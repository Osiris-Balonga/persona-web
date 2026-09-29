import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-foreground">
      <Image src="/persona-mark.svg" alt="" width={32} height={27} priority className="h-7 w-auto" />
      {!compact && <span className="text-[1.05rem] font-bold tracking-[-0.045em]">PERSONA</span>}
    </span>
  );
}
