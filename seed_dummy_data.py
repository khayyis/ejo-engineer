import sqlite3
import json
import os
import random
import datetime

DB_FILE = "ejo_database.db"

def seed_all_dummy_data():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    print("--- 1. SEEDING / UPDATING USERS ---")
    # Charlie is completely excluded! Official Drafters: Diki Firmansyah & Rifan Nur.
    users = [
        # Admin / Server / Leads
        ("server", "MQELXeeVFU3E3qlCE6QbSGJZUljX9MVnYkJVHFKBXDVbELwkLztLWp2M9iJ7aMTgJZfc6pmCmsokt8TF1Pi2xEvxHtWF9zvUFm8y95IPvg0irAVdnbgPjgg7dSyb9GD5", "System Server Admin", "Server", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80", "ENG"),
        ("admin", "admin123", "user_Admin", "Admin Eng", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80", "ENG"),
        ("fiki", "fiki123", "Fiki Erwansyah", "Foreman Eng", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80", "ENG"),
        ("foreman", "foreman123", "user_Foreman", "Foreman Eng", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80", "ENG"),
        ("muhono", "muhono123", "Muhono", "Supervisor Eng", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "ENG"),
        ("edy", "edy123", "Edy Santoso", "Manager Eng", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "ENG"),
        ("sutopo", "sutopo123", "Sutopo Sejati", "Factory Manager", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80", "ENG"),
        
        # Genuine Drafters
        ("diki", "123456", "Diki Firmansyah", "Drafter", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "ENG"),
        ("rifan", "123456", "Rifan Nur", "Drafter", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "ENG"),

        # Discipline Engineers / Operators (ENG)
        ("tedy", "123456", "Tedy", "Sipil", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "ENG"),
        ("dadang", "123456", "Dadang", "Sipil", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80", "ENG"),
        ("thorik", "123456", "Thorik", "Elektrik", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80", "ENG"),
        ("rifky", "123456", "Rifky", "Elektrik", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "ENG"),
        ("hadi", "123456", "Hadi", "Elektrik", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "ENG"),
        ("kresna", "123456", "Kresna", "Elektrik", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80", "ENG"),
        ("aden", "123456", "Aden", "Kalibrasi", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80", "ENG"),
        ("chandra", "123456", "Chandra", "Program", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80", "ENG"),
        ("yuli", "123456", "Yuli", "Mekanik", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80", "ENG"),
        ("reksa", "123456", "Reksa", "Mekanik", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80", "ENG"),
        ("eman", "123456", "Eman", "Mekanik", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80", "ENG"),
        ("rahmad", "123456", "Rahmad", "Repair Part", "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80", "ENG"),

        # Department Staff, Supervisors, Managers
        # PRD
        ("prd", "prd123", "user_PRD", "user_PRD", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "PRD"),
        ("staff_prd", "staff_prd123", "user_PRD", "user_PRD", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "PRD"),
        ("spvprd", "spvprd123", "Supervisor PRD", "Supervisor PRD", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "PRD"),
        ("spv_prd", "spv_prd123", "Supervisor PRD", "Supervisor PRD", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "PRD"),
        ("mgr_prd", "mgr_prd123", "Manager PRD", "Manager PRD", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "PRD"),

        # ENG
        ("eng", "eng123", "user_ENG", "user_ENG", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "ENG"),
        ("staff_eng", "staff_eng123", "user_ENG", "user_ENG", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "ENG"),

        # EPR
        ("epr", "epr123", "user_EPR", "user_EPR", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "EPR"),
        ("staff_epr", "staff_epr123", "user_EPR", "user_EPR", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "EPR"),
        ("spv_epr", "spv_epr123", "Supervisor EPR", "Supervisor EPR", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "EPR"),
        ("mgr_epr", "mgr_epr123", "Manager EPR", "Manager EPR", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "EPR"),

        # GA
        ("ga", "ga123", "user_GA", "user_GA", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "GA"),
        ("staff_ga", "staff_ga123", "user_GA", "user_GA", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "GA"),
        ("spv_ga", "spv_ga123", "Supervisor GA", "Supervisor GA", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "GA"),
        ("mgr_ga", "mgr_ga123", "Manager GA", "Manager GA", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "GA"),

        # QC
        ("qc", "qc123", "user_QC", "user_QC", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "QC"),
        ("staff_qc", "staff_qc123", "user_QC", "user_QC", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "QC"),
        ("spv_qc", "spv_qc123", "Supervisor QC", "Supervisor QC", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "QC"),
        ("mgr_qc", "mgr_qc123", "Manager QC", "Manager QC", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "QC"),

        # WRH
        ("wrh", "wrh123", "user_WRH", "user_WRH", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "WRH"),
        ("staff_wrh", "staff_wrh123", "user_WRH", "user_WRH", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "WRH"),
        ("spv_wrh", "spv_wrh123", "Supervisor WRH", "Supervisor WRH", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "WRH"),
        ("mgr_wrh", "mgr_wrh123", "Manager WRH", "Manager WRH", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "WRH"),

        # TMB
        ("tmb", "tmb123", "user_TMB", "user_TMB", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "TMB"),
        ("staff_tmb", "staff_tmb123", "user_TMB", "user_TMB", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "TMB"),
        ("spv_tmb", "spv_tmb123", "Supervisor TMB", "Supervisor TMB", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", "TMB"),
        ("mgr_tmb", "mgr_tmb123", "Manager TMB", "Manager TMB", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", "TMB"),
    ]

    cursor.execute("DELETE FROM users WHERE username = 'charlie'")

    for username, password, fullname, role, avatar, dept in users:
        cursor.execute("SELECT COUNT(*) FROM users WHERE username = ?", (username,))
        if cursor.fetchone()[0] == 0:
            cursor.execute(
                "INSERT INTO users (username, password, fullname, role, avatar, dept) VALUES (?, ?, ?, ?, ?, ?)",
                (username, password, fullname, role, avatar, dept)
            )
        else:
            cursor.execute(
                "UPDATE users SET fullname = ?, role = ?, dept = ? WHERE username = ?",
                (fullname, role, dept, username)
            )
    conn.commit()
    print(f"Users seeded. Total users: {cursor.execute('SELECT COUNT(*) FROM users').fetchone()[0]}")

    print("\n--- 2. SEEDING EXTENSIVE GENERAL EJOS ---")
    cursor.execute("DELETE FROM general_ejos")

    # Discipline Engineers pool (Strictly mapped by discipline)
    engineers_by_cat = {
        "Sipil": ["Tedy", "Dadang"],
        "Elektrik": ["Thorik", "Rifky", "Hadi", "Kresna"],
        "Mekanik": ["Yuli", "Reksa", "Eman"],
        "Kalibrasi": ["Aden"],
        "Program": ["Chandra"],
        "Repair Part": ["Rahmad"]
    }

    # Departments list
    depts = ["PRD", "ENG", "EPR", "GA", "QC", "WRH", "TMB"]

    # Job titles and descriptions templates per category & department
    job_templates = [
        # Sipil
        ("Sipil", "Perbaikan Retakan Lantai Epoxy & Drainage Line 2 Produksi", "PRD", "Gedung Produksi Line 2", 8500000.0, "Perbaikan retakan pada lantai epoxy area filling line 2 seluas 15 m2 dan perkuatan grating saluran."),
        ("Sipil", "Perbaikan Paving Block Ambles Akses Truk Timbangan Pos 1", "TMB", "Jembatan Timbang Luar", 9800000.0, "Paving block K-400 area manuver truk tronton ambles 8 cm akibat beban dinamis."),
        ("Sipil", "Waterproofing & Perbaikan Talang Air Seng Gudang Blok B", "WRH", "Warehouse Blok B", 7200000.0, "Pembersihan endapan talang jurai dan pelapisan waterproofing polyurethane membrane pada sambungan seng."),
        ("Sipil", "Perbaikan Pintu Otomatis & Partisi Kaca Ruang Meeting GA", "GA", "Gedung Office Lt. 2", 3200000.0, "Penggantian floor hinge Dorma BTS-84 dan penyetelan stopper rel aluminium pintu geser otomatis."),
        ("Sipil", "Pengecoran Rabat Beton Landasan Tangki Kimia EPR", "EPR", "Area Tangki Bahan Kimia", 11500000.0, "Pengecoran slab beton K-300 tebal 20 cm tahan tumpahan asam untuk landasan dosing tank."),
        ("Sipil", "Renovasi Ruang Sterilisasi & Pengecatan Dinding Antibakteri QC", "QC", "Laboratorium Mikrobiologi", 6400000.0, "Pengecatan dinding cleanroom menggunakan cat epoksi antibakteri bersertifikat food contact."),
        ("Sipil", "Pondasi Skid Pompa Sirkulasi Utility Cooling Tower", "ENG", "Area Utility Cooling Tower", 5800000.0, "Pembuatan pondasi beton bertulang skid pompa sirkulasi 30kW dengan peredam getaran neoprene."),
        ("Sipil", "Perbaikan Saluran Drainase Air Hujan Area Parkir Truk", "TMB", "Area Manuver Timbangan 2", 4200000.0, "Normalisasi buangan air hujan dan penggantian box culvert U-Ditch 40x40 cm."),

        # Elektrik (Thorik, Rifky, Hadi, Kresna)
        ("Elektrik", "Troubleshooting Overload Inverter Motor Konveyor Utama", "PRD", "Line 1 Packaging", 3500000.0, "Inverter Yaskawa 7.5kW trip error OC (overcurrent). Dilakukan penggantian cooling fan dan parameter tuning."),
        ("Elektrik", "Penggantian Lampu High Bay LED 150W & Rewiring Panel WRH", "WRH", "Gudang Bahan Baku WRH", 12000000.0, "Penggantian 12 unit lampu mercury dengan High Bay LED 150W hemat energi."),
        ("Elektrik", "Perbaikan Jaringan Kabel Indikator Berat & RS485 TMB", "TMB", "Pos Operator Timbangan", 2800000.0, "Data penimbangan terputus ke SAP saat cuaca lembap. Penarikan kabel shielded twisted pair baru."),
        ("Elektrik", "Peremajaan Komponen Kontaktor & Thermal Overload Panel MCC 3", "PRD", "Substation MCC PRD", 7500000.0, "Penggantian kontaktor Schneider LC1D65A dan relay thermal proteksi motor boiler."),
        ("Elektrik", "Pemasangan Surge Arrester & Grounding Panel Utama GA", "GA", "Gedung Office Lt. 1", 4600000.0, "Instalasi surge protection device Type 2 dan perbaikan grounding resistansi < 2 Ohm."),
        ("Elektrik", "Troubleshooting Sensor Induktif & Proximity Rotary Mesin EPR", "EPR", "Line Extruder EPR", 2200000.0, "Sensor proximity NPN sering false reading akibat noise kelistrikan. Dilakukan grounding shield isolasi."),
        ("Elektrik", "Penggantian Trafo Arus (CT) & Digital Power Meter LVMDP ENG", "ENG", "Ruang Trafo Utama", 8900000.0, "Penggantian CT 1000/5A Class 0.5 dan konfigurasi digital power meter Schneider PM5350."),
        ("Elektrik", "Pemasangan Emergency Stop Button & Safety Relay Line Packing", "PRD", "Line 3 Packaging PRD", 3100000.0, "Penambahan 4 titik tombol emergency stop berpenutup dengan safety relay Pilz dual channel."),

        # Mekanik (Yuli, Reksa, Eman)
        ("Mekanik", "Penggantian Mechanical Seal Pompa Transfer Sirup 02", "PRD", "Ruang Pompa Sirup PRD", 6200000.0, "Terdapat rembesan sirup kental pada seal shaft pompa centrifugal 02. Dilakukan overhaul dan ganti seal."),
        ("Mekanik", "Overhaul Gearbox Worm Drive Konveyor Palletizer Warehouse", "WRH", "Palletizer Area WRH", 5500000.0, "Gearbox rasio 1:40 temperatur tinggi 85C dan dengung bearing. Ganti worm wheel dan oli ISO VG 320."),
        ("Mekanik", "Perbaikan Sistem Exhaust Fan & Ducting Acid Fume Hood QC", "QC", "Lab Mikrobiologi QC", 4800000.0, "Daya hisap lemari asam menurun. Dilakukan balancing sudu blower PP dan pembersihan filter scrubber."),
        ("Mekanik", "Maintenance Unit AC Standing 5 PK Ruang Server & Kantor GA", "GA", "Server Room Office", 2400000.0, "Cuci evaporator coil, pembersihan filter hepa blower indoor, dan penambahan freon R410A."),
        ("Mekanik", "Penggantian V-Belt & Pulley Motor Blower Cyclone EPR", "EPR", "Dust Collector Line EPR", 3600000.0, "V-belt tipe B-85 aus slip transmisi. Dilakukan penggantian 4 jalur belt setara Optibelt Red Power."),
        ("Mekanik", "Perbaikan Pneumatic Valve Actuator Tangki Storage CPO", "ENG", "Tangki Storage CPO", 4100000.0, "Actuator valve pneumatic FESTO macet buka separuh akibat korosi silinder udara."),
        ("Mekanik", "Penyelarasan Laser Alignment Kopling Pompa Boiler Feed Water", "ENG", "Boiler Room ENG", 3900000.0, "Laser alignment kopling fleksibel motor 45kW ke pompa multistage deviasi < 0.03 mm."),
        ("Mekanik", "Pergantian Rantai & Sprocket Konveyor Transfer Timbangan Pos 2", "TMB", "Infeed Hopper Timbangan", 5100000.0, "Rantai double pitch ANSI 60 aus mulur 3%. Penggantian rantai Tsubaki dan alignment roda gigi."),

        # Kalibrasi (Aden)
        ("Kalibrasi", "Kalibrasi Rutin Sensor Suhu RTD & Transmitter Pressure Autoclave", "PRD", "Sterilisasi Produksi", 1800000.0, "Kalibrasi periodik 6 titik sensor temperatur PT100 dan 2 unit pressure transmitter autoclave."),
        ("Kalibrasi", "Tera Ulang Load Cell 6 Titik Jembatan Timbang 60 Ton", "TMB", "Platform Jembatan Timbang", 3500000.0, "Pengecekan eksitasi tegangan dan zero balancing 6 buah load cell digital Avery Weigh-Tronix."),
        ("Kalibrasi", "Verifikasi & Kalibrasi Analytical Balance Mettler Toledo Lab QC", "QC", "Lab Kimia & Fisika QC", 2200000.0, "Verifikasi linearitas dan kalibrasi timbangan analitik presisi 4 desimal (0.1 mg) standar F1."),
        ("Kalibrasi", "Kalibrasi pH Meter & Conductivity Transmitter Instalasi WTP", "ENG", "Water Treatment Plant", 1950000.0, "Kalibrasi 3 titik larutan buffer pH 4.01, 7.00, 10.01 dan standar konduktivitas 1413 uS/cm."),
        ("Kalibrasi", "Kalibrasi Sensor Pressure Gauge Tabung Gas Nitrogen & O2", "GA", "Sentral Gas GA", 1400000.0, "Uji kalibrasi komparasi dead weight tester standar untuk 8 unit pressure gauge 0-250 bar."),
        ("Kalibrasi", "Kalibrasi Temperature Controller & Thermocouple Oven Mesin EPR", "EPR", "Oven Pemanas Line EPR", 2100000.0, "Kalibrasi loop thermocouple tipe K dan controller Autonics TK4S temperatur kerja 180C."),
        ("Kalibrasi", "Kalibrasi Moisture Analyzer & Titrator Karl Fischer Lab QC", "QC", "Lab QC Ruang Instrumen", 2700000.0, "Kalibrasi pemanas halogen moisture analyzer dan verifikasi volumetrik titrator KF."),
        ("Kalibrasi", "Kalibrasi Flowmeter Air Bersih Sumur Deep Well 1 & 2", "ENG", "Utility Deep Well", 2900000.0, "Kalibrasi in-situ ultrasonic transit time flowmeter pada pipa header 4 inch debit 30 m3/h."),

        # Program (Chandra)
        ("Program", "Modifikasi Logic PLC Siemens S7-1200 Interlock Safety Door", "EPR", "Mesin Packaging Robot", 4500000.0, "Pemrograman ulang logic TIA Portal v17 untuk menambahkan interlock safety light curtain."),
        ("Program", "Integrasi Sensor Flowmeter Magnetic ke SCADA Utility WTP", "ENG", "Water Treatment Plant", 3800000.0, "Konfigurasi komunikasi Modbus TCP flowmeter Endress+Hauser ke Wonderware SCADA server."),
        ("Program", "Sinkronisasi Data Timbangan Truk ke Database SAP ERP", "TMB", "Server Server Timbangan", 5200000.0, "Pembuatan web service middleware Python-SAP RFC untuk transfer auto-weighting ticket."),
        ("Program", "Modifikasi HMI Weintek Recipe System Mesin Mixing Produksi", "PRD", "Ruang Batching PRD", 3400000.0, "Penambahan fitur password level supervisor dan 10 slot resep baru pada HMI cMT3102X."),
        ("Program", "Konfigurasi Alarm Notifikasi WhatsApp Mesin Chiller Utility", "ENG", "Chiller Plant Utility", 2600000.0, "Integrasi node-red ke gateway WhatsApp API untuk broadcast trip temperature warning."),
        ("Program", "Pembuatan Dashboard OEE & Downtime Monitoring Line 1 PRD", "PRD", "Office Produksi Line 1", 4900000.0, "Integrasi sinyal pulse sensor counter ke dashboard Grafana realtime efisiensi mesin."),
        ("Program", "Update Firmware & Kalibrasi Digital Datalogger Suhu Cold Storage", "WRH", "Cold Storage Warehouse", 2300000.0, "Update firmware datalogger multi-channel Ethernet dan setup auto-backup cloud SQL."),
        ("Program", "Backup & Restore Program PLC Omron CJ2M Mesin Labeling", "PRD", "Packaging Line 2", 1800000.0, "Pencadangan full program PLC CX-Programmer dan setting backup baterai memori CPU."),

        # Repair Part (Rahmad)
        ("Repair Part", "Rekondisi & Bubut Shaft Impeller Pompa KSB Utility", "ENG", "Workshop Bubut Engineering", 1500000.0, "Shaft impeller pompa sirkulasi aus 0.8mm dudukan bearing 6310. Metal spray & bubut presisi."),
        ("Repair Part", "Penggantian Bearing & Hardchrome Shaft Roll Mesin Slitter EPR", "EPR", "Mesin Slitter Line EPR", 2800000.0, "Roll slitter dia 180x1200mm aus tergores. Grinding ulang, hardchrome 50 micron, balancing G2.5."),
        ("Repair Part", "Rekondisi Rumah Bearing Pillow Block Konveyor Pallet WRH", "WRH", "Workshop Maintenance", 1200000.0, "Bushing ulang lubang rumah bearing SN 518 yang longgar menggunakan liner bronze."),
        ("Repair Part", "Pembuatan Sprocket Khusus Pitch 1.5 Inch Mesin Packer PRD", "PRD", "Workshop Bubut PRD", 2100000.0, "Bubut bahan S45C pembuatan gigi sprocket 24T dan proses hardening gigi induksi 50 HRC."),
        ("Repair Part", "Lapping & Rekondisi Mechanical Seal Keramik Pompa Sirup", "PRD", "Workshop Repair Part", 1600000.0, "Lapping flat permukaan ceramic vs carbon disc flatness < 2 light bands helium."),
        ("Repair Part", "Rekondisi Dudukan Pin Guide & Bushing Mesin Press GA", "GA", "Workshop GA", 1400000.0, "Bore ulang pin guide dan pasang sleeve kuningan bronze tahan gesek pelumasan otomatis."),
        ("Repair Part", "Bubut Ulang Flange Adaptor Pipa Header Steam 4 Inch Boiler", "ENG", "Boiler House", 1750000.0, "Facing muka flange bergerigi spiral untuk kerapatan gasket spiral wound SS 316."),
        ("Repair Part", "Rekondisi Roll Roller Karet Konveyor Input Timbangan Pos 1", "TMB", "Jembatan Timbang Infeed", 2300000.0, "Penggantian lapisan rubber lagging diamond 10mm pada drum pulley konveyor.")
    ]

    # Generate dates across months (Jan–Aug 2026)
    # We will distribute across 4 statuses:
    # 1. Schedule (Phase 1 / Antrean Baru): status 'Requested' or 'Pending Foreman Approval', engineer 'Unassigned', is_archived 0
    # 2. On Progress (Phase 2 / Sedang Dikerjakan): status 'In Progress', engineer assigned, is_archived 0
    # 3. Done (Phase 3 / Selesai Pengajuan): status 'Done' or 'Pending Manager Approval', engineer assigned, is_archived 0
    # 4. History EJO (Archived / Closed): status 'Completed' or 'Archived', engineer assigned, is_archived 1

    general_ejos_seeded = []
    
    for idx, (cat, title, dept, location, est_cost, desc) in enumerate(job_templates, start=1):
        ejo_id = f"EJO{idx:02d}140826" if idx <= 18 else f"EJO{idx:02d}2026"
        priority = str(random.choice([1, 1, 2, 2, 3]))
        
        # Decide Phase / Lifecycle
        if idx % 4 == 1:
            # Sesi 1: Schedule (Phase 1)
            status = random.choice(["Requested", "Pending Dept Approval", "Pending Foreman Approval"])
            engineer = "Unassigned"
            is_archived = 0
            act_cost = 0.0
            month = random.choice([7, 8])
            day = random.randint(1, 14)
            c_date = f"2026-{month:02d}-{day:02d} 09:00:00"
            t_date = f"2026-{month:02d}-{min(28, day+10):02d}"
            e_date = f"2026-{month:02d}-{min(28, day+8):02d}"
            requester = f"user_{dept}"
            logs = [
                {"date": f"2026-{month:02d}-{day:02d} 09:00", "status": "Requested", "user": requester, "message": f"General EJO diajukan oleh staff {dept}.", "text": f"General EJO diajukan oleh staff {dept}."}
            ]
            approvals = {
                "requester": {"signed": 1, "name": requester, "date": f"2026-{month:02d}-{day:02d} 09:00"}
            }
        elif idx % 4 == 2:
            # Sesi 2: On Progress (Phase 2)
            status = "In Progress"
            engineer = random.choice(engineers_by_cat[cat])
            is_archived = 0
            act_cost = 0.0
            month = random.choice([7, 8])
            day = random.randint(1, 13)
            c_date = f"2026-{month:02d}-{day:02d} 08:30:00"
            t_date = f"2026-{month:02d}-{min(28, day+12):02d}"
            e_date = f"2026-{month:02d}-{min(28, day+10):02d}"
            requester = f"user_{dept}"
            logs = [
                {"date": f"2026-{month:02d}-{day:02d} 08:30", "status": "Requested", "user": requester, "message": "EJO diajukan.", "text": "EJO diajukan."},
                {"date": f"2026-{month:02d}-{day:02d} 10:15", "status": "In Progress", "user": "Fiki Erwansyah", "message": f"Ditugaskan kepada {engineer} ({cat}).", "text": f"Ditugaskan kepada {engineer} ({cat})."}
            ]
            approvals = {
                "requester": {"signed": 1, "name": requester, "date": f"2026-{month:02d}-{day:02d} 08:30"},
                "dept": {"signed": 1, "name": f"Supervisor {dept}", "date": f"2026-{month:02d}-{day:02d} 09:00"},
                "foreman": {"signed": 1, "name": "Fiki Erwansyah", "date": f"2026-{month:02d}-{day:02d} 10:15"}
            }
        elif idx % 4 == 3:
            # Sesi 3: Done (Phase 3)
            status = random.choice(["Done", "Pending User Approval", "Completed"])
            engineer = random.choice(engineers_by_cat[cat])
            is_archived = 0
            act_cost = round(est_cost * random.uniform(0.9, 1.05), -4)
            month = random.choice([6, 7, 8])
            day = random.randint(1, 10)
            c_date = f"2026-{month:02d}-{day:02d} 08:00:00"
            t_date = f"2026-{month:02d}-{min(28, day+6):02d}"
            e_date = f"2026-{month:02d}-{min(28, day+5):02d}"
            comp_date = f"2026-{month:02d}-{min(28, day+5):02d} 16:30"
            requester = f"user_{dept}"
            logs = [
                {"date": f"2026-{month:02d}-{day:02d} 08:00", "status": "Requested", "user": requester, "message": "EJO diajukan.", "text": "EJO diajukan."},
                {"date": f"2026-{month:02d}-{day:02d} 09:30", "status": "In Progress", "user": "Fiki Erwansyah", "message": f"Ditugaskan kepada {engineer} ({cat}).", "text": f"Ditugaskan kepada {engineer} ({cat})."},
                {"date": comp_date, "status": "Done", "user": engineer, "message": "Pekerjaan teknis selesai teruji normal.", "text": "Pekerjaan teknis selesai teruji normal."}
            ]
            approvals = {
                "requester": {"signed": 1, "name": requester, "date": f"2026-{month:02d}-{day:02d} 08:00"},
                "foreman": {"signed": 1, "name": "Fiki Erwansyah", "date": f"2026-{month:02d}-{day:02d} 09:30"}
            }
            if status == "Completed":
                approvals["user"] = {"signed": 1, "name": requester, "date": comp_date}
        else:
            # History EJO (Completed / Archived from Jan–July 2026)
            status = "Completed"
            engineer = random.choice(engineers_by_cat[cat])
            is_archived = 1
            act_cost = round(est_cost * random.uniform(0.85, 1.0), -4)
            month = random.choice([1, 2, 3, 4, 5, 6, 7])
            day = random.randint(1, 20)
            c_date = f"2026-{month:02d}-{day:02d} 08:00:00"
            t_date = f"2026-{month:02d}-{min(28, day+7):02d}"
            e_date = f"2026-{month:02d}-{min(28, day+6):02d}"
            comp_date = f"2026-{month:02d}-{min(28, day+6):02d} 17:00"
            requester = f"user_{dept}"
            logs = [
                {"date": f"2026-{month:02d}-{day:02d} 08:00", "status": "Requested", "user": requester, "message": "EJO diajukan.", "text": "EJO diajukan."},
                {"date": f"2026-{month:02d}-{day:02d} 10:00", "status": "In Progress", "user": "Fiki Erwansyah", "message": f"Ditugaskan ke {engineer} ({cat}).", "text": f"Ditugaskan ke {engineer} ({cat})."},
                {"date": comp_date, "status": "Completed", "user": "Edy Santoso", "message": "Persetujuan selesai penuh dan pekerjaan diarsipkan.", "text": "Persetujuan selesai penuh dan pekerjaan diarsipkan."}
            ]
            approvals = {
                "requester": {"signed": 1, "name": requester, "date": f"2026-{month:02d}-{day:02d} 08:00"},
                "foreman": {"signed": 1, "name": "Fiki Erwansyah", "date": f"2026-{month:02d}-{day:02d} 10:00"},
                "supervisor": {"signed": 1, "name": "Muhono", "date": f"2026-{month:02d}-{min(28, day+6):02d} 10:00"},
                "manager": {"signed": 1, "name": "Edy Santoso", "date": comp_date}
            }

        # Specific Repair part pricing
        part_price_new = 0.0
        repair_duration = 0
        repair_cost_per_day = 0.0
        if cat == "Repair Part":
            part_price_new = round(est_cost * random.uniform(3.0, 5.5), -4)
            repair_duration = random.randint(2, 5)
            repair_cost_per_day = round(est_cost / repair_duration, -3)

        cursor.execute("""
            INSERT INTO general_ejos (
                id, title, dept, category, priority, location, targetDate, estDate, status,
                engineer, estCost, actCost, description, logs, requester, is_archived, approvals,
                createdDate, part_price_new, repair_duration, repair_cost_per_day
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ejo_id, title, dept, cat, priority, location, t_date, e_date, status,
            engineer, est_cost, act_cost, desc, json.dumps(logs), requester, is_archived,
            json.dumps(approvals), c_date, part_price_new, repair_duration, repair_cost_per_day
        ))

    conn.commit()
    print(f"General EJOs seeded. Total rows: {cursor.execute('SELECT COUNT(*) FROM general_ejos').fetchone()[0]}")

    print("\n--- 3. SEEDING EXTENSIVE DRAWING EJOS ---")
    cursor.execute("DELETE FROM drawings")

    # Drawing templates (Drafters strictly Diki Firmansyah & Rifan Nur)
    drawing_templates = [
        # Sipil / Civil & Structural (Diki Firmansyah)
        ("Sipil", "Detail As-Built Drawing Layout Piping Utility Header Steam", "ENG", "Boiler Room & Header Distribusi", "uploads/drawing_sample_steam_piping.pdf", "Gambar as-built pemipaan steam bertekanan 8 bar dari boiler room menuju gedung produksi."),
        ("Sipil", "Shop Drawing Pembuatan Skid Pondasi Tangki CPO 1500 KL", "PRD", "Area Tangki Timbun PRD", "", "Desain struktur beton bertulang pile cap dan ring wall pondasi tangki minyak CPO 1500 KL."),
        ("Sipil", "Layout Denah Tata Letak Racking Double Deep Warehouse A2", "WRH", "Gudang Finish Goods WRH", "uploads/drawing_sample_racking_layout.pdf", "Denah 2D penataan lorong aisle forklift reach truck dan jarak aman pilar gedung."),
        ("Sipil", "Desain Konstruksi Kanopi Parkir Forklift & Area Loading GA", "GA", "Area Samping Gedung GA", "", "Kalkulasi beban angin dan detail sambungan baut konstruksi baja profil WF 150x75."),
        ("Sipil", "Gambar Arsitektur Layout Sekat Partisi Cleanroom Laboratorium QC", "QC", "Laboratorium Mikrobiologi", "uploads/drawing_sample_cleanroom.pdf", "Detail sambungan sandwich panel PIR dan pintu interlock airlock hermetic."),
        ("Sipil", "Site Plan Perluasan Jalur Akses Jembatan Timbang Pos 2", "TMB", "Jalur Masuk Truk Pos 2", "", "Gambar kontur levelling jalan rabat beton dan penempatan tiang rambu peringatan."),
        ("Sipil", "Struktur Baja Mezzanine Penempatan Tangki Dosing Kimia EPR", "EPR", "Gedung Bahan Baku EPR", "uploads/drawing_sample_mezzanine.pdf", "Kalkulasi struktur gelagar baja balok I-Beam untuk menopang 4 unit tangki 1000L."),

        # Mekanik (Rifan Nur)
        ("Mekanik", "Fabrication Drawing Shaft Rotor & Hub Blower Dust Collector", "EPR", "Area Cyclone EPR", "", "Gambar fabrikasi pembuatan sudu impeler blower hisap debu stainless steel SUS 304."),
        ("Mekanik", "Drawing Jalur Pemipaan Water Treatment Plant Softener 50 m3/h", "ENG", "Unit Softener WTP", "uploads/drawing_sample_wtp_softener.pdf", "Isometrik jalur perpipaan tangki resin kation dan multiport valve otomatis."),
        ("Mekanik", "P&ID Sistem Tata Udara Clean Room & Air Handling Unit AHU QC", "QC", "Lab Mikrobiologi QC", "", "Diagram perpipaan dan instrumentasi sistem sirkulasi udara HEPA filter H14."),
        ("Mekanik", "Detail As-Built Pemipaan Chilled Water Supply & Return Utility", "PRD", "Chiller Room PRD", "uploads/drawing_sample_chilled_water.pdf", "Drawing 3D isometrik pipa carbon steel sch 40 insulasi armaflex 2 inch."),
        ("Mekanik", "Desain Dudukan Motor & Pulley Blower Exhaust Gudang Bahan Baku", "WRH", "Dinding Luar Warehouse", "", "Gambar potongan rangka siku 50x50x5 dan penempatan anti-vibration mount spring."),
        ("Mekanik", "Drawing Modifikasi Gravity Roller Conveyor Area Bongkar Muat GA", "GA", "Loading Bay GA", "uploads/drawing_sample_roller_conveyor.pdf", "Detail modul perpanjangan meja roller konveyor beban 500 kg per meter."),
        ("Mekanik", "Drawing Fabrikasi Cover Pelindung Rantai & Motor Timbangan Pos 1", "TMB", "Platform Timbangan Pos 1", "", "Desain casing safety guard plat perforated 2mm sesuai standar K3 keselamatan kerja."),

        # Elektrik (Drafter: Diki Firmansyah / Rifan Nur - Drafters ONLY)
        ("Elektrik", "Single Line Diagram & Wiring Control Panel Motor MCC 4", "PRD", "Substation MCC 4 PRD", "", "Skema kontrol interlock kontaktor delta-star dan proteksi thermal overload feeder 45kW."),
        ("Elektrik", "Wiring Diagram Modul ADC & Kalibrator Jembatan Timbang Digital", "TMB", "Ruang Panel Indikator TMB", "uploads/drawing_sample_adc_wiring.pdf", "Wiring diagram converter 24-bit delta-sigma junction box 6 load cell."),
        ("Elektrik", "Skema Jalur Kelistrikan & Penerangan Luar Pos Timbangan 2", "TMB", "Pos Jembatan Timbang Luar", "", "Skema penarikan kabel bawah tanah NYFGBY 4x16mm dari panel distribusi utama."),
        ("Elektrik", "Diagram Kelistrikan Distribusi Panel LVMDP 400V Substation Utama", "ENG", "Main Power House ENG", "uploads/drawing_sample_lvmdp.pdf", "Single line diagram busbar tembaga 2000A dan metering digital SCADA."),
        ("Elektrik", "Skema Pengawatan Interlock Emergency & Safety Light Curtain EPR", "EPR", "Mesin Stamping EPR", "", "Wiring diagram fail-safe relay dan sensor optik proteksi area kerja operator."),
        ("Elektrik", "Drawing Wiring Loop Sensor Suhu & Humidity Transmitter Lab QC", "QC", "Ruang Pengujian QC", "uploads/drawing_sample_loop_qc.pdf", "Skema pengkabelan sensor 4-20mA ke PLC analitik dan alarm buzzer warning."),
        ("Elektrik", "Wiring Diagram Panel Penerangan Otomatis Sensor Gerak Gudang", "WRH", "Lorong Aisle WRH Blok B", "", "Skema rangkaian kontaktor otomatis saklar timer dan pir sensor hemat energi."),

        # Repair Part (Drafter: Rifan Nur)
        ("Repair Part", "Part Drawing Bushing & Sleeve Pompa Multi-Stage Grundfos CRN", "PRD", "Workshop Repair Part", "uploads/drawing_sample_bushing_sleeve.pdf", "Dimensi toleransi pembubutan sleeve keramik dan bushing perunggu tungsten carbide."),
        ("Repair Part", "Detail Drawing Roller Sprocket Konveyor Pallet WRH Heavy Duty", "WRH", "Area Infeed Palletizer", "uploads/drawing_sample_sprocket.pdf", "Detail gigi sprocket RS 80 pitch 25.4mm dan pasak spi pengunci shaft roller."),
        ("Repair Part", "Drawing Part Rekondisi Shaft Impeller Pompa KSB 65-200", "ENG", "Workshop Bubut ENG", "uploads/drawing_sample_ksb_shaft.pdf", "Toleransi h7 pembubutan leher bearing 6310 dan dudukan snap ring pengunci."),
        ("Repair Part", "Detail Dimensi Roll Slitter Hardchrome Mesin Pemotong EPR", "EPR", "Workshop EPR", "", "Dimensi toleransi konsentrisitas run-out < 0.01 mm roll baja S45C."),
        ("Repair Part", "Drawing Part Pisau Chopper Shredder Limbah Padat GA", "GA", "Workshop Utility GA", "uploads/drawing_sample_chopper_blade.pdf", "Desain mata pisau baja SKD-11 perlakuan panas vacuum hardening 58 HRC."),
        ("Repair Part", "Part Drawing Housing Dudukan Load Cell 30 Ton Anti-Lift TMB", "TMB", "Jembatan Timbang Pos 2", "", "Dimensi pembikinan base plate baja padat ST-52 penahan gaya angkat tronton."),
        ("Repair Part", "Drawing Detail Impeller Blower Suction PP Tahan Kimia QC", "QC", "Workshop QC", "uploads/drawing_sample_pp_impeller.pdf", "Gambar cetakan sudu melengkung polypropylene tahan uap asam sulfat pekat.")
    ]

    for idx, (cat, title, dept, location, file_path_sample, desc) in enumerate(drawing_templates, start=1):
        drw_id = f"DRW{idx:02d}140826" if idx <= 12 else f"DRW{idx:02d}2026"
        ejo_ref = f"EJO{idx:02d}140826" if idx <= 18 else f"EJO{idx:02d}2026"
        priority = str(random.choice([1, 1, 2, 2, 3]))
        
        # Determine Drafter based strictly on discipline
        assigned_drafter = "Diki Firmansyah" if cat in ["Sipil", "Elektrik"] else "Rifan Nur"

        if idx % 4 == 1:
            # Sesi 1: Schedule (Phase 1 / Antrean Baru)
            status = "Pending Foreman Approval"
            engineer = "Unassigned"
            file_url = ""
            month = random.choice([7, 8])
            day = random.randint(1, 14)
            c_date = f"2026-{month:02d}-{day:02d} 10:00:00"
            t_date = f"2026-{month:02d}-{min(28, day+12):02d}"
            e_date = f"2026-{month:02d}-{min(28, day+10):02d}"
            requester = f"user_{dept}"
            logs = [
                {"date": f"2026-{month:02d}-{day:02d} 10:00", "status": "Requested", "user": requester, "message": f"Permintaan Drawing diajukan oleh staff {dept}. Menunggu review Foreman.", "text": f"Permintaan Drawing diajukan oleh staff {dept}. Menunggu review Foreman."}
            ]
            approvals = {}
        elif idx % 4 == 2:
            # Sesi 2: On Progress (Phase 2 / Sedang Digambar)
            status = "On Progress"
            engineer = assigned_drafter
            file_url = ""
            month = random.choice([7, 8])
            day = random.randint(1, 13)
            c_date = f"2026-{month:02d}-{day:02d} 09:30:00"
            t_date = f"2026-{month:02d}-{min(28, day+12):02d}"
            e_date = f"2026-{month:02d}-{min(28, day+10):02d}"
            requester = f"user_{dept}"
            logs = [
                {"date": f"2026-{month:02d}-{day:02d} 09:30", "status": "Requested", "user": requester, "message": "Drawing diajukan.", "text": "Drawing diajukan."},
                {"date": f"2026-{month:02d}-{day:02d} 11:00", "status": "On Progress", "user": "Fiki Erwansyah", "message": f"Ditugaskan ke {assigned_drafter} (Drafter {cat}).", "text": f"Ditugaskan ke {assigned_drafter} (Drafter {cat})."}
            ]
            approvals = {}
        elif idx % 4 == 3:
            # Sesi 3: Done (Phase 3 / Sedang Approval Berjenjang)
            status = random.choice(["Pending Supervisor Approval", "Pending Manager Approval", "Pending Factory Manager Approval"])
            engineer = assigned_drafter
            file_url = file_path_sample or "uploads/drawing_sample_general.pdf"
            month = random.choice([6, 7, 8])
            day = random.randint(1, 10)
            c_date = f"2026-{month:02d}-{day:02d} 08:30:00"
            t_date = f"2026-{month:02d}-{min(28, day+7):02d}"
            e_date = f"2026-{month:02d}-{min(28, day+5):02d}"
            requester = f"user_{dept}"
            logs = [
                {"date": f"2026-{month:02d}-{day:02d} 08:30", "status": "Requested", "user": requester, "message": "Drawing diajukan.", "text": "Drawing diajukan."},
                {"date": f"2026-{month:02d}-{day:02d} 10:00", "status": "In Progress", "user": "Fiki Erwansyah", "message": f"Ditugaskan ke {assigned_drafter}.", "text": f"Ditugaskan ke {assigned_drafter}."},
                {"date": f"2026-{month:02d}-{min(28, day+4):02d} 16:00", "status": "Pending Supervisor Approval", "user": assigned_drafter, "message": "File drawing diupload, menunggu approval supervisor.", "text": "File drawing diupload, menunggu approval supervisor."}
            ]
            approvals = {
                "drafter": {"signed": 1, "name": assigned_drafter, "date": f"2026-{month:02d}-{min(28, day+4):02d} 16:00"},
                "foreman": {"signed": 1, "name": "Fiki Erwansyah", "date": f"2026-{month:02d}-{min(28, day+5):02d} 09:00"}
            }
            if status in ["Pending Manager Approval", "Pending Factory Manager Approval"]:
                approvals["supervisor"] = {"signed": 1, "name": "Muhono", "date": f"2026-{month:02d}-{min(28, day+5):02d} 14:00"}
            if status == "Pending Factory Manager Approval":
                approvals["manager"] = {"signed": 1, "name": "Edy Santoso", "date": f"2026-{month:02d}-{min(28, day+6):02d} 10:00"}
        else:
            # History EJO (Completed / Archived Drawing from Jan–July 2026)
            status = "Completed"
            engineer = assigned_drafter
            file_url = file_path_sample or "uploads/drawing_sample_completed.pdf"
            month = random.choice([1, 2, 3, 4, 5, 6, 7])
            day = random.randint(1, 18)
            c_date = f"2026-{month:02d}-{day:02d} 09:00:00"
            t_date = f"2026-{month:02d}-{min(28, day+8):02d}"
            e_date = f"2026-{month:02d}-{min(28, day+6):02d}"
            comp_date = f"2026-{month:02d}-{min(28, day+6):02d} 16:00"
            requester = f"user_{dept}"
            logs = [
                {"date": f"2026-{month:02d}-{day:02d} 09:00", "status": "Requested", "user": requester, "message": "Drawing diajukan.", "text": "Drawing diajukan."},
                {"date": f"2026-{month:02d}-{day:02d} 11:00", "status": "In Progress", "user": "Fiki Erwansyah", "message": f"Ditugaskan ke {assigned_drafter}.", "text": f"Ditugaskan ke {assigned_drafter}."},
                {"date": comp_date, "status": "Completed", "user": "Sutopo Sejati", "message": "Disetujui Factory Manager penuh dan diarsipkan.", "text": "Disetujui Factory Manager penuh dan diarsipkan."}
            ]
            approvals = {
                "drafter": {"signed": 1, "name": assigned_drafter, "date": f"2026-{month:02d}-{min(28, day+4):02d} 11:00"},
                "foreman": {"signed": 1, "name": "Fiki Erwansyah", "date": f"2026-{month:02d}-{min(28, day+4):02d} 14:00"},
                "supervisor": {"signed": 1, "name": "Muhono", "date": f"2026-{month:02d}-{min(28, day+5):02d} 09:00"},
                "manager": {"signed": 1, "name": "Edy Santoso", "date": f"2026-{month:02d}-{min(28, day+5):02d} 14:00"},
                "factory_manager": {"signed": 1, "name": "Sutopo Sejati", "date": comp_date}
            }

        cursor.execute("""
            INSERT INTO drawings (
                id, ejo_id, title, dept, category, priority, location, targetDate, estDate, status,
                engineer, requester, uploader, description, file_path, uploaded_at, drawing_type,
                etiket_category, etiket_orientation, logs, approvals
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            drw_id, ejo_ref, title, dept, cat, priority, location, t_date, e_date, status,
            engineer, requester, requester, desc, file_url, c_date, "request",
            cat, "landscape", json.dumps(logs), json.dumps(approvals)
        ))

    conn.commit()
    print(f"Drawings seeded. Total rows: {cursor.execute('SELECT COUNT(*) FROM drawings').fetchone()[0]}")

    print("\n--- 4. SEEDING EXTENSIVE PROJECTS ---")
    cursor.execute("DELETE FROM projects")

    projects_templates = [
        # TMB
        ("PRJ-2026-001", "Pembangunan Pos Timbangan 2 & Barrier Gate SAP ERP", "TMB", 185000000.0, "2026-09-30", "Fiki Erwansyah", 3, 100, 100, 85, "Pembangunan pos timbangan tambahan untuk mengurai antrean truk bahan baku."),
        ("PRJ-2026-009", "Instalasi Sensor Kamera ANPR & Timbangan Axle Load Pos Masuk", "TMB", 95000000.0, "2026-11-15", "Hadi", 2, 100, 75, 30, "Pemasangan kamera pembaca plat nomor otomatis terhubung database timbangan."),

        # PRD
        ("PRJ-2026-002", "Otomatisasi Sistem Clean-In-Place (CIP) Line 2 Produksi", "PRD", 320000000.0, "2026-10-15", "Chandra", 3, 100, 100, 70, "Upgrade sistem sirkulasi pembersihan tangki sanitasi kimia NaOH & asam nitrat otomatis."),
        ("PRJ-2026-008", "Modifikasi Konveyor Transfer & Auto-Reject Metal Detector Line 3", "PRD", 175000000.0, "2026-08-14", "Fiki Erwansyah", 4, 100, 100, 100, "Penggantian konveyor belt food grade dan integrasi metal detector Thermo Fisher."),
        ("PRJ-2026-010", "Pemasangan Robot Palletizer Otomatis Line 1 Packaging PRD", "PRD", 520000000.0, "2026-12-20", "Yuli", 1, 0, 0, 0, "Pengadaan robot arm KUKA 4-axis kapasitas 1200 bag/jam untuk efisiensi loading."),

        # WRH
        ("PRJ-2026-003", "Pemasangan Racking High Bay Double Deep 1200 Pallet Warehouse", "WRH", 450000000.0, "2026-11-20", "Tedy", 2, 100, 85, 40, "Ekspansi kapasitas penyimpanan gudang finish goods dengan sistem rak heavy duty 6 tier."),
        ("PRJ-2026-011", "Implementasi Sistem WMS RFID Barcode Scanner Gudang B1", "WRH", 110000000.0, "2026-06-30", "Chandra", 5, 100, 100, 100, "Sistem tracking penempatan pallet real-time dengan barcode handheld Android."),

        # ENG
        ("PRJ-2026-004", "Pemasangan Trafo Substation 1500 kVA & Panel Sinkron Genset", "ENG", 580000000.0, "2026-08-15", "Thorik", 4, 100, 100, 100, "Peningkatan daya listrik pabrik dengan trafo Schneider 1500 kVA 20kV/400V."),
        ("PRJ-2026-012", "Pembangunan Unit Pengolahan Limbah Cair Biologis Aerasi WTP", "ENG", 390000000.0, "2026-10-30", "Dadang", 3, 100, 100, 60, "Ekspansi bak aerasi lagoon 500 m3 dan diffuser blower membran efisiensi tinggi."),

        # QC
        ("PRJ-2026-005", "Modernisasi Lab Mikrobiologi & HVAC Cleanroom ISO 8 Lab QC", "QC", 210000000.0, "2026-11-15", "Yuli", 2, 100, 60, 20, "Upgrade ruang uji mikrobiologi bertekanan positif dengan partisi sandwich panel."),
        ("PRJ-2026-013", "Pengadaan Spektrofotometer HPLC & Gas Chromatography Lab QC", "QC", 430000000.0, "2026-07-15", "Aden", 5, 100, 100, 100, "Alat analisis kromatografi cair performa tinggi Shimadzu untuk uji kemurnian produk."),

        # GA
        ("PRJ-2026-006", "Pembangunan Kanopi Loading Bay Ekspedisi & Shelter Forklift GA", "GA", 140000000.0, "2026-09-25", "Dadang", 3, 100, 100, 80, "Pembangunan kanopi pelindung loading barang seluas 350 m2 rangka baja bentang lebar."),
        ("PRJ-2026-014", "Pemasangan Solar Panel Rooftop 50 kWp Gedung Office GA", "GA", 260000000.0, "2026-12-10", "Thorik", 1, 0, 0, 0, "Pemanfaatan energi surya on-grid inverter untuk penerangan gedung administrasi."),

        # EPR
        ("PRJ-2026-007", "Implementasi IoT Smart Energy & Compressed Air Monitoring", "EPR", 95000000.0, "2026-12-15", "Chandra", 1, 0, 0, 0, "Pemasangan wireless power meter IoT dan sensor debit angin kompresor tiap lini."),
        ("PRJ-2026-015", "Retrofit Sistem Pemanas Oven Extruder Efisiensi Listrik EPR", "EPR", 160000000.0, "2026-08-30", "Rifky", 3, 100, 100, 90, "Penggantian ceramic band heater dengan induction heating coil hemat daya 30%.")
    ]

    for p_id, title, dept, budget, targetDate, pic, phase, pr_p, po_p, gr_p, desc in projects_templates:
        approvals = {
            "supervisor": {"signed": 1, "name": "Muhono", "date": "2026-07-01 10:00"}
        }
        if phase >= 2:
            approvals["manager"] = {"signed": 1, "name": "Edy Santoso", "date": "2026-07-02 14:00"}
        if phase >= 3:
            approvals["plant_manager"] = {"signed": 1, "name": "Sutopo Sejati", "date": "2026-07-03 09:00"}

        handover_approvals = {}
        handover_docs = []
        if phase >= 4:
            if phase == 5:
                handover_approvals = {
                    "staff_eng": {"signed": 1, "signer": "Diki Firmansyah", "signature": "/uploads/sig_staff_eng.png", "date": "2026-08-10 09:00"},
                    "spv_eng": {"signed": 1, "signer": "Muhono", "signature": "/uploads/sig_spv_eng.png", "date": "2026-08-10 11:00"},
                    "manager_eng": {"signed": 1, "signer": "Edy Santoso", "signature": "/uploads/sig_manager_eng.png", "date": "2026-08-11 14:00"},
                    "manager_user": {"signed": 1, "signer": "Hendra", "signature": "/uploads/sig_manager_user.png", "date": "2026-08-11 16:00"},
                    "spv_user": {"signed": 1, "signer": "Budi", "signature": "/uploads/sig_spv_user.png", "date": "2026-08-12 08:30"},
                    "staff_user": {"signed": 1, "signer": "Andi", "signature": "/uploads/sig_staff_user.png", "date": "2026-08-12 10:00"}
                }
            else:
                handover_approvals = {
                    "staff_eng": {"signed": 1, "signer": "Diki Firmansyah", "signature": "/uploads/sig_staff_eng.png", "date": "2026-08-10 09:00"},
                    "spv_eng": {"signed": 1, "signer": "Muhono", "signature": "/uploads/sig_spv_eng.png", "date": "2026-08-10 11:00"}
                }
            handover_docs = [
                "/uploads/project_bast_sample.pdf"
            ]

        docs = [
            "/uploads/project_proposal_sample.pdf"
        ]
        exec_docs = []
        if phase >= 3:
            exec_docs = [
                "/uploads/project_exec_sample.pdf"
            ]

        timeline = [
            {"date": "2026-07-01", "title": "Kick-Off & Penetapan Desain", "desc": "Penetapan spesifikasi teknis dan vendor.", "completed": 1 if phase >= 2 else 0},
            {"date": "2026-07-20", "title": "Pengadaan Material & Fabrikasi", "desc": "Penerbitan PO dan inspeksi pabrikasi.", "completed": 1 if phase >= 3 else 0},
            {"date": "2026-08-10", "title": "Instalasi Lapangan & Testing", "desc": "Ereksi konstruksi dan uji coba fungsional.", "completed": 1 if phase >= 4 else 0},
            {"date": targetDate, "title": "Commissioning & Serah Terima", "desc": "Uji beban penuh dan penerbitan BAST resmi.", "completed": 1 if phase >= 5 else 0}
        ]

        cursor.execute("""
            INSERT INTO projects (
                id, title, dept, budget, targetDate, pic, desc, phase, approvals,
                docs, execution_docs, handover_docs, handover_approvals, timeline,
                pr_percent, po_percent, gr_percent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p_id, title, dept, budget, targetDate, pic, desc, phase,
            json.dumps(approvals), json.dumps(docs), json.dumps(exec_docs),
            json.dumps(handover_docs), json.dumps(handover_approvals),
            json.dumps(timeline), pr_p, po_p, gr_p
        ))

    conn.commit()
    print(f"Projects seeded. Total rows: {cursor.execute('SELECT COUNT(*) FROM projects').fetchone()[0]}")

    print("\n--- 5. SEEDING REPAIR PARTS INVENTORY ---")
    cursor.execute("DELETE FROM repair_parts")

    repair_parts_data = [
        ("PART-001", "Shaft Impeller Pompa KSB 65-200", "PART-KSB-65", 4, "Bin A-12 Workshop", "EJO412026", "Shaft impeller stainless steel 316 hasil rekondisi dan bubut presisi.", 9500000.0, 8000000.0, 9500000.0, "user_ENG"),
        ("PART-002", "Bushing & Sleeve Tungsten Carbide Grundfos CRN 32", "PART-GF-CRN32", 6, "Bin A-14 Workshop", "DRW222026", "Sleeve keramik dan bushing perunggu tahan aus pompa boiler feed water.", 4800000.0, 3900000.0, 4800000.0, "user_PRD"),
        ("PART-003", "Roll Slitter Hardchrome 180x1200mm", "PART-SLT-180", 2, "Bin B-03 Workshop", "EJO422026", "Roll slitter baja S45C dilapisi hardchrome 50 micron dan dinamis balancing.", 16000000.0, 13200000.0, 16000000.0, "user_EPR"),
        ("PART-004", "Roller Sprocket RS80 Double Pitch Heavy Duty", "PART-SPK-RS80", 12, "Bin B-08 Workshop", "DRW232026", "Sprocket rantai konveyor pallet baja carbon heat treated.", 2200000.0, 1750000.0, 2200000.0, "user_WRH"),
        ("PART-005", "Mechanical Seal SiC/SiC/Viton 45mm", "PART-SEAL-45", 8, "Bin C-01 Workshop", "EJO17140826", "Mechanical seal cartridge pompa transfer cairan kental food grade.", 3500000.0, 2800000.0, 3500000.0, "user_PRD"),
        ("PART-006", "Worm Gear Bronze Ratio 1:40 Gearbox 110", "PART-WGM-140", 3, "Bin C-05 Workshop", "EJO18140826", "Roda gigi cacing perunggu fosfor untuk reducer konveyor.", 3800000.0, 3100000.0, 3800000.0, "user_WRH"),
        ("PART-007", "Mata Pisau Chopper SKD-11 Shredder Limbah", "PART-BLD-SKD11", 16, "Bin D-02 Workshop", "DRW262026", "Pisau baja SKD-11 perlakuan panas kekerasan 58 HRC.", 1850000.0, 1400000.0, 1850000.0, "user_GA"),
        ("PART-008", "Impeller Blower PP 350mm Tahan Uap Asam", "PART-IMP-PP350", 4, "Bin D-07 Workshop", "DRW282026", "Sudu impeller polypropylene anti korosi untuk scrubber fume hood.", 2900000.0, 2250000.0, 2900000.0, "user_QC")
    ]

    for item in repair_parts_data:
        cursor.execute("""
            INSERT INTO repair_parts (
                id, name, code, stock, location, ejo_id, description, price, cost_saving, original_price, uploader
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, item)
    conn.commit()
    print(f"Repair Parts seeded. Total rows: {cursor.execute('SELECT COUNT(*) FROM repair_parts').fetchone()[0]}")

    print("\n--- ALL EXTENSIVE DUMMY DATA SEEDED SUCCESSFULLY! ---")
    conn.close()

if __name__ == "__main__":
    seed_all_dummy_data()
