export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 108" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-l-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--logo-l-from)" }} />
          <stop offset="100%" style={{ stopColor: "var(--logo-l-to)" }} />
        </linearGradient>
        <linearGradient id="logo-a-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      <path d="M18,15 L34,15 L34,80 L56,92 L18,92 Z" fill="url(#logo-l-gradient)" />

      <path
        d="M75,15 L100,92 L50,92 Z M75,50 L84,87 L66,87 Z"
        fill="url(#logo-a-gradient)"
        fillRule="evenodd"
      />
      <path d="M75,58 L81,83 L69,83 Z" fill="url(#logo-a-gradient)" />
    </svg>
  );
}
