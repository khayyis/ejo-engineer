<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Drawing;
use App\Models\Ejo;
use App\Models\GeneralEjo;
use App\Models\Notification;
use App\Models\Project;
use App\Models\RepairPart;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EjoController extends Controller
{
    // =====================================================================
    //  AUTHENTICATION
    // =====================================================================

    /**
     * POST /api/login
     * Autentikasi user + device lock via sessions table.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
            'device_id' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        // Plaintext comparison (same as original server.py)
        if (! $user || $user->password !== $request->password) {
            return response()->json(['message' => 'Username atau password salah'], 401);
        }

        // Cek device lock – satu user hanya boleh login di satu device
        $existingSession = DB::table('sessions')
            ->where('user_id', $user->username)
            ->first();

        if ($existingSession) {
            $payload = json_decode($existingSession->payload, true);
            $lockedDevice = $payload['device_id'] ?? null;
            $timeSince = time() - $existingSession->last_activity;
            // Izinkan login jika device sama atau session sudah timeout (>35 detik)
            if ($lockedDevice && $lockedDevice !== $request->device_id && $timeSince < 35) {
                return response()->json([
                    'message' => 'User sudah login di device lain',
                    'locked_device' => true,
                ], 403);
            }
        }

        // Simpan session dengan device_id
        $token = Str::random(60);

        DB::table('sessions')->updateOrInsert(
            ['user_id' => $user->username],
            [
                'id'            => $token,
                'ip_address'    => $request->ip(),
                'user_agent'    => $request->userAgent(),
                'payload'       => json_encode(['device_id' => $request->device_id]),
                'last_activity' => time(),
            ]
        );

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => $user->makeHidden(['password']),
            'token'   => $token,
        ]);
    }

    /**
     * POST /api/heartbeat
     * Perbarui last_activity agar session tetap aktif.
     */
    public function heartbeat(Request $request): JsonResponse
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['message' => 'Token tidak ditemukan'], 401);
        }

        $session = DB::table('sessions')->where('id', $token)->first();

        if (! $session) {
            return response()->json(['message' => 'Session tidak valid'], 401);
        }

        DB::table('sessions')
            ->where('id', $token)
            ->update(['last_activity' => time()]);

        return response()->json(['message' => 'OK', 'timestamp' => now()]);
    }

    /**
     * POST /api/logout
     * Hapus session dan lepaskan device lock.
     */
    public function logout(Request $request): JsonResponse
    {
        $token = $request->bearerToken();

        if ($token) {
            DB::table('sessions')->where('id', $token)->delete();
        }

        return response()->json(['message' => 'Logout berhasil']);
    }

    // =====================================================================
    //  EJO CRUD
    // =====================================================================

    /**
     * GET /api/ejos
     */
    public function getEjos(): JsonResponse
    {
        $ejos = Ejo::orderByDesc('created_at')->get();
        return response()->json($ejos);
    }

    /**
     * POST /api/ejos
     * Auto-generate ID: EJO-{year}-{sequential}
     */
    public function createEjo(Request $request): JsonResponse
    {
        $data = $request->all();

        // Generate ID otomatis
        $year = date('Y');
        $lastEjo = Ejo::where('ejo_id', 'like', "EJO-{$year}-%")
            ->orderByDesc('ejo_id')
            ->first();

        if ($lastEjo) {
            $lastNumber = (int) substr($lastEjo->ejo_id, -3);
            $newNumber  = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        $data['ejo_id'] = "EJO-{$year}-{$newNumber}";

        // Pastikan created_by terisi
        if (! isset($data['created_by'])) {
            $data['created_by'] = $request->input('username', 'system');
        }

        $ejo = Ejo::create($data);

        return response()->json([
            'message' => 'EJO berhasil dibuat',
            'data'    => $ejo,
        ], 201);
    }

    /**
     * PUT /api/ejos/{id}
     */
    public function updateEjo(Request $request, $id): JsonResponse
    {
        $ejo = Ejo::find($id);

        if (! $ejo) {
            return response()->json(['message' => 'EJO tidak ditemukan'], 404);
        }

        $ejo->update($request->all());

        return response()->json([
            'message' => 'EJO berhasil diupdate',
            'data'    => $ejo,
        ]);
    }

    /**
     * DELETE /api/ejos/{id}
     * Hanya staff atau user yang boleh menghapus.
     */
    public function deleteEjo(Request $request, $id): JsonResponse
    {
        $user = $this->getUserFromToken($request);

        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (! in_array(strtolower($user->role ?? ''), ['staff', 'user'])) {
            return response()->json(['message' => 'Hanya staff/user yang boleh menghapus EJO'], 403);
        }

        $ejo = Ejo::find($id);

        if (! $ejo) {
            return response()->json(['message' => 'EJO tidak ditemukan'], 404);
        }

        $ejo->delete();

        return response()->json(['message' => 'EJO berhasil dihapus']);
    }

    // =====================================================================
    //  GENERAL EJO CRUD
    // =====================================================================

    /**
     * GET /api/general-ejos
     */
    public function getGeneralEjos(): JsonResponse
    {
        // Auto-archive Completed/Cancelled general EJOs after 3 days without confirmation
        $threeDaysAgo = now()->subDays(3);
        $expiredGejos = GeneralEjo::whereIn('status', ['Completed', 'Cancelled'])
            ->where(function($q) {
                $q->where('is_archived', 0)->orWhereNull('is_archived');
            })
            ->get();

        foreach ($expiredGejos as $gejo) {
            $compDate = null;
            if (!empty($gejo->qty_work_done_date)) {
                try {
                    $compDate = \Carbon\Carbon::parse($gejo->qty_work_done_date);
                } catch (\Exception $e) {}
            }
            $logs = is_array($gejo->logs) ? $gejo->logs : (json_decode($gejo->logs, true) ?: []);
            if (!$compDate && !empty($logs)) {
                foreach (array_reverse($logs) as $l) {
                    $msg = $l['message'] ?? '';
                    $dtStr = $l['date'] ?? '';
                    if ((str_contains($msg, 'Completed') || str_contains($msg, 'selesai') || str_contains($msg, 'Selesai')) && !empty($dtStr)) {
                        try {
                            $compDate = \Carbon\Carbon::parse($dtStr);
                            break;
                        } catch (\Exception $e) {}
                    }
                }
                if (!$compDate && !empty($logs)) {
                    $lastLogDate = end($logs)['date'] ?? '';
                    if (!empty($lastLogDate)) {
                        try {
                            $compDate = \Carbon\Carbon::parse($lastLogDate);
                        } catch (\Exception $e) {}
                    }
                }
            }
            if (!$compDate && !empty($gejo->createdDate)) {
                try {
                    $compDate = \Carbon\Carbon::parse($gejo->createdDate);
                } catch (\Exception $e) {}
            }
            if (!$compDate && !empty($gejo->created_at)) {
                $compDate = $gejo->created_at;
            }

            if ($compDate && $compDate->lte($threeDaysAgo)) {
                $logs[] = [
                    'date' => now()->format('Y-m-d H:i'),
                    'message' => 'Pekerjaan otomatis diarsipkan ke History oleh sistem setelah 3 hari tanpa konfirmasi.'
                ];
                $gejo->is_archived = 1;
                $gejo->logs = $logs;
                $gejo->save();
            }
        }

        $generalEjos = GeneralEjo::orderByDesc('created_at')->get();
        return response()->json($generalEjos);
    }

    /**
     * POST /api/general-ejos
     * Auto-generate ID: EJO-{sequential}
     */
    public function createGeneralEjo(Request $request): JsonResponse
    {
        $data = $request->all();

        $lastGejo = GeneralEjo::orderByDesc('gejo_id')->first();

        if ($lastGejo && preg_match('/EJO(\d{3})/', $lastGejo->gejo_id, $matches)) {
            $newNumber = str_pad((int) $matches[1] + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        $dateStr = date('dmY');
        $data['gejo_id'] = "EJO{$newNumber}{$dateStr}";

        if (! isset($data['created_by'])) {
            $data['created_by'] = $request->input('username', 'system');
        }

        $generalEjo = GeneralEjo::create($data);

        return response()->json([
            'message' => 'General EJO berhasil dibuat',
            'data'    => $generalEjo,
        ], 201);
    }

    /**
     * PUT /api/general-ejos/{id}
     */
    public function updateGeneralEjo(Request $request, $id): JsonResponse
    {
        $generalEjo = GeneralEjo::find($id);

        if (! $generalEjo) {
            return response()->json(['message' => 'General EJO tidak ditemukan'], 404);
        }

        $generalEjo->update($request->all());

        return response()->json([
            'message' => 'General EJO berhasil diupdate',
            'data'    => $generalEjo,
        ]);
    }

    /**
     * DELETE /api/general-ejos/{id}
     */
    public function deleteGeneralEjo($id): JsonResponse
    {
        $generalEjo = GeneralEjo::find($id);

        if (! $generalEjo) {
            return response()->json(['message' => 'General EJO tidak ditemukan'], 404);
        }

        $generalEjo->delete();

        return response()->json(['message' => 'General EJO berhasil dihapus']);
    }

    // =====================================================================
    //  DRAWINGS CRUD
    // =====================================================================

    /**
     * GET /api/drawings
     */
    public function getDrawings(): JsonResponse
    {
        $drawings = Drawing::orderByDesc('created_at')->get();
        return response()->json($drawings);
    }

    /**
     * POST /api/drawings
     * Support multipart file upload dan JSON.
     */
    public function uploadDrawing(Request $request): JsonResponse
    {
        $data = $request->all();

        // Generate ID otomatis
        $lastDrawing = Drawing::orderByDesc('drawing_id')->first();

        if ($lastDrawing && preg_match('/DRW-(\d+)/', $lastDrawing->drawing_id, $matches)) {
            $newNumber = str_pad((int) $matches[1] + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        $data['drawing_id'] = "DRW-{$newNumber}";

        // Handle file upload jika ada
        if ($request->hasFile('file')) {
            $file     = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path     = $file->storeAs('public/uploads/drawings', $filename);
            $data['file_path'] = Storage::url($path);
            $data['file_name'] = $file->getClientOriginalName();
        }

        // Handle base64 file upload dari JSON
        if ($request->has('file_data') && $request->has('file_name')) {
            $fileData = base64_decode($request->input('file_data'));
            $filename = time() . '_' . $request->input('file_name');
            $path     = 'public/uploads/drawings/' . $filename;
            Storage::put($path, $fileData);
            $data['file_path'] = Storage::url($path);
        }

        if (! isset($data['uploaded_by'])) {
            $data['uploaded_by'] = $request->input('username', 'system');
        }

        $drawing = Drawing::create($data);

        return response()->json([
            'message' => 'Drawing berhasil diupload',
            'data'    => $drawing,
        ], 201);
    }

    /**
     * PUT /api/drawings/{id}
     * Bisa termasuk update signing PDF.
     */
    public function updateDrawing(Request $request, $id): JsonResponse
    {
        $drawing = Drawing::find($id);

        if (! $drawing) {
            return response()->json(['message' => 'Drawing tidak ditemukan'], 404);
        }

        $data = $request->all();

        // Handle file upload baru
        if ($request->hasFile('file')) {
            $file     = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path     = $file->storeAs('public/uploads/drawings', $filename);
            $data['file_path'] = Storage::url($path);
            $data['file_name'] = $file->getClientOriginalName();
        }

        // Handle base64 signed PDF
        if ($request->has('signed_pdf_data')) {
            $pdfData  = base64_decode($request->input('signed_pdf_data'));
            $filename = time() . '_signed_' . ($data['file_name'] ?? 'drawing.pdf');
            $path     = 'public/uploads/drawings/signed/' . $filename;
            Storage::put($path, $pdfData);
            $data['signed_file_path'] = Storage::url($path);
        }

        // Update info tanda tangan
        if ($request->has('signed_by')) {
            $data['signed_at'] = now();
        }

        $drawing->update($data);

        return response()->json([
            'message' => 'Drawing berhasil diupdate',
            'data'    => $drawing,
        ]);
    }

    /**
     * DELETE /api/drawings/{id}
     */
    public function deleteDrawing($id): JsonResponse
    {
        $drawing = Drawing::find($id);

        if (! $drawing) {
            return response()->json(['message' => 'Drawing tidak ditemukan'], 404);
        }

        // Hapus file terkait jika ada
        if ($drawing->file_path) {
            $relativePath = str_replace('/storage/', 'public/', $drawing->file_path);
            Storage::delete($relativePath);
        }

        $drawing->delete();

        return response()->json(['message' => 'Drawing berhasil dihapus']);
    }

    // =====================================================================
    //  PROJECTS CRUD
    // =====================================================================

    /**
     * GET /api/projects
     */
    public function getProjects(): JsonResponse
    {
        $projects = Project::orderByDesc('created_at')->get();
        return response()->json($projects);
    }

    /**
     * POST /api/projects
     * Auto-generate ID: PRJ-{year}-{sequential}
     */
    public function createProject(Request $request): JsonResponse
    {
        $data = $request->all();

        $year = date('Y');
        $lastProject = Project::where('project_id', 'like', "PRJ-{$year}-%")
            ->orderByDesc('project_id')
            ->first();

        if ($lastProject && preg_match('/PRJ-\d{4}-(\d+)/', $lastProject->project_id, $matches)) {
            $newNumber = str_pad((int) $matches[1] + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        $data['project_id'] = "PRJ-{$year}-{$newNumber}";

        if (! isset($data['created_by'])) {
            $data['created_by'] = $request->input('username', 'system');
        }

        $project = Project::create($data);

        return response()->json([
            'message' => 'Project berhasil dibuat',
            'data'    => $project,
        ], 201);
    }

    /**
     * PUT /api/projects/{id}
     */
    public function updateProject(Request $request, $id): JsonResponse
    {
        $project = Project::find($id);

        if (! $project) {
            return response()->json(['message' => 'Project tidak ditemukan'], 404);
        }

        $project->update($request->all());

        return response()->json([
            'message' => 'Project berhasil diupdate',
            'data'    => $project,
        ]);
    }

    /**
     * DELETE /api/projects/{id}
     */
    public function deleteProject($id): JsonResponse
    {
        $project = Project::find($id);

        if (! $project) {
            return response()->json(['message' => 'Project tidak ditemukan'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project berhasil dihapus']);
    }

    /**
     * POST /api/projects/upload-doc
     * Upload dokumen project (file).
     */
    public function uploadProjectDoc(Request $request): JsonResponse
    {
        $request->validate([
            'file'       => 'required|file|max:10240',
            'project_id' => 'required|string',
        ]);

        $project = Project::where('project_id', $request->project_id)->first();

        if (! $project) {
            return response()->json(['message' => 'Project tidak ditemukan'], 404);
        }

        $file     = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path     = $file->storeAs('public/uploads/projects', $filename);

        // Tambah dokumen ke array docs project
        $docs = $project->docs ?? [];
        $docs[] = [
            'file_name' => $file->getClientOriginalName(),
            'file_path' => Storage::url($path),
            'uploaded_by' => $request->input('username', 'system'),
            'uploaded_at' => now()->toISOString(),
        ];

        $project->update(['docs' => $docs]);

        return response()->json([
            'message' => 'Dokumen project berhasil diupload',
            'data'    => $project,
        ], 201);
    }

    /**
     * Helper to stamp digital signatures on project handover Berita Acara PDF (Hybrid PHP / Laravel)
     */
    private function stampProjectHandoverPdfSignatures($pdfPath, $approvals)
    {
        if (!file_exists($pdfPath) || !class_exists('\setasign\Fpdi\Fpdi')) {
            return;
        }

        try {
            $pdf = new \setasign\Fpdi\Fpdi();
            $pageCount = $pdf->setSourceFile($pdfPath);
            $templateId = $pdf->importPage(1);
            $pdf->AddPage('P', 'A4');
            $pdf->useTemplate($templateId);

            // Coordinates in mm on A4 page
            $roleCoords = [
                'pic'          => ['x' => 15,  'y' => 148, 'w' => 25],
                'foreman'      => ['x' => 44,  'y' => 148, 'w' => 25],
                'supervisor'   => ['x' => 44,  'y' => 148, 'w' => 25],
                'manager'      => ['x' => 73,  'y' => 148, 'w' => 25],
                'manager_user' => ['x' => 102, 'y' => 148, 'w' => 25],
                'spv_user'     => ['x' => 131, 'y' => 148, 'w' => 25],
                'staff_user'   => ['x' => 160, 'y' => 148, 'w' => 25],
            ];

            $stamped = false;
            foreach ($roleCoords as $role => $coord) {
                if (!empty($approvals[$role]['signature'])) {
                    $sigData = $approvals[$role]['signature'];
                    $base64Str = preg_replace('#^data:image/\w+;base64,#i', '', $sigData);
                    $imgData = base64_decode($base64Str);
                    $tempImg = sys_get_temp_dir() . '/sig_' . $role . '_' . uniqid() . '.png';
                    file_put_contents($tempImg, $imgData);

                    $pdf->Image($tempImg, $coord['x'], $coord['y'], $coord['w']);
                    @unlink($tempImg);
                    $stamped = true;
                }
            }

            if ($stamped) {
                $pdf->Output($pdfPath, 'F');
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("PHP PDF Stamping Error: " . $e->getMessage());
        }
    }

    // =====================================================================
    //  REPAIR PARTS CRUD
    // =====================================================================

    /**
     * GET /api/repair-parts
     */
    public function getRepairParts(): JsonResponse
    {
        $parts = RepairPart::orderByDesc('created_at')->get();
        return response()->json($parts);
    }

    /**
     * POST /api/repair-parts
     * Auto-generate ID: PART-{sequential}
     */
    public function createRepairPart(Request $request): JsonResponse
    {
        $data = $request->all();

        $lastPart = RepairPart::orderByDesc('part_id')->first();

        if ($lastPart && preg_match('/PART-(\d+)/', $lastPart->part_id, $matches)) {
            $newNumber = str_pad((int) $matches[1] + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        $data['part_id'] = "PART-{$newNumber}";

        if (! isset($data['created_by'])) {
            $data['created_by'] = $request->input('username', 'system');
        }

        $part = RepairPart::create($data);

        return response()->json([
            'message' => 'Repair part berhasil dibuat',
            'data'    => $part,
        ], 201);
    }

    /**
     * DELETE /api/repair-parts/{id}
     */
    public function deleteRepairPart($id): JsonResponse
    {
        $part = RepairPart::find($id);

        if (! $part) {
            return response()->json(['message' => 'Repair part tidak ditemukan'], 404);
        }

        $part->delete();

        return response()->json(['message' => 'Repair part berhasil dihapus']);
    }

    // =====================================================================
    //  USERS CRUD
    // =====================================================================

    /**
     * GET /api/users
     */
    public function getUsers(): JsonResponse
    {
        $users = User::all()->makeHidden(['password', 'remember_token']);
        return response()->json($users);
    }

    /**
     * POST /api/users
     */
    public function createUser(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
            'name'     => 'required|string',
            'role'     => 'required|string',
        ]);

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'data'    => $user->makeHidden(['password', 'remember_token']),
        ], 201);
    }

    /**
     * PUT /api/users/{username}
     */
    public function updateUser(Request $request, $username): JsonResponse
    {
        $user = User::where('username', $username)->first();

        if (! $user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $data = $request->all();

        // Hash password jika diupdate
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User berhasil diupdate',
            'data'    => $user->makeHidden(['password', 'remember_token']),
        ]);
    }

    /**
     * PUT /api/users/{username}/layout-settings
     */
    public function updateUserLayoutSettings(Request $request, $username): JsonResponse
    {
        $user = User::where('username', $username)->first();

        if (! $user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $layoutSettings = $request->input('layout_settings', $request->all());

        $user->update(['layout_settings' => $layoutSettings]);

        return response()->json([
            'message' => 'Layout settings berhasil diupdate',
            'data'    => $user->makeHidden(['password', 'remember_token']),
        ]);
    }

    /**
     * DELETE /api/users/{username}
     */
    public function deleteUser($username): JsonResponse
    {
        $user = User::where('username', $username)->first();

        if (! $user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        // Hapus session user terkait
        DB::table('sessions')->where('user_id', $user->id)->delete();

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus']);
    }

    /**
     * POST /api/upload-avatar
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'file'     => 'required|image|max:2048',
            'username' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (! $user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        // Hapus avatar lama
        if ($user->avatar_path) {
            $oldPath = str_replace('/storage/', 'public/', $user->avatar_path);
            Storage::delete($oldPath);
        }

        $file     = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path     = $file->storeAs('public/uploads/avatars', $filename);

        $user->update(['avatar_path' => Storage::url($path)]);

        return response()->json([
            'message'     => 'Avatar berhasil diupload',
            'avatar_path' => Storage::url($path),
        ]);
    }

    // =====================================================================
    //  SETTINGS
    // =====================================================================

    /**
     * GET /api/settings
     */
    public function getSettings(): JsonResponse
    {
        $settings = Setting::first();

        return response()->json($settings ?? (object) []);
    }

    /**
     * PUT /api/settings
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $setting = Setting::first();

        if ($setting) {
            $setting->update($request->all());
        } else {
            $setting = Setting::create($request->all());
        }

        return response()->json([
            'message' => 'Settings berhasil diupdate',
            'data'    => $setting,
        ]);
    }

    // =====================================================================
    //  NOTIFICATIONS
    // =====================================================================

    /**
     * GET /api/notifications?username=xxx
     */
    public function getNotifications(Request $request): JsonResponse
    {
        $username = $request->query('username');

        if (! $username) {
            return response()->json(['message' => 'Parameter username diperlukan'], 400);
        }

        $notifications = Notification::where('username', $username)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($notifications);
    }

    /**
     * PUT /api/notifications/read-all?username=xxx
     */
    public function markAllNotificationsRead(Request $request): JsonResponse
    {
        $username = $request->query('username');

        if (! $username) {
            return response()->json(['message' => 'Parameter username diperlukan'], 400);
        }

        Notification::where('username', $username)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Semua notifikasi ditandai sudah dibaca']);
    }

    /**
     * DELETE /api/notifications
     * Hapus notifikasi berdasarkan username atau hapus semua.
     */
    public function deleteNotifications(Request $request): JsonResponse
    {
        $username = $request->query('username');

        if ($username) {
            Notification::where('username', $username)->delete();
        } else {
            Notification::truncate();
        }

        return response()->json(['message' => 'Notifikasi berhasil dihapus']);
    }

    // =====================================================================
    //  FILE UPLOAD
    // =====================================================================

    /**
     * POST /api/upload
     * Upload file umum ke storage.
     */
    public function uploadFile(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:20480',
        ]);

        $file      = $request->file('file');
        $filename  = time() . '_' . $file->getClientOriginalName();
        $subfolder = $request->input('subfolder', 'general');
        $path      = $file->storeAs("public/uploads/{$subfolder}", $filename);

        return response()->json([
            'message'   => 'File berhasil diupload',
            'file_path' => Storage::url($path),
            'file_name' => $file->getClientOriginalName(),
        ], 201);
    }



    // =====================================================================
    //  NUCLEAR
    // =====================================================================

    /**
     * POST /api/nuclear
     * Reset semua tabel database. Hanya untuk role 'Server'.
     */
    public function nuclearDatabase(Request $request): JsonResponse
    {
        $user = $this->getUserFromToken($request);

        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (strtolower($user->role ?? '') !== 'server') {
            return response()->json([
                'message' => 'Hanya role Server yang boleh melakukan operasi ini',
            ], 403);
        }

        $tablesToReset = [
            'ejos',
            'general_ejos',
            'drawings',
            'projects',
            'repair_parts',
            'notifications',
        ];

        try {
            $driver = DB::getDriverName();
            if ($driver === 'mysql') {
                DB::statement('SET FOREIGN_KEY_CHECKS=0');
            } elseif ($driver === 'sqlite') {
                DB::statement('PRAGMA foreign_keys = OFF');
            }

            foreach ($tablesToReset as $table) {
                if (DB::getSchemaBuilder()->hasTable($table)) {
                    DB::table($table)->delete();
                }
            }

            if ($driver === 'mysql') {
                DB::statement('SET FOREIGN_KEY_CHECKS=1');
            } elseif ($driver === 'sqlite') {
                DB::statement('PRAGMA foreign_keys = ON');
            }

            return response()->json([
                'message' => 'Semua tabel berhasil di-reset',
                'tables'  => $tablesToReset,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Gagal reset database',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/database/reset-module
     * Reset/Delete data per spesifik modul menu navbar.
     */
    public function resetModuleDatabase(Request $request): JsonResponse
    {
        $username = trim($request->input('username', ''));
        $module   = strtolower(trim($request->input('module', '')));

        $user = DB::table('users')->where('username', $username)->first();
        $isServer = $user && ($user->role === 'Server' || strtolower($username) === 'server');

        if (! $isServer) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Otoritas tidak cukup. Hanya Server Admin yang dapat mereset modul database.',
            ], 403);
        }

        try {
            switch ($module) {
                case 'general-ejo':
                    DB::table('general_ejos')->whereNull('category')->orWhere('category', '!=', 'Repair Part')->delete();
                    $msg = 'Data General EJO berhasil dihapus!';
                    break;
                case 'drawing':
                    DB::table('drawings')->delete();
                    $msg = 'Data Drawing EJO berhasil dihapus!';
                    break;
                case 'projects':
                    DB::table('projects')->delete();
                    $msg = 'Data Project Monitoring berhasil dihapus!';
                    break;
                case 'parts':
                case 'partlist':
                    DB::table('repair_parts')->delete();
                    DB::table('general_ejos')->where('category', 'Repair Part')->delete();
                    $msg = 'Data Repair Part & Spare Part berhasil dihapus!';
                    break;
                case 'history':
                    DB::table('general_ejos')->where('status', 'Completed')->orWhere('is_archived', 1)->delete();
                    DB::table('drawings')->where('status', 'Done')->delete();
                    DB::table('notifications')->delete();
                    $msg = 'Data History EJO & Notifikasi berhasil dihapus!';
                    break;
                case 'users':
                    DB::table('users')->where('username', '!=', 'server')->delete();
                    $msg = 'Akun pengguna berhasil di-reset ke setelan default!';
                    break;
                default:
                    return response()->json([
                        'status'  => 'error',
                        'message' => "Modul '{$module}' tidak dikenali",
                    ], 400);
            }

            return response()->json([
                'status'  => 'success',
                'module'  => $module,
                'message' => $msg,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mereset modul database: ' . $e->getMessage(),
            ], 500);
        }
    }

    // =====================================================================
    //  HELPER
    // =====================================================================

    /**
     * Ambil user berdasarkan bearer token dari sessions table.
     */
    private function getUserFromToken(Request $request): ?User
    {
        $token = $request->bearerToken();

        if (! $token) {
            return null;
        }

        $session = DB::table('sessions')->where('id', $token)->first();

        if (! $session) {
            return null;
        }

        return User::find($session->user_id);
    }
}
