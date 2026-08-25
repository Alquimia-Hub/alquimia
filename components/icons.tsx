export function AlquimiaLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      viewBox="0 0 40 40"
    >
      <circle cx="20" cy="20" r="16" />
      <path d="M20 8 L30 26 L10 26 Z" />
      <circle cx="20" cy="20" fill="currentColor" r="2" />
    </svg>
  );
}

export function AlquimiaDivider({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      viewBox="0 0 40 40"
    >
      <circle cx="20" cy="20" r="8" />
      <path d="M20 4 L32 28 L8 28 Z" />
      <circle cx="20" cy="20" fill="currentColor" r="1.5" />
    </svg>
  );
}

export function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3.2a.07.07 0 0 0-.073.035c-.211.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.074.074 0 0 0-.074-.035A19.736 19.736 0 0 0 5.94 4.369a.066.066 0 0 0-.031.027C2.533 9.046 1.611 13.58 2.063 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.027c.461-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.105 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.644-1.873.891a.077.077 0 0 0-.04.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.029zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.86-.87 2.09s.9 2.43 1.02 2.6c.12.16 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
    </svg>
  );
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z" />
    </svg>
  );
}

export function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5.5 19 12 8 18.5z" />
    </svg>
  );
}

const SIGIL_PATHS = [
  <>
    <circle cx="20" cy="20" key="c" r="11" />
    <circle cx="20" cy="20" fill="currentColor" key="d" r="3" />
  </>,

  <>
    <circle cx="20" cy="19" key="c" r="8" />
    <path d="M20 27 v8 M15 31 h10" key="p" />
    <path d="M14 8 a9 9 0 0 0 12 0" key="a" />
  </>,

  <>
    <circle cx="20" cy="20" key="c" r="12" />
    <path d="M8 20 h24" key="p" />
  </>,

  <>
    <path d="M20 6 L33 29 L7 29 Z" key="t" />
    <path d="M20 16 L26 26 L14 26 Z" key="i" />
  </>,

  <>
    <path d="M20 34 L7 11 L33 11 Z" key="t" />
    <path d="M20 26 L14 15 L26 15 Z" key="i" />
  </>,

  <>
    <path d="M20 6 L33 29 L7 29 Z" key="t" />
    <path d="M12 22 h16" key="l" />
  </>,
] as const;

export function RepoSigil({
  className,
  index = 0,
}: {
  className?: string;
  index?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      viewBox="0 0 40 40"
    >
      {SIGIL_PATHS[index % SIGIL_PATHS.length]}
    </svg>
  );
}

export function InteligenciaIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      viewBox="0 0 40 40"
    >
      <circle cx="20" cy="20" r="14" />
      <circle cx="20" cy="20" fill="currentColor" r="2.5" />
    </svg>
  );
}

export function AutomatizacionIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      viewBox="0 0 40 40"
    >
      <circle cx="20" cy="20" r="13" />
      <path d="M20 7 v26 M7 20 h26" />
      <circle cx="20" cy="20" r="4" />
    </svg>
  );
}

export function ProductividadIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      viewBox="0 0 40 40"
    >
      <path d="M20 6 L32 22 L8 22 Z" />
      <line x1="20" x2="20" y1="22" y2="34" />
      <line x1="13" x2="27" y1="34" y2="34" />
    </svg>
  );
}

export function QuoteOrnament({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      viewBox="0 0 40 40"
    >
      <path d="M4 20 L16 20 M24 20 L36 20" />
      <path d="M20 14 L24 20 L20 26 L16 20 Z" />
    </svg>
  );
}
