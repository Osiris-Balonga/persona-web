"use client";

import { useState } from "react";
import Image from "next/image";

const portraitUrl = "https://persona-portraits.osirisbalonga.workers.dev/portraits/v1/medium/p_0233.webp";

export function ExamplePortrait({ alt }: { alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#e8ecf8] sm:aspect-[5/4]">
      {failed ? (
        <div aria-label={alt} role="img" className="flex h-full items-center justify-center text-6xl font-semibold tracking-tighter text-primary/50">CA</div>
      ) : (
        <Image src={portraitUrl} alt={alt} fill priority sizes="(max-width: 640px) 80vw, (max-width: 1024px) 44vw, 340px" className="object-cover object-top" onError={() => setFailed(true)} />
      )}
    </div>
  );
}
