import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x2D, 0x37, 0x48)

    # ----------------------------------------------------
    # HALAMAN SAMPUL (COVER PAGE)
    # ----------------------------------------------------
    p_cov_space = doc.add_paragraph()
    p_cov_space.paragraph_format.space_before = Pt(36)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = p_title.add_run("LAPORAN PENGEMBANGAN DAN BUKU PANDUAN PENGGUNA SISTEM\nIRMA VERSE")
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_sub = p_sub.add_run("Platform Ekosistem Pembelajaran Terintegrasi (LMS), Kompetisi, Komunikasi Real-time, dan Gamifikasi Komunitas Berbasis Next.js & Socket.io")
    run_sub.font.name = 'Calibri'
    run_sub.font.size = Pt(13)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
    p_sub.paragraph_format.space_after = Pt(80)

    p_line = doc.add_paragraph()
    p_line.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_line = p_line.add_run("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    run_line.font.color.rgb = RGBColor(0x3B, 0x82, 0xF6)
    p_line.paragraph_format.space_after = Pt(80)

    p_author_label = doc.add_paragraph()
    p_author_label.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_al = p_author_label.add_run("Disusun Oleh:")
    run_al.font.size = Pt(11)
    run_al.font.bold = True

    p_author = doc.add_paragraph()
    p_author.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_a = p_author.add_run("TIM PENGEMBANG IRMA VERSE\nRaditt10 & Fauzaroo01\nKomunitas Ikatan Remaja Masjid (IRMA)")
    run_a.font.size = Pt(12)
    run_a.font.bold = True
    run_a.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
    p_author.paragraph_format.space_after = Pt(100)

    p_year = doc.add_paragraph()
    p_year.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_y = p_year.add_run("TAHUN 2026\nINDONESIA")
    run_y.font.size = Pt(11)
    run_y.font.bold = True
    run_y.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    doc.add_page_break()

    # Helper functions
    def add_heading_1(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(18)
        h.paragraph_format.space_after = Pt(6)
        h.paragraph_format.keep_with_next = True
        run = h.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        return h

    def add_heading_2(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(12)
        h.paragraph_format.space_after = Pt(4)
        h.paragraph_format.keep_with_next = True
        run = h.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)
        return h

    def add_heading_3(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(8)
        h.paragraph_format.space_after = Pt(2)
        h.paragraph_format.keep_with_next = True
        run = h.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        return h

    def add_p(text, bold_prefix=None, italic=False, space_after=6):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.font.bold = True
        r = p.add_run(text)
        r.font.italic = italic
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.font.bold = True
        p.add_run(text)
        return p

    def add_callout(title, text, color_hex="F1F5F9", border_color="3B82F6"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        tbl.columns[0].width = Inches(6.5)
        cell = tbl.cell(0, 0)
        set_cell_background(cell, color_hex)
        set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        r1 = p.add_run(f"📌 {title}\n")
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        
        r2 = p.add_run(text)
        r2.font.size = Pt(10)
        r2.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ----------------------------------------------------
    # KATA PENGANTAR
    # ----------------------------------------------------
    add_heading_1("KATA PENGANTAR")
    add_p("Puji dan syukur kami panjatkan ke hadirat Allah Subhanahu Wa Ta'ala atas limpahan rahmat, taufik, dan inayah-Nya, sehingga Laporan Pengembangan Sistem dan Buku Panduan Pengoperasian Aplikasi IRMA Verse (Ikatan Remaja Masjid Metaverse Platform) ini dapat diselesaikan dengan baik dan terstruktur.")
    add_p("IRMA Verse hadir sebagai respon terhadap akselerasi transformasi digital dalam pembinaan generasi muda Islam. Aplikasi ini menyatukan Learning Management System (LMS) modern terstruktur, sistem gamifikasi prestasi (XP, Level, Badges), media komunikasi real-time (Socket.io), serta manajemen kegiatan dan kompetisi remaja masjid ke dalam satu ekosistem web yang interaktif, elegan, dan inklusif.")
    add_p("Laporan ini disusun secara komprehensif untuk mendokumentasikan landasan perancangan, arsitektur perangkat lunak, perancangan basis data relasional, modul fitur utama, panduan penggunaan teknis bagi seluruh peran pengguna (Super Admin, Admin, Instruktur, Member), hingga prosedur pemecahan masalah (troubleshooting).")
    add_p("Besar harapan kami agar dokumen dan platform IRMA Verse ini dapat memberikan kemanfaatan yang berkelanjutan bagi pembinaan dakwah kepemudaan. Kami senantiasa terbuka menerima kritik dan saran konstruktif demi penyempurnaan sistem pada versi-versi mendatang.")
    
    p_sign = doc.add_paragraph()
    p_sign.paragraph_format.space_before = Pt(16)
    p_sign.paragraph_format.space_after = Pt(20)
    p_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sign = p_sign.add_run("Bandung, September 2026\n\n\nTim Pengembang IRMA Verse")
    r_sign.font.bold = True

    # ----------------------------------------------------
    # UCAPAN TERIMA KASIH
    # ----------------------------------------------------
    add_heading_1("UCAPAN TERIMA KASIH")
    add_p("Penyelesaian platform digital IRMA Verse dan penyusunan buku laporan ini merupakan hasil sinergi dan kolaborasi dari berbagai pihak. Rasa hormat dan terima kasih setulus-tulusnya kami sampaikan kepada:")
    add_bullet(" yang senantiasa meluangkan waktu memberikan bimbingan visi dakwah kepemudaan, nasihat keislaman, serta dorongan moril tanpa henti.", "1. Pengurus dan Dewan Pembina IRMA (Ikatan Remaja Masjid)")
    add_bullet(" atas sinergi, komitmen, dan kerja keras dalam merancang arsitektur sistem, desain antarmuka, optimasi database, dan stabilitas server real-time.", "2. Rekan Kolaborator Pengembang (Raditt10 & Fauzaroo01)")
    add_bullet(" yang telah berpartisipasi aktif dalam pengujian modul materi kurikulum, perancangan bank soal kuis, serta memberikan evaluasi pedagogis yang sangat berharga.", "3. Para Asatidz, Instruktur, dan Mentor IRMA")
    add_bullet(" dari berbagai sekolah dan masjid (Tingkat X, XI, XII, dan Ikatan Alumni) yang antusias mencoba sistem, mengisi presensi, bersaing di leaderboard, dan melaporkan feedback perbaikan.", "4. Seluruh Anggota dan Kader Remaja Masjid")
    add_bullet(" (Next.js, Tailwind CSS, Prisma ORM, Socket.io, Lucide Icons, dan komunitas TypeScript global) yang menyediakan teknologi berdaya guna tinggi bagi kemajuan pendidikan.", "5. Komunitas Pengembang Perangkat Lunak Terbuka (Open-Source)")

    # ----------------------------------------------------
    # LEMBAR PENGESAHAN
    # ----------------------------------------------------
    add_heading_1("LEMBAR PENGESAHAN")
    add_p("Dokumen Laporan Sistem dan Buku Panduan Teknis Aplikasi IRMA Verse ini telah ditelaah, diuji fungsionalitasnya, dan disahkan sebagai dokumen standar operasional resmi aplikasi:")

    tbl_peng = doc.add_table(rows=4, cols=2)
    tbl_peng.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_peng.autofit = False
    tbl_peng.columns[0].width = Inches(2.2)
    tbl_peng.columns[1].width = Inches(4.3)
    
    peng_data = [
        ("Nama Sistem", ": IRMA Verse (Platform Pembelajaran & Komunitas Remaja Masjid)"),
        ("Versi Sistem", ": Versi 1.0.0 (Production Stable)"),
        ("Teknologi Inti", ": Next.js 14/16, TypeScript, MySQL, Prisma ORM, Socket.io"),
        ("Tanggal Pengesahan", ": 8 September 2026")
    ]
    for idx, (label, val) in enumerate(peng_data):
        row = tbl_peng.rows[idx]
        cell_lbl, cell_val = row.cells[0], row.cells[1]
        set_cell_margins(cell_lbl, top=60, bottom=60, left=60, right=60)
        set_cell_margins(cell_val, top=60, bottom=60, left=60, right=60)
        r0 = cell_lbl.paragraphs[0].add_run(label)
        r0.font.bold = True
        cell_val.paragraphs[0].add_run(val)

    p_peng_space = doc.add_paragraph()
    p_peng_space.paragraph_format.space_before = Pt(28)

    tbl_ttd = doc.add_table(rows=1, cols=2)
    tbl_ttd.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_ttd.columns[0].width = Inches(3.2)
    tbl_ttd.columns[1].width = Inches(3.2)
    
    c1 = tbl_ttd.cell(0, 0)
    p_c1 = c1.paragraphs[0]
    p_c1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c1.add_run("Mengetahui,\nLead Software Engineer IRMA Verse\n\n\n\n\n( Raditya / Raditt10 )\nNIP/ID: ENG-2026-001")
    
    c2 = tbl_ttd.cell(0, 1)
    p_c2 = c2.paragraphs[0]
    p_c2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c2.add_run("Menyetujui,\nHead of Digital Ecosystem IRMA\n\n\n\n\n( Fauzar / Fauzaroo01 )\nNIP/ID: ARC-2026-002")

    doc.add_page_break()

    # ----------------------------------------------------
    # DAFTAR ISI
    # ----------------------------------------------------
    add_heading_1("DAFTAR ISI")
    
    daftar_isi_items = [
        ("HALAMAN SAMPUL", "i"),
        ("KATA PENGANTAR", "ii"),
        ("UCAPAN TERIMA KASIH", "iii"),
        ("LEMBAR PENGESAHAN", "iv"),
        ("DAFTAR ISI", "v"),
        ("BAB 1: PENDAHULUAN", "1"),
        ("  1.1 Latar Belakang & Tujuan Aplikasi", "1"),
        ("  1.2 Target Pengguna (User Roles)", "2"),
        ("  1.3 Kebutuhan Sistem (Minimum Hardware & Software Requirement)", "3"),
        ("BAB 2: ARSITEKTUR & PERANCANGAN SISTEM", "4"),
        ("  2.1 Alur Kerja Sistem (Business Process)", "4"),
        ("  2.2 Teknologi (Bahasa Pemrograman, Framework, Database)", "6"),
        ("  2.3 Perancangan Basis Data (ERD / Struktur Tabel)", "7"),
        ("BAB 3: MEMULAI APLIKASI", "10"),
        ("  3.1 Cara Akses atau Instalasi (Web/Desktop/Mobile)", "10"),
        ("  3.2 Halaman Utama & Tampilan Antarmuka (UI Overview)", "11"),
        ("  3.3 Prosedur Registrasi & Pembuatan Akun Baru", "12"),
        ("  3.4 Panduan Login dan Logout", "13"),
        ("BAB 4: MANAJEMEN AKUN & PENGATURAN (SETTINGS)", "14"),
        ("  4.1 Mengubah Profil Pengguna & Kata Sandi", "14"),
        ("  4.2 Pengaturan Hak Akses (Role Management)", "15"),
        ("  4.3 Konfigurasi Umum Aplikasi", "16"),
        ("BAB 5: FITUR UTAMA APLIKASI (CORE FEATURES)", "17"),
        ("  5.1 Modul Dashboard & Overview Akademik (Statistik & Metrik)", "17"),
        ("  5.2 Modul Manajemen Program & Materi Kajian LMS", "18"),
        ("  5.3 Modul Presensi Digital, Evaluasi Kuis & Gamifikasi", "20"),
        ("  5.4 Modul Laporan Rekapitulasi, Kompetisi & Real-time Chat", "22"),
        ("BAB 6: PANDUAN LANJUTAN (ADVANCED FEATURES)", "24"),
        ("  6.1 Integrasi dengan Sistem Lain (OAuth, GenAI, Socket.io)", "24"),
        ("  6.2 Pencadangan & Pemulihan Data (Backup & Restore)", "25"),
        ("BAB 7: PEMECAHAN MASALAH (TROUBLESHOOTING)", "26"),
        ("  Kendala Umum dan Solusinya (Error Code, Lupa Password, Koneksi)", "26"),
        ("LAMPIRAN", "29"),
        ("  Lampiran 1: Struktur Direktori & File Project", "29"),
        ("  Lampiran 2: Cuplikan Skema Relasi Database Prisma", "30"),
        ("  Lampiran 3: Panduan Membuka Dokumen di Google Docs", "32")
    ]
    
    tbl_toc = doc.add_table(rows=len(daftar_isi_items), cols=2)
    tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_toc.autofit = False
    tbl_toc.columns[0].width = Inches(5.8)
    tbl_toc.columns[1].width = Inches(0.7)
    
    for i, (item_title, page_num) in enumerate(daftar_isi_items):
        r_row = tbl_toc.rows[i]
        c_title, c_page = r_row.cells[0], r_row.cells[1]
        set_cell_margins(c_title, top=20, bottom=20, left=40, right=40)
        set_cell_margins(c_page, top=20, bottom=20, left=40, right=40)
        
        p_t = c_title.paragraphs[0]
        r_t = p_t.add_run(item_title)
        if "BAB" in item_title or item_title.isupper():
            r_t.font.bold = True
        
        p_p = c_page.paragraphs[0]
        p_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_p = p_p.add_run(page_num)
        if "BAB" in item_title or item_title.isupper():
            r_p.font.bold = True

    doc.add_page_break()

    # ----------------------------------------------------
    # BAB 1: PENDAHULUAN
    # ----------------------------------------------------
    add_heading_1("BAB 1: PENDAHULUAN")
    
    add_heading_2("1.1 Latar Belakang & Tujuan Aplikasi")
    add_p("Ikatan Remaja Masjid (IRMA) merupakan pilar penting dalam pembinaan keagamaan, akhlak, dan kepemimpinan generasi muda di lingkungan sekolah maupun masjid. Di era disrupsi informasi dan transformasi digital saat ini, metode pembinaan konvensional yang mengandalkan lembaran presensi fisik, penyebaran materi via grup perpesanan yang mudah tertimbun, serta tiadanya evaluasi terstruktur menghadirkan kesenjangan efektivitas pembelajaran.")
    add_p("Platform IRMA Verse dikembangkan untuk menjawab problematika tersebut dengan menghadirkan solusi teknologi cerdas yang ramah pengguna, modern, dan menyenangkan. IRMA Verse memadukan kemandirian belajar (self-paced learning) melalui modul materi terstruktur dengan gamifikasi yang memotivasi remaja untuk istiqomah dalam menuntut ilmu.")
    add_p("Tujuan strategis dibangunnya sistem IRMA Verse adalah sebagai berikut:", bold_prefix="Tujuan Utama Sistem: ")
    add_bullet("Membangun ekosistem belajar digital yang mengelompokkan materi kajian secara berjenjang (Tingkat X, XI, XII) dan tematik (Wajib, Extra, NextLevel, Susulan).", "1. Standardisasi Modul Kajian: ")
    add_bullet("Menghilangkan inefisiensi presensi kertas melalui sistem absensi digital yang mencatat kehadiran real-time, evaluasi materi, dan rating kepuasan penyampaian ustadz.", "2. Efisiensi Pencatatan Presensi: ")
    add_bullet("Menerapkan reward system berupa poin, Experience Points (XP), level dinamis, badges penghargaan, dan streak keaktifan agar anggota termotivasi untuk terus hadir dan belajar.", "3. Gamifikasi Motivasi Santri: ")
    add_bullet("Menyediakan wadah diskusi ilmiah dua arah yang aman dan santun antara pemateri/instruktur dengan para anggota melalui WebSocket berkecepatan tinggi.", "4. Komunikasi Real-Time Terpadu: ")
    add_bullet("Mengelola agenda tabligh/kajian berkala, turnamen islami (Tahfidz, Seni, Bahasa), serta transparansi peringkat prestasi anggota.", "5. Sentralisasi Agenda & Kompetisi: ")

    add_heading_2("1.2 Target Pengguna (User Roles)")
    add_p("Sistem IRMA Verse mengimplementasikan kontrol akses berbasis peran (Role-Based Access Control) yang membedakan otoritas pengguna ke dalam 4 (empat) peran utama:")
    
    tbl_roles = doc.add_table(rows=5, cols=3)
    tbl_roles.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_roles.autofit = False
    tbl_roles.columns[0].width = Inches(1.3)
    tbl_roles.columns[1].width = Inches(2.2)
    tbl_roles.columns[2].width = Inches(3.0)
    
    headers_roles = ["Peran (Role)", "Profil Pengguna", "Kewenangan & Hak Akses Utama"]
    for j, h in enumerate(headers_roles):
        c = tbl_roles.rows[0].cells[j]
        set_cell_background(c, "E2E8F0")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        c.paragraphs[0].add_run(h).font.bold = True
        
    roles_data = [
        ("Super Admin", "Pengelola infrastruktur dan pimpinan tertinggi IRMA", "Mengelola seluruh pengguna, mengubah hak akses (role), memantau log sistem dan database, mengelola konfigurasi aplikasi tingkat lanjut."),
        ("Admin", "Pengurus harian dan panitia pelaksana kegiatan", "Membuat jadwal kajian resmi, memverifikasi peserta kompetisi, memoderasi berita dan warta komunitas, meninjau laporan keluhan/bug pengguna."),
        ("Instruktur", "Ustadz, Guru Pembimbing, dan Mentor Kajian", "Menyusun program belajar, mengunggah materi pelajaran/video, membuka dan menutup sesi presensi kajian, membuat soal kuis, serta membalas chat santri."),
        ("User", "Anggota remaja masjid, siswa, dan peserta kajian", "Mengakses materi, mengisi presensi digital, mengerjakan kuis evaluasi, mengumpulkan poin XP & lencana, serta berinteraksi di ruang obrolan.")
    ]
    for i, row_data in enumerate(roles_data):
        row = tbl_roles.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            set_cell_margins(c, top=60, bottom=60, left=80, right=80)
            if j == 0:
                set_cell_background(c, "F8FAFC")
                c.paragraphs[0].add_run(val).font.bold = True
            else:
                c.paragraphs[0].add_run(val)

    add_heading_2("1.3 Kebutuhan Sistem (Minimum Hardware & Software Requirement)")
    add_p("Untuk menjamin kestabilan dan kenyamanan operasional sistem, berikut spesifikasi minimum yang dipersyaratkan:")
    
    add_heading_3("A. Kebutuhan Klien Pengguna (Client Requirement)")
    add_bullet("Smartphone / Komputer / Tablet dengan prosesor dual-core minimal 1.5 GHz, memori RAM 2 GB, dan koneksi internet stabil (minimal 512 Kbps).", "Hardware: ")
    add_bullet("Web browser modern yang mendukung standar HTML5 & WebSocket (Google Chrome v90+, Mozilla Firefox v88+, Safari v14+, atau Microsoft Edge v90+).", "Software: ")

    add_heading_3("B. Kebutuhan Server & Hosting (Server Requirement)")
    add_bullet("Processor 2 Core vCPU (Rekomendasi 4 Core), RAM 4 GB (Rekomendasi 8 GB), Penyimpanan SSD 25 GB untuk basis data dan aset statis.", "Hardware Server: ")
    add_bullet("Sistem Operasi Linux Ubuntu 22.04 LTS / Debian 12 / Windows Server; Node.js v20.x atau v22.x; PNPM v9.x; Database MySQL 8.0 / MariaDB 10.6+; Reverse Proxy Nginx dengan sertifikat SSL/TLS.", "Software Server: ")

    # ----------------------------------------------------
    # BAB 2: ARSITEKTUR & PERANCANGAN SISTEM
    # ----------------------------------------------------
    add_heading_1("BAB 2: ARSITEKTUR & PERANCANGAN SISTEM")
    
    add_heading_2("2.1 Alur Kerja Sistem (Business Process)")
    add_p("Proses bisnis dalam IRMA Verse didesain secara integratif melalui alur operasional terstruktur:")
    add_bullet("Pengguna mendaftar secara mandiri melalui form registrasi atau Google OAuth. Sistem memvalidasi kredensial dan menyematkan peran default 'user'.", "1. Siklus Autentikasi Akun: ")
    add_bullet("Instruktur menyusun silabus program kajian, mengunggah modul materi (teks format rich markdown, link video, dan lampiran referensi), serta mengaitkan kuis evaluasi.", "2. Siklus Manajemen Kurikulum: ")
    add_bullet("Member membuka akademi, memilih materi sesuai tingkat kelasnya, dan membaca kajian. Saat pertemuan tatap muka atau siaran daring berlangsung, instruktur membuka jendela presensi digital.", "3. Siklus Pembelajaran & Absensi: ")
    add_bullet("Member melakukan submit presensi digital lengkap dengan waktu kedatangan, tingkat kejelasan materi, catatan resume, serta rating instruktur.", "4. Siklus Presensi Multi-Parameter: ")
    add_bullet("Member mengerjakan kuis pilihan ganda. Sistem mengevaluasi jawaban secara otomatis, merekam skor, dan mengkreditkan poin XP ke profil member yang memicu kenaikan level serta pembukaan lencana.", "5. Siklus Evaluasi & Gamifikasi: ")
    add_bullet("Member dan instruktur dapat bertukar pesan real-time melalui Chat Rooms untuk konsultasi pribadi seputar materi maupun fikih praktis.", "6. Siklus Komunikasi Real-time: ")
    add_bullet("Admin dan instruktur memonitor kehadiran, merekap evaluasi, dan mengelola agenda kompetisi dakwah secara berkala.", "7. Siklus Monitoring & Pelaporan: ")

    add_heading_2("2.2 Teknologi (Bahasa Pemrograman, Framework, Database)")
    add_p("Arsitektur IRMA Verse memanfaatkan piranti teknologi mutakhir:")
    add_bullet("TypeScript 5 memberikan pengetikan statis yang kuat, meminimalisir bug logika pada tahap pengembangan serta mempercepat kolaborasi tim.", "Bahasa Pemrograman: ")
    add_bullet("Next.js 14/16 dengan App Router, menyatukan frontend React 19 dan backend Route Handlers/Server Actions dalam satu codebase monolitik yang efisien.", "Framework Utama: ")
    add_bullet("Tailwind CSS v4 untuk utility styling berkecepatan tinggi, dipadukan dengan Radix UI dan Shadcn UI guna menyajikan komponen antarmuka yang elegan dan aksesibel.", "Desain Antarmuka: ")
    add_bullet("MySQL 8.0 sebagai RDBMS berkinerja tinggi, diakses secara type-safe melalui Prisma ORM v6 yang mengelola migrasi skema dan relasi antar tabel.", "Basis Data & ORM: ")
    add_bullet("NextAuth.js (Auth.js v5 Beta) untuk manajemen sesi JWT berbasis cookie aman HttpOnly, terintegrasi dengan Google OAuth 2.0 dan password hashing bcryptjs.", "Autentikasi & Keamanan: ")
    add_bullet("Socket.io v4 yang dikonfigurasi melalui custom HTTP server (server.ts) untuk komunikasi WebSocket real-time dua arah.", "Mesin Real-time: ")
    add_bullet("SDK @google/genai (Google Gemini) yang disematkan pada modul asisten pintar untuk menjawab pertanyaan fikih santri secara interaktif.", "Kecerdasan Buatan (AI): ")

    add_heading_2("2.3 Perancangan Basis Data (ERD / Struktur Tabel)")
    add_p("Struktur data relasional IRMA Verse mencakup entitas berikut:")
    
    tbl_db = doc.add_table(rows=9, cols=3)
    tbl_db.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_db.autofit = False
    tbl_db.columns[0].width = Inches(1.8)
    tbl_db.columns[1].width = Inches(2.2)
    tbl_db.columns[2].width = Inches(2.5)
    
    headers_db = ["Nama Tabel", "Kunci Utama & Asing", "Fungsi & Deskripsi Relasi"]
    for j, h in enumerate(headers_db):
        c = tbl_db.rows[0].cells[j]
        set_cell_background(c, "E2E8F0")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        c.paragraphs[0].add_run(h).font.bold = True
        
    db_data = [
        ("users", "id (PK UUID), email (Unique)", "Menyimpan kredensial akun, biodata, peran (role), level, xp, badges, points, streak harian, dan avatar."),
        ("programs", "id (PK), instructorId (FK users)", "Data kurikulum/program kajian, tingkat kelas (X/XI/XII), kategori (Wajib/Extra/NextLevel/Susulan), dan silabus."),
        ("material", "id (PK), programId (FK), instructorId (FK)", "Modul materi pelajaran, konten rich text, tautan referensi, prasyarat jenjang, dan status presensi."),
        ("attendance", "id (PK), userId (FK), materialId (FK)", "Catatan presensi, status (hadir/izin/sakit), kejelasan materi, relevansi, rating, dan kesimpulan santri."),
        ("material_quizzes", "id (PK), materialId (FK), creatorId", "Induk kuis evaluasi materi yang terhubung ke tabel quiz_questions dan quiz_options."),
        ("quiz_attempts", "id (PK), quizId (FK), userId (FK)", "Rekapitulasi hasil ujian santri, skor perolehan, rekaman jawaban JSON, dan waktu penyelesaian."),
        ("chat_conversations & chat_messages", "id (PK), senderId (FK), conversationId", "Kanal dan rekaman pesan instan 1-on-1 antara instruktur dan member beserta lampiran."),
        ("competitions & schedules", "id (PK), instructorId (FK users)", "Agenda kegiatan kajian dakwah serta pendaftaran kompetisi (Tahfidz, Seni, Bahasa) dan leaderboard.")
    ]
    for i, row_data in enumerate(db_data):
        row = tbl_db.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            set_cell_margins(c, top=50, bottom=50, left=70, right=70)
            if j == 0:
                set_cell_background(c, "F8FAFC")
                c.paragraphs[0].add_run(val).font.bold = True
            else:
                c.paragraphs[0].add_run(val)

    # ----------------------------------------------------
    # BAB 3: MEMULAI APLIKASI
    # ----------------------------------------------------
    add_heading_1("BAB 3: MEMULAI APLIKASI")
    
    add_heading_2("3.1 Cara Akses atau Instalasi (Web/Desktop/Mobile)")
    add_p("Aplikasi IRMA Verse berbasis cloud web yang dirancang responsif (Mobile-First Design):")
    add_bullet("Kunjungi alamat URL resmi aplikasi melalui peramban (misal: https://irmaverse.org atau http://localhost:3000 pada lingkungan lokal).", "Akses Pengguna Akhir: ")
    add_bullet("Pada browser Chrome di Android atau Desktop, klik ikon instalasi di bilah alamat untuk memasang shortcut aplikasi layaknya aplikasi native tanpa memakan ruang penyimpanan besar.", "Instalasi PWA: ")
    
    add_p("Untuk menjalankan lingkungan pengembangan (Development Setup):", bold_prefix="Langkah Instalasi Server Lokal: ")
    add_bullet("Pastikan Node.js v20+ dan PNPM telah terpasang di komputer.", "1. Prasyarat: ")
    add_bullet("Kloning repositori proyek: git clone https://github.com/raditt10/irma-verse.git", "2. Clone Repo: ")
    add_bullet("Masuk ke direktori dan pasang dependensi: cd irma-verse && pnpm install", "3. Install Dependencies: ")
    add_bullet("Salin file .env.example menjadi .env, sesuaikan konfigurasi DATABASE_URL, NEXTAUTH_SECRET, dan kredensial OAuth Google.", "4. Konfigurasi Lingkungan: ")
    add_bullet("Sinkronkan database: npx prisma migrate dev lalu npx prisma db seed", "5. Migrasi DB: ")
    add_bullet("Jalankan server kustom: pnpm dev (server aktif di http://localhost:3000).", "6. Jalankan Server: ")

    add_heading_2("3.2 Halaman Utama & Tampilan Antarmuka (UI Overview)")
    add_p("Tata letak antarmuka dirancang bersih, intuitif, dan nyaman dipandang:")
    add_bullet("Berada di sisi samping pada layar lebar dan navigasi bawah/drawer pada smartphone, mencakup menu Overview, Akademi, Jadwal, Kompetisi, Berita, Ruang Chat, Peringkat, dan Pengaturan.", "Bilah Navigasi (Sidebar): ")
    add_bullet("Menampilkan pintasan profil, notifikasi lonceng untuk pesan chat masuk dan pembaruan materi, serta pencarian global.", "Bilah Header: ")
    add_bullet("Menampilkan kartu ringkasan progres capaian santri, banner kajian unggulan, dan jadwal terdekat.", "Area Kerja Utama: ")

    add_heading_2("3.3 Prosedur Registrasi & Pembuatan Akun Baru")
    add_p("Calon anggota dapat mendaftarkan diri dengan langkah berikut:")
    add_bullet("Buka rute /auth atau klik tombol 'Daftar' di halaman pembuka.", "1. Buka Halaman Auth: ")
    add_bullet("Pilih metode pendaftaran: 'Daftar dengan Google' (SSO cepat) atau isi formulir (Nama Lengkap, Email, Kata Sandi).", "2. Pilih Metode: ")
    add_bullet("Sistem memvalidasi keunikan email dan mengenkripsi kata sandi menggunakan salt bcrypt 10 putaran.", "3. Pemrosesan Data: ")
    add_bullet("Setelah berhasil, pengguna akan diarahkan melengkapi profil awal (asal sekolah, kelas X/XI/XII, dan nomor telepon aktif).", "4. Melengkapi Profil: ")

    add_heading_2("3.4 Panduan Login dan Logout")
    add_p("Prosedur masuk dan keluar sistem dirancang mengutamakan keamanan:")
    add_bullet("Akses halaman /auth, masukkan alamat email dan password, lalu klik 'Masuk'. Token JWT akan disematkan pada cookie aman peramban.", "Login Kredensial: ")
    add_bullet("Klik 'Lanjutkan dengan Google' untuk proses login instan satu klik tanpa perlu mengingat password terpisah.", "Login Google SSO: ")
    add_bullet("Klik avatar profil di kanan atas, lalu pilih opsi 'Keluar'. Sesi browser dan koneksi WebSocket Socket.io akan dihapus secara bersih.", "Prosedur Logout: ")

    # ----------------------------------------------------
    # BAB 4: MANAJEMEN AKUN & PENGATURAN
    # ----------------------------------------------------
    add_heading_1("BAB 4: MANAJEMEN AKUN & PENGATURAN (SETTINGS)")
    
    add_heading_2("4.1 Mengubah Profil Pengguna & Kata Sandi")
    add_p("Setiap pengguna memiliki kendali penuh atas identitas akunnya pada menu /settings:")
    add_bullet("Pengguna dapat mengunggah foto profil baru dengan fitur crop interaktif, memperbarui bio dakwah, serta nomor kontak WhatsApp.", "Pembaruan Biodata & Avatar: ")
    add_bullet("Pengguna berbasis email dapat memperbarui password dengan memverifikasi kata sandi lama terlebih dahulu demi mencegah pembajakan akun.", "Ganti Kata Sandi: ")
    add_bullet("Pengguna dapat melihat rekap lencana yang terkumpul, perolehan XP, dan histori log aktivitas pada tab profil.", "Rekap Capaian & Prestasi: ")

    add_heading_2("4.2 Pengaturan Hak Akses (Role Management)")
    add_p("Pengelolaan peran pengguna dilakukan secara terpusat oleh Super Admin melalui konsol /admin/users:")
    add_bullet("Super Admin dapat menaikkan status peran akun santri menjadi 'instruktur' atau 'admin', serta mencabut hak akses jika diperlukan.", "Pengalihan Peran: ")
    add_bullet("Setiap pembaruan peran akan otomatis menyinkronkan token otorisasi pengguna saat request halaman berikutnya dilakukan.", "Validasi Hak Akses: ")
    add_bullet("Akun dengan peran Instruktur secara otomatis memperoleh wewenang manajemen silabus kelas, input materi, pembuatan kuis, dan review absensi.", "Menu Khusus Instruktur: ")

    add_heading_2("4.3 Konfigurasi Umum Aplikasi")
    add_p("Pengaturan umum sistem mencakup preferensi operasional:")
    add_bullet("Pengguna dapat mengaktifkan/menonaktifkan efek suara saat ada pesan chat baru atau perolehan badge prestasi.", "Preferensi Audio & Notifikasi: ")
    add_bullet("Admin dapat mengatur status pembukaan presensi, penutupan pendaftaran lomba, serta pengumuman siaran darurat.", "Kontrol Operasional Admin: ")

    # ----------------------------------------------------
    # BAB 5: FITUR UTAMA APLIKASI (CORE FEATURES)
    # ----------------------------------------------------
    add_heading_1("BAB 5: FITUR UTAMA APLIKASI (CORE FEATURES)")
    
    add_heading_2("5.1 Modul Dashboard & Overview Akademik (Dashboard & Statistik)")
    add_p("Dashboard (/overview) berfungsi sebagai pusat kendali ringkas:")
    add_bullet("Menampilkan metrik akumulasi XP, tingkatan Level santri, total kuis yang telah diselesaikan, dan rekor streak keaktifan.", "Statistik Belajar Pribadi: ")
    add_bullet("Menampilkan jadwal kajian yang akan datang dengan countdown waktu, lokasi acara/tautan live, serta profil pemateri.", "Agenda Kajian Terdekat: ")
    add_bullet("Bagi Administrator, dashboard menampilkan grafik registrasi member baru, rasio kehadiran bulanan, serta statistik keterlibatan kuis.", "Analitik Manajerial Admin: ")

    add_heading_2("5.2 Modul Manajemen Program & Materi Kajian LMS (Input & Manajemen Data)")
    add_p("Modul Akademi (/academy & /materials) merupakan repositori materi pembelajaran:")
    add_bullet("Materi tersusun menurut jenjang (Kelas X, XI, XII) dan dikategorikan menjadi Wajib, Extra, NextLevel, dan Susulan.", "Kurikulum Berjenjang: ")
    add_bullet("Instruktur dapat menulis kajian dengan format Markdown, melampirkan file dokumen PDF, serta tautan video streaming.", "Editor Materi Kaya Fitur: ")
    add_bullet("Setiap materi terhubung dengan rekapan kajian sebelumnya dan dapat dijadikan prasyarat untuk membuka materi berikutnya.", "Alur Silabus Berkesinambungan: ")

    add_heading_2("5.3 Modul Presensi Digital, Evaluasi Kuis & Gamifikasi (Transaksi & Proses Utama)")
    add_p("Modul transaksi mendokumentasikan keaktifan dan capaian santri:")
    add_bullet("Saat kajian berlangsung, member mengisi presensi digital yang mencatat ketepatan waktu, pemahaman materi, dan evaluasi rating bagi instruktur.", "Presensi Multi-Parameter: ")
    add_bullet("Kuis pilihan ganda yang otomatis dinilai oleh sistem dengan umpan balik langsung atas jawaban yang benar dan salah.", "Kuis Interaktif Otomatis: ")
    add_bullet("Setiap presensi dan kuis memberikan reward XP yang menaikkan level akun dan membuka lencana (Badges) kehormatan pada profil santri.", "Engine Gamifikasi & XP: ")

    add_heading_2("5.4 Modul Laporan Rekapitulasi, Kompetisi & Real-time Chat (Laporan & Ekspor)")
    add_p("Modul pelaporan dan interaksi komunitas memfasilitasi kebutuhan manajerial:")
    add_bullet("Laporan daftar hadir santri yang dapat disaring berdasarkan tanggal, kelas, dan topik materi untuk evaluasi berkala pimpinan.", "Rekapitulasi Presensi: ")
    add_bullet("Wadah kompetisi (Tahfidz, Pidato Bahasa Arab/Inggris, Seni Kaligrafi) dengan formulir pendaftaran, jadwal seleksi, dan leaderboard juara.", "Pusat Kompetisi & Leaderboard: ")
    add_bullet("Ruang chat 1-on-1 berbasis WebSocket Socket.io dengan penanda pesan terbaca (read receipts) untuk konsultasi materi dan keagamaan.", "Komunikasi Pesan Real-time: ")

    # ----------------------------------------------------
    # BAB 6: PANDUAN LANJUTAN
    # ----------------------------------------------------
    add_heading_1("BAB 6: PANDUAN LANJUTAN (ADVANCED FEATURES)")
    
    add_heading_2("6.1 Integrasi dengan Sistem Lain")
    add_p("Aplikasi IRMA Verse terintegrasi dengan ekosistem teknologi modern:")
    add_bullet("Memanfaatkan OAuth 2.0 untuk verifikasi identitas akun Google secara aman tanpa menyimpan password pihak ketiga.", "1. Google Cloud Authentication: ")
    add_bullet("Pemanfaatan model bahasa besar Google Gemini (@google/genai) untuk menyediakan asisten tanya-jawab fikih dan bimbingan belajar santri.", "2. Integrasi Kecerdasan Buatan (Google Gemini): ")
    add_bullet("Arsitektur WebSocket pada server.ts untuk transmisi data instan tanpa delay (chat, kehadiran, dan notifikasi).", "3. Engine Socket.io WebSocket: ")

    add_heading_2("6.2 Pencadangan & Pemulihan Data (Backup & Restore)")
    add_p("Prosedur pemeliharaan data untuk memastikan keandalan sistem:")
    add_bullet("Jalankan berkala perintah ekspor database: mysqldump -u root -p db_irmaverse > backup_$(date +%Y%m%d).sql", "Prosedur Backup Database: ")
    add_bullet("Untuk merestorasi basis data dari file cadangan: mysql -u root -p db_irmaverse < backup_file.sql", "Prosedur Restore Database: ")
    add_bullet("Pengelolaan struktur tabel dilakukan aman melalui migrasi Prisma dengan perintah npx prisma migrate deploy.", "Sinkronisasi Skema: ")

    # ----------------------------------------------------
    # BAB 7: PEMECAHAN MASALAH (TROUBLESHOOTING)
    # ----------------------------------------------------
    add_heading_1("BAB 7: PEMECAHAN MASALAH (TROUBLESHOOTING)")
    add_p("Panduan mengatasi masalah teknis yang sering ditemui pada operasional sistem:")
    
    tbl_ts = doc.add_table(rows=6, cols=3)
    tbl_ts.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_ts.autofit = False
    tbl_ts.columns[0].width = Inches(1.8)
    tbl_ts.columns[1].width = Inches(2.2)
    tbl_ts.columns[2].width = Inches(2.5)
    
    headers_ts = ["Gejala / Kode Error", "Kemungkinan Penyebab", "Tindakan Solutif"]
    for j, h in enumerate(headers_ts):
        c = tbl_ts.rows[0].cells[j]
        set_cell_background(c, "E2E8F0")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        c.paragraphs[0].add_run(h).font.bold = True
        
    ts_data = [
        ("Koneksi Basis Data Gagal\n(PrismaClientInitializationError)", "Layanan database MySQL tidak aktif atau string koneksi DATABASE_URL salah.", "Pastikan servis MySQL menyala di port 3306. Periksa kecocokan user, password, dan nama database pada berkas .env."),
        ("Pesan Chat Tidak Terkirim\n(WebSocket Disconnect)", "Server dijalankan dengan 'next dev' standar tanpa inisialisasi Socket.io di server.ts.", "Jalankan aplikasi selalu menggunakan perintah 'pnpm dev' (eksekusi tsx server.ts). Periksa apakah ada firewall yang memblokir koneksi WebSocket."),
        ("Gagal Masuk Akun\n(CredentialsSignin)", "Kombinasi email dan kata sandi salah, atau akun sebelumnya terdaftar via Google SSO.", "Periksa kembali ejaan email dan sandi. Jika mendaftar menggunakan Google, silakan klik tombol 'Lanjutkan dengan Google'."),
        ("Presensi Berstatus Ditutup\n(Attendance Closed)", "Instruktur pengampu materi belum mengaktifkan toggle presensi pada modul kajian.", "Hubungi instruktur kajian yang bersangkutan agar mengaktifkan status pembukaan presensi (isAttendanceOpen = true)."),
        ("Avatar Profil Tidak Tampil", "Domain gambar eksternal belum didaftarkan pada konfigurasi Next.js Image Optimization.", "Daftarkan domain hostname gambar pada properti images.remotePatterns di berkas next.config.ts lalu mulai ulang server.")
    ]
    for i, row_data in enumerate(ts_data):
        row = tbl_ts.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            set_cell_margins(c, top=50, bottom=50, left=70, right=70)
            if j == 0:
                set_cell_background(c, "FEF2F2")
                c.paragraphs[0].add_run(val).font.bold = True
            else:
                c.paragraphs[0].add_run(val)

    # ----------------------------------------------------
    # LAMPIRAN
    # ----------------------------------------------------
    add_heading_1("LAMPIRAN")
    
    add_heading_2("Lampiran 1: Struktur Direktori & File Project IRMA Verse")
    add_p("Pohon direktori arsitektur Next.js App Router pada IRMA Verse:")
    
    tree_text = """irma-verse/
├── app/                      # Rute Halaman & API Next.js App Router
│   ├── academy/              # Modul Kurikulum & Jenjang Kelas (X, XI, XII)
│   ├── admin/                # Dashboard Khusus Super Admin & Admin
│   ├── ai-assistant/         # Integrasi Chat Asisten AI Google Gemini
│   ├── api/                  # Route Handlers (auth, presensi, chat, berita)
│   ├── auth/                 # Autentikasi Login & Registrasi
│   ├── chat-rooms/           # Antarmuka Ruang Obrolan Real-time
│   ├── competitions/         # Modul Lomba Islami & Leaderboard
│   ├── feedback/             # Pelaporan Bug & Masukan Sistem
│   ├── friends/              # Jejaring Pertemanan Antar Anggota
│   ├── leaderboard/          # Papan Peringkat Prestasi & Level
│   ├── materials/            # Detail Modul Materi & Presensi
│   ├── news/                 # Portal Warta & Berita Komunitas
│   ├── overview/             # Beranda Utama Pengguna
│   ├── profile/              # Biodata, Lencana & Log Aktivitas
│   ├── programs/             # Program Pembelajaran Terstruktur
│   ├── quiz/                 # Evaluasi Pembelajaran & Pengerjaan Kuis
│   ├── schedule/             # Agenda Kalender Kajian
│   └── settings/             # Konfigurasi Profil & Preferensi Akun
├── components/               # Komponen Reusable (Shadcn UI & Lucide Icons)
├── lib/                      # Utilitas Basis Data (Prisma), Auth, & Socket
├── prisma/                   # Skema Database (schema.prisma) & Migrasi
├── public/                   # Aset Gambar, Logo, & Efek Suara
├── server.ts                 # Custom HTTP Server untuk Socket.io
└── package.json              # Konfigurasi Dependensi & Skrip Proyek"""

    tbl_tree = doc.add_table(rows=1, cols=1)
    tbl_tree.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_tree.columns[0].width = Inches(6.5)
    c_tree = tbl_tree.cell(0, 0)
    set_cell_background(c_tree, "F8FAFC")
    set_cell_margins(c_tree, top=100, bottom=100, left=150, right=150)
    p_tree = c_tree.paragraphs[0]
    r_tr = p_tree.add_run(tree_text)
    r_tr.font.name = 'Consolas'
    r_tr.font.size = Pt(8.5)
    r_tr.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    add_heading_2("Lampiran 2: Cuplikan Skema Relasi Database Prisma")
    add_p("Cuplikan representasi tabel utama users, material, dan attendance pada schema.prisma:")
    
    schema_sample = """model users {
  id               String             @id @default(uuid())
  email            String             @unique
  name             String?
  password         String?
  role             users_role         @default(user)
  level            Int                @default(1)
  points           Int                @default(0)
  streak           Int                @default(0)
  material         material[]
  courseenrollment courseenrollment[]
  quiz_attempts    quiz_attempts[]
  // ... relasi chat, badges, dan activity logs
}

model material {
  id               String            @id @default(uuid())
  title            String
  grade            material_grade
  category         material_category
  isAttendanceOpen Boolean           @default(true)
  instructorId     String
  users            users             @relation(fields: [instructorId], references: [id])
}

model attendance {
  id         String   @id @default(uuid())
  userId     String
  materialId String
  status     String   @default("hadir")
  feedback   String?  @db.Text
  rating     Int?
  createdAt  DateTime @default(now())
}"""

    tbl_sch = doc.add_table(rows=1, cols=1)
    tbl_sch.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sch.columns[0].width = Inches(6.5)
    c_sch = tbl_sch.cell(0, 0)
    set_cell_background(c_sch, "F8FAFC")
    set_cell_margins(c_sch, top=100, bottom=100, left=150, right=150)
    p_sch = c_sch.paragraphs[0]
    r_sc = p_sch.add_run(schema_sample)
    r_sc.font.name = 'Consolas'
    r_sc.font.size = Pt(8.5)

    add_heading_2("Lampiran 3: Panduan Membuka Dokumen di Google Docs")
    add_callout(
        "PANDUAN CEPAT MEMBUKA DI GOOGLE DOCS",
        "Dokumen ini disimpan secara resmi dalam file berformat Microsoft Word (.docx) yang kompatibel 100% dengan Google Docs:\n\n"
        "1. Buka peramban dan masuk ke https://docs.google.com atau https://drive.google.com\n"
        "2. Di Google Docs: Klik ikon folder ('Buka pemilih file' / Open file picker) di bagian kanan atas layar.\n"
        "3. Pilih tab 'Upload' (Unggah).\n"
        "4. Seret (Drag and Drop) file 'LAPORAN_SISTEM_IRMAVERSE.docx' dari folder proyek X:\\Irmaverse ke kotak upload Google Docs.\n"
        "5. Dokumen akan terbuka secara instan dalam Google Docs dengan seluruh tata letak (Heading 1-3, Tabel berbingkai warna, Daftar Isi, Lembar Pengesahan) rapi dan siap diedit atau dibagikan.",
        "F0FDF4", "22C55E"
    )

    doc.save(r"x:\Irmaverse\LAPORAN_SISTEM_IRMAVERSE.docx")
    print("Dokumen LAPORAN_SISTEM_IRMAVERSE.docx berhasil dibuat!")

if __name__ == "__main__":
    create_document()
