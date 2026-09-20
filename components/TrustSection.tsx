import { BadgeCheck, Headphones, RotateCcw, ShieldCheck } from "lucide-react";

const trustItems = [
  [ShieldCheck, "Genuine products", "Every item is checked before it reaches you."],
  [RotateCcw, "Easy returns", "Simple 7-day return support for peace of mind."],
  [Headphones, "Human support", "Real help from our team, seven days a week."],
  [BadgeCheck, "Secure checkout", "Your details stay protected at every step."],
] as const;

export function TrustSection() {
  return <section id="why-aloron" className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">{trustItems.map(([Icon, title, description]) => <div key={title} className="flex gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"><Icon size={20} /></div><div><h3 className="font-bold text-slate-900 dark:text-white">{title}</h3><p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">{description}</p></div></div>)}</div></section>;
}
