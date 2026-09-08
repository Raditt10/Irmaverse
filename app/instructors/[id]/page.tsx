"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

import Loading from "@/components/ui/Loading";
import BackButton from "@/components/ui/BackButton";
import SafeImage from "@/components/ui/SafeImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Mail,
  Calendar,
  BookOpen,
  Star,
  Activity,
  Users,
  MessageCircle,
  BookMarked,
  GraduationCap,
  Shield,
  Clock
} from "lucide-react";

interface InstructorProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  role: string;
  bidangKeahlian: string | null;
  pengalaman: string | null;
  createdAt: string;
  lastSeen: string;
}

interface Material {
  id: string;
  title: string;
  description: string | null;
  date: string;
  thumbnailUrl: string | null;
  category: string;
  grade: string;
  isTuntas: boolean;
  totalInvited: number;
  totalAttended: number;
}

interface InstructorStats {
  kajianCount: number;
  completedKajianCount: number;
  totalParticipants: number;
  averageRating: number;
}

const InstructorDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const instructorId = params?.id as string;

  const [instructor, setInstructor] = useState<InstructorProfile | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (instructorId) {
      fetchInstructorDetail();
    }
  }, [instructorId]);

  const fetchInstructorDetail = async () => {
    try {
      const res = await fetch(`/api/instructors/${instructorId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInstructor(data.instructor);
      setMaterials(data.materials);
      setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isOnline = (ls: string) => Date.now() - new Date(ls).getTime() < 300000;
  
  const formatLastSeen = (ls: string) => {
    const m = Math.floor((Date.now() - new Date(ls).getTime()) / 60000);
    if (m < 5) return "Online";
    if (m < 60) return `${m} menit yang lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam yang lalu`;
    return `${Math.floor(h / 24)} hari yang lalu`;
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loading text="Memuat profil instruktur..." size="lg" />
      </div>
    );

  if (!instructor)
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-12 w-12 text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-slate-700 mb-2">
                Instruktur Tidak Ditemukan
              </h2>
              <p className="text-slate-500 mb-6">
                Profil instruktur yang kamu cari tidak tersedia.
              </p>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  const online = isOnline(instructor.lastSeen);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <DashboardHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {/* LEFT: Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-[0_4px_0_0_#cbd5e1] overflow-hidden sticky top-20 p-5 sm:p-6">
                <div className="flex justify-end mb-1">
                  <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                    <span
                      className={`h-2 w-2 rounded-full ${online ? "bg-emerald-400 animate-pulse" : "bg-slate-300"}`}
                    />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                      {formatLastSeen(instructor.lastSeen)}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={instructor.avatar || undefined}
                        alt={instructor.name || "Instructor"}
                      />
                      <AvatarFallback className="bg-emerald-500 text-white font-black text-2xl">
                        {(instructor.name?.trim().charAt(0) || "I").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="text-center mb-4">
                    <h1 className="text-xl font-black text-slate-800 mb-1">
                      {instructor.name}
                    </h1>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                      <GraduationCap className="h-3 w-3" />
                      Instruktur
                    </div>
                    {instructor.bidangKeahlian && (
                      <p className="text-[11px] text-slate-400 font-black mt-1.5 uppercase tracking-widest">
                        {instructor.bidangKeahlian}
                      </p>
                    )}
                  </div>
                  
                  {instructor.bio && (
                    <div className="bg-slate-50/70 rounded-xl p-3 mb-4 border border-slate-100 italic">
                      <p className="text-xs text-slate-600 text-center leading-relaxed">
                        "{instructor.bio}"
                      </p>
                    </div>
                  )}

                  {instructor.pengalaman && (
                    <div className="mb-4">
                       <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Pengalaman</h4>
                       <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white border-l-4 border-emerald-500 pl-2.5 py-1">
                        {instructor.pengalaman}
                       </p>
                    </div>
                  )}

                  <div className="space-y-2.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 text-emerald-600">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Email</span>
                         <span className="text-slate-600 font-bold truncate text-xs">{instructor.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 text-emerald-600">
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Bergabung</span>
                         <span className="text-slate-600 font-bold text-xs">
                          {new Date(instructor.createdAt).toLocaleDateString(
                            "id-ID",
                            { year: "numeric", month: "long", day: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {session?.user?.role?.toLowerCase() !== "instruktur" && session?.user?.id !== instructor.id && (
                    <div className="mt-5">
                       <button 
                          onClick={() => router.push(`/instructors/chat?instructorId=${instructor.id}`)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-50 text-teal-600 font-black rounded-xl border-2 border-teal-100 hover:bg-teal-100 hover:border-teal-200 active:scale-95 transition-all text-xs uppercase tracking-wide"
                       >
                          <MessageCircle className="h-4 w-4" />
                          Kirim Pesan
                        </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Stats & Materials */}
            <div className="lg:col-span-2 space-y-5">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
                    val: stats?.completedKajianCount || 0,
                    lbl: "Kajian Yang Selesai",
                    bg: "bg-emerald-50/70",
                    bdr: "border-emerald-100",
                    hv: "hover:border-emerald-300 hover:shadow-[0_4px_0_0_#10b981]",
                  },
                  {
                    icon: <Star className="h-5 w-5 text-emerald-500" fill="currentColor" />,
                    val: stats?.averageRating || 0,
                    lbl: "Rata-Rata Rating",
                    bg: "bg-emerald-50/70",
                    bdr: "border-emerald-100",
                    hv: "hover:border-emerald-300 hover:shadow-[0_4px_0_0_#10b981]",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl ${s.bg} border-2 ${s.bdr} transition-all duration-300 ${s.hv} group cursor-default`}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-xs border border-emerald-100 shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-800 group-hover:text-slate-900 leading-none mb-1">
                        {s.val}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {s.lbl}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Materials Section */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-[0_4px_0_0_#cbd5e1]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border-2 border-emerald-100">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-800 leading-none mb-0.5">
                        Daftar Kajian
                      </h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                         Kajian oleh {instructor.name?.split(" ")[0]}
                      </p>
                    </div>
                  </div>
                </div>

                {materials.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-xs border border-slate-100">
                      <BookOpen className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold text-xs mb-0.5">
                      Belum ada kajian yang diselesaikan
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                       Ikuti kajian dan selesaikan untuk melihat rekapan di sini
                    </p>
                  </div>
                ) : (() => {
                  const tuntasMaterials = materials
                    .filter((m) => m.isTuntas)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                  const shown = tuntasMaterials.slice(0, 3);

                  if (tuntasMaterials.length === 0) return (
                    <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-xs border border-slate-100">
                        <BookOpen className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-bold text-xs mb-0.5">
                        Belum ada kajian yang diselesaikan
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium text-center px-4">
                        Ikuti kajian dan selesaikan untuk melihat rekapan di sini
                      </p>
                    </div>
                  );

                  return (
                    <>
                      <div className="space-y-3">
                        {shown.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => router.push(`/materials/${m.id}`)}
                            className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all group cursor-pointer"
                          >
                            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-xs group-hover:scale-105 transition-transform bg-slate-100">
                               <SafeImage 
                                 src={m.thumbnailUrl} 
                                 alt={m.title} 
                                 fallbackType="thumbnail"
                                 contentType="kajian"
                                 fallbackName={m.title}
                                 className="w-full h-full object-cover"
                               />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1 text-[9px] font-black uppercase tracking-wider">
                                 <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
                                    {m.category}
                                 </span>
                                 <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                                    Kelas {m.grade}
                                 </span>
                              </div>
                              <h4 className="font-black text-slate-800 text-sm sm:text-base truncate mb-1 group-hover:text-emerald-600 transition-colors">
                                {m.title}
                              </h4>
                              <div className="flex items-center gap-3 text-slate-400">
                                 <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[10px] font-bold">
                                       {formatDate(m.date)}
                                    </span>
                                 </div>
                              </div>
                            </div>
                            <div className="hidden sm:flex flex-col items-end shrink-0">
                               <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-xs group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                  <ArrowLeft className="h-4 w-4 rotate-180" />
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {tuntasMaterials.length > 3 && (
                        <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mt-4">
                          Menampilkan 3 dari {tuntasMaterials.length} kajian tuntas terbaru
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
};

export default InstructorDetail;
