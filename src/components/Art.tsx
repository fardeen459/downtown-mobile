/* Original procedural SVG artwork — no stock photography, no brand marks. */
export function BeforeAfterArt() {
  return (
    <svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" className="art">
      <defs>
        <linearGradient id="ba-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#17130f" /><stop offset="1" stopColor="#070708" /></linearGradient>
        <linearGradient id="ba-good" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2d1f" /><stop offset=".55" stopColor="#14110e" /><stop offset="1" stopColor="#0c0d10" /></linearGradient>
        <radialGradient id="ba-glow" cx=".7" cy=".3" r=".6"><stop offset="0" stopColor="#d8b98a" stopOpacity=".55" /><stop offset="1" stopColor="#d8b98a" stopOpacity="0" /></radialGradient>
        <clipPath id="ba-l"><rect x="0" y="0" width="300" height="750" /></clipPath>
        <clipPath id="ba-r"><rect x="300" y="0" width="300" height="750" /></clipPath>
      </defs>
      <rect width="600" height="750" fill="url(#ba-bg)" />
      <g transform="rotate(-8 300 375)">
        <rect x="170" y="140" width="260" height="480" rx="38" fill="#232326" stroke="#5a4a36" strokeWidth="3" />
        <g clipPath="url(#ba-l)">
          <rect x="182" y="152" width="236" height="456" rx="28" fill="#0e0f12" />
          <g stroke="#cfd3da" strokeOpacity=".55" strokeWidth="1.4" fill="none">
            <path d="M240 330 L190 260 M240 330 L205 420 M240 330 L300 270 M240 330 L300 400 M240 330 L215 560 M240 330 L270 180" />
            <path d="M225 300 L260 312 L250 352 L215 345 Z" />
            <path d="M205 420 L188 470 M300 400 L290 470 L300 540 M270 180 L300 160" />
          </g>
        </g>
        <g clipPath="url(#ba-r)">
          <rect x="182" y="152" width="236" height="456" rx="28" fill="url(#ba-good)" />
          <rect x="182" y="152" width="236" height="456" rx="28" fill="url(#ba-glow)" />
          <text x="360" y="300" fontFamily="Fraunces, Georgia, serif" fontSize="44" fill="#f3ece2" textAnchor="middle" fontWeight="300">:09</text>
        </g>
      </g>
      <line x1="300" y1="0" x2="300" y2="750" stroke="#d8b98a" strokeWidth="1.5" />
      <circle cx="300" cy="375" r="20" fill="#0b0b0c" stroke="#d8b98a" strokeWidth="1.5" />
      <path d="M293 375 l-5 0 M307 375 l5 0" stroke="#d8b98a" strokeWidth="2" />
      <text x="80" y="690" fill="#9a958d" fontSize="13" letterSpacing="4" fontFamily="Inter, sans-serif">BEFORE</text>
      <text x="520" y="690" fill="#d8b98a" fontSize="13" letterSpacing="4" fontFamily="Inter, sans-serif" textAnchor="end">AFTER</text>
    </svg>
  )
}

export function StudioArt() {
  return (
    <svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" className="art">
      <defs>
        <linearGradient id="st-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141416" /><stop offset="1" stopColor="#09090a" /></linearGradient>
        <linearGradient id="st-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b241c" /><stop offset="1" stopColor="#0d0b09" /></linearGradient>
        <radialGradient id="st-lamp" cx=".5" cy="0" r="1"><stop offset="0" stopColor="#ffe6c0" stopOpacity=".5" /><stop offset=".6" stopColor="#d8b98a" stopOpacity=".05" /><stop offset="1" stopColor="#d8b98a" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="600" height="750" fill="url(#st-wall)" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={60 + i * 100} y="80" width="70" height="260" rx="4" fill="#111113" stroke="#26262a" />)}
      {[0, 1, 2, 3, 4].map((i) => <rect key={'g' + i} x={60 + i * 100} y="80" width="70" height="3" fill="#d8b98a" opacity=".5" />)}
      <path d="M150 380 L450 380 L520 750 L80 750 Z" fill="url(#st-lamp)" />
      <rect x="0" y="470" width="600" height="280" fill="url(#st-desk)" />
      <rect x="0" y="468" width="600" height="2" fill="#d8b98a" opacity=".5" />
      <path d="M300 300 L300 370 M260 380 L340 380 L320 362 L280 362 Z" stroke="#6b5a43" strokeWidth="3" fill="#1d1a16" />
      <rect x="230" y="520" width="140" height="80" rx="10" fill="#1b1b1e" stroke="#3a3a40" transform="rotate(-6 300 560)" />
      <circle cx="430" cy="560" r="26" fill="none" stroke="#7a6a52" strokeWidth="3" />
      <rect x="120" y="545" width="70" height="8" rx="4" fill="#4a4036" transform="rotate(18 155 549)" />
      <rect x="130" y="580" width="56" height="6" rx="3" fill="#6a5a46" transform="rotate(-10 158 583)" />
      <text x="80" y="690" fill="#9a958d" fontSize="13" letterSpacing="4" fontFamily="Inter, sans-serif">THE STUDIO · E MAIN ST</text>
    </svg>
  )
}

export function ModelsArt() {
  const phones = [
    { x: 70, h: 360, c: '#2a2a2e' }, { x: 190, h: 400, c: '#3a3128' }, { x: 320, h: 430, c: '#1e2229' }, { x: 455, h: 460, c: '#2d2a26' },
  ]
  return (
    <svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" className="art">
      <defs>
        <radialGradient id="md-bg" cx=".5" cy=".35" r=".8"><stop offset="0" stopColor="#1f1a14" /><stop offset="1" stopColor="#060607" /></radialGradient>
        <linearGradient id="md-scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a2118" /><stop offset="1" stopColor="#08090b" /></linearGradient>
      </defs>
      <rect width="600" height="750" fill="url(#md-bg)" />
      <ellipse cx="300" cy="640" rx="280" ry="22" fill="#000" opacity=".6" />
      {phones.map((p, i) => {
        const w = p.h * 0.48, y = 630 - p.h
        return (
          <g key={i}>
            <rect x={p.x - 20} y={y} width={w} height={p.h} rx={w * 0.17} fill={p.c} stroke="#6b5a43" strokeOpacity=".6" />
            <rect x={p.x - 13} y={y + 7} width={w - 14} height={p.h - 14} rx={w * 0.14} fill="url(#md-scr)" />
            <rect x={p.x - 20 + w / 2 - 14} y={y + 16} width="28" height="7" rx="3.5" fill="#000" />
            <rect x={p.x - 20 + w * 0.2} y={y + p.h * 0.3} width={w * 0.6} height="1.5" fill="#d8b98a" opacity=".6" />
          </g>
        )
      })}
      <text x="80" y="690" fill="#9a958d" fontSize="13" letterSpacing="4" fontFamily="Inter, sans-serif">EVERY GENERATION, EVERY SIZE</text>
    </svg>
  )
}
