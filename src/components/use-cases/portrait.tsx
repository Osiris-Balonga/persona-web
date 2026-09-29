"use client";

import { useState } from "react";
import Image from "next/image";
import type { UseCasePerson } from "@/lib/use-case-people";

export function Portrait({
  person,
  className = "",
  size = 96,
}: {
  person: UseCasePerson;
  className?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const initials = person.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-[#dfe7f8] text-primary dark:bg-[#263b5b] ${className}`}
    >
      {person.portrait && !failed ? (
        <Image
          src={person.portrait}
          alt={person.name}
          width={size}
          height={size}
          sizes={`${size}px`}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-label={person.name} className="text-lg font-semibold">
          {initials}
        </span>
      )}
    </span>
  );
}
