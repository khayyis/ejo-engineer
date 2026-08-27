<?php

namespace App\Services;

class PdfSignerService
{
    private function getPythonPath(): string
    {
        $possiblePaths = [
            'C:\\Python314\\python.exe',
            'C:\\Python312\\python.exe',
            'C:\\Python311\\python.exe',
            'C:\\Python310\\python.exe',
            'python3',
            'python',
        ];

        foreach ($possiblePaths as $p) {
            return $p;
        }
        return 'python';
    }

    /**
     * Stamping signatures on Technical Drawing PDF using Python PyMuPDF Engine.
     */
    public function signDrawing(string $pdfPath, array $approvals, string $category = 'Sipil', string $orientation = 'landscape'): bool
    {
        if (! file_exists($pdfPath)) {
            return false;
        }

        try {
            $approvalsFile = tempnam(sys_get_temp_dir(), 'drw_app_');
            file_put_contents($approvalsFile, json_encode($approvals));
            
            $scriptPath = base_path('scripts/pdf_signer.py');
            $pyExe = $this->getPythonPath();

            $cmd = sprintf(
                '"%s" "%s" drawing %s %s %s %s',
                $pyExe,
                $scriptPath,
                escapeshellarg($pdfPath),
                escapeshellarg($approvalsFile),
                escapeshellarg($category),
                escapeshellarg($orientation)
            );

            @exec($cmd, $output, $exitCode);
            @unlink($approvalsFile);

            return $exitCode === 0;
        } catch (\Throwable $e) {
            \Log::error('signDrawing failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Stamping signatures on Project Handover (Berita Acara) PDF using Python PyMuPDF Engine.
     */
    public function signHandover(string $pdfPath, array $approvals): bool
    {
        if (! file_exists($pdfPath)) {
            return false;
        }

        try {
            $approvalsFile = tempnam(sys_get_temp_dir(), 'ho_app_');
            file_put_contents($approvalsFile, json_encode($approvals));
            
            $scriptPath = base_path('scripts/pdf_signer.py');
            $pyExe = $this->getPythonPath();

            $cmd = sprintf(
                '"%s" "%s" handover %s %s',
                $pyExe,
                $scriptPath,
                escapeshellarg($pdfPath),
                escapeshellarg($approvalsFile)
            );

            @exec($cmd, $output, $exitCode);
            @unlink($approvalsFile);

            return $exitCode === 0;
        } catch (\Throwable $e) {
            \Log::error('signHandover failed: ' . $e->getMessage());
            return false;
        }
    }
}
