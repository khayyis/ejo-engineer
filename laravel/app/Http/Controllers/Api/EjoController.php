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
use App\Models\WspMaterial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class EjoController extends Controller
{
    private function isServerAdmin(?User $user, ?string $username = null): bool
    {
        if ($user && $user->role === 'Server') {
            return true;
        }
        if ($username) {
            $u = User::where('username', $username)->first();
            return $u && $u->role === 'Server';
        }
        return false;
    }

    private array $roleLevels = [
        'Server' => 100,
        'Manager Eng' => 80,
        'Plant Manager' => 80,
        'Admin Eng' => 40,
        'Drafter' => 20,
        'Sipil' => 20,
        'Mekanik' => 20,
        'Elektrik' => 20,
        'Program' => 20,
        'Kalibrasi' => 20,
        'Repair Part' => 20,
        'Manager' => 80,
        'Supervisor' => 60,
        'User' => 10,
        'user_PRD' => 10,
        'user_ENG' => 10,
        'user_EPR' => 10,
        'user_GA' => 10,
        'user_QC' => 10,
        'user_WRH' => 10,
        'user_TMB' => 10,
        'user_EUT' => 10,
        'Staff PRD' => 10,
        'Staff ENG' => 10,
        'Staff EPR' => 10,
        'Staff GA' => 10,
        'Staff QC' => 10,
        'Staff WRH' => 10,
        'Staff TMB' => 10,
        'Staff EUT' => 10,
        'Supervisor PRD' => 60,
        'Supervisor EPR' => 60,
        'Supervisor GA' => 60,
        'Supervisor QC' => 60,
        'Supervisor WRH' => 60,
        'Supervisor TMB' => 60,
        'Supervisor EUT' => 60,
        'Manager PRD' => 80,
        'Manager EPR' => 80,
        'Manager GA' => 80,
        'Manager QC' => 80,
        'Manager WRH' => 80,
        'Manager TMB' => 80,
        'Manager EUT' => 80,
    ];

    private function getRoleLevel(?string $role): int
    {
        if (! $role) return 0;
        if (isset($this->roleLevels[$role])) return $this->roleLevels[$role];
        if (str_starts_with($role, 'Manager ')) return 80;
        if (str_starts_with($role, 'Supervisor ')) return 60;
        if (str_starts_with($role, 'user_') || str_starts_with($role, 'Staff ') || str_starts_with($role, 'User ')) return 10;
        return 0;
    }

    private function normalizeDeptCode(?string $dept): string
    {
        if (! $dept) return '';
        $clean = trim((string) $dept);
        $upper = strtoupper($clean);
        $mapping = [
            'PRD' => 'PRD',
            'PRD (PRODUCTION)' => 'PRD',
            'PRODUCTION' => 'PRD',
            'ENG' => 'ENG',
            'ENG (ENGINEERING)' => 'ENG',
            'ENGINEERING' => 'ENG',
            'EUT' => 'EUT',
            'EUT (ENGINEER UTILITY)' => 'EUT',
            'EUT (ENGINEERING UTILITY)' => 'EUT',
            'ENGINEER UTILITY' => 'EUT',
            'ENGINEERING UTILITY' => 'EUT',
            'UTILITY' => 'EUT',
            'UTL' => 'EUT',
            'EPR' => 'EPR',
            'EPR (ENGINEERING PRODUKSI)' => 'EPR',
            'EPR (ENGINEERING PRODUCTION)' => 'EPR',
            'ENGINEERING PRODUKSI' => 'EPR',
            'ENGINEERING PRODUCTION' => 'EPR',
            'GA' => 'GA',
            'GA (GENERAL AFFAIR)' => 'GA',
            'GENERAL AFFAIR' => 'GA',
            'GENERAL AFFAIRS' => 'GA',
            'QC' => 'QC',
            'QC (QUALITY CONTROL)' => 'QC',
            'QUALITY CONTROL' => 'QC',
            'WRH' => 'WRH',
            'WRH (WAREHOUSE)' => 'WRH',
            'WAREHOUSE' => 'WRH',
            'MAINTENANCE' => 'WRH',
            'EKSPEDISI' => 'WRH',
            'TMB' => 'TMB',
            'TMB (TIMBANGAN)' => 'TMB',
            'TIMBANGAN' => 'TMB',
            'HSE' => 'HSE',
        ];
        return $mapping[$upper] ?? $clean;
    }

    private function insertNotification(string $targetUsername, string $ejoId, string $message): void
    {
        if (! $targetUsername) return;
        Notification::create([
            'id'              => date('YmdHis') . '_' . Str::random(6),
            'target_username' => $targetUsername,
            'ejo_id'          => $ejoId,
            'message'         => $message,
            'timestamp'       => now()->toIso8601String(),
            'is_read'         => 0,
        ]);
    }

    private function resolveUsername(string $fullname): ?string
    {
        if (! $fullname || $fullname === 'Unassigned') return null;
        $user = User::where('fullname', $fullname)->orWhere('username', $fullname)->first();
        return $user ? $user->username : null;
    }

    private function notifyDeptApprovers(string $dept, string $refId, string $message): void
    {
        $normDept = $this->normalizeDeptCode($dept);
        if (! $normDept) return;

        $approvers = User::where('is_active', 1)
            ->where(function ($q) use ($normDept) {
                $q->where('dept', $normDept)
                  ->orWhere('role', 'like', "%{$normDept}%");
            })
            ->where(function ($q) {
                $q->where('role', 'like', '%Supervisor%')
                  ->orWhere('role', 'like', '%Manager%')
                  ->orWhere('role', 'like', '%SPV%');
            })
            ->pluck('username');

        foreach ($approvers as $u) {
            $this->insertNotification($u, $refId, $message);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $rawUser = $request->input('username');
        $rawPass = $request->input('password');
        $rawDev  = $request->input('device_id');

        if (! is_string($rawUser) || ! is_string($rawPass)) {
            return response()->json(['status' => 'error', 'message' => 'Format input username atau password tidak valid!'], 400);
        }

        $username = trim($rawUser);
        $password = $rawPass;
        $deviceId = (is_string($rawDev) && trim($rawDev) !== '') ? trim($rawDev) : ('dev-fallback-' . Str::random(8));

        if (! $username || ! $password) {
            return response()->json(['status' => 'error', 'message' => 'Username dan Password wajib diisi.'], 400);
        }

        $maintenanceSetting = Setting::where('key', 'maintenance_mode')->first();
        $isMaintenance = $maintenanceSetting && $maintenanceSetting->value === '1';

        $user = User::whereRaw('LOWER(username) = LOWER(?)', [$username])->first();
        if (! $user) {
            return response()->json(['status' => 'error', 'message' => 'Username atau password salah'], 401);
        }

        $isValidPass = false;
        if (password_verify($password, $user->password) || $password === $user->password) {
            $isValidPass = true;
        }

        if (! $isValidPass) {
            return response()->json(['status' => 'error', 'message' => 'Username atau password salah'], 401);
        }

        // TOTP 2FA Verification (100% Offline RFC 6238)
        if (! empty($user->totp_secret)) {
            $totpCode = trim((string) $request->input('totp_code', ''));
            if (! $totpCode) {
                return response()->json([
                    'status'        => 'totp_required',
                    'message'       => 'Verifikasi 2FA diperlukan. Masukkan 6-digit kode Authenticator.',
                    'requires_totp' => true,
                ], 200);
            }

            if (! \App\Services\TotpService::verify($user->totp_secret, $totpCode)) {
                return response()->json([
                    'status'        => 'error',
                    'message'       => 'Kode 2FA Authenticator salah atau kedaluwarsa!',
                    'requires_totp' => true,
                ], 401);
            }
        }

        $isServer = ($user->role === 'Server' || strtolower($user->username) === 'server');
        if ($user->is_active === 0 && ! $isServer) {
            return response()->json(['status' => 'error', 'message' => 'Akun Anda telah nonaktif/disuspend oleh Server Admin. Silakan hubungi Server Admin.'], 403);
        }

        if ($isMaintenance && ! $isServer) {
            return response()->json(['status' => 'error', 'message' => 'Server sedang dalam pemeliharaan (maintenance) / perbaikan. Akses ditutup sementara.'], 503);
        }

        $userPayload = $user->toArray();
        $userPayload['device_id'] = $deviceId;
        unset($userPayload['password']);

        DB::table('sessions')->updateOrInsert(
            ['user_id' => strtolower($user->username)],
            [
                'id'            => Str::random(40),
                'ip_address'    => $request->ip(),
                'user_agent'    => $request->userAgent(),
                'payload'       => json_encode(['device_id' => $deviceId, 'forced_logout' => 0]),
                'last_activity' => time(),
            ]
        );

        return response()->json($userPayload, 200);
    }

    public function heartbeat(Request $request): JsonResponse
    {
        $username = trim($request->input('username', ''));
        $deviceId = trim($request->input('device_id', ''));

        if (! $username || ! $deviceId) {
            return response()->json(['status' => 'error', 'message' => 'Missing username or device_id'], 400);
        }

        $ukey = strtolower($username);
        $session = DB::table('sessions')->where('user_id', $ukey)->first();

        if ($session) {
            $payload = json_decode($session->payload, true) ?: [];
            if (! empty($payload['forced_logout'])) {
                DB::table('sessions')->where('user_id', $ukey)->delete();
                return response()->json([
                    'status'  => 'superseded',
                    'message' => 'Sesi akun Anda telah dikeluarkan (logout) oleh Admin.',
                ], 200);
            }

            // Single-device session validation
            $activeDev = $payload['device_id'] ?? '';
            if ($activeDev !== '' && $activeDev !== $deviceId) {
                return response()->json([
                    'status'  => 'superseded',
                    'message' => 'Akun Anda sedang aktif di perangkat lain. Sesi ini telah ditutup.',
                ], 200);
            }
        }

        DB::table('sessions')->updateOrInsert(
            ['user_id' => $ukey],
            [
                'id'            => $session ? $session->id : Str::random(40),
                'ip_address'    => $request->ip(),
                'user_agent'    => $request->userAgent(),
                'payload'       => json_encode(['device_id' => $deviceId, 'forced_logout' => 0]),
                'last_activity' => time(),
            ]
        );

        return response()->json(['status' => 'success', 'timestamp' => now()->toIso8601String()]);
    }

    public function logout(Request $request): JsonResponse
    {
        $username = trim($request->input('username', ''));
        $deviceId = trim($request->input('device_id', ''));

        if ($username) {
            DB::table('sessions')->where('user_id', strtolower($username))->delete();
        }

        return response()->json(['status' => 'success']);
    }

    public function forceLogoutUser(Request $request): JsonResponse
    {
        $target = strtolower(trim($request->input('target_username', '')));
        if ($target) {
            DB::table('sessions')->where('user_id', $target)->update([
                'payload' => json_encode(['device_id' => '', 'forced_logout' => 1]),
            ]);
        }
        return response()->json(['status' => 'success', 'message' => "Sesi device {$target} berhasil di-logout."]);
    }

    public function setupTotp(Request $request): JsonResponse
    {
        $username = trim($request->input('username', ''));
        $password = (string) $request->input('password', '');

        $user = User::whereRaw('LOWER(username) = LOWER(?)', [$username])->first();
        if (! $user) {
            return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan'], 404);
        }

        $isValidPass = (password_verify($password, $user->password) || $password === $user->password);
        if (! $isValidPass) {
            return response()->json(['status' => 'error', 'message' => 'Password salah'], 401);
        }

        $secret = \App\Services\TotpService::generateSecret();
        $otpauthUrl = \App\Services\TotpService::getOtpAuthUrl($user->username, $secret, 'EJO Engineer');

        return response()->json([
            'status'       => 'success',
            'username'     => $user->username,
            'secret'       => $secret,
            'otpauth_url'  => $otpauthUrl,
            'is_enabled'   => ! empty($user->totp_secret),
        ]);
    }

    public function enableTotp(Request $request): JsonResponse
    {
        $username = trim($request->input('username', ''));
        $secret   = trim($request->input('secret', ''));
        $code     = trim($request->input('code', ''));

        $user = User::whereRaw('LOWER(username) = LOWER(?)', [$username])->first();
        if (! $user) {
            return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan'], 404);
        }

        if (! \App\Services\TotpService::verify($secret, $code)) {
            return response()->json(['status' => 'error', 'message' => 'Kode OTP tidak valid! Pastikan jam perangkat Anda akurat.'], 400);
        }

        $user->update(['totp_secret' => $secret]);

        return response()->json([
            'status'  => 'success',
            'message' => '2FA Google/Aegis Authenticator berhasil diaktifkan 100% offline!',
        ]);
    }

    public function disableTotp(Request $request): JsonResponse
    {
        $username = trim($request->input('username', ''));
        $password = (string) $request->input('password', '');
        $code     = trim($request->input('code', ''));

        $user = User::whereRaw('LOWER(username) = LOWER(?)', [$username])->first();
        if (! $user) {
            return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan'], 404);
        }

        $isValidPass = (password_verify($password, $user->password) || $password === $user->password);
        if (! $isValidPass) {
            return response()->json(['status' => 'error', 'message' => 'Password salah'], 401);
        }

        if (! empty($user->totp_secret)) {
            if (! \App\Services\TotpService::verify($user->totp_secret, $code)) {
                return response()->json(['status' => 'error', 'message' => 'Kode OTP salah!'], 400);
            }
        }

        $user->update(['totp_secret' => null]);

        return response()->json([
            'status'  => 'success',
            'message' => '2FA Authenticator berhasil dinonaktifkan.',
        ]);
    }

    public function getUsers(Request $request): JsonResponse
    {
        $users = User::where('role', '!=', 'Server')
            ->whereRaw('LOWER(COALESCE(dept, "")) != "server"')
            ->get();
        $now = time();
        $activeSessions = DB::table('sessions')->get()->keyBy('user_id');

        $result = $users->map(function ($u) use ($activeSessions, $now) {
            $arr = $u->toArray();
            $ukey = strtolower($u->username);
            $sess = $activeSessions->get($ukey);
            $arr['is_online'] = $sess && ($now - $sess->last_activity < 45);
            return $arr;
        });

        return response()->json($result);
    }

    public function createUser(Request $request): JsonResponse
    {
        $data = $request->all();
        $creator = trim($request->input('creator_username', $request->input('requester_username', $request->input('requester', ''))));
        $creatorUser = $creator ? User::where('username', $creator)->first() : null;
        $creatorRole = $creatorUser ? $creatorUser->role : '';

        $creatorLevel = $this->getRoleLevel($creatorRole);
        $targetLevel = $this->getRoleLevel($data['role'] ?? '');

        $adminRoles = ['Server', 'Admin Eng', 'Foreman Eng', 'Supervisor Eng', 'Manager Eng', 'Plant Manager', 'Factory Manager'];
        $isValid = ($this->isServerAdmin($creatorUser, $creator) || in_array($creatorRole, $adminRoles, true) || $creatorLevel > $targetLevel);

        if (! $isValid) {
            return response()->json(['status' => 'error', 'message' => 'Otoritas Anda tidak mencukupi untuk membuat user dengan jabatan tersebut!'], 403);
        }

        if (User::where('username', $data['username'])->exists()) {
            return response()->json(['status' => 'error', 'message' => "Username '{$data['username']}' sudah digunakan oleh user lain!"], 400);
        }

        User::create($data);
        return response()->json(['status' => 'success', 'username' => $data['username']], 201);
    }

    public function updateUser(Request $request, string $username): JsonResponse
    {
        $user = User::where('username', $username)->first();
        if (! $user) {
            return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan'], 404);
        }

        $data = $request->all();
        $user->update($data);
        return response()->json(['status' => 'success', 'username' => $username]);
    }

    public function updateUserLayoutSettings(Request $request, string $username): JsonResponse
    {
        $user = User::where('username', $username)->first();
        if (! $user) {
            return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan'], 404);
        }

        $incomingLayout = $request->input('layout_settings');
        $layoutJson = is_array($incomingLayout) ? json_encode($incomingLayout) : (string) $incomingLayout;

        $user->update([
            'layout_settings' => $layoutJson,
        ]);

        return response()->json(['status' => 'success', 'username' => $username]);
    }

    public function updateUserAccess(Request $request, string $username): JsonResponse
    {
        $requester = trim($request->input('requester_username', $request->input('creator_username', '')));
        $reqUser = User::where('username', $requester)->first();

        if (! $this->isServerAdmin($reqUser, $requester)) {
            return response()->json(['status' => 'error', 'message' => 'Pengaturan akses akun hanya dapat diubah oleh Akun Server!'], 403);
        }

        $user = User::where('username', $username)->first();
        if (! $user) {
            return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan'], 404);
        }

        $permissions = $request->input('access_permissions', []);
        $isActive = $request->input('is_active', 1) ? 1 : 0;

        $user->update([
            'access_permissions' => is_array($permissions) ? json_encode($permissions) : $permissions,
            'is_active'          => $isActive,
        ]);

        if ($isActive === 0) {
            DB::table('sessions')->where('user_id', strtolower($username))->delete();
        }

        return response()->json(['status' => 'success', 'message' => "Hak akses akun '{$username}' berhasil diperbarui."]);
    }

    public function updateRoleAccess(Request $request): JsonResponse
    {
        $creator = trim($request->input('creator_username', $request->input('requester_username', $request->input('requester', ''))));
        $creatorUser = User::where('username', $creator)->first();
        $creatorRole = $creatorUser ? $creatorUser->role : '';

        $adminRoles = ['Admin Eng', 'Foreman Eng', 'Supervisor Eng', 'Manager Eng', 'Plant Manager', 'Factory Manager'];
        if (! $this->isServerAdmin($creatorUser, $creator) && ! in_array($creatorRole, $adminRoles, true)) {
            return response()->json(['status' => 'error', 'message' => 'Otoritas tidak cukup untuk memperbarui hak akses role.'], 403);
        }

        $targetDept = $request->input('dept', $request->input('target_dept', 'ENG'));
        $targetRole = $request->input('role', $request->input('target_role', ''));
        if (! $targetRole) {
            return response()->json(['status' => 'error', 'message' => 'Role target wajib diisi!'], 400);
        }

        $permissions = $request->input('access_permissions', []);
        $permJson = is_array($permissions) ? json_encode($permissions) : $permissions;

        User::whereRaw('LOWER(COALESCE(dept, "ENG")) = LOWER(?)', [$targetDept])
            ->whereRaw('LOWER(COALESCE(role, "User")) = LOWER(?)', [$targetRole])
            ->update(['access_permissions' => $permJson]);

        return response()->json(['status' => 'success', 'message' => "Hak akses per Role '{$targetRole}' Dept '{$targetDept}' berhasil diperbarui."]);
    }

    public function bulkResetUserAccess(Request $request): JsonResponse
    {
        $requester = trim($request->input('requester_username', $request->input('creator_username', '')));
        $reqUser = User::where('username', $requester)->first();

        if (! $this->isServerAdmin($reqUser, $requester)) {
            return response()->json(['status' => 'error', 'message' => 'Hanya Akun Server yang dapat me-reset hak akses massal!'], 403);
        }

        User::query()->update(['access_permissions' => null]);
        return response()->json(['status' => 'success', 'message' => 'Seluruh hak akses kustom pengguna berhasil di-reset ke setelan role default!']);
    }

    public function deleteUser(Request $request, string $username): JsonResponse
    {
        $user = User::where('username', $username)->first();
        if (! $user) {
            return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan'], 404);
        }

        if ($this->isServerAdmin($user, $username)) {
            return response()->json(['status' => 'error', 'message' => 'Akun Root Server dilindungi sistem dan tidak dapat dihapus!'], 403);
        }

        DB::table('sessions')->where('user_id', strtolower($username))->delete();
        $user->delete();

        return response()->json(['status' => 'success', 'message' => 'User berhasil dihapus']);
    }

    public function seedBasedAccounts(Request $request): JsonResponse
    {
        $username = trim($request->input('username', ''));
        $user = User::where('username', $username)->first();

        if (! $this->isServerAdmin($user, $username)) {
            return response()->json(['status' => 'error', 'message' => 'Otoritas tidak cukup. Hanya akun Server yang dapat generate based accounts.'], 403);
        }

        $baseAccounts = [
            ["tedy", "123456", "Tedy", "Sipil 1", "Sipil", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "ENG"],
            ["dadang", "123456", "Dadang", "Sipil 2", "Sipil", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80", "ENG"],
            ["thorik", "123456", "Thorik", "Elektrik 1", "Elektrik", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80", "ENG"],
            ["rifky", "123456", "Rifky", "Elektrik 2", "Elektrik", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "ENG"],
            ["hadi", "123456", "Hadi", "Elektrik 3", "Elektrik", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "ENG"],
            ["kresna", "123456", "Kresna", "Elektrik 4", "Elektrik", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80", "ENG"],
            ["aden", "123456", "Aden", "Kalibrasi", "Kalibrasi", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80", "ENG"],
            ["chandra", "123456", "Chandra", "Program", "Program", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80", "ENG"],
            ["yuli", "123456", "Yuli", "Mekanik 1", "Mekanik", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80", "ENG"],
            ["reksa", "123456", "Reksa", "Mekanik 2", "Mekanik", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80", "ENG"],
            ["eman", "123456", "Eman", "Mekanik 3", "Mekanik", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80", "ENG"],
            ["rahmad", "123456", "Rahmad", "Repair Part", "Repair Part", "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80", "ENG"],
            ["diki", "123456", "Diki Firmansyah", "Sipil", "Drafter", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "ENG"],
            ["rifan", "123456", "Rifan Nur Satriyo", "Mekanikal", "Drafter", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "ENG"],
            ["syawal", "123456", "Syawal", "PRD Proses", "user_PRD", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80", "PRD"],
            ["zikautsar", "123456", "Ahmad Zikautsar", "PRD Retail", "user_PRD", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80", "PRD"],
            ["alfian", "123456", "Alfian", "", "user_WRH", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "WRH"],
            ["puput", "123456", "Puput Susanto", "Utility", "user_EUT", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "EUT"],
            ["parhan", "123456", "Ahmad Parhan", "WWTP", "user_EUT", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80", "EUT"],
            ["miftah", "123456", "Miftah Hasan Fuadi", "Otomotif & Maintenance", "user_EUT", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80", "EUT"],
            ["feny", "123456", "Feny Logina", "Part Keeper", "user_EPR", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80", "EPR"],
            ["dicky", "123456", "Dicky Syaiful", "PM Retail", "user_EPR", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80", "EPR"],
            ["dodi", "123456", "Dodi Simanjuntak", "PM Proses", "user_EPR", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80", "EPR"],
            ["intan", "123456", "Intan Purnama", "Kimia & Mikro", "user_QC", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80", "QC"],
            ["annisa", "123456", "Annisa Nurfitriana", "Retail", "user_QC", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80", "QC"],
            ["yessica", "123456", "Yessica Tania", "R&D Research", "user_QC", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80", "QC"],
            ["hesti", "123456", "Hesti Kurniati", "RM Raw Material", "user_QC", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80", "QC"],
            ["tashya", "123456", "Tashya Claudea", "", "user_GA", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80", "GA"],
            ["dedi_h", "123456", "Dedi Hartono", "", "user_TMB", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "TMB"],
            ["andi_y", "123456", "Andi Yulianto", "", "Supervisor PRD", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "PRD"],
            ["muhono_eut", "123456", "Muhono", "", "Supervisor EUT", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80", "EUT"],
            ["reja", "123456", "Reja Firmansyah", "", "Supervisor EUT", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80", "EUT"],
            ["usep", "123456", "Usep Hermawan", "", "Supervisor EPR", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "EPR"],
            ["nancy", "123456", "Nancy Krismawati", "", "Supervisor GA", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80", "GA"],
            ["yongki", "123456", "Yongki Yeremia", "", "Supervisor GA", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80", "GA"],
            ["veronica", "123456", "Veronica Ong", "", "Supervisor QC", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80", "QC"],
            ["endro", "123456", "Endro Juniarto", "", "Supervisor WRH", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "WRH"],
            ["dani", "dani123", "Ahmad Dani", "", "Foreman Eng", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80", "ENG"],
            ["budi", "budi123", "Budi Utomo", "", "Foreman Eng", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "ENG"],
            ["fiki", "123456", "Fiki Erwansyah", "", "Foreman Eng", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "ENG"],
            ["muhono_eng", "123456", "Muhono", "", "Supervisor Eng", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80", "ENG"],
            ["edy", "123456", "Edy Santoso", "", "Manager Eng", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "ENG"],
        ];

        $count = 0;
        foreach ($baseAccounts as [$uName, $uPass, $uFull, $uSec, $uRole, $uAv, $uDept]) {
            User::updateOrCreate(
                ['username' => $uName],
                [
                    'password'  => $uPass,
                    'fullname'  => $uFull,
                    'section'   => $uSec,
                    'role'      => $uRole,
                    'avatar'    => $uAv,
                    'dept'      => $uDept,
                    'is_active' => 1,
                ]
            );
            $count++;
        }

        return response()->json([
            'status'  => 'success',
            'count'   => $count,
            'message' => "Berhasil meng-generate {$count} akun basis (Departemen, SPV, & Teknisi Engineering)!",
        ]);
    }

    private function validateSafeUploadExtension(string $ext, array $allowed = ['png', 'jpg', 'jpeg', 'pdf', 'webp', 'doc', 'docx', 'xls', 'xlsx']): bool
    {
        $dangerous = ['php', 'php3', 'php4', 'php5', 'phtml', 'phar', 'exe', 'sh', 'bat', 'cmd', 'js', 'vbs', 'py', 'pl', 'cgi', 'htaccess'];
        $clean = strtolower(trim($ext, '. '));
        return in_array($clean, $allowed, true) && ! in_array($clean, $dangerous, true);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $username = $request->input('username');
        $user = User::where('username', $username)->first();
        if (! $user) {
            return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan'], 404);
        }

        if (! $request->hasFile('avatar') && ! $request->hasFile('file')) {
            return response()->json(['status' => 'error', 'message' => 'File tidak ditemukan'], 400);
        }

        $file = $request->file('avatar') ?: $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension() ?: 'png');
        if (! $this->validateSafeUploadExtension($ext, ['png', 'jpg', 'jpeg', 'webp'])) {
            return response()->json(['status' => 'error', 'message' => 'Format file avatar tidak diizinkan! Wajib format gambar (PNG/JPG/WEBP)'], 400);
        }
        $filename = 'avatar_' . strtolower($username) . '_' . Str::random(6) . '.' . $ext;
        $destPath = public_path('uploads/avatars');
        if (! File::isDirectory($destPath)) {
            File::makeDirectory($destPath, 0777, true, true);
        }

        $file->move($destPath, $filename);
        $avatarUrl = '/uploads/avatars/' . $filename;
        $user->update(['avatar' => $avatarUrl]);

        return response()->json([
            'status'  => 'success',
            'avatar'  => $avatarUrl,
            'message' => 'Foto profil berhasil diperbarui.',
        ]);
    }

    public function getEjos(): JsonResponse
    {
        $ejos = Ejo::all();
        return response()->json($ejos);
    }

    public function createEjo(Request $request): JsonResponse
    {
        $data = $request->all();
        $ejoId = $data['id'] ?? ('EJO-' . date('Y') . '-' . Str::random(3));

        if (preg_match('/^EJO-2026-(\d+)$/', $ejoId, $m)) {
            if (Ejo::where('id', $ejoId)->exists()) {
                $existing = Ejo::where('id', 'like', 'EJO-2026-%')->pluck('id');
                $nums = [];
                foreach ($existing as $ex) {
                    if (preg_match('/^EJO-2026-(\d+)$/', $ex, $mx)) {
                        $nums[] = (int) $mx[1];
                    }
                }
                $next = $nums ? (max($nums) + 1) : 1;
                $ejoId = sprintf('EJO-2026-%03d', $next);
            }
        }

        $data['id'] = $ejoId;
        $status = $data['status'] ?? 'Requested';
        if ($status === 'Waiting Dept Approval') $status = 'Requested';
        $data['status'] = $status;

        $ejo = Ejo::create($data);

        $engineer = $data['engineer'] ?? 'Unassigned';
        if ($engineer && $engineer !== 'Unassigned') {
            foreach (explode(',', $engineer) as $eng) {
                $engName = trim($eng);
                if ($engName) {
                    $u = $this->resolveUsername($engName);
                    if ($u) {
                        $this->insertNotification($u, $ejoId, "EJO Baru {$ejoId} ditugaskan kepada Anda: {$data['title']}");
                    }
                }
            }
        }

        return response()->json(['status' => 'success', 'id' => $ejoId], 201);
    }

    public function updateEjo(Request $request, string $id): JsonResponse
    {
        $ejo = Ejo::find($id);
        if (! $ejo) {
            return response()->json(['status' => 'error', 'message' => 'EJO tidak ditemukan'], 404);
        }

        $data = $request->all();
        $ejo->update($data);
        return response()->json(['status' => 'success', 'id' => $id]);
    }

    public function deleteEjo(Request $request, string $id): JsonResponse
    {
        $ejo = Ejo::find($id);
        if (! $ejo) {
            return response()->json(['status' => 'error', 'message' => 'EJO tidak ditemukan'], 404);
        }

        $ejo->delete();
        return response()->json(['status' => 'success', 'message' => 'EJO berhasil dihapus']);
    }

    public function getGeneralEjos(): JsonResponse
    {
        // Auto-archive expired completed general ejos (> 3 days)
        $threeDaysAgo = now()->subDays(3);
        $expiredGejos = GeneralEjo::whereIn('status', ['Completed', 'Cancelled'])
            ->where(function ($q) {
                $q->where('is_archived', 0)->orWhereNull('is_archived');
            })
            ->get();

        foreach ($expiredGejos as $gejo) {
            $compDate = null;
            if (! empty($gejo->qty_work_done_date)) {
                try {
                    $cleanDone = str_replace(['Z', 'T'], ['', ' '], substr($gejo->qty_work_done_date, 0, 19));
                    $compDate = \Carbon\Carbon::parse($cleanDone);
                } catch (\Throwable $e) {}
            }

            $logs = is_array($gejo->logs) ? $gejo->logs : [];
            if (! $compDate && ! empty($logs)) {
                foreach (array_reverse($logs) as $l) {
                    $msg = $l['message'] ?? '';
                    $dtStr = $l['date'] ?? '';
                    if ((str_contains($msg, 'Completed') || str_contains($msg, 'selesai') || str_contains($msg, 'Selesai')) && $dtStr) {
                        try {
                            $compDate = \Carbon\Carbon::parse($dtStr);
                            break;
                        } catch (\Throwable $e) {}
                    }
                }
            }

            if (! $compDate && ! empty($gejo->createdDate)) {
                try {
                    $compDate = \Carbon\Carbon::parse($gejo->createdDate);
                } catch (\Throwable $e) {}
            }

            if ($compDate && $compDate->lte($threeDaysAgo)) {
                $logs[] = [
                    'date'    => now()->format('Y-m-d H:i'),
                    'message' => 'Pekerjaan otomatis diarsipkan ke History oleh sistem setelah 3 hari tanpa konfirmasi.',
                ];
                $gejo->is_archived = 1;
                $gejo->logs = $logs;
                $gejo->save();
            }
        }

        $generalEjos = GeneralEjo::all();
        return response()->json($generalEjos);
    }

    public function createGeneralEjo(Request $request): JsonResponse
    {
        $data = $request->all();
        if (isset($data['items']) && is_array($data['items'])) {
            $inserted = 0;
            foreach ($data['items'] as $item) {
                GeneralEjo::create($item);
                $inserted++;
            }
            return response()->json(['status' => 'success', 'count' => $inserted], 201);
        }

        $gejoId = $data['id'] ?? ('EJO' . Str::random(8));
        $data['id'] = $gejoId;
        $data['createdDate'] = $data['createdDate'] ?? now()->toIso8601String();
        $data['status'] = $data['status'] ?? 'Requested';
        $gejo = GeneralEjo::create($data);

        return response()->json(['status' => 'success', 'id' => $gejoId], 201);
    }

    public function updateGeneralEjo(Request $request, string $id): JsonResponse
    {
        $gejo = GeneralEjo::find($id);
        if (! $gejo) {
            return response()->json(['status' => 'error', 'message' => 'General EJO tidak ditemukan'], 404);
        }

        $data = $request->all();
        $gejo->update($data);
        return response()->json(['status' => 'success', 'id' => $id]);
    }

    public function deleteGeneralEjo(Request $request, string $id): JsonResponse
    {
        $gejo = GeneralEjo::find($id);
        if (! $gejo) {
            return response()->json(['status' => 'error', 'message' => 'General EJO tidak ditemukan'], 404);
        }

        $gejo->delete();
        return response()->json(['status' => 'success', 'message' => 'General EJO berhasil dihapus']);
    }

    public function getProjects(): JsonResponse
    {
        $projects = Project::all();
        return response()->json($projects);
    }

    public function createProject(Request $request): JsonResponse
    {
        $data = $request->all();
        $proj = Project::create($data);
        return response()->json(['status' => 'success', 'id' => $proj->id], 201);
    }

    public function updateProject(Request $request, string $id): JsonResponse
    {
        $project = Project::find($id);
        if (! $project) {
            return response()->json(['status' => 'error', 'message' => 'Project tidak ditemukan'], 404);
        }

        $data = $request->all();
        $project->update($data);

        // Auto stamp project handover PDFs if handover_approvals updated (100% Native PHP FPDI)
        if (isset($data['handover_approvals']) && ! empty($project->handover_docs)) {
            $hApprovals = is_array($project->handover_approvals) ? $project->handover_approvals : [];
            $hDocs = is_array($project->handover_docs) ? $project->handover_docs : [];

            if (! empty($hApprovals)) {
                $signerService = app(\App\Services\PdfSignerService::class);
                foreach ($hDocs as $hDoc) {
                    $docUrl = is_string($hDoc) ? $hDoc : ($hDoc['path'] ?? $hDoc['url'] ?? '');
                    if ($docUrl && str_ends_with(strtolower(explode('?', $docUrl)[0]), '.pdf')) {
                        $pdfAbsPath = public_path(ltrim(explode('?', $docUrl)[0], '/'));
                        $signerService->signHandover($pdfAbsPath, $hApprovals);
                    }
                }
            }
        }

        return response()->json(['status' => 'success', 'id' => $id]);
    }

    public function deleteProject(Request $request, string $id): JsonResponse
    {
        $project = Project::find($id);
        if (! $project) {
            return response()->json(['status' => 'error', 'message' => 'Project tidak ditemukan'], 404);
        }

        $project->delete();
        return response()->json(['status' => 'success', 'message' => 'Project berhasil dihapus']);
    }

    public function uploadProjectDoc(Request $request): JsonResponse
    {
        $projId = $request->input('id');
        $project = Project::find($projId);
        if (! $project) {
            return response()->json(['status' => 'error', 'message' => 'Project tidak ditemukan'], 404);
        }

        $file = $request->file('file');
        if (! $file) {
            return response()->json(['status' => 'error', 'message' => 'File tidak valid'], 400);
        }

        $ext = strtolower($file->getClientOriginalExtension() ?: 'pdf');
        if (! $this->validateSafeUploadExtension($ext, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'])) {
            return response()->json(['status' => 'error', 'message' => 'Format file dokumen project tidak diizinkan!'], 400);
        }
        $filename = 'proj_' . Str::random(8) . '.' . $ext;
        $destPath = public_path('uploads/projects');
        if (! File::isDirectory($destPath)) {
            File::makeDirectory($destPath, 0777, true, true);
        }

        $file->move($destPath, $filename);
        $fileUrl = '/uploads/projects/' . $filename;

        $colName = $request->input('category', 'docs');
        $currentDocs = $project->{$colName} ?: [];
        $currentDocs[] = $fileUrl;

        $project->{$colName} = $currentDocs;
        if ($colName === 'handover_docs') {
            $project->handover_approvals = [];
        }
        $project->save();

        return response()->json([
            'status'   => 'success',
            'file_url' => $fileUrl,
            $colName   => $currentDocs,
        ]);
    }

    public function deleteProjectHandoverDoc(Request $request, string $id): JsonResponse
    {
        $project = Project::find($id);
        if (! $project) {
            return response()->json(['status' => 'error', 'message' => 'Project tidak ditemukan'], 404);
        }

        $docUrl = $request->query('url', '');
        $currentDocs = is_array($project->handover_docs) ? $project->handover_docs : [];
        $targetClean = strtolower(basename(explode('?', $docUrl)[0]));

        $updatedDocs = [];
        foreach ($currentDocs as $d) {
            $dUrl = is_string($d) ? $d : ($d['path'] ?? $d['url'] ?? '');
            if ($dUrl && strtolower(basename(explode('?', $dUrl)[0])) === $targetClean) {
                continue;
            }
            $updatedDocs[] = $d;
        }

        $project->handover_docs = $updatedDocs;
        $project->handover_approvals = [];
        $project->save();

        return response()->json([
            'status'             => 'success',
            'handover_docs'      => $updatedDocs,
            'handover_approvals' => [],
        ]);
    }

    public function getDrawings(): JsonResponse
    {
        $drawings = Drawing::orderByDesc('uploaded_at')->get();
        return response()->json($drawings);
    }

    public function uploadDrawing(Request $request): JsonResponse
    {
        $data = $request->all();
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $ext = strtolower($file->getClientOriginalExtension() ?: 'pdf');
            if (! $this->validateSafeUploadExtension($ext, ['pdf', 'png', 'jpg', 'jpeg', 'dwg', 'dxf'])) {
                return response()->json(['status' => 'error', 'message' => 'Format file drawing tidak diizinkan! (Hanya PDF/Gambar/CAD)'], 400);
            }
            $drawingId = $data['id'] ?? ('DRW' . Str::random(8));
            $filename = strtolower($drawingId) . '_' . Str::random(8) . '.' . $ext;
            $destPath = public_path('uploads/drawings');
            if (! File::isDirectory($destPath)) {
                File::makeDirectory($destPath, 0777, true, true);
            }
            $file->move($destPath, $filename);
            $data['file_path'] = '/uploads/drawings/' . $filename;
        }

        $drawingId = $data['id'] ?? ('DRW' . Str::random(8));
        $data['id'] = $drawingId;
        $data['uploaded_at'] = $data['uploaded_at'] ?? now()->toIso8601String();

        $drawing = Drawing::create($data);

        // Auto apply PDF stamp signatures if approvals present and file is PDF (100% Native PHP FPDI)
        if (! empty($drawing->file_path) && str_ends_with(strtolower(explode('?', $drawing->file_path)[0]), '.pdf')) {
            $approvals = $drawing->approvals ?: [];
            if (! empty($approvals)) {
                $pdfAbsPath = public_path(ltrim(explode('?', $drawing->file_path)[0], '/'));
                $cat = $drawing->etiket_category ?: ($drawing->category ?: 'Sipil');
                $orient = $drawing->etiket_orientation ?: 'landscape';

                app(\App\Services\PdfSignerService::class)->signDrawing($pdfAbsPath, $approvals, $cat, $orient);
            }
        }

        return response()->json(['status' => 'success', 'id' => $drawingId], 201);
    }

    public function updateDrawing(Request $request, string $id): JsonResponse
    {
        $drawing = Drawing::find($id);
        if (! $drawing) {
            return response()->json(['status' => 'error', 'message' => 'Drawing tidak ditemukan'], 404);
        }

        $data = $request->all();

        // Handle multipart upload if file attached
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $ext = strtolower($file->getClientOriginalExtension() ?: 'pdf');
            if (! $this->validateSafeUploadExtension($ext, ['pdf', 'png', 'jpg', 'jpeg', 'dwg', 'dxf'])) {
                return response()->json(['status' => 'error', 'message' => 'Format file drawing tidak diizinkan! (Hanya PDF/Gambar/CAD)'], 400);
            }
            $filename = strtolower($id) . '_' . Str::random(8) . '.' . $ext;
            $destPath = public_path('uploads/drawings');
            if (! File::isDirectory($destPath)) {
                File::makeDirectory($destPath, 0777, true, true);
            }
            $file->move($destPath, $filename);
            $data['file_path'] = '/uploads/drawings/' . $filename;
        }

        $drawing->update($data);

        // Auto apply PDF stamp signatures if approvals present and file is PDF (100% Native PHP FPDI)
        if (! empty($drawing->file_path) && str_ends_with(strtolower(explode('?', $drawing->file_path)[0]), '.pdf')) {
            $approvals = $drawing->approvals ?: [];
            if (! empty($approvals)) {
                $pdfAbsPath = public_path(ltrim(explode('?', $drawing->file_path)[0], '/'));
                $cat = $drawing->etiket_category ?: 'Sipil';
                $orient = $drawing->etiket_orientation ?: 'landscape';

                app(\App\Services\PdfSignerService::class)->signDrawing($pdfAbsPath, $approvals, $cat, $orient);
            }
        }

        return response()->json(['status' => 'success', 'id' => $id]);
    }

    public function deleteDrawing(Request $request, string $id): JsonResponse
    {
        $drawing = Drawing::find($id);
        if (! $drawing) {
            return response()->json(['status' => 'error', 'message' => 'Drawing tidak ditemukan'], 404);
        }

        $drawing->delete();
        return response()->json(['status' => 'success', 'message' => 'Drawing berhasil dihapus']);
    }

    public function getRepairParts(): JsonResponse
    {
        $parts = RepairPart::all();
        return response()->json($parts);
    }

    public function createRepairPart(Request $request): JsonResponse
    {
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = 'RP' . date('ymdHis') . '_' . Str::random(4);
        }
        if (empty($data['name']) && ! empty($data['part_name'])) {
            $data['name'] = $data['part_name'];
        }
        if (empty($data['code']) && ! empty($data['part_number'])) {
            $data['code'] = $data['part_number'];
        }
        $part = RepairPart::create($data);
        return response()->json(['status' => 'success', 'id' => $part->id], 201);
    }

    public function deleteRepairPart(Request $request, string $id): JsonResponse
    {
        $part = RepairPart::find($id);
        if (! $part) {
            return response()->json(['status' => 'error', 'message' => 'Part tidak ditemukan'], 404);
        }

        $part->delete();
        return response()->json(['status' => 'success', 'message' => 'Part berhasil dihapus']);
    }

    public function getWspMaterials(): JsonResponse
    {
        $materials = WspMaterial::all();
        return response()->json($materials);
    }

    public function importWspMaterials(Request $request): JsonResponse
    {
        $items = $request->input('items', $request->all());
        if (! is_array($items)) {
            $items = [];
        }

        WspMaterial::truncate();
        $count = 0;
        foreach ($items as $item) {
            $mat = trim($item['material'] ?? '');
            if (! $mat) continue;
            WspMaterial::create([
                'material'    => $mat,
                'description' => trim($item['description'] ?? ''),
                'price'       => (float) ($item['price'] ?? 0.0),
            ]);
            $count++;
        }

        return response()->json(['status' => 'success', 'message' => "{$count} materials imported"]);
    }

    public function getSettings(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $data = $request->all();
        foreach ($data as $k => $v) {
            Setting::updateOrCreate(
                ['key' => $k],
                ['value' => (string) $v]
            );
        }
        return response()->json(['status' => 'success']);
    }

    public function getNotifications(Request $request): JsonResponse
    {
        $username = $request->query('username');
        if (! $username) {
            return response()->json(['message' => 'Parameter username diperlukan'], 400);
        }

        $notifs = Notification::where('target_username', $username)->orderByDesc('id')->get();
        return response()->json($notifs);
    }

    public function markAllNotificationsRead(Request $request): JsonResponse
    {
        $username = $request->query('username');
        if ($username) {
            Notification::where('target_username', $username)->update(['is_read' => 1]);
        }
        return response()->json(['status' => 'success']);
    }

    public function deleteNotifications(Request $request): JsonResponse
    {
        $username = $request->query('username');
        $notifId = $request->query('id');

        if ($notifId) {
            Notification::where('id', $notifId)->delete();
        } elseif ($username) {
            Notification::where('target_username', $username)->delete();
        }

        return response()->json(['status' => 'success']);
    }

    public function uploadFile(Request $request): JsonResponse
    {
        if (! $request->hasFile('file')) {
            return response()->json(['status' => 'error', 'message' => 'File tidak valid'], 400);
        }

        $file = $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension() ?: 'png');
        if (! $this->validateSafeUploadExtension($ext, ['png', 'jpg', 'jpeg', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx'])) {
            return response()->json(['status' => 'error', 'message' => 'Format file tidak diizinkan!'], 400);
        }
        $filename = 'rev_' . Str::random(8) . '.' . $ext;

        $destPath = public_path('uploads');
        if (! File::isDirectory($destPath)) {
            File::makeDirectory($destPath, 0777, true, true);
        }

        $file->move($destPath, $filename);
        $fileUrl = '/uploads/' . $filename;

        return response()->json([
            'status'    => 'success',
            'file_url'  => $fileUrl,
            'file_name' => $file->getClientOriginalName(),
        ]);
    }

    public function nuclearDatabase(Request $request): JsonResponse
    {
        $username = trim($request->input('username', ''));
        $user = User::where('username', $username)->first();

        if (! $this->isServerAdmin($user, $username)) {
            return response()->json(['status' => 'error', 'message' => 'Hanya role Server yang boleh melakukan operasi ini'], 403);
        }

        Ejo::truncate();
        GeneralEjo::truncate();
        Drawing::truncate();
        Project::truncate();
        RepairPart::truncate();
        Notification::truncate();
        WspMaterial::truncate();

        return response()->json(['status' => 'success', 'message' => 'Semua modul data berhasil di-reset.']);
    }

    public function resetModuleDatabase(Request $request): JsonResponse
    {
        $username = trim($request->input('username', ''));
        $module   = strtolower(trim($request->input('module', '')));

        $user = User::where('username', $username)->first();

        if (! $this->isServerAdmin($user, $username)) {
            return response()->json(['status' => 'error', 'message' => 'Otoritas tidak cukup. Hanya Server Admin yang dapat mereset modul database.'], 403);
        }

        switch ($module) {
            case 'general-ejo':
                GeneralEjo::whereNull('category')->orWhere('category', '!=', 'Repair Part')->delete();
                $msg = 'Data General EJO berhasil dihapus!';
                break;
            case 'drawing':
                Drawing::truncate();
                $msg = 'Data Drawing EJO berhasil dihapus!';
                break;
            case 'projects':
                Project::truncate();
                $msg = 'Data Project Monitoring berhasil dihapus!';
                break;
            case 'parts':
            case 'partlist':
                RepairPart::truncate();
                GeneralEjo::where('category', 'Repair Part')->delete();
                $msg = 'Data Repair Part & Spare Part berhasil dihapus!';
                break;
            case 'history':
                GeneralEjo::where('status', 'Completed')->orWhere('is_archived', 1)->delete();
                Drawing::where('status', 'Done')->delete();
                Notification::truncate();
                $msg = 'Data History EJO & Notifikasi berhasil dihapus!';
                break;
            case 'all-data':
            case 'all_data':
            case 'all-modules':
            case 'all_modules':
            case 'all-except-users':
                Ejo::truncate();
                GeneralEjo::truncate();
                Drawing::truncate();
                Project::truncate();
                RepairPart::truncate();
                Notification::truncate();
                WspMaterial::truncate();
                $msg = 'Seluruh data tiket & modul berhasil dihapus tanpa mengubah akun personel!';
                break;
            case 'users':
                User::where('role', '!=', 'Server')->delete();
                $msg = 'Akun pengguna berhasil di-reset ke setelan default!';
                break;
            default:
                return response()->json(['status' => 'error', 'message' => "Modul '{$module}' tidak dikenali"], 400);
        }

        return response()->json(['status' => 'success', 'module' => $module, 'message' => $msg]);
    }

    public function getDailyActivityLogs(Request $request): JsonResponse
    {
        $date = $request->query('date', date('Y-m-d'));
        $logs = \DB::table('daily_activity_logs')
            ->where('log_date', $date)
            ->orderBy('id', 'asc')
            ->get();
        return response()->json(['status' => 'success', 'date' => $date, 'data' => $logs]);
    }

    public function createDailyActivityLog(Request $request): JsonResponse
    {
        $data = $request->validate([
            'log_date' => 'required|string',
            'group_type' => 'required|string',
            'engineer_name' => 'required|string',
            'role' => 'nullable|string',
            'activity' => 'required|string',
            'ejo_id' => 'nullable|string',
            'ejo_title' => 'nullable|string',
            'created_by' => 'nullable|string'
        ]);

        $id = \DB::table('daily_activity_logs')->insertGetId(array_merge($data, [
            'created_at' => now(),
            'updated_at' => now()
        ]));

        return response()->json(['status' => 'success', 'id' => $id, 'message' => 'Log aktivitas berhasil ditambahkan!']);
    }

    public function deleteDailyActivityLog(Request $request, $id): JsonResponse
    {
        \DB::table('daily_activity_logs')->where('id', $id)->delete();
        return response()->json(['status' => 'success', 'message' => 'Log aktivitas berhasil dihapus!']);
    }
}
