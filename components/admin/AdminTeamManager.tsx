"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { demoteAdmin, promoteAdmin } from "@/actions/admins";

type AdminMember = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "CUSTOMER";
};

const ownerEmails = [
  "mdnajmussakib2003@gmail.com",
  "md.najmus.sakib.rahatul.2005@gmail.com",
  "rakibtoha47@gmail.com",
];

export function AdminTeamManager({ initialAdmins }: { initialAdmins: AdminMember[] }) {
  const router = useRouter();
  const [admins, setAdmins] = useState(initialAdmins);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  const isOwner = (memberEmail: string) => ownerEmails.includes(memberEmail.toLowerCase());

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("promote");
    setMessage("");
    const result = await promoteAdmin(email);
    if (result.success) {
      setMessage("অ্যাডমিন সফলভাবে অনুমতি পেয়েছেন।");
      setEmail("");
      router.refresh();
    } else setMessage(result.error);
    setBusy("");
  };

  const remove = async (admin: AdminMember) => {
    if (isOwner(admin.email)) return;
    if (!window.confirm(`${admin.name || admin.email}-কে ডিমোট করতে চান?`)) return;
    setBusy(admin.id);
    setMessage("");
    const result = await demoteAdmin(admin.id);
    if (result.success) setAdmins((current) => current.filter((item) => item.id !== admin.id));
    else setMessage(result.error);
    setBusy("");
  };

  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-neutral-950 dark:text-white">অ্যাডমিন টিম ও অ্যাক্সেস কন্ট্রোল</h2>
          <p className="mt-1 text-xs text-neutral-500">
            স্টোর ব্যবস্থাপনার জন্য অনুমোদিত অ্যাডমিন সদস্যদের তালিকা ও রোল।
          </p>
        </div>
        <form onSubmit={submit} className="flex w-full gap-2 sm:w-auto">
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            aria-label="New admin email"
            className="field min-w-0 font-mono text-xs sm:w-64"
          />
          <button
            disabled={busy === "promote"}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-neutral-900 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <UserPlus size={13} />
            <span>{busy === "promote" ? "যোগ হচ্ছে…" : "অ্যাডমিন যোগ করুন"}</span>
          </button>
        </form>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left font-mono text-xs">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
            <tr>
              <th className="pb-3 uppercase">টিম সদস্য</th>
              <th className="pb-3 uppercase">ইমেইল</th>
              <th className="pb-3 uppercase">রোল</th>
              <th className="pb-3 uppercase">স্ট্যাটাস</th>
              <th className="pb-3 text-right uppercase">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    {admin.image ? (
                      <Image
                        src={admin.image}
                        alt=""
                        width={32}
                        height={32}
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid size-8 place-items-center rounded-full bg-neutral-200 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300">
                        {(admin.name || admin.email).slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="font-sans font-semibold text-neutral-900 dark:text-white">
                      {admin.name || "অ্যাডমিন"}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 text-neutral-600 dark:text-neutral-400">{admin.email}</td>
                <td className="py-3.5">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      isOwner(admin.email)
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                        : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                    }`}
                  >
                    {isOwner(admin.email) ? "SUPER_ADMIN" : "ADMIN"}
                  </span>
                </td>
                <td className="py-3.5">
                  <span className="rounded px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                    Active
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  {isOwner(admin.email) ? (
                    <span className="text-[11px] text-neutral-400">Owner (Protected)</span>
                  ) : (
                    <button
                      type="button"
                      disabled={busy === admin.id}
                      onClick={() => void remove(admin)}
                      className="rounded px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-40 dark:text-rose-400 dark:hover:bg-rose-950/20"
                    >
                      রিমুভ
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && (
        <p aria-live="polite" className="mt-4 font-mono text-xs text-emerald-600 dark:text-emerald-400">
          {message}
        </p>
      )}
    </section>
  );
}
