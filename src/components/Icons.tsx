type IconProps = { size?: number; className?: string };

export function SearchIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M16 16.5 20 20.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UserIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 19.2c1.4-2.8 3.8-4.2 7-4.2s5.6 1.4 7 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeartIcon({
  size = 16,
  filled = false,
  className,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.2187 3.32846C13.9839 1.95769 12.0335 2.51009 10.8618 3.39001C10.3813 3.7508 10.1412 3.93119 9.99984 3.93119C9.8585 3.93119 9.61834 3.7508 9.13784 3.39001C7.96619 2.51009 6.01574 1.95769 3.78104 3.32846C0.848228 5.12745 0.184604 11.0624 6.94944 16.0695C8.23794 17.0232 8.88217 17.5 9.99984 17.5C11.1175 17.5 11.7618 17.0232 13.0503 16.0695C19.8151 11.0624 19.1514 5.12745 16.2187 3.32846Z"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke="#141414"
      />
    </svg>
  );
}

export function BagIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6.5 8h11l-.8 11.2a1 1 0 0 1-1 .8H8.3a1 1 0 0 1-1-.8L6.5 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8V6.8A3 3 0 0 1 12 3.8 3 3 0 0 1 15 6.8V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShareIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5.83337C15.6454 5.96719 16.1323 6.19053 16.5237 6.56328C17.5 7.49322 17.5 8.98996 17.5 11.9834C17.5 14.9768 17.5 16.4735 16.5237 17.4035C15.5474 18.3334 13.976 18.3334 10.8333 18.3334H9.16667C6.02397 18.3334 4.45262 18.3334 3.47631 17.4035C2.5 16.4735 2.5 14.9768 2.5 11.9834C2.5 8.98996 2.5 7.49322 3.47631 6.56328C3.86765 6.19053 4.35458 5.96719 5 5.83337"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke="#141414"
      />
      <path
        d="M10.0211 1.66706L10 11.6666M12.5 4.10735C12.5 4.10735 11.1276 2.45027 10.3723 1.81253C10.2635 1.7206 10.1426 1.6721 10.0211 1.66706C9.88558 1.66145 9.74925 1.70989 9.62775 1.8124C8.87242 2.45001 7.5 4.10735 7.5 4.10735"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#141414"
      />
    </svg>
  );
}

export function ChevronIcon({
  size = 16,
  direction = "down",
  className,
}: IconProps & { direction?: "up" | "down" | "left" | "right" }) {
  const rotation = { down: 0, left: 90, up: 180, right: 270 }[direction];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <path
        d="m6 9 6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StarIcon({
  size = 14,
  filled = true,
  className,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="m12 3.6 2.4 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.2 6.9 19l1.1-5.6L3.8 9.5l5.7-.7L12 3.6Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThumbIcon({
  size = 16,
  down = false,
  className,
}: IconProps & { down?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: down ? "rotate(180deg)" : undefined }}
      aria-hidden="true"
    >
      <path
        d="M8 11V5.5a2 2 0 0 1 3.6-1.2L14 8h4.2a2 2 0 0 1 2 2.3l-.8 6A2 2 0 0 1 17.4 18H8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 10H5.5A1.5 1.5 0 0 0 4 11.5v5A1.5 1.5 0 0 0 5.5 18H8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
