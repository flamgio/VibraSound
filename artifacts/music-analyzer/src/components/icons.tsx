type IconProps = { className?: string; strokeWidth?: number };
const S = ({ className, strokeWidth = 1.4, children, viewBox = "0 0 24 24" }: { className?: string; strokeWidth?: number; children: React.ReactNode; viewBox?: string }) => (
  <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth={strokeWidth}>{children}</svg>
);

export function WaveformIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M2 13h2.5" />
      <path d="M4.5 13c.3-2.2 1.2-5 2.5-5v10c1.3 0 2.2-2.8 2.5-5" />
      <path d="M9.5 13h1" />
      <path d="M10.5 13c.3-3.5 1.5-8 3-8v16c1.5 0 2.7-4.5 3-8" />
      <path d="M16.5 13h1" />
      <path d="M17.5 13c.3-2 1-4 2-4v8c1-.3 1.8-2 2-4" />
      <path d="M21.5 13H23" />
    </S>
  );
}

export function DnaIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M8 2c0 0 0 4 4 6s4 8 4 14" />
      <path d="M16 2c0 0 0 4-4 6S8 16 8 22" />
      <path d="M9.5 5.5h5M9.5 18.5h5M8.5 10.5h7M8.5 13.5h7" />
    </S>
  );
}

export function FrequencyIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4} viewBox="0 0 24 24">
      <rect x="1.5" y="16" width="3" height="7" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="6.5" y="11" width="3" height="12" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="11.5" y="4" width="3" height="19" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="16.5" y="8.5" width="3" height="14.5" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="21.5" y="13" width="1" height="10" rx="0.5" fill="currentColor" stroke="none" opacity="0.5" />
    </S>
  );
}

export function BpmIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <polyline points="1 12 5 12 7 5 10 19 13 9 16 14 18 12 23 12" />
    </S>
  );
}

export function MusicNoteIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M9 18V5l12-2.5v13.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="15.5" r="2.5" />
    </S>
  );
}

export function CellIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <ellipse cx="12" cy="12" rx="9" ry="9" />
      <ellipse cx="12" cy="12" rx="3.5" ry="3.5" fill="currentColor" opacity="0.15" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      <path d="M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M18.2 5.8l-1.4 1.4M7.2 16.8l-1.4 1.4" strokeWidth={(strokeWidth ?? 1.4) * 0.85} />
    </S>
  );
}

export function SparkleIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.3}>
      <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" />
      <circle cx="5" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="19" r="0.75" fill="currentColor" stroke="none" />
    </S>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
    </svg>
  );
}

export function SoundCloudIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.175 12.225c-.074 0-.133.06-.142.133l-.233 2.154.233 2.105c.01.074.068.13.142.13.074 0 .133-.056.142-.13l.265-2.105-.265-2.154c-.01-.072-.068-.133-.142-.133zm-.899.876c-.09 0-.16.07-.168.155l-.108 1.278.108 1.24c.008.085.079.153.168.153s.162-.068.168-.153l.122-1.24-.122-1.278c-.006-.085-.078-.155-.168-.155zm1.8-.468c-.086 0-.155.068-.163.155l-.192 1.746.192 1.666c.008.086.077.155.163.155.086 0 .155-.069.163-.155l.217-1.666-.217-1.746c-.008-.087-.077-.155-.163-.155zm.9-.174c-.098 0-.18.08-.187.18l-.158 1.92.158 1.763c.007.1.089.18.187.18.098 0 .18-.08.187-.18l.178-1.763-.178-1.92c-.007-.1-.089-.18-.187-.18zm5.09-3.12c-.308 0-.6.056-.873.157C6.894 6.2 4.13 3.628 0.75 3.628c-1.047 0-2.048.258-2.908.714-.321.17-.41.34-.413.492v11.4c.003.16.133.292.294.296h10.335c.61 0 1.102-.494 1.102-1.102V9.578c0-.61-.492-1.102-1.102-1.102z"/>
    </svg>
  );
}

export function HistoryIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M12 2a10 10 0 1 0 10 10" />
      <polyline points="12 7 12 12 15 15" />
      <path d="M2.5 17.5v3.5h3.5" />
      <path d="M2.5 21l5-5" />
    </S>
  );
}

export function ChartBarIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M18 20V8M12 20V3M6 20v-7" />
      <path d="M2 20h20" strokeWidth={(strokeWidth ?? 1.4) * 0.7} opacity="0.4" />
    </S>
  );
}

export function ArrowLeftIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M19 12H5M5 12l7 7M5 12l7-7" />
    </S>
  );
}

export function ArrowRightIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.5}>
      <path d="M5 12h14M19 12l-7-7M19 12l-7 7" />
    </S>
  );
}

export function ExternalLinkIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </S>
  );
}

export function SunIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" strokeWidth={(strokeWidth ?? 1.4) * 0.9} />
    </S>
  );
}

export function MoonIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" fillOpacity="0.1" />
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </S>
  );
}

export function AlertIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08" />
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
    </S>
  );
}

export function EnergyIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M13 2L4 13h8l-1 9 9-11h-8l1-9z" fill="currentColor" fillOpacity="0.12" />
      <path d="M13 2L4 13h8l-1 9 9-11h-8l1-9z" />
    </S>
  );
}

export function PlaylistIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M3 6h14M3 12h14M3 18h8" />
      <circle cx="20" cy="17" r="2" />
      <path d="M22 9v8" strokeWidth={(strokeWidth ?? 1.4) * 0.9} />
    </S>
  );
}

export function FilmIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M2 9h5M17 9h5M2 15h5M17 15h5" strokeWidth={(strokeWidth ?? 1.4) * 0.8} opacity="0.7" />
    </S>
  );
}

export function HeadphonesIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 18.5a2.5 2.5 0 0 1-2.5 2.5H17a2.5 2.5 0 0 1-2.5-2.5v-2a2.5 2.5 0 0 1 2.5-2.5h4v4.5z" />
      <path d="M3 18.5A2.5 2.5 0 0 0 5.5 21H7a2.5 2.5 0 0 0 2.5-2.5v-2A2.5 2.5 0 0 0 7 14H3v4.5z" />
    </S>
  );
}

export function GridIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </S>
  );
}

export function CheckIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 2}>
      <polyline points="20 6 9 17 4 12" />
    </S>
  );
}

export function ResonanceIcon({ className, strokeWidth }: IconProps) {
  return (
    <S className={className} strokeWidth={strokeWidth ?? 1.4}>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <path d="M12 6a6 6 0 0 1 6 6" />
      <path d="M2 12a10 10 0 0 0 10 10" strokeOpacity="0.4" />
      <path d="M6 12a6 6 0 0 0 6 6" strokeOpacity="0.4" />
    </S>
  );
}
