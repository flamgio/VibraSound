type IconProps = { className?: string; strokeWidth?: number };

const S = ({
  className, strokeWidth = 1.5, children, viewBox = "0 0 24 24"
}: {
  className?: string; strokeWidth?: number; children: React.ReactNode; viewBox?: string;
}) => (
  <svg
    className={className}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="currentColor"
    strokeWidth={strokeWidth}
  >
    {children}
  </svg>
);

export function WaveformIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M2 12h1.5" />
      <path d="M3.5 12c.4-2.5 1.4-5.5 2.75-5.5v11C7.6 17.5 8.6 14.5 9 12" />
      <path d="M9 12h1.25" />
      <path d="M10.25 12c.4-4 1.75-9 3.25-9v18c1.5 0 2.85-5 3.25-9" />
      <path d="M16.75 12h1.25" />
      <path d="M18 12c.35-2.2 1.1-4.5 2.25-4.5v9C21.4 16.5 22.15 14.2 22.5 12" />
      <path d="M22.5 12H24" />
    </S>
  );
}

export function DnaIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M8 2c0 2 1 4 4 6s4 6 4 10" />
      <path d="M16 2c0 2-1 4-4 6S8 14 8 18" />
      <path d="M10 4.5h4" />
      <path d="M9.5 9.5h5" />
      <path d="M9.5 14.5h5" />
      <path d="M10 19.5h4" />
    </S>
  );
}

export function FrequencyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="15" width="3.5" height="8" rx="1.75" fill="currentColor" />
      <rect x="6" y="10" width="3.5" height="13" rx="1.75" fill="currentColor" />
      <rect x="11" y="3" width="3.5" height="20" rx="1.75" fill="currentColor" />
      <rect x="16" y="7" width="3.5" height="16" rx="1.75" fill="currentColor" opacity="0.75" />
      <rect x="21" y="12" width="2" height="11" rx="1" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

export function BpmIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.75}>
      <polyline points="1 12 4.5 12 6.5 5 10 19 13.5 9 16.5 14.5 18.5 12 23 12" />
    </S>
  );
}

export function MusicNoteIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" fill="currentColor" fillOpacity="0.12" />
      <circle cx="18" cy="16" r="3" />
    </S>
  );
}

export function CellIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.1" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" strokeWidth={(strokeWidth ?? 1.5) * 0.8} />
      <path d="M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1" strokeWidth={(strokeWidth ?? 1.5) * 0.7} opacity="0.6" />
    </S>
  );
}

export function SparkleIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M12 2L13.9 9.1L21 11L13.9 12.9L12 20L10.1 12.9L3 11L10.1 9.1L12 2Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M12 2L13.9 9.1L21 11L13.9 12.9L12 20L10.1 12.9L3 11L10.1 9.1L12 2Z" />
      <circle cx="4.5" cy="4.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="19" r="0.8" fill="currentColor" stroke="none" />
    </S>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

export function SoundCloudIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.56 8.87V17h8.76c1.01 0 1.68-.64 1.68-1.55a1.55 1.55 0 0 0-1.68-1.55c-.04 0-.09 0-.13.01.02-.12.03-.24.03-.36A3.46 3.46 0 0 0 16.73 10a3.47 3.47 0 0 0-2.44 1.01A3.46 3.46 0 0 0 11.56 8.87zm-1.76.95c.19 0 .36.07.49.18V17h1.27V9.82a4.72 4.72 0 0 0-.49-.03c-2.2 0-3.99 1.74-3.99 3.88a3.8 3.8 0 0 0 .05.64 1.75 1.75 0 0 0-.53-.08A1.75 1.75 0 0 0 4.85 16a1.75 1.75 0 0 0 1.75 1.75h3.2V9.82zm-5.56 7.37A1.19 1.19 0 0 1 3.06 16a1.19 1.19 0 1 1 2.38 0 1.19 1.19 0 0 1-1.2 1.19z" />
    </svg>
  );
}

export function HistoryIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M12 2a10 10 0 1 0 10 10" />
      <polyline points="12 7 12 12 14.5 14.5" />
      <path d="M21.5 2v5h-5" />
      <path d="M21.5 7l-4.5-4.5" />
    </S>
  );
}

export function ChartBarIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M18 20V8M12 20V3M6 20v-7" />
      <path d="M2 20h20" strokeWidth={(strokeWidth ?? 1.5) * 0.65} opacity="0.35" />
    </S>
  );
}

export function ArrowLeftIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.75}>
      <path d="M19 12H5M5 12l7 7M5 12l7-7" />
    </S>
  );
}

export function ArrowRightIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.75}>
      <path d="M5 12h14M19 12l-7-7M19 12l-7 7" />
    </S>
  );
}

export function ExternalLinkIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </S>
  );
}

export function SunIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 1.5v2M12 20.5v2M4 4l1.5 1.5M18.5 18.5L20 20M1.5 12h2M20.5 12h2M4 20l1.5-1.5M18.5 5.5L20 4" strokeWidth={(strokeWidth ?? 1.5) * 0.85} />
    </S>
  );
}

export function MoonIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" fillOpacity="0.08" />
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </S>
  );
}

export function AlertIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="currentColor" fillOpacity="0.07" />
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </S>
  );
}

export function EnergyIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M13 2L4 13h8l-1 9 9-11h-8l1-9z" fill="currentColor" fillOpacity="0.1" />
      <path d="M13 2L4 13h8l-1 9 9-11h-8l1-9z" />
    </S>
  );
}

export function PlaylistIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <line x1="3" y1="6" x2="15" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="11" y2="18" />
      <circle cx="20" cy="17.5" r="2.5" />
      <path d="M22.5 9v8.5" />
    </S>
  );
}

export function FilmIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <rect x="2" y="4.5" width="20" height="15" rx="2.5" fill="currentColor" fillOpacity="0.07" />
      <rect x="2" y="4.5" width="20" height="15" rx="2.5" />
      <path d="M7 4.5v15M17 4.5v15" strokeWidth={(strokeWidth ?? 1.5) * 0.75} opacity="0.5" />
      <path d="M2 9.5h5M17 9.5h5M2 14.5h5M17 14.5h5" strokeWidth={(strokeWidth ?? 1.5) * 0.75} opacity="0.5" />
    </S>
  );
}

export function HeadphonesIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" />
    </S>
  );
}

export function GridIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </S>
  );
}

export function CheckIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 2.25}>
      <polyline points="20 6 9 17 4 12" />
    </S>
  );
}

export function ResonanceIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <path d="M12 6a6 6 0 0 1 6 6" />
      <path d="M2 12a10 10 0 0 0 10 10" strokeOpacity="0.35" />
      <path d="M6 12a6 6 0 0 0 6 6" strokeOpacity="0.35" />
    </S>
  );
}

export function StarIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" fillOpacity="0.1" />
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </S>
  );
}

export function ZapIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.1" />
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </S>
  );
}
