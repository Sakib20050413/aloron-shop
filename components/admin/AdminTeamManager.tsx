"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { demoteAdmin, promoteAdmin } from "@/actions/admins";

type AdminMember = { id: string; name: string; email: string; image: string | null; role: "ADMIN" | "CUSTOMER"; };
const ownerEmail = "mdnajmussakib2003@gmail.com";

export function AdminTeamManager({ initialAdmins }: { initialAdmins: AdminMember[] }) {
  const router = useRouter();
  const [admins, setAdmins] = useState(initialAdmins);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("promote");
    setMessage("");
    const result = await promoteAdmin(email);
    if (result.success) {
      setMessage("অ্যাডমিন সফলভাবে যোগ হয়েছে।");
      setEmail("");
      router.refresh();
    } else setMessage(result.error);
    setBusy("");
  };
  const remove = async (admin: AdminMember) => {
    if (admin.email.toLowerCase() === ownerEmail) return;
    if (!window.confirm(`${admin.name || admin.email}-কে ডিমোট করতে চান?`)) return;
    setBusy(admin.id);
    setMessage("");
    const result = await demoteAdmin(admin.id);
    if (result.success) setAdmins((current) => current.filter((item) => item.id !== admin.id));
    else setMessage(result.error);
    setBusy("");
  };
  return <section className="mt-6 rounded-3xl border border-slate-200 p-6 dark:border-white/10">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-black">👥 অ্যাডমিন টিম</h2><p className="mt-1 text-sm text-slate-500">বিশ্বস্ত টিম মেম্বারদের অ্যাডমিন অ্যাক্সেস নিয়ন্ত্রণ করুন।</p></div><form onSubmit={submit} className="flex w-full gap-2 sm:w-auto"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" aria-label="নতুন অ্যাডমিনের ইমেইল" className="field min-w-0 flex-1 sm:w-64" /><button disabled={busy === "promote"} className="whitespace-nowrap rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950">{busy === "promote" ? "যোগ হচ্ছে…" : "➕ নতুন অ্যাডমিন যোগ করুন"}</button></form></div>
    <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-slate-400"><tr><th className="pb-3">Member</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3">Status</th><th className="pb-3 text-right">Action</th></tr></thead><tbody>{admins.map((admin) => <tr key={admin.id} className="border-t border-slate-100 dark:border-white/10"><td className="py-4"><div className="flex items-center gap-3">{admin.image ? <Image src={admin.image} alt="" width={36} height={36} className="size-9 rounded-full object-cover" /> : <span className="grid size-9 place-items-center rounded-full bg-cyan-500/15 font-black text-cyan-600">{(admin.name || admin.email).slice(0, 1).toUpperCase()}</span>}<span className="font-bold">{admin.name || "Unnamed admin"}</span></div></td><td className="py-4">{admin.email}</td><td className="py-4"><span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-300">{admin.email.toLowerCase() === ownerEmail ? "SUPER_ADMIN" : "ADMIN"}</span></td><td className="py-4"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Active</span></td><td className="py-4 text-right">{admin.email.toLowerCase() === ownerEmail ? <span className="text-xs font-bold text-slate-400">Protected</span> : <button type="button" disabled={busy === admin.id} onClick={() => void remove(admin)} className="rounded-lg px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-40">রিমুভ</button>}</td></tr>)}</tbody></table></div>
    {message && <p aria-live="polite" className="mt-4 rounded-xl bg-slate-100 p-3 text-sm font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">{message}</p>}
  </section>;
}
