import Link from "next/link";

export default function ForbiddenPage() {
  return <main className="grid min-h-screen place-items-center bg-[#030712] px-5 text-center text-white"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-400">403</p><h1 className="mt-3 text-4xl font-black">Access restricted</h1><p className="mt-3 text-slate-400">You do not have permission to view this area.</p><Link href="/" className="mt-7 inline-block rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950">Return home</Link></div></main>;
}
