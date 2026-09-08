"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

import Toast from "@/components/ui/Toast";
import CartoonConfirmDialog from "@/components/ui/ConfirmDialog"; // Import Confirm Dialog
import Loading from "@/components/ui/Loading";
import SafeImage from "@/components/ui/SafeImage";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Target,
  MessageCircle,
  ListChecks,
  BarChart3,
  ChevronRight,
  Circle,
  Users,
  GraduationCap,
  Edit,
  Trash2,
  Share2,
  Lock,
  Search,
  UserPlus,
  UserMinus,
  UserCheck,
  ShieldCheck,
  X,
} from "lucide-react";

interface MaterialItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startedAt: string | null;
  instructor: string;
  thumbnailUrl: string | null;
  order: number;
  isCompleted: boolean;
  attendanceStatus: string | null;
  inviteStatus: string | null;
  enrollmentCount: number;
}

interface Program {
  id: string;
  title: string;
  description: string | null;
  duration: string;
  level: string;
  category: string;
  image?: string;
  instructor: {
    id: string;
    name: string;
    avatar: string | null;
    email: string | null;
  };
  syllabus: string[];
  requirements: string[];
  benefits: string[];
  materials: MaterialItem[];
  enrollmentCount: number;
  totalKajian: number;
  isEnrolled: boolean;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  stageOrder: number | null;
  totalStages: number;
  isLocked: boolean;
  prerequisiteProgram: { id: string; title: string } | null;
  enrolledMembers?: {
    enrollmentId: string;
    userId: string;
    enrolledAt: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  }[];
}

const ProgramDetail = () => {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Member Management States
  const [memberSearch, setMemberSearch] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [userOptions, setUserOptions] = useState<
    { id: string; name: string; email: string; avatar: string | null }[]
  >([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [addUserSearch, setAddUserSearch] = useState("");
  const [enrollingMemberId, setEnrollingMemberId] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<{
    userId: string;
    name: string;
  } | null>(null);
  const [removingMember, setRemovingMember] = useState(false);

  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;
  const { data: session } = useSession({ required: false });

  const isPrivileged =
    session?.user?.role === "instruktur" || session?.user?.role === "admin" || session?.user?.role === "super_admin";

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    if (programId) fetchProgramDetail();
  }, [programId]);

  // Real-time avatar update listener
  useEffect(() => {
    const handleAvatarUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.userId && detail?.avatarUrl) {
        setProgram((prev) => {
          if (!prev) return prev;
          const updatedEnrolled = prev.enrolledMembers?.map((m) =>
            m.userId === detail.userId ? { ...m, avatar: detail.avatarUrl } : m,
          );
          const updatedInstructor =
            prev.instructor?.id === detail.userId
              ? { ...prev.instructor, avatar: detail.avatarUrl }
              : prev.instructor;
          return {
            ...prev,
            instructor: updatedInstructor,
            enrolledMembers: updatedEnrolled,
          };
        });
      }
    };
    window.addEventListener("user-avatar-updated", handleAvatarUpdate);
    return () =>
      window.removeEventListener("user-avatar-updated", handleAvatarUpdate);
  }, []);

  const fetchProgramDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/programs/${programId}`);
      if (!res.ok) throw new Error("Gagal mengambil data Program");
      const data = await res.json();
      setProgram(data);
    } catch (error) {
      console.error("Error loading program:", error);
      setProgram(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available users for enrollment modal
  const fetchAvailableUsers = async (query = "") => {
    try {
      setSearchingUsers(true);
      const url = query
        ? `/api/users?search=${encodeURIComponent(query)}&limit=50`
        : `/api/users?limit=50`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil data pengguna");
      const data = await res.json();
      setUserOptions(data);
    } catch (err) {
      console.error("Error fetching users for enrollment:", err);
    } finally {
      setSearchingUsers(false);
    }
  };

  const handleOpenAddMemberModal = () => {
    setShowAddMemberModal(true);
    setAddUserSearch("");
    fetchAvailableUsers();
  };

  const handleAddMember = async (userId: string) => {
    try {
      setEnrollingMemberId(userId);
      const res = await fetch(`/api/programs/${programId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menambahkan anggota");
      }
      showToast(data.message || "Anggota berhasil didaftarkan", "success");
      fetchProgramDetail();
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setEnrollingMemberId(null);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      setRemovingMember(true);
      const res = await fetch(
        `/api/programs/${programId}/enroll?userId=${encodeURIComponent(memberToRemove.userId)}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengeluarkan anggota");
      }
      showToast(data.message || "Anggota berhasil dikeluarkan", "success");
      fetchProgramDetail();
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setRemovingMember(false);
      setMemberToRemove(null);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const res = await fetch(`/api/programs/${programId}/enroll`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Gagal mendaftar");
      showToast("Berhasil mendaftar di Program Kurikulum!", "success");
      fetchProgramDetail();
    } catch (error: any) {
      showToast(error.message || "Gagal mendaftar", "error");
    } finally {
      setEnrolling(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/programs/${programId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal menghapus Program");
      }

      showToast("Program berhasil dihapus", "success");
      setTimeout(() => router.push("/programs"), 1500);
    } catch (error: any) {
      console.error("Delete Error:", error);
      showToast(error.message || "Terjadi kesalahan saat menghapus", "error");
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: program?.title || "Program Kurikulum IRMA",
        text: `Ikuti program kurikulum "${program?.title}" di IRMA!`,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Error sharing:", err);
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast("Tautan disalin ke clipboard!", "success");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardHeader />
        <div className="flex w-full">
          <Sidebar />
          <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
            <Loading text="Sedang memuat detail Program Kurikulum..." size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300 mb-6">
              <Target className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-700 mb-2">
              Program Tidak Ditemukan
            </h2>
            <button
              onClick={() => router.push("/programs")}
              className="mt-4 px-6 py-3 rounded-xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-0.5 transition-all"
            >
              Kembali ke Daftar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressColor =
    program.progress.percentage === 100
      ? "bg-emerald-500"
      : program.progress.percentage > 50
        ? "bg-teal-500"
        : program.progress.percentage > 0
          ? "bg-amber-400"
          : "bg-slate-200";

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full max-w-[100vw] overflow-x-hidden">
          <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              {/* Back */}
              <button
                onClick={() => router.push("/programs")}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-all group px-4 py-2 rounded-xl border-2 border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform stroke-3" />
                Kembali
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {isPrivileged && (
                  <>
                    <button
                      onClick={() => router.push(`/programs/${program.id}/edit`)}
                      className="w-[46px] h-[46px] rounded-[14px] bg-[#00c689] text-white border-2 border-[#00a874] border-b-4 hover:bg-[#00d08f] hover:border-b-2 hover:translate-y-0.5 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center p-0"
                      title="Edit Program"
                    >
                      <Edit className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(true)}
                      className="w-[46px] h-[46px] rounded-[14px] bg-[#ff3366] text-white border-2 border-[#e62050] border-b-4 hover:bg-[#ff4775] hover:border-b-2 hover:translate-y-0.5 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center p-0"
                      title="Hapus Program"
                    >
                      <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                  </>
                )}
                <button
                  onClick={handleShare}
                  className="w-[46px] h-[46px] rounded-[14px] bg-white text-slate-500 border-2 border-slate-200 border-b-4 hover:text-teal-500 hover:border-teal-300 hover:bg-teal-50 hover:border-b-2 hover:translate-y-0.5 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center p-0"
                  title="Bagikan"
                >
                  <Share2 className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* HERO */}
            <div className="relative bg-white rounded-4xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_8px_0_0_#cbd5e1] overflow-hidden group">
              <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden border-b-2 border-slate-200 bg-slate-900">
                <SafeImage
                  src={program.image}
                  alt={program.title}
                  fallbackType="thumbnail"
                  contentType="program"
                  fallbackName={program.title}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                    program.isLocked ? "blur-sm opacity-80" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent pointer-events-none" />

                {program.isLocked && (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-[85%] lg:-translate-y-[65%] flex flex-col items-center justify-center z-10 pointer-events-none px-4">
                    <div className="flex flex-col items-center gap-2 lg:gap-3">
                      <div className="p-3.5 lg:p-6 bg-white/95 rounded-3xl lg:rounded-4xl border-2 border-white shadow-2xl backdrop-blur-md">
                        <Lock className="h-5 w-5 lg:h-10 lg:w-10 text-slate-600" strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] sm:text-sm lg:text-base font-black text-white bg-slate-900/60 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg uppercase tracking-wider text-center max-w-full sm:max-w-md lg:max-w-[80%] wrap-break-word font-sans">
                        {program.prerequisiteProgram 
                          ? `Program ini tidak dapat kamu akses, selesaikan program "${program.prerequisiteProgram.title}" sebelumnya.`
                          : "Program Terkunci"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-3 lg:mb-4">
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black bg-white/90 text-slate-800 border-2 border-white uppercase tracking-wide backdrop-blur-sm">
                      {program.category}
                    </span>
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black bg-white/90 text-slate-800 border-2 border-white uppercase tracking-wide backdrop-blur-sm">
                      {program.level}
                    </span>
                    {program.stageOrder && (
                      <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black bg-emerald-500 text-white border-2 border-emerald-400 uppercase tracking-wide backdrop-blur-sm flex items-center gap-1 sm:gap-1.5">
                        Tahap {program.stageOrder}{program.totalStages > 0 ? ` / ${program.totalStages}` : ""}
                      </span>
                    )}
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black bg-teal-500/90 text-white border-2 border-teal-400 uppercase tracking-wide backdrop-blur-sm flex items-center gap-1 sm:gap-1.5">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />
                      {program.duration}
                    </span>
                    {program.isLocked && (
                      <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black bg-amber-500 text-white border-2 border-amber-400 uppercase tracking-wide backdrop-blur-sm flex items-center gap-1 sm:gap-1.5">
                        <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />
                        Terkunci
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 drop-shadow-md leading-tight wrap-break-word">
                    {program.title}
                  </h1>
                  <p className="text-slate-200 text-sm md:text-lg font-medium max-w-3xl line-clamp-2 leading-relaxed wrap-break-word">
                    {program.description}
                  </p>
                </div>
              </div>
            </div>

            {/* PROGRESS BAR (for enrolled users) */}
            {program.isEnrolled && (
              <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 bg-emerald-100 rounded-2xl border-2 border-emerald-200">
                    <BarChart3
                      className="h-6 w-6 text-emerald-600"
                      strokeWidth={3}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-slate-800">
                      Perkembanganmu di Program ini
                    </h2>
                    <p className="text-sm text-slate-500 font-bold">
                      {program.progress.completed} dari {program.progress.total}{" "}
                      materi selesai
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-slate-800">
                      {program.progress.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${progressColor} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${program.progress.percentage}%` }}
                  />
                </div>
                {program.progress.percentage === 100 && (
                  <div className="mt-4 flex items-center gap-2 text-emerald-600 font-black">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Selamat! Program ini telah selesai!</span>
                  </div>
                )}
              </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Materials List */}
                <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl sm:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-2xl border-2 border-emerald-200 shrink-0">
                        <BookOpen
                          className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600"
                          strokeWidth={3}
                        />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800 tracking-tight leading-tight">
                          Daftar Kajian
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-bold italic mt-0.5">
                          {program.materials.length} {program.totalKajian > 0 ? `/ ${program.totalKajian}` : ""} kajian dalam Program ini
                        </p>
                      </div>
                    </div>

                    {isPrivileged && (
                      <button
                        onClick={() =>
                          router.push(
                            `/materials/create?programId=${program.id}`,
                          )
                        }
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 text-white font-black text-xs sm:text-sm rounded-2xl border-2 border-teal-600 shadow-[0_3px_0_0_#0f766e] hover:bg-teal-600 active:translate-y-0.5 active:shadow-none transition-all shrink-0 whitespace-nowrap"
                      >
                        <ListChecks className="h-4 w-4 shrink-0" />
                        Buat Kajian Baru
                      </button>
                    )}
                  </div>

                  {program.materials.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 px-4 border-2 border-dashed border-slate-100 rounded-3xl sm:rounded-4xl bg-slate-50/30">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-100 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                        <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-slate-300" />
                      </div>
                      <h4 className="text-slate-600 font-black text-base sm:text-lg mb-1">
                        Belum ada Kajian
                      </h4>
                      <p className="text-slate-400 text-xs sm:text-sm font-bold max-w-sm mx-auto leading-relaxed">
                        Instruktur belum menambahkan Kajian ke Program Kurikulum ini.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-[500px] md:max-h-[650px] overflow-y-auto overscroll-contain pr-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-teal-200 transition-all duration-300">
                      {(() => {
                        if (program.totalKajian > 0) {
                          return Array.from({ length: program.totalKajian }, (_, i) => i + 1).map((num) => {
                            const materialForThisSlot = program.materials.find(m => m.order === num);

                            if (materialForThisSlot) {
                              return (
                                <div
                                  key={materialForThisSlot.id}
                                  onClick={() => {
                                    if (!isPrivileged && materialForThisSlot.inviteStatus === "rejected") {
                                      showToast("Kamu tidak tergabung dalam kajian ini, kamu menolak kajian", "error");
                                    } else {
                                      router.push(`/materials/${materialForThisSlot.id}`);
                                    }
                                  }}
                                  className={`flex gap-4 md:gap-6 p-5 md:p-6 rounded-4xl border-2 transition-all group cursor-pointer ${
                                    materialForThisSlot.isCompleted
                                      ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-300"
                                      : "bg-slate-50 border-slate-100 hover:border-teal-200 hover:bg-teal-50/30"
                                  }`}
                                >
                                  {/* Step number / check */}
                                  <div className="flex flex-col items-center gap-2">
                                    <div
                                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm transition-colors ${
                                        materialForThisSlot.isCompleted
                                          ? "bg-emerald-500 text-white border-2 border-emerald-600"
                                          : "bg-white border-2 border-slate-200 text-teal-600 group-hover:border-teal-300"
                                      }`}
                                    >
                                      {materialForThisSlot.isCompleted ? (
                                        <CheckCircle2 className="h-6 w-6" />
                                      ) : (
                                        <span>{num}</span>
                                      )}
                                    </div>
                                    {num < program.totalKajian && (
                                      <div
                                        className={`w-0.5 flex-1 rounded-full min-h-[20px] ${
                                          materialForThisSlot.isCompleted
                                            ? "bg-emerald-300"
                                            : "bg-slate-200"
                                        }`}
                                      />
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 space-y-2 py-1">
                                    <div className="flex items-start justify-between gap-3">
                                      <h4
                                        className={`font-black text-lg md:text-xl leading-tight transition-colors ${
                                          materialForThisSlot.isCompleted
                                            ? "text-emerald-700"
                                            : "text-slate-800 group-hover:text-teal-700"
                                        }`}
                                      >
                                        {materialForThisSlot.title}
                                      </h4>
                                      <ChevronRight className="h-5 w-5 text-slate-300 shrink-0 mt-1 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                                    </div>

                                    {materialForThisSlot.description && (
                                      <p className="text-slate-500 font-bold text-sm leading-relaxed line-clamp-2">
                                        {materialForThisSlot.description}
                                      </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-400 pt-1">
                                      <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-teal-400" />
                                        <span>
                                          {new Date(materialForThisSlot.date).toLocaleDateString(
                                            "id-ID",
                                            {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                            },
                                          )}
                                        </span>
                                      </div>
                                      {materialForThisSlot.startedAt && (
                                        <div className="flex items-center gap-1.5">
                                          <Clock className="h-3.5 w-3.5 text-emerald-400" />
                                          <span>{materialForThisSlot.startedAt} WIB</span>
                                        </div>
                                      )}
                                      {materialForThisSlot.isCompleted && (
                                        <span className="text-emerald-600 font-black">
                                          ✓ Selesai
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // Render Kajian Kosong (Belum dibuat)
                            return (
                              <div
                                key={`empty-${num}`}
                                className="flex gap-4 md:gap-6 p-5 md:p-6 rounded-4xl border-2 border-dashed border-slate-200 bg-white/50 opacity-70 transition-all"
                              >
                                {/* Step number */}
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-none bg-slate-50 border-2 border-slate-200 text-slate-400">
                                    <span>{num}</span>
                                  </div>
                                  {num < program.totalKajian && (
                                    <div className="w-0.5 flex-1 rounded-full min-h-[20px] bg-slate-100" />
                                  )}
                                </div>

                                {/* Empty Content */}
                                <div className="flex-1 space-y-2 py-1 flex flex-col justify-center">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-black text-lg md:text-xl leading-tight text-slate-400 italic">
                                      Kajian Ke-{num} Belum Tersedia
                                    </h4>
                                    {isPrivileged && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          router.push(`/materials/create?programId=${program.id}&kajianOrder=${num}`);
                                        }}
                                        className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors"
                                      >
                                        Buat Sekarang
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-slate-400 font-bold text-sm leading-relaxed">
                                    Materi untuk sesi ini belum dijadwalkan oleh instruktur.
                                  </p>
                                </div>
                              </div>
                            );
                          });
                        }

                        // Fallback: Jika totalKajian tidak ada atau 0, gunakan mapping normal lama
                        return program.materials.map((material, idx) => (
                          <div
                            key={material.id}
                            onClick={() => {
                              if (!isPrivileged && material.inviteStatus === "rejected") {
                                showToast("Kamu tidak tergabung dalam kajian ini, kamu menolak kajian", "error");
                              } else {
                                router.push(`/materials/${material.id}`);
                              }
                            }}
                            className={`flex gap-4 md:gap-6 p-5 md:p-6 rounded-4xl border-2 transition-all group cursor-pointer ${
                              material.isCompleted
                                ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-300"
                                : "bg-slate-50 border-slate-100 hover:border-teal-200 hover:bg-teal-50/30"
                            }`}
                          >
                            {/* Step number / check */}
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm transition-colors ${
                                  material.isCompleted
                                    ? "bg-emerald-500 text-white border-2 border-emerald-600"
                                    : "bg-white border-2 border-slate-200 text-teal-600 group-hover:border-teal-300"
                                }`}
                              >
                                {material.isCompleted ? (
                                  <CheckCircle2 className="h-6 w-6" />
                                ) : (
                                  <span>{material.order}</span>
                                )}
                              </div>
                              {idx < program.materials.length - 1 && (
                                <div
                                  className={`w-0.5 flex-1 rounded-full min-h-[20px] ${
                                    material.isCompleted
                                      ? "bg-emerald-300"
                                      : "bg-slate-200"
                                  }`}
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2 py-1">
                              <div className="flex items-start justify-between gap-3">
                                <h4
                                  className={`font-black text-lg md:text-xl leading-tight transition-colors ${
                                    material.isCompleted
                                      ? "text-emerald-700"
                                      : "text-slate-800 group-hover:text-teal-700"
                                  }`}
                                >
                                  {material.title}
                                </h4>
                                <ChevronRight className="h-5 w-5 text-slate-300 shrink-0 mt-1 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                              </div>

                              {material.description && (
                                <p className="text-slate-500 font-bold text-sm leading-relaxed line-clamp-2">
                                  {material.description}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-400 pt-1">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-teal-400" />
                                  <span>
                                    {new Date(material.date).toLocaleDateString(
                                      "id-ID",
                                      {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      },
                                    )}
                                  </span>
                                </div>
                                {material.startedAt && (
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>{material.startedAt} WIB</span>
                                  </div>
                                )}
                                {material.isCompleted && (
                                  <span className="text-emerald-600 font-black">
                                    ✓ Selesai
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {/* Enrolled Members Management Section (Privileged Users) */}
                {isPrivileged && (
                  <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1] space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b-2 border-slate-100">
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 bg-emerald-100 rounded-2xl border-2 border-emerald-200 text-emerald-600">
                          <Users className="h-6 w-6" strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-slate-800">
                              Anggota Terdaftar
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
                              {program.enrolledMembers?.length || 0}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-400 mt-0.5">
                            Kelola pengguna yang mengikuti program kurikulum ini
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleOpenAddMemberModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 text-white font-black text-xs sm:text-sm border-2 border-teal-700 border-b-4 hover:bg-teal-600 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
                      >
                        <UserPlus className="h-4 w-4 stroke-[2.5]" />
                        <span>Tambah Anggota</span>
                      </button>
                    </div>

                    {/* Search Bar for Members */}
                    {(program.enrolledMembers?.length || 0) > 0 && (
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          placeholder="Cari nama atau email anggota terdaftar..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-xs sm:text-sm font-bold placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all"
                        />
                        {memberSearch && (
                          <button
                            onClick={() => setMemberSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Member List */}
                    {(() => {
                      const allMembers = program.enrolledMembers || [];
                      const filteredMembers = allMembers.filter((m) => {
                        if (!memberSearch.trim()) return true;
                        const query = memberSearch.toLowerCase();
                        return (
                          m.name.toLowerCase().includes(query) ||
                          m.email.toLowerCase().includes(query)
                        );
                      });

                      if (allMembers.length === 0) {
                        return (
                          <div className="p-8 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-400">
                              <Users className="h-7 w-7" />
                            </div>
                            <h4 className="text-base font-black text-slate-700 mb-1">
                              Belum Ada Anggota Terdaftar
                            </h4>
                            <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto mb-4">
                              Program ini belum memiliki anggota. Daftarkan anggota secara manual atau bagikan tautan program.
                            </p>
                            <button
                              onClick={handleOpenAddMemberModal}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-white font-black text-xs border-2 border-teal-700 hover:bg-teal-600 transition-all cursor-pointer shadow-sm"
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                              Tambah Anggota Pertama
                            </button>
                          </div>
                        );
                      }

                      if (filteredMembers.length === 0) {
                        return (
                          <div className="p-6 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30">
                            <p className="text-xs font-bold text-slate-400">
                              Tidak ada anggota yang cocok dengan pencarian "{memberSearch}"
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {filteredMembers.map((member) => (
                            <div
                              key={member.userId}
                              className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-teal-200 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Avatar */}
                                <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-slate-200 bg-emerald-50 shrink-0 flex items-center justify-center">
                                  {member.avatar ? (
                                    <SafeImage
                                      src={member.avatar}
                                      alt={member.name}
                                      width={44}
                                      height={44}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-black text-base">
                                      {member.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>

                                {/* Info */}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h5 className="font-black text-sm text-slate-800 truncate">
                                      {member.name}
                                    </h5>
                                    {member.role === "instruktur" && (
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-100 text-amber-700">
                                        Instruktur
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-400 truncate">
                                    {member.email}
                                  </p>
                                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                                    <Clock className="h-3 w-3 text-teal-500" />
                                    <span>
                                      Terdaftar:{" "}
                                      {new Date(member.enrolledAt).toLocaleDateString(
                                        "id-ID",
                                        {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        },
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Remove */}
                              <button
                                onClick={() =>
                                  setMemberToRemove({
                                    userId: member.userId,
                                    name: member.name,
                                  })
                                }
                                title="Keluarkan Anggota"
                                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors shrink-0 ml-2 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Syllabus */}
                {program.syllabus.length > 0 && (
                  <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1]">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-2.5 bg-emerald-100 rounded-2xl border-2 border-emerald-200">
                        <ListChecks
                          className="h-6 w-6 text-emerald-600"
                          strokeWidth={3}
                        />
                      </div>
                      <h2 className="text-xl lg:text-2xl font-black text-slate-800">
                        Silabus
                      </h2>
                    </div>
                    <ul className="space-y-3">
                      {program.syllabus.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors group"
                        >
                          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border-2 border-slate-200 text-slate-500 font-black text-sm shrink-0 group-hover:border-emerald-300 group-hover:text-emerald-600 transition-colors">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 font-bold text-sm md:text-base leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements & Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {program.requirements.length > 0 && (
                    <div className="bg-white p-6 rounded-4xl border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1]">
                      <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-amber-400 rounded-full" />
                        Persyaratan
                      </h3>
                      <ul className="space-y-3">
                        {program.requirements.map((req, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm font-bold text-slate-600 leading-snug"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {program.benefits.length > 0 && (
                    <div className="bg-white p-6 rounded-4xl border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1]">
                      <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-emerald-400 rounded-full" />
                        Manfaat
                      </h3>
                      <ul className="space-y-3">
                        {program.benefits.map((ben, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm font-bold text-slate-600 leading-snug"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            {ben}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6 lg:space-y-8">
                {/* Stats */}
                <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1] p-6 lg:p-8">
                  <h3 className="text-lg font-black text-slate-800 mb-5">
                    Informasi Program
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Total Materi
                        </p>
                        <p className="text-lg font-black text-slate-800">
                          {program.materials.length} {program.totalKajian > 0 ? `/ ${program.totalKajian}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <Clock className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Durasi
                        </p>
                        <p className="text-lg font-black text-slate-800">
                          {program.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Enroll */}
                {!program.isEnrolled && !isPrivileged && (
                  <div className={`rounded-[2.5rem] p-6 lg:p-8 text-white border-2 shadow-[0_6px_0_0] text-center relative overflow-hidden ${
                    program.isLocked 
                      ? "bg-slate-100 border-slate-300 shadow-slate-200 text-slate-400" 
                      : "bg-linear-to-br from-teal-400 to-cyan-400 border-teal-600 shadow-[#0f766e]"
                  }`}>
                    {!program.isLocked && <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />}
                    <div className={`h-10 w-10 mx-auto mb-3 ${program.isLocked ? "text-slate-300" : "text-white/80"}`}>
                      {program.isLocked ? <Lock className="w-full h-full" /> : <GraduationCap className="w-full h-full" />}
                    </div>
                    <h3 className={`text-2xl font-black mb-2 relative z-10 ${program.isLocked ? "text-slate-600" : "text-white"}`}>
                      {program.isLocked ? "Program Terkunci" : "Tertarik Bergabung?"}
                    </h3>
                    <p className={`text-sm font-bold mb-6 leading-relaxed relative z-10 ${program.isLocked ? "text-slate-400" : "text-teal-50"}`}>
                      {program.isLocked 
                        ? `Selesaikan program "${program.prerequisiteProgram?.title}" terlebih dahulu untuk membuka akses program ini.`
                        : "Daftar untuk mengikuti Program kami dan mulai belajar."
                      }
                    </p>
                    {program.isLocked ? (
                      <button
                        onClick={() => router.push(`/programs/${program.prerequisiteProgram?.id}`)}
                        className="w-full py-4 rounded-2xl bg-white text-slate-500 font-black border-2 border-slate-200 shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 relative z-10"
                      >
                        Lihat Program Prasyarat
                      </button>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full py-4 rounded-2xl bg-white text-teal-600 font-black border-2 border-teal-100 shadow-lg hover:bg-teal-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative z-10 disabled:opacity-50"
                      >
                        {enrolling ? (
                          <Sparkles className="h-5 w-5 animate-spin" />
                        ) : (
                          "Daftar Sekarang"
                        )}
                      </button>
                    )}
                  </div>
                )}

                {program.isEnrolled && (
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-emerald-700 font-black">
                      Anda sudah terdaftar di Program ini
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
      {/* Confirm Delete Program Dialog */}
      <CartoonConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Program?"
        message="Apakah Anda yakin ingin menghapus program ini? Tindakan ini tidak dapat dibatalkan dan semua materi di dalamnya mungkin terpengaruh."
        type="warning"
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />

      {/* Confirm Remove Member Dialog */}
      <CartoonConfirmDialog
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
        title="Keluarkan Anggota?"
        message={`Apakah Anda yakin ingin mengeluarkan "${memberToRemove?.name}" dari program ini?`}
        type="warning"
        confirmText={removingMember ? "Mengeluarkan..." : "Ya, Keluarkan"}
        cancelText="Batal"
      />

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] border-3 border-slate-200 shadow-[0_10px_0_0_#cbd5e1] max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-xl border border-teal-200 text-teal-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-black text-lg text-slate-800">
                    Tambah Anggota ke Program
                  </h4>
                  <p className="text-xs font-bold text-slate-400">
                    Pilih pengguna untuk didaftarkan ke kurikulum ini
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Search Input */}
            <div className="p-5 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={addUserSearch}
                  onChange={(e) => {
                    setAddUserSearch(e.target.value);
                    fetchAvailableUsers(e.target.value);
                  }}
                  placeholder="Cari nama atau email pengguna..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-xs sm:text-sm font-bold placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal User List */}
            <div className="p-5 overflow-y-auto space-y-2 flex-1 min-h-[220px]">
              {searchingUsers ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Sparkles className="h-6 w-6 text-teal-500 animate-spin mb-2" />
                  <p className="text-xs font-bold text-slate-400">
                    Mencari pengguna...
                  </p>
                </div>
              ) : userOptions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xs font-bold text-slate-400">
                    Tidak ada pengguna yang ditemukan
                  </p>
                </div>
              ) : (
                userOptions.map((user) => {
                  const isAlreadyEnrolled = program.enrolledMembers?.some(
                    (m) => m.userId === user.id,
                  );
                  const isEnrollingThis = enrollingMemberId === user.id;

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-2xl border-2 border-slate-100 hover:border-teal-200 bg-white hover:bg-teal-50/20 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-emerald-50 shrink-0 flex items-center justify-center">
                          {user.avatar ? (
                            <SafeImage
                              src={user.avatar}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-black text-sm">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-xs sm:text-sm text-slate-800 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-3">
                        {isAlreadyEnrolled ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Terdaftar
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddMember(user.id)}
                            disabled={isEnrollingThis}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 text-white font-black text-xs border border-teal-700 hover:bg-teal-600 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isEnrollingThis ? (
                              <Sparkles className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <UserPlus className="h-3.5 w-3.5" />
                            )}
                            <span>{isEnrollingThis ? "Mendaftar..." : "Daftarkan"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-600 font-black text-xs sm:text-sm hover:bg-slate-100 transition-all cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramDetail;
