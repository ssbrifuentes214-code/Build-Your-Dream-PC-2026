const T = [
  ["FPS / Frames Per Second", "Cuadros por segundo", "Cantidad de imágenes por segundo. 30 = trabado, 60 = fluido, 144 = competitivo.", ["FPS means Frames Per Second. More FPS is smoother."]],
  ["Bottleneck", "Cuello de botella", "Un componente lento frena a los demás. Ej: RTX 4060 + CPU viejo.", ["Bottleneck is when one slow component limits the others."]],
  ["Overheating y Thermal Throttling", "Sobrecalentamiento", "Una PC sucia o sin pasta térmica se calienta y baja el rendimiento sola para no quemarse.", ["Overheating causes FPS drop."]],
  ["Thermal Paste", "Pasta térmica", "Crema entre CPU y cooler. Se cambia 1 vez por año.", ["Thermal paste transfers heat from CPU to cooler."]],
  ["Driver", "Controlador", "Programa que hace que Windows entienda la placa. Sin driver actualizado, menos FPS.", ["Driver is the software for your hardware."]],
  ["Cooling", "Refrigeración", "Air cooling: cooler clásico con disipador y fan, barato. Liquid cooling: usa líquido por mangueras, mucho más eficiente. AIO (All-In-One): viene cerrada y lista, de 120/240/360mm. Custom loop: a medida, carísima. Dato clave: para i7/Ryzen 7 y 144 FPS, el aire no alcanza, necesitás liquid cooling de 240mm.", ["For high FPS you need liquid cooling, air cooling is not enough for i7", "Liquid cooling is better for overclocking."]],
  ["Compatibility", "Compatibilidad", "Socket: LGA1700 no entra en LGA1200, AM4 no entra en AM5. DDR5 no entra en una mother DDR4.", ["Check compatibility before buying."]],
  ["PSU / Power Supply", "Fuente", "Calcular watts. CPU 65W + GPU 160W + resto = mínimo 550W 80 Plus Bronze. Una fuente genérica se quema.", []],
  ["Motherboard / Chipset", "Placa madre", "H610 básico, B760 medio, Z790 para overclock.", []],
  ["RAM / Dual Channel", "Memoria doble canal", "No es lo mismo 1x16GB que 2x8GB. 2x8GB da hasta 20% más FPS.", []],
  ["Storage", "Almacenamiento", "HDD vs SSD SATA vs SSD NVMe M.2. Hoy sin NVMe no sos gamer.", []],
  ["BIOS Update", "Actualizar la BIOS", "Si ponés un Ryzen 5000 en una mother AM4 vieja, no da video hasta actualizar la BIOS.", []],
  ["Monitor", "Monitor", "Si tu monitor es de 60Hz, no vas a ver más de 60 FPS aunque tu PC tire 144.", []]
];
const G = [["Motherboard","Placa madre"],["CPU / Processor","Procesador"],["GPU / Graphics Card","Placa de video"],["RAM / Memory","Memoria"],["PSU / Power Supply","Fuente"],["Storage","Almacenamiento"],["BIOS","BIOS"],["Driver","Controlador"],["Format","Formatear"],["Overheating","Sobrecalentamiento"],["Thermal Paste","Pasta térmica"],["Bottleneck","Cuello de botella"],["Upgrade","Mejora"],["FPS / Frames Per Second","Cuadros por segundo"],["Lag","Retraso / Tirón"],["Build","Armado de PC"],["Benchmark","Prueba de rendimiento"],["Install","Instalar"],["Backup","Copia de seguridad"],["Bug","Error"],["Crash","Cuelgue"],["Cooling","Refrigeración"],["Case","Gabinete"],["Slot","Ranura"],["Cable Management","Orden de cables"],["Update","Actualización"],["Setup","Configuración / Escritorio gamer"],["Peripheral","Periférico"],["Performance","Rendimiento"],["Liquid Cooling / Air Cooling / AIO","Refrigeración líquida / por aire"]];
const P = [["Welcome!","¡Bienvenidos!"],["Scan here","Escaneá acá"],["You chose...","Elegiste..."],["You get... FPS","Tenés... FPS"],["No bottleneck","Sin cuello de botella"],["Liquid cooling is better","La refrigeración líquida es mejor"],["Check compatibility","Chequeá la compatibilidad"],["This is your budget","Este es tu presupuesto"],["Thanks for coming!","¡Gracias por venir!"]];

const $ = id => document.getElementById(id);
const say = t => {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(t), { lang: "en-US", rate: 0.9 }));
};
const btn = t => `<button type="button" class="say" data-say="${t}" aria-label="Escuchar: ${t}">🔊</button>`;

$("theory").innerHTML = T.map((x, i) => `<article class="card"><h3>${i + 1}. ${x[0]} <small>${x[1]}</small></h3><p>${x[2]}</p>${x[3].map(p => `<p class="en">${btn(p)} “${p}”</p>`).join("")}</article>`).join("");
$("gloss").innerHTML = G.map((x, i) => `<div class="gcard"><b>${i + 1}</b><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("");
$("speak").innerHTML = P.map(x => `<li>${btn(x[0])}<span class="en">${x[0]}</span><span class="es">${x[1]}</span></li>`).join("");
document.addEventListener("click", e => { const b = e.target.closest(".say"); if (b) say(b.dataset.say); });

/* Simulador */
const CPU = { "i3": 1, "i5": 2, "i7": 3, "Ryzen 5": 2, "Ryzen 7": 3 };
const GPU = { "RTX 3060": [90, 1], "RTX 4060": [120, 2], "RTX 4070": [144, 3] };
function sim() {
  const c = $("s-cpu").value, g = $("s-gpu").value, r = +$("s-ram").value, hz = +$("s-hz").value;
  const [base, gt] = GPU[g], ct = CPU[c], gap = gt - ct;
  let f = base; const tips = [];
  if (gap > 0) { f = Math.round(f * (1 - 0.12 * gap)); tips.push(["Bottleneck: your CPU limits your GPU.", "Cuello de botella: tu CPU frena a tu placa de video."]); }
  if (r === 8) { f = Math.round(f * 0.85); tips.push(["8GB is basic. Upgrade to 16GB.", "8GB es básico. Pasá a 16GB."]); }
  const shown = Math.min(f, hz);
  if (hz < f) tips.push([`Your ${hz}Hz monitor shows ${hz} FPS at most.`, `Tu monitor de ${hz}Hz muestra como máximo ${hz} FPS.`]);
  if (ct === 3 && base >= 144) tips.push(["For high FPS you need liquid cooling (240mm).", "Para altos FPS necesitás refrigeración líquida de 240mm."]);
  if (!gap) tips.unshift(["Great performance, no bottleneck.", "Gran rendimiento, sin cuello de botella."]);
  tips.push(["PSU: 550W 80 Plus Bronze minimum.", "Fuente: mínimo 550W 80 Plus Bronze."]);
  const level = shown >= 144 ? "Competitivo" : shown >= 60 ? "Fluido" : "Trabado";
  const phrase = `You chose ${g} + ${c} + ${r}GB. You get ${shown} FPS!`;
  $("sim-out").innerHTML = `<p class="en big">${btn(phrase)} ${phrase}</p>
    <div class="meter" data-fps="${shown}" role="img" aria-label="${shown} FPS, ${level}"><i style="width:${Math.min(100, shown / 144 * 100)}%"></i><span>${shown} FPS · ${level}</span></div>
    <ul>${tips.map(t => `<li><span class="en">${t[0]}</span><span class="es">${t[1]}</span></li>`).join("")}</ul>`;
}
["s-cpu", "s-gpu", "s-ram", "s-hz"].forEach(id => $(id).addEventListener("change", sim));
sim();

/* Buscador y traductor */
const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const DB = [
  ...G.map(x => ({ k: "Glosario", en: x[0], es: x[1], x: "" })),
  ...P.map(x => ({ k: "Frase", en: x[0], es: x[1], x: "" })),
  ...T.map(x => ({ k: "Teoría", en: x[0], es: x[1], x: x[2] + " " + x[3].join(" ") }))
];
let toEs = true;
function find() {
  const q = norm($("q").value.trim());
  const out = $("results");
  if (!q) { out.innerHTML = `<li class="empty">Escribí en inglés o en español para buscar en el glosario, las frases y la teoría.</li>`; return; }
  const hits = DB.filter(d => norm(d.en + " " + d.es + " " + d.x).includes(q)).slice(0, 12);
  out.innerHTML = hits.length ? hits.map(d => {
    const [a, b] = toEs ? [d.en, d.es] : [d.es, d.en];
    return `<li><span class="tag">${d.k}</span><strong>${a}</strong><span class="arrow">→</span><span>${b}</span>${d.k !== "Teoría" ? btn(d.en) : ""}${d.x ? `<small>${d.x}</small>` : ""}</li>`;
  }).join("") : `<li class="empty">No encontré “${$("q").value}”. Probá con otra palabra.</li>`;
}
$("q").addEventListener("input", find);
$("dir").addEventListener("click", e => {
  toEs = !toEs;
  e.target.textContent = toEs ? "Mostrar: inglés → español" : "Mostrar: español → inglés";
  e.target.setAttribute("aria-pressed", String(!toEs));
  find();
});
find();

/* Navegación por vistas: al entrar solo se ve la primera (Proyecto) */
const links = document.querySelectorAll(".menu a[data-go]");
const views = document.querySelectorAll("[data-view]");
function show(v, scroll) {
  if (![...links].some(a => a.dataset.go === v)) v = "proyecto";
  views.forEach(el => el.classList.toggle("on", el.dataset.view.split(" ").includes(v)));
  links.forEach(a => {
    const on = a.dataset.go === v;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  if (scroll) $("main-top").scrollIntoView({ behavior: "smooth" });
}
const route = () => location.hash.replace("#/", "");
window.addEventListener("hashchange", () => show(route(), true));
show(route(), false);

/* Barra de FPS: va de un lado al otro a la cadencia de los FPS */
(function () {
  const PERIOD = 2000; // ms que tarda en cruzar la barra
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let lastDraw = 0;
  function loop(t) {
    const bar = document.querySelector("#sim-out .meter");
    if (bar && bar.offsetParent !== null) {
      const fps = +bar.dataset.fps || 60;
      if (t - lastDraw >= 1000 / fps) {
        lastDraw = t;
        const ph = (t % (PERIOD * 2)) / PERIOD;
        bar.firstElementChild.style.width = (ph < 1 ? ph : 2 - ph) * 100 + "%";
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
