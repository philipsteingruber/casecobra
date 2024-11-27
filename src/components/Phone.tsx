import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}

export default function Phone({ imgSrc, className, dark = false, ...props }: PhoneProps) {
  return (
    <div className={cn("pointer-events-none relative z-50 overflow-hidden", className)} {...props}>
      <Image
        className="pointer-events-none z-50 select-none"
        src={dark ? "/phone-template-dark-edges.png" : "/phone-template-white-edges.png"}
        alt="Phone image"
        height={1831}
        width={896}
      />
      <div className="absolute inset-0 -z-10">
        <Image src={imgSrc} alt="Your image" height={428} width={619} />
      </div>
    </div>
  );
}
