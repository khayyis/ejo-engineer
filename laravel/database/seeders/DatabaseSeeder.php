<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Default users (password plaintext seperti original server.py)
        $users = [
            ['username' => 'server',       'password' => 'server123',    'fullname' => 'Server Admin',         'role' => 'Server',          'dept' => 'ENG', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'manager_eng',  'password' => 'manager123',   'fullname' => 'Manager Engineering',  'role' => 'Manager Eng',     'dept' => 'ENG', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'spv_eng',      'password' => 'spv123',       'fullname' => 'Supervisor Engineering','role' => 'Supervisor Eng',  'dept' => 'ENG', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'foreman_eng',  'password' => 'foreman123',   'fullname' => 'Foreman Engineering',  'role' => 'Foreman Eng',     'dept' => 'ENG', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'admin_eng',    'password' => 'admin123',     'fullname' => 'Admin Engineering',    'role' => 'Admin Eng',       'dept' => 'ENG', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'drafter1',     'password' => 'drafter123',   'fullname' => 'Drafter 1',            'role' => 'Drafter',         'dept' => 'ENG', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'staff_prd',    'password' => 'staff123',     'fullname' => 'Staff Produksi',       'role' => 'Staff PRD',       'dept' => 'PRD', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'staff_epr',    'password' => 'staff123',     'fullname' => 'Staff EPR',            'role' => 'Staff EPR',       'dept' => 'EPR', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'staff_ga',     'password' => 'staff123',     'fullname' => 'Staff GA',             'role' => 'Staff GA',        'dept' => 'GA',  'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'staff_qc',     'password' => 'staff123',     'fullname' => 'Staff QC',             'role' => 'Staff QC',        'dept' => 'QC',  'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'staff_wrh',    'password' => 'staff123',     'fullname' => 'Staff Warehouse',      'role' => 'Staff WRH',       'dept' => 'WRH', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'staff_tmb',    'password' => 'staff123',     'fullname' => 'Staff Timbangan',      'role' => 'Staff TMB',       'dept' => 'TMB', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'spv_tmb',      'password' => 'spv123',       'fullname' => 'Supervisor Timbangan', 'role' => 'Supervisor TMB',  'dept' => 'TMB', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
            ['username' => 'manager_tmb',  'password' => 'manager123',   'fullname' => 'Manager Timbangan',    'role' => 'Manager TMB',     'dept' => 'TMB', 'avatar' => '', 'signature' => '', 'show_status_prop' => 1],
        ];

        foreach ($users as $u) {
            DB::table('users')->insertOrIgnore($u);
        }

        // Default settings
        $settings = [
            ['key' => 'show_status_prop',       'value' => '1'],
            ['key' => 'maintenance_mode',        'value' => '0'],
            ['key' => 'kpi_percentage_gejo',     'value' => '80'],
            ['key' => 'kpi_percentage_drawing',  'value' => '80'],
            ['key' => 'kpi_realisasi_gejo',      'value' => '0'],
            ['key' => 'kpi_realisasi_drawing',   'value' => '0'],
        ];

        foreach ($settings as $s) {
            DB::table('settings')->insertOrIgnore($s);
        }

        // Default repair parts
        $parts = [
            ['id' => 'PART-001', 'name' => 'Bearing 6205',    'code' => 'BRG-6205', 'stock' => 10, 'location' => 'Rak A1', 'price' => 45000,  'cost_saving' => 0, 'original_price' => 55000],
            ['id' => 'PART-002', 'name' => 'V-Belt A50',      'code' => 'VBT-A50',  'stock' => 5,  'location' => 'Rak A2', 'price' => 35000,  'cost_saving' => 0, 'original_price' => 45000],
            ['id' => 'PART-003', 'name' => 'Seal Oil 30x50',  'code' => 'SOL-3050', 'stock' => 20, 'location' => 'Rak B1', 'price' => 15000,  'cost_saving' => 0, 'original_price' => 20000],
            ['id' => 'PART-004', 'name' => 'Grease Shell EP2','code' => 'GRS-EP2',  'stock' => 8,  'location' => 'Rak B2', 'price' => 75000,  'cost_saving' => 0, 'original_price' => 90000],
            ['id' => 'PART-005', 'name' => 'Bolt M12x50',     'code' => 'BLT-M12',  'stock' => 50, 'location' => 'Rak C1', 'price' => 5000,   'cost_saving' => 0, 'original_price' => 7000],
        ];

        foreach ($parts as $p) {
            DB::table('repair_parts')->insertOrIgnore($p);
        }
    }
}
