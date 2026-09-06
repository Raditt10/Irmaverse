"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";
import {
  ArrowRight,
  Award,
  BookMarked,
  Calendar,
  CalendarDays,
  Camera,
  MessageCircleQuestion,
  ChevronLeft,
  ChevronRight,
  Clock,
  Contact,
  Facebook,
  GraduationCap,
  Heart,
  HelpCircle,
  Home as HomeIcon,
  Instagram,
  LayoutGrid,
  Mail,
  MapPin,
  MessageSquare,
  Newspaper,
  Phone,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Youtube,
  Zap,
  Menu,
  X
} from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [latestNews, setLatestNews] = useState<Array<{ id: string; title: string; category: string | null; deskripsi?: string; slug: string; image?: string | null }>>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [stats, setStats] = useState({ totalMembers: 0, totalInstructors: 0 });
  // State untuk Galeri
  const [currentSlide, setCurrentSlide] = useState(0);
  // State untuk Mobile Menu (Burger Menu)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect instruktur ke /academy
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "instruktur") {
      router.replace("/academy");
    }
  }, [status, session, router]);

  // Data Gambar Galeri
  const galleryItems = [
    {
      src: "https://picsum.photos/seed/kegiatan1/800/400",
      title: "Kajian Akbar Bulanan",
      description: "Serunya belajar bersama ustadz tamu di Masjid Sekolah."
    },
    {
      src: "https://picsum.photos/seed/kegiatan2/800/400",
      title: "Rihlah Alam Terbuka",
      description: "Mentadaburi alam sambil mempererat ukhuwah antar anggota."
    },
    {
      src: "https://picsum.photos/seed/kegiatan3/800/400",
      title: "Latihan Marawis",
      description: "Persiapan penampilan untuk acara perpisahan sekolah."
    },
    {
      src: "https://picsum.photos/seed/kegiatan4/800/400",
      title: "Bakti Sosial IRMA",
      description: "Berbagi kebahagiaan dengan masyarakat sekitar sekolah."
    }
  ];

  // Auto slide logic
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setGalleryLoading(true);
      setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [galleryItems.length]);

  const nextSlide = () => {
    setGalleryLoading(true);
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setGalleryLoading(true);
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const features = [
    {
      icon: LayoutGrid,
      title: "Dashboard",
      description: "Pantau seluruh aktivitas dan progres IRMA Anda",
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      icon: Calendar,
      title: "Jadwal Kajian",
      description: "Lihat jadwal kajian mingguan per kelas",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      icon: BookMarked,
      title: "Rekapan Materi",
      description: "Akses rangkuman materi yang telah dipelajari",
      gradient: "from-teal-400 to-green-500",
    },
    {
      icon: HelpCircle,
      title: "Kuis",
      description: "Uji pemahaman materi dengan kuis interaktif",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: MessageSquare,
      title: "Forum Diskusi",
      description: "Diskusikan topik kajian bersama anggota",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: Award,
      title: "Peringkat",
      description: "Lihat papan peringkat anggota terbaik",
      gradient: "from-teal-500 to-green-600",
    },
    {
      icon: CalendarDays,
      title: "Kegiatan",
      description: "Info jadwal event dan kegiatan IRMA",
      gradient: "from-emerald-400 to-green-400",
    },
    {
      icon: GraduationCap,
      title: "Program Kurikulum",
      description: "Kurikulum pembelajaran yang terstruktur",
      gradient: "from-green-400 to-teal-400",
    },
    {
      icon: Trophy,
      title: "Info Perlombaan",
      description: "Informasi lomba dan kompetisi terbaru",
      gradient: "from-teal-500 to-emerald-500",
    },
    {
      icon: Contact,
      title: "Instruktur",
      description: "Kenali instruktur dan pemateri kajian",
      gradient: "from-emerald-600 to-green-600",
    },
    {
      icon: Users,
      title: "Daftar Anggota",
      description: "Lihat seluruh daftar anggota IRMA",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: Newspaper,
      title: "Berita IRMA",
      description: "Baca berita dan artikel terbaru",
      gradient: "from-teal-400 to-emerald-600",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Terorganisir dengan Baik",
      description:
        "Sistem yang terstruktur untuk mengelola seluruh kegiatan IRMA dengan efisien",
    },
    {
      icon: Clock,
      title: "Hemat Waktu",
      description:
        "Akses informasi kapan saja, di mana saja tanpa perlu hadir secara fisik",
    },
    {
      icon: TrendingUp,
      title: "Tracking Progress",
      description:
        "Pantau perkembangan pembelajaran dan pencapaian pribadi secara real-time",
    },
    {
      icon: Heart,
      title: "Komunitas Solid",
      description: "Membangun ikatan yang kuat dengan sesama anggota IRMA",
    },
  ];

  const today = new Date();
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const tanggalStr = `${hari[today.getDay()]}, ${today.getDate()} ${
    bulan[today.getMonth()]
  } ${today.getFullYear()}`;

  const [userLocation, setUserLocation] = useState<string>("Lokasi tidak diketahui");
  
  useEffect(() => {
    // Lazy load geolocation — don't block initial render
    const loadGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await res.json();
              setUserLocation(
                data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  data.address.state ||
                  data.display_name ||
                  "Lokasi ditemukan"
              );
            } catch {
              setUserLocation("Lokasi ditemukan");
            }
          },
          () => setUserLocation("Lokasi tidak diketahui")
        );
      }
    };

    // Use requestIdleCallback if available, otherwise defer with setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadGeolocation);
    } else {
      setTimeout(loadGeolocation, 2000);
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLatestNews(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/public/stats");
        const data = await res.json();
        if (data.totalMembers !== undefined) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-700 via-teal-600 to-cyan-500 text-white relative">
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 38%), radial-gradient(circle at 78% 12%, rgba(59,130,246,0.28), transparent 32%), radial-gradient(circle at 68% 72%, rgba(16,185,129,0.42), transparent 32%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative w-full">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between py-2 sm:py-4 px-3 sm:px-6 lg:px-8 text-sm text-white/80 max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-[10px] sm:text-sm font-semibold">{tanggalStr}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/70">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{userLocation}</span>
          </div>
        </div>

        {/* Header & Hero Section */}
        <div className="flex flex-col gap-3 sm:gap-4 pb-8 sm:pb-12">
          {/* Navbar */}
          <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8">
            <div className="flex items-center hover:scale-105 transition-transform duration-300">
              {/* LOGO CARD */}
              <img 
                src="/logo.webp" 
                alt="IRMA Verse" 
                className="h-10 w-10 sm:h-14 sm:w-14 object-contain drop-shadow-md" 
              />
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-white/90">
              {['Beranda', 'Galeri', 'FAQ'].map((item) => {
                const sectionId = item.toLowerCase();
                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (sectionId === 'beranda') {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
                  }
                };
                return (
                  <Link 
                    key={item} 
                    href={`#${sectionId}`} 
                    onClick={handleClick}
                    className="hover:text-white hover:scale-110 transition-all hover:drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]"
                  >
                    {item}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 text-white/70">
                <Instagram className="h-5 w-5 hover:scale-125 transition-transform cursor-pointer hover:text-white" />
                <Youtube className="h-5 w-5 hover:scale-125 transition-transform cursor-pointer hover:text-white" />
                <Facebook className="h-5 w-5 hover:scale-125 transition-transform cursor-pointer hover:text-white" />
              </div>
              <Link href="/auth">
                <button className="relative overflow-hidden px-4 sm:px-7 py-2 text-xs sm:text-sm font-bold rounded-2xl border-b-4 border-emerald-600 bg-white text-emerald-700 shadow-xl group transition-all duration-300 active:translate-y-1 hover:scale-105">
                  <span className="flex items-center gap-1.5 sm:gap-2 z-10 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>Login</span>
                  </span>
                </button>
              </Link>
            </div>
          </div>
          {/* Mobile Floating Expandable Navbar (Right) */}
          <div className="lg:hidden fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-[100]">
            {/* The Expandable Menu Items */}
            <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${
              isMobileMenuOpen 
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
                : "opacity-0 scale-75 translate-y-4 pointer-events-none"
            }`}>
              {[
                { id: 'beranda', icon: HomeIcon, label: 'Beranda' },
                { id: 'galeri', icon: Camera, label: 'Galeri Kegiatan' },
                { id: 'faq', icon: HelpCircle, label: 'Pertanyaan Umum' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    title={item.label}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      if (item.id === 'beranda') {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="p-3 rounded-full bg-white text-emerald-600 border-2 border-emerald-100 shadow-lg hover:bg-emerald-500 hover:text-white active:scale-90 transition-all duration-200 flex items-center justify-center"
                  >
                    <Icon className="h-5 w-5 stroke-[2.5px]" />
                  </Link>
                );
              })}
            </div>

            {/* Trigger Button (Burger / Close) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-3.5 rounded-full text-white shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/20 ${
                isMobileMenuOpen 
                  ? "bg-rose-500 hover:bg-rose-600 rotate-90" 
                  : "bg-emerald-600 hover:bg-emerald-500 rotate-0"
              }`}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 stroke-[2.5px]" />
              ) : (
                <Menu className="h-5 w-5 stroke-[2.5px]" />
              )}
            </button>
          </div>

          {/* Hero Content Area */}
          <div className="relative flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 items-center pt-4 sm:pt-8 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8">
            <div className="relative space-y-4 sm:space-y-6 z-10 w-full">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/20 border-2 border-white/30 text-white text-[10px] sm:text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transform -rotate-1 hover:rotate-0 transition-all">
                Official Website <span className="text-emerald-100 bg-emerald-600 px-1 rounded text-[10px] sm:text-sm">Irma</span>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-base font-bold text-white/80 tracking-wide">ROHIS DIGITAL SEKOLAH</p>
                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.15)]">
                  IRMA <span className="bg-linear-to-r from-emerald-200 via-white to-cyan-200 bg-clip-text text-transparent">VERSE</span>
                </h2>
              </div>

              <p className="text-xs sm:text-base text-white/90 font-medium leading-relaxed max-w-[65%] sm:max-w-lg drop-shadow-sm">
                Platform digital yang menghubungkan seluruh anggota IRMA dengan sistem terorganisir, modern, dan efisien untuk pembelajaran Islami yang lebih baik.
              </p>

              <div className="w-full max-w-md bg-white/20 rounded-2xl p-1.5 sm:p-2 border-2 border-white/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] backdrop-blur-sm">
                <SearchBar limitTypes={["news", "schedule"]} />
              </div>

              <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                <img src="/logo13.webp" alt="Logo" className="h-10 sm:h-12 w-auto object-contain drop-shadow-md" />
                <div>
                  <p className="text-[9px] sm:text-[10px] font-extrabold text-emerald-200 uppercase tracking-tight drop-shadow-sm">Aplikasi Dipelihara di</p>
                  <p className="text-sm sm:text-base font-bold text-white drop-shadow-sm">SMKN 13 Bandung</p>
                </div>
              </div>
            </div>

            {/* Gambar Model Khusus Mobile (Menempel di Kanan Judul) */}
            <div className="absolute right-[-1rem] sm:right-[-1.5rem] top-4 sm:top-8 flex lg:hidden justify-end pointer-events-none z-0">
              <div className="absolute inset-0 bg-emerald-400/20 blur-[50px] rounded-full pointer-events-none" />
              <img
                src="/model_1.webp"
                alt="Role model IRMA"
                className="relative h-60 sm:h-76 w-auto object-contain opacity-90"
                style={{ 
                  filter: "drop-shadow(3px 3px 0px #ffffff) drop-shadow(10px 10px 0px rgba(0,0,0,0.2))",
                  WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 95%)",
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 95%)"
                }} 
              />
            </div>

            {/* Gambar Model Desktop */}
            <div className="relative mt-8 lg:mt-0 hidden lg:flex justify-center lg:justify-end items-end z-10 lg:translate-x-8 xl:translate-x-14 2xl:translate-x-20">
               <div className="absolute inset-0 bg-emerald-400/25 blur-[90px] rounded-full pointer-events-none" />
               <img
                src="/model_1.webp"
                alt="Role model IRMA"
                className="relative lg:h-[620px] xl:h-[700px] 2xl:h-[760px] w-auto object-contain hover:scale-105 origin-bottom transition-transform duration-500"
                style={{ 
                  filter: "drop-shadow(6px 6px 0px #ffffff) drop-shadow(18px 18px 0px rgba(0,0,0,0.25))",
                  WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 95%)",
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 95%)"
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Icons Section - Cartoon Style */}
      <section id="fitur" className="py-14 sm:py-20 relative bg-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-emerald-50/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-14">

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2 sm:mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] relative z-10">Fitur Tersedia</h2>
            <p className="text-sm sm:text-lg text-slate-500 font-bold max-w-md mx-auto">Semua yang kamu butuhkan untuk aktivitas IRMA </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
            {features.map((feature, index) => {
              const hoverRotate = index % 2 === 0 ? "hover:-rotate-3" : "hover:rotate-3";
              return (
                <div
                  key={index}
                  className={`group cursor-pointer flex flex-col items-center bg-white rounded-2xl sm:rounded-3xl border-[3px] border-slate-100 hover:border-emerald-300 p-2.5 sm:p-4 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,0.25)] hover:-translate-y-2 ${hoverRotate}`}
                >
                  <div className="w-11 h-11 sm:w-16 sm:h-16 flex items-center justify-center mb-1.5 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500 stroke-[2px] drop-shadow-sm group-hover:text-emerald-600 transition-colors duration-300" />
                  </div>
                  <p className="text-[10px] sm:text-[13px] font-extrabold text-slate-700 text-center leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                    {feature.title}
                  </p>
                  <p className="hidden sm:block text-[10px] text-slate-400 font-semibold mt-1 leading-snug text-center line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* CARTOON GALLERY SECTION */}
      <section id="galeri" className="py-14 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20 md:mb-24">

            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-6 leading-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
               <span className="bg-linear-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}>Kegiatan</span> Kami
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-bold">
               Lihat kegiatan IRMA yang penuh warna dan bersemangat! 🎉
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Model 3 (Menunjuk ke Galeri) */}
            <div className="absolute -top-20 sm:-top-32 md:-top-44 right-1 sm:right-4 md:right-8 z-20 pointer-events-none flex items-end">
              <div className="absolute inset-0 bg-emerald-400/20 blur-[50px] rounded-full pointer-events-none" />
              <img
                src="/model_3.webp"
                alt="Role Model Galeri IRMA"
                className="relative h-28 xs:h-32 sm:h-48 md:h-60 lg:h-68 w-auto object-contain object-bottom hover:scale-105 origin-bottom transition-transform duration-500 pointer-events-auto"
                style={{
                  filter: "drop-shadow(4px 4px 0px #ffffff) drop-shadow(12px 12px 0px rgba(0,0,0,0.2))",
                  WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 95%)",
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 95%)"
                }}
              />
            </div>

            {/* Frame Kartun */}
            <div className="relative aspect-video md:aspect-21/9 rounded-3xl sm:rounded-4xl border-4 sm:border-8 border-white/40 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] bg-black/20 backdrop-blur-sm overflow-hidden transform hover:scale-[1.01] transition-transform duration-500 group">
              {/* Slides */}
              {galleryItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                >
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                  {/* TEXT OVERLAY */}
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent px-4 py-3 sm:p-6 md:p-10 text-white">
                    <h3 className="text-sm sm:text-2xl md:text-3xl font-extrabold mb-0.5 sm:mb-2 text-yellow-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] leading-tight">{item.title}</h3>
                    <p className="text-[10px] sm:text-sm md:text-lg text-white font-bold max-w-2xl drop-shadow-md line-clamp-1 sm:line-clamp-none">{item.description}</p>
                  </div>
                </div>
              ))}

              {/* Navigation Buttons */}
              <button onClick={prevSlide} className="absolute left-1.5 sm:left-4 top-1/2 -translate-y-1/2 bg-white text-emerald-700 p-2 sm:p-4 rounded-xl sm:rounded-2xl border-b-3 sm:border-b-4 border-emerald-800 shadow-lg hover:bg-gray-100 active:border-b-0 active:translate-y-1 transition-all z-10">
                <ChevronLeft className="h-4 w-4 sm:h-8 sm:w-8 stroke-[4px]" />
              </button>
              
              <button onClick={nextSlide} className="absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2 bg-white text-emerald-700 p-2 sm:p-4 rounded-xl sm:rounded-2xl border-b-3 sm:border-b-4 border-emerald-800 shadow-lg hover:bg-gray-100 active:border-b-0 active:translate-y-1 transition-all z-10">
                <ChevronRight className="h-4 w-4 sm:h-8 sm:w-8 stroke-[4px]" />
              </button>
            </div>

            {/* Decoration Dots */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-5 sm:mt-8">
              {galleryItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 sm:h-4 md:h-5 rounded-full transition-all duration-300 border-2 sm:border-[3px] border-white/40 shadow-sm ${
                    currentSlide === index ? "w-8 sm:w-10 md:w-12 bg-yellow-400 scale-110" : "w-3 sm:w-4 md:w-5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-400 rounded-full blur-xl opacity-60 animate-bounce hidden sm:block"></div>
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-cyan-400 rounded-full blur-2xl opacity-60 animate-pulse delay-700 hidden sm:block"></div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-14 sm:py-24 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-5 w-72 h-72 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 leading-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
               FAQ <span className="bg-linear-to-r from-yellow-200 via-emerald-100 to-cyan-200 bg-clip-text text-transparent" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}>Terkait</span>
            </h2>
            <p className="text-xs sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto font-bold leading-relaxed drop-shadow-sm">
              Semua hal yang sering kamu tanyakan seputar aktivitas dan penggunaan aplikasi IRMAVerse!
            </p>
          </div>

          {/* 2-Column Comic Grid: Left Questions, Right Model Showcase */}
          <div className="relative flex flex-col items-start lg:grid lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-8 lg:items-end">
            {/* Left Column: Comic Bubble Questions */}
            <div className="flex flex-col gap-1.5 xs:gap-2 sm:gap-2.5 lg:gap-3.5 w-[44%] xs:w-[45%] sm:w-[48%] max-w-[160px] xs:max-w-[175px] sm:max-w-[210px] lg:max-w-none lg:w-full z-10 relative items-start">
              {[
                {
                  q: "Apa itu IrmaVerse?",
                  a: "IrmaVerse adalah platform digital khusus untuk mendukung seluruh kegiatan, informasi, dan komunikasi anggota IRMA secara terorganisir dan modern.",
                  rotation: "-rotate-1 sm:-rotate-2 hover:rotate-0",
                  align: "self-start ml-0 mr-auto max-w-full lg:max-w-[480px]",
                  tail: "left-3 sm:left-4 -bottom-1",
                },
                {
                  q: "Bagaimana cara mengakses fitur di IRMAVerse?",
                  a: "Klik tombol 'Login', lalu masuk menggunakan akun yang telah didaftarkan. Anda dapat menikmati fitur Presensi, Event, hingga Jadwal Kajian secara mudah.",
                  rotation: "rotate-1 sm:rotate-2 hover:rotate-0",
                  align: "self-start ml-0.5 sm:ml-2 lg:self-end lg:ml-auto lg:mr-0 lg:translate-x-4 max-w-full lg:max-w-[470px]",
                  tail: "right-3 lg:right-6 -bottom-1",
                },
                {
                  q: "Apakah alumni bisa gabung ke IRMAVerse?",
                  a: "Saat ini fokus utama IRMAVerse adalah untuk anggota aktif. Namun, alumni dapat melihat galeri dan artikel seputar IRMA di bagian yang bersifat publik.",
                  rotation: "-rotate-0.5 sm:-rotate-1 hover:rotate-0",
                  align: "self-start ml-0 sm:ml-1 lg:-translate-x-2 max-w-full lg:max-w-[490px]",
                  tail: "left-4 sm:left-6 -bottom-1",
                },
                {
                  q: "Bagaimana jika ada kendala penggunaan?",
                  a: "Silakan kirimkan laporan Anda melalui form di bagian 'Kontak Kami' di bawah, tim kami akan segera membalas email Anda.",
                  rotation: "rotate-1 sm:rotate-1.5 hover:rotate-0",
                  align: "self-start ml-0.5 sm:ml-2 lg:self-end lg:ml-auto lg:mr-0 lg:translate-x-2 max-w-full lg:max-w-[460px]",
                  tail: "right-3 lg:right-5 -bottom-1",
                }
              ].map((faq, i) => (
                <div
                  key={i}
                  className={`group relative bg-white rounded-md sm:rounded-xl lg:rounded-2xl p-1.5 xs:p-2 sm:p-2.5 lg:p-3.5 border-[1.5px] sm:border-2 lg:border-[2.5px] border-emerald-500 shadow-[1.5px_1.5px_0px_0px_#065f46] hover:shadow-[3px_3px_0px_0px_#064e3b] hover:-translate-y-0.5 transition-all duration-300 w-full ${faq.rotation} ${faq.align}`}
                >
                  {/* Comic Speech Bubble Pointer Tail */}
                  <div className={`absolute ${faq.tail} w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-white border-b-[1.5px] sm:border-b-2 border-r-[1.5px] sm:border-r-2 border-emerald-500 rotate-45 z-10`} />

                  {/* Question Text in Comic Bubble */}
                  <h3 className="text-[8px] xs:text-[8.5px] sm:text-[10.5px] lg:text-[14px] font-black text-slate-800 leading-tight sm:leading-snug group-hover:text-emerald-700 transition-colors flex items-start gap-1 sm:gap-1.5">
                    <span className="text-emerald-600 font-black text-[8px] xs:text-[8.5px] sm:text-[10.5px] lg:text-sm shrink-0">Q:</span>
                    <span>{faq.q}</span>
                  </h3>

                  {/* Answer Bubble Box */}
                  <div className="mt-0.5 sm:mt-1 bg-emerald-50/90 rounded-xs xs:rounded-sm sm:rounded-lg lg:rounded-xl p-1 xs:p-1.5 sm:p-2 lg:p-2.5 border border-emerald-200/90 text-slate-700 shadow-inner">
                    <div className="flex items-start gap-1 sm:gap-1.5">
                      <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-600 text-white font-black text-[4.5px] xs:text-[5.5px] sm:text-[7px] shadow-xs">
                        A
                      </span>
                      <p className="text-[6.5px] xs:text-[7px] sm:text-[8.5px] lg:text-[11.5px] font-bold leading-tight sm:leading-relaxed text-slate-700">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Model 2 Showcase (On mobile: shifted further right; On desktop: in column 2) */}
            <div className="absolute right-[-3.5rem] xs:right-[-4.5rem] sm:right-[-3rem] bottom-0 lg:relative lg:right-auto lg:bottom-auto flex justify-end items-end pointer-events-none lg:pointer-events-auto z-0 lg:z-10 lg:translate-x-8 xl:translate-x-14 2xl:translate-x-20">
              {/* Radial ambient glow behind model */}
              <div className="absolute bottom-6 right-0 lg:right-6 w-52 sm:w-80 lg:w-96 h-52 sm:h-80 lg:h-96 bg-emerald-400/20 blur-[70px] rounded-full pointer-events-none" />
              <div className="absolute bottom-16 right-0 w-40 sm:w-64 lg:w-72 h-40 sm:h-64 lg:h-72 bg-yellow-300/15 blur-[60px] rounded-full pointer-events-none" />

              {/* Model 2 Cropped Image */}
              <div className="relative flex justify-center lg:justify-end items-end w-full">
                <img
                  src="/model_2.webp"
                  alt="Role Model FAQ IRMA"
                  className="relative h-[230px] xs:h-[255px] sm:h-[310px] lg:h-[620px] xl:h-[700px] 2xl:h-[760px] w-auto max-w-none lg:max-w-full object-contain object-bottom hover:scale-105 origin-bottom transition-transform duration-500 pointer-events-auto"
                  style={{
                    filter: "drop-shadow(4px 4px 0px #ffffff) drop-shadow(12px 12px 0px rgba(0,0,0,0.2))",
                    WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-600/40 via-teal-600/40 to-cyan-600/40" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-125 h-125 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 text-center">


          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-3 sm:mb-8 leading-tight drop-shadow-lg">
            Siap Memulai Perjalanan <br className="hidden sm:block" />
            <span className="relative inline-block mt-1 sm:mt-2 transform -rotate-1">
              <span className="relative z-10">Pembelajaran Islami?</span>
              <div className="absolute bottom-0.5 sm:bottom-1 left-0 w-full h-2.5 sm:h-4 bg-emerald-500/50 rounded-full z-0" />
            </span>
          </h2>

          <p className="text-sm sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-bold drop-shadow-md">
            Daftar sekarang dan dapatkan akses ke semua fitur untuk pengalaman yang lebih terorganisir, modern, dan menyenangkan
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-4">
            <Link href="/auth?mode=signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 text-sm sm:text-lg group font-extrabold bg-white text-emerald-800 rounded-2xl border-b-6 sm:border-b-8 border-emerald-900 active:border-b-0 active:translate-y-2 transition-all duration-150 flex items-center justify-center gap-2 sm:gap-3 hover:brightness-105 shadow-2xl">
                <span>Daftar Sekarang!</span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 stroke-[3px] group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          <div className="mt-8 sm:mt-16 flex flex-wrap justify-center items-center gap-3 sm:gap-8 text-white/90 font-bold">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 border-white/10">
              <Shield className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.5px]" />
              <span className="text-xs sm:text-base">100% Data Aman</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 border-white/10">
              <Users className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.5px]" />
              <span className="text-xs sm:text-base">{stats.totalMembers} Anggota Aktif</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 border-white/10">
              <Contact className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.5px]" />
              <span className="text-xs sm:text-base">{stats.totalInstructors} Instruktur</span>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[calc(100%+1.3px)] h-[50px] sm:h-[80px] block relative z-10">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-4 sm:pt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-16 mb-12">
            <div className="flex-1 flex flex-col gap-4 min-w-[280px]">
              <div className="flex items-center mb-4 hover:scale-105 transition-transform duration-300 w-fit">
                <img src="/logo.webp" alt="IRMA Verse" className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-sm" />
              </div>
              <p className="text-slate-600 leading-relaxed text-sm max-w-sm font-medium">
                Menghubungkan anggota IRMA dengan teknologi modern untuk pengalaman pembelajaran Islami yang lebih baik dan interaktif.
              </p>
              <div className="flex gap-4 mt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener" className="text-slate-400 hover:text-emerald-500 hover:-translate-y-1 transition-all duration-300"><Facebook className="h-5 w-5 stroke-[2px]" /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener" className="text-slate-400 hover:text-emerald-500 hover:-translate-y-1 transition-all duration-300"><Instagram className="h-5 w-5 stroke-[2px]" /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener" className="text-slate-400 hover:text-emerald-500 hover:-translate-y-1 transition-all duration-300"><Youtube className="h-5 w-5 stroke-[2px]" /></a>
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-bold text-slate-800 text-lg mb-4 sm:mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Halaman utama', id: 'beranda', icon: HomeIcon },
                  { name: 'Galeri Kegiatan', id: 'galeri', icon: Camera },
                  { name: 'Pertanyaan Umum', id: 'faq', icon: HelpCircle },
                ].map((link, i) => {
                  const Icon = link.icon;
                  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (link.id === 'beranda') {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      const element = document.getElementById(link.id);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  };
                  return (
                    <li key={i}>
                      <Link 
                        href={`#${link.id}`} 
                        onClick={handleClick}
                        className="text-slate-600 hover:text-emerald-600 font-medium transition-all duration-300 text-sm flex items-center gap-3 group hover:translate-x-1"
                      >
                        <Icon className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" strokeWidth={2} />
                        <span>{link.name}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-bold text-slate-800 text-lg mb-4 sm:mb-6">Contact Us</h3>
              <div className="space-y-3 text-sm text-slate-600 font-medium">
                <p className="leading-relaxed">Masjid Al-hikmah, Jl. Soekarno-Hatta KM. 10, Jatisari, Kecamatan Buahbatu, Kota Bandung, Jawa Barat 40286</p>
                <p className="flex items-center gap-2">
                  <span className="text-emerald-500 font-semibold">Email:</span> 1CtJ3@example.com
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-emerald-500 font-semibold">Telepon:</span> 0812-3456-7890
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-center sm:text-left text-slate-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} <span className="text-emerald-600 font-bold">IRMAVerse</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}