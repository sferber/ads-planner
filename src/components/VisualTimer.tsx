interface Props {
  /** Fortschritt von 0 (leer) bis 1 (voll). */
  progress: number;
  size?: number;
  color?: string;
  /** Große Zahl in der Mitte, z. B. "12:34". */
  label: string;
  sublabel?: string;
}

/**
 * Sichtbarer Zeitring – macht vergehende Zeit greifbar (gegen Zeitblindheit).
 * Der Ring leert sich, je weniger Zeit übrig ist.
 */
export default function VisualTimer({
  progress,
  size = 240,
  color = "#5b8def",
  label,
  sublabel,
}: Props) {
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = c * (1 - clamped);

  return (
    <div className="visual-timer" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(0,0,0,0.07)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="timer-ring"
        />
      </svg>
      <div className="visual-timer-center">
        <div className="visual-timer-label">{label}</div>
        {sublabel && <div className="visual-timer-sub">{sublabel}</div>}
      </div>
    </div>
  );
}
