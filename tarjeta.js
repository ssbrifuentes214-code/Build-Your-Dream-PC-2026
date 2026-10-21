/* Dibuja la ficha del presupuesto (igual a la que se imprime) en un <canvas>.
   La usan index.html (botón "Descargar imagen") y ficha.html (la página que abre el QR). */
const CARD_D = {
  es: { sheetT: 'Ficha técnica', perf: ['Básico', 'Entrada', 'Medio', 'Alto', 'Ultra'], fPsu: 'Fuente', fCool: 'Refrigeración', fBn: 'Cuello de botella', coolLiq: 'Líquida 240mm', coolAir: 'Por aire', yes: 'Sí', no: 'No', tot: 'TOTAL', note: 'Precios estimados en dólares, solo de los componentes elegidos.', noteArs: 'Precios estimados en pesos argentinos, según la cotización que escribas.', rate: 'Cotización' },
  en: { sheetT: 'Tech sheet', perf: ['Basic', 'Entry', 'Medium', 'High', 'Ultra'], fPsu: 'PSU', fCool: 'Cooling', fBn: 'Bottleneck', coolLiq: 'Liquid 240mm', coolAir: 'Air', yes: 'Yes', no: 'No', tot: 'TOTAL', note: 'Estimated prices in dollars, only for the chosen parts.', noteArs: 'Estimated prices in Argentine pesos, using the rate you enter.', rate: 'Rate' }
};

function drawCard(cv, o) {
  const { c, g, r, w, liq, ARS, RATE } = o;
  const L = o.L === 'en' ? 'en' : 'es', S = CARD_D[L];
  const fps = Math.round(Math.min(g.fps, c.cap) * r.f);
  const tier = [0, 60, 85, 110, 140].filter(v => fps >= v).length - 1;
  const bn = c.cap < g.fps, total = c.p + g.p + r.p;
  const money = n => ARS ? 'AR$ ' + Math.round(n * RATE).toLocaleString('es-AR') : 'US$ ' + n;
  const date = o.date || new Date().toLocaleDateString(L === 'en' ? 'en-US' : 'es-AR');
  const rowsA = [['CPU', c.n, money(c.p)], ['GPU', g.n, money(g.p)], ['RAM', r.n, money(r.p)]];
  const rowsB = [[S.fPsu, w + 'W · 80 Plus Bronze'], [S.fCool, liq ? S.coolLiq : S.coolAir], [S.fBn, bn ? S.yes : S.no]];
  if (ARS) rowsB.push([S.rate, 'US$ 1 = AR$ ' + RATE.toLocaleString('es-AR')]);

  const SC = 2, PAD = 28, PW = 480, P = 18, px = PAD, py = PAD;
  const yA = py + 94, yF = yA + rowsA.length * 32 + 12, yB = yF + 60, yE = yB + rowsB.length * 32;
  const pb = yE + 100, H = pb + 8 + PAD;
  cv.width = (PW + PAD * 2) * SC; cv.height = H * SC;
  const x = cv.getContext('2d');
  if (!x.roundRect) x.roundRect = function (a, b, ww, hh) { this.rect(a, b, ww, hh); };
  const HF = '"Chakra Petch",sans-serif', BF = 'Figtree,sans-serif', MF = '"Space Mono",monospace';
  const T = (s, a, b, col, al, font) => { x.font = font; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, a, b); };
  const line = (y, col, lw, dash) => { x.setLineDash(dash || []); x.strokeStyle = col; x.lineWidth = lw; x.beginPath(); x.moveTo(px + P, y); x.lineTo(px + PW - P, y); x.stroke(); x.setLineDash([]); };
  const rows = (list, y0) => {
    line(y0, '#cfd8ee', 1);
    list.forEach((s, i) => {
      const y = y0 + i * 32;
      T(s[0], px + P, y + 21, '#5a6a94', 'left', '700 13px ' + HF);
      T(s[1], px + P + 122, y + 21, '#0b1f4d', 'left', '500 15px ' + BF);
      if (s[2]) T(s[2], px + PW - P, y + 21, '#0b1f4d', 'right', '700 15px ' + MF);
      line(y + 32, '#cfd8ee', 1);
    });
  };

  function draw() {
    x.setTransform(SC, 0, 0, SC, 0, 0);
    const bg = x.createLinearGradient(0, 0, PW + PAD * 2, H); bg.addColorStop(0, '#0f2b6e'); bg.addColorStop(1, '#060f26');
    x.fillStyle = bg; x.fillRect(0, 0, PW + PAD * 2, H);
    // papel con borde recortado abajo
    x.save(); x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 24; x.shadowOffsetY = 10; x.fillStyle = '#f3f6ff';
    x.beginPath(); x.moveTo(px, py + 12); x.quadraticCurveTo(px, py, px + 12, py); x.lineTo(px + PW - 12, py); x.quadraticCurveTo(px + PW, py, px + PW, py + 12); x.lineTo(px + PW, pb);
    for (let xx = px + PW; xx > px + 1; xx -= 12) { x.lineTo(xx - 6, pb + 8); x.lineTo(xx - 12, pb); }
    x.closePath(); x.fill(); x.restore();

    T(S.sheetT, px + P, py + 31, '#2456d6', 'left', '700 13px ' + HF);
    T('Expo Técnica 2026', px + PW - P, py + 31, '#5a6a94', 'right', '500 13px ' + HF);
    line(py + 45, '#9fb0d8', 2, [6, 4]);
    T('Build Your Dream PC', px + P, py + 82, '#0b1f4d', 'left', '700 25px ' + HF);
    rows(rowsA, yA);
    x.fillStyle = '#0b1f4d'; x.beginPath(); x.roundRect(px + P, yF, PW - P * 2, 48, 8); x.fill();
    T(`${fps} FPS · ${S.perf[tier]}`, px + PW / 2, yF + 31, '#ffd23f', 'center', '700 22px ' + MF);
    rows(rowsB, yB);
    line(yE + 12, '#0b1f4d', 2);
    T(S.tot, px + P, yE + 42, '#0b1f4d', 'left', '700 18px ' + HF);
    T(money(total), px + PW - P, yE + 44, '#2456d6', 'right', '700 26px ' + MF);
    T(ARS ? S.noteArs : S.note, px + P, yE + 68, '#5a6a94', 'left', '500 12px ' + BF);
    T(date, px + PW - P, yE + 90, '#5a6a94', 'right', '500 12px ' + BF);
  }
  draw();
  const ready = document.fonts ? Promise.all(['700 13px "Chakra Petch"', '500 15px Figtree', '700 15px "Space Mono"'].map(f => document.fonts.load(f))).then(draw).catch(() => {}) : Promise.resolve();
  return { name: money(total), fps, total, money, ready };
}
