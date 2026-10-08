import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" aria-label="CrediEdgeOS Command Centre" className={`block ${className}`}>
      <img
        src="/CE_OS_LOGO.png"
        alt="CrediEdgeOS"
        className="h-9 w-auto max-w-[168px] shrink-0 object-contain object-left"
      />
    </Link>
  );
}
