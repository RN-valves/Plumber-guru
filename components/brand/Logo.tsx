import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_WIDTH = 805;
const LOGO_HEIGHT = 235;

type LogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function Logo({
  href = "/",
  className,
  imageClassName,
  priority = false,
}: LogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt="Plumber Guru"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn(
        "h-12 w-auto max-w-[min(220px,52vw)] object-contain sm:h-14 sm:max-w-[260px] lg:h-[3.75rem] lg:max-w-[300px]",
        imageClassName
      )}
    />
  );

  if (!href) {
    return (
      <div className={cn("inline-flex shrink-0 items-center", className)}>
        {image}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="Plumber Guru Home"
    >
      {image}
    </Link>
  );
}
