export const sampleTacDataUrl =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" style="background:#0a0c10; font-family:sans-serif;">
  <!-- Scan Border & Header Info -->
  <rect x="0" y="0" width="600" height="600" fill="#08090c"/>
  <text x="25" y="35" fill="#4ade80" font-size="13" font-family="monospace">HCM - NEUROCIRURGIA / TAC CRANIO C/C</text>
  <text x="25" y="55" fill="#94a3b8" font-size="11" font-family="monospace">SITOE, ARMANDO M. | ID: 10482910 | DATA: 24/09/2026</text>
  <text x="470" y="35" fill="#f59e0b" font-size="12" font-family="monospace">AXIAL + C</text>
  <text x="470" y="55" fill="#94a3b8" font-size="11" font-family="monospace">KV 120 / SL 2.5mm</text>

  <!-- Skull Silhouette -->
  <ellipse cx="300" cy="300" rx="185" ry="215" fill="#2d3748" stroke="#cbd5e1" stroke-width="8"/>
  <ellipse cx="300" cy="300" rx="173" ry="202" fill="#171923" stroke="#4a5568" stroke-width="3"/>

  <!-- Brain Parenchyma -->
  <ellipse cx="300" cy="300" rx="160" ry="190" fill="#262a36"/>

  <!-- Ventricles with mass effect (shift) -->
  <!-- Left Ventricle (compressed, shifted) -->
  <path d="M 292 230 C 285 270, 275 320, 288 360 C 295 340, 298 270, 292 230 Z" fill="#0a0c10" stroke="#334155" stroke-width="2"/>
  <!-- Contralateral Ventricle dilated -->
  <path d="M 245 220 C 230 260, 230 330, 250 370 C 265 340, 260 260, 245 220 Z" fill="#0a0c10" stroke="#334155" stroke-width="2"/>

  <!-- Intracranial lesion in right fronto-parietal region (viewer left/right) -->
  <!-- Edema halo -->
  <circle cx="370" cy="275" r="55" fill="#1e222d" opacity="0.9"/>
  <!-- Ring enhancing lesion -->
  <circle cx="375" cy="270" r="42" fill="#3b4252" stroke="#e2e8f0" stroke-width="4"/>
  <circle cx="375" cy="270" r="28" fill="#111318"/>
  <circle cx="373" cy="268" r="12" fill="#0f172a"/>

  <!-- Midline shift arrow -->
  <path d="M 300 130 L 300 170" stroke="#ef4444" stroke-width="2" stroke-dasharray="4"/>
  <path d="M 300 430 L 300 470" stroke="#ef4444" stroke-width="2" stroke-dasharray="4"/>
  <path d="M 300 290 Q 285 295 282 305" stroke="#ef4444" stroke-width="3" fill="none"/>
  <text x="220" y="305" fill="#ef4444" font-size="11" font-weight="bold">Desvio: 7mm</text>

  <!-- Labels -->
  <text x="430" y="275" fill="#f87171" font-size="12" font-weight="bold">Lesão tumoral</text>
  <line x1="425" y1="272" x2="395" y2="272" stroke="#f87171" stroke-width="1.5"/>

  <text x="25" y="565" fill="#64748b" font-size="11">R: Direito | L: Esquerdo</text>
  <text x="430" y="565" fill="#38bdf8" font-size="11">TAC CRÂNIO AXIAL</text>
</svg>
`);

export const sampleRxDataUrl =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" style="background:#0a0c10; font-family:sans-serif;">
  <rect x="0" y="0" width="600" height="600" fill="#05070a"/>
  <!-- Header Info -->
  <text x="25" y="35" fill="#38bdf8" font-size="13" font-family="monospace">HOSPITAL CENTRAL DE MAPUTO / RX TÓRAX P.A.</text>
  <text x="25" y="55" fill="#94a3b8" font-size="11" font-family="monospace">SITOE, ARMANDO M. | ID: 10482910 | DATA: 24/09/2026</text>
  <text x="490" y="35" fill="#e2e8f0" font-size="14" font-weight="bold">PA ERECTO</text>

  <!-- Thoracic silhouette -->
  <path d="M 120 130 C 130 90, 470 90, 480 130 C 510 240, 520 440, 460 510 C 390 530, 210 530, 140 510 C 80 440, 90 240, 120 130 Z" fill="#131720" stroke="#334155" stroke-width="2"/>

  <!-- Spine / Trachea -->
  <rect x="294" y="100" width="12" height="380" fill="#475569" opacity="0.6"/>
  <line x1="300" y1="100" x2="300" y2="230" stroke="#0a0c10" stroke-width="6"/>

  <!-- Clavicles -->
  <path d="M 140 140 Q 220 160 290 145" stroke="#94a3b8" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M 460 140 Q 380 160 310 145" stroke="#94a3b8" stroke-width="7" fill="none" stroke-linecap="round"/>

  <!-- Ribs shadows -->
  <g stroke="#334155" stroke-width="4" fill="none" opacity="0.7">
    <path d="M 150 180 Q 230 200 295 190"/>
    <path d="M 450 180 Q 370 200 305 190"/>
    <path d="M 140 230 Q 230 260 295 240"/>
    <path d="M 460 230 Q 370 260 305 240"/>
    <path d="M 135 290 Q 230 320 295 290"/>
    <path d="M 465 290 Q 370 320 305 290"/>
    <path d="M 135 350 Q 230 380 295 340"/>
    <path d="M 465 350 Q 370 380 305 340"/>
  </g>

  <!-- Lungs (radiolucent dark zones) -->
  <path d="M 160 170 C 180 150, 270 170, 270 240 C 270 340, 240 430, 160 450 C 140 370, 140 240, 160 170 Z" fill="#090b0e"/>
  <path d="M 440 170 C 420 150, 330 170, 330 240 C 330 340, 360 430, 440 450 C 460 370, 460 240, 440 170 Z" fill="#090b0e"/>

  <!-- Cardiac Silhouette -->
  <path d="M 290 260 C 310 260, 340 320, 385 410 C 370 440, 300 460, 260 440 C 240 410, 240 360, 280 290 Z" fill="#334155" opacity="0.85" stroke="#64748b" stroke-width="2"/>

  <!-- Diaphragms -->
  <path d="M 130 460 Q 210 440 280 470" stroke="#94a3b8" stroke-width="4" fill="none"/>
  <path d="M 470 470 Q 400 445 340 480" stroke="#94a3b8" stroke-width="4" fill="none"/>

  <!-- Sinuses / Costophrenic angles -->
  <text x="110" y="495" fill="#4ade80" font-size="10">Seio costofrénico livre</text>
  <text x="390" y="505" fill="#4ade80" font-size="10">Seio livre</text>

  <text x="25" y="565" fill="#64748b" font-size="11">Índice cardiotorácico &lt; 0.50 (normal) | Sem consolidações</text>
  <text x="470" y="565" fill="#38bdf8" font-size="11">RX TÓRAX PA</text>
</svg>
`);
