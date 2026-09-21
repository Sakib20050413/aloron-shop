import Image from "next/image";

export function ImageOrIcon({ src, alt, sizes, className = "" }: { src: string; alt: string; sizes: string; className?: string }) {
  if (src.startsWith("http") || src.startsWith("/")) {
    return <Image src={src} alt={alt} width={900} height={900} sizes={sizes} className={className} onError={(event) => { event.currentTarget.src = "/logo.png"; }} />;
  }
  return <span className={className} aria-hidden="true">{src}</span>;
}
