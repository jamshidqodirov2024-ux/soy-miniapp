// app.js — SOY AVTOMAKTABI (clean & stable)
const $ = (id) => document.getElementById(id);
const safe = (fn) => { try { fn(); } catch(e) { console.log(e); } };

// Pages
const pages = {
  home: $("page-home"),
  test: $("page-test"),
  lessons: $("page-lessons"),
  chat: $("page-chat"),
};

const nav = {
  home: $("nav-home"),
  test: $("nav-test"),
  lessons: $("nav-lessons"),
  chat: $("nav-chat"),
};

let current = "home";

function showPage(name){
  if(!pages[name]) return;

  Object.keys(pages).forEach(k => pages[k]?.classList.remove("active"));
  Object.keys(nav).forEach(k => nav[k]?.classList.remove("active"));

  pages[name].classList.add("active");
  nav[name]?.classList.add("active");
  current = name;

  if(name === "test") renderQuestion();
}

nav.home?.addEventListener("click", () => showPage("home"));
nav.test?.addEventListener("click", () => showPage("test"));
nav.lessons?.addEventListener("click", () => showPage("lessons"));
nav.chat?.addEventListener("click", () => showPage("chat"));

// Home actions
$("btn-call")?.addEventListener("click", () => window.location.href = "tel:+998889884840");
$("btn-maps")?.addEventListener("click", () =>
  window.open("https://www.google.com/maps?q=Andijon%20Konchilik%20ko%27chasi%2077", "_blank")
);

// Chat preview
const toast = $("toast");
$("btn-send")?.addEventListener("click", () => {
  const input = $("chatMsg");
  const v = (input?.value || "").trim();
  if(!v) return;
  input.value = "";
  toast?.classList.add("show");
  setTimeout(() => toast?.classList.remove("show"), 1500);
});
$("btn-call2")?.addEventListener("click", () => window.location.href = "tel:+998889884840");
$("btn-telegram")?.addEventListener("click", () => window.open("https://t.me/uzactive", "_blank"));

// Quiz images (offline)
function svgData(svg){
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg.trim());
}
const IMG = {
  chorraha: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500">
    <rect width="900" height="500" fill="#06101b"/>
    <rect x="360" y="0" width="180" height="500" fill="#0b1118"/>
    <rect x="0" y="180" width="900" height="140" fill="#0b1118"/>
    <rect x="420" y="340" width="60" height="90" rx="12" fill="#00B4FF"/>
    <rect x="560" y="210" width="90" height="55" rx="12" fill="#00B4FF"/>
  </svg>`),
  masofa: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500">
    <rect width="900" height="500" fill="#06101b"/>
    <rect x="0" y="260" width="900" height="240" fill="#0b1118"/>
    <rect x="180" y="320" width="220" height="80" rx="18" fill="#00B4FF"/>
    <rect x="520" y="320" width="220" height="80" rx="18" fill="#00B4FF" opacity=".85"/>
    <line x1="400" y1="360" x2="520" y2="360" stroke="rgba(255,255,255,.7)" stroke-width="6" stroke-dasharray="12 10"/>
  </svg>`),
  belgi: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500">
    <rect width="900" height="500" fill="#06101b"/>
    <rect x="0" y="300" width="900" height="200" fill="#0b1118"/>
    <rect x="140" y="120" width="160" height="160" rx="28" fill="#00B4FF"/>
    <rect x="210" y="280" width="20" height="150" rx="10" fill="rgba(255,255,255,.5)"/>
  </svg>`),
  signal: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500">
    <rect width="900" height="500" fill="#071321"/>
    <rect x="0" y="290" width="900" height="210" fill="#0b1118"/>
    <rect x="180" y="260" width="320" height="90" rx="18" fill="#00B4FF"/>
    <polygon points="520,285 610,310 520,335" fill="rgba(255,255,255,.22)"/>
  </svg>`),
  svetofor: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500">
    <rect width="900" height="500" fill="#06101b"/>
    <rect x="0" y="280" width="900" height="220" fill="#0b1118"/>
    <rect x="120" y="110" width="120" height="260" rx="28" fill="rgba(255,255,255,.10)" stroke="rgba(255,255,255,.2)" stroke-width="4"/>
    <circle cx="180" cy="240" r="34" fill="rgba(0,180,255,.55)"/>
  </svg>`)
};

const quiz = [
  { img: IMG.chorraha, q:"Teng huquqli chorrahada odatda kimga yo‘l beriladi?", o:["Chap tomondagiga","O‘ng tomondagiga","Tezroq kelayotganiga"], c:1 },
  { img: IMG.signal,   q:"Burilishdan oldin nima qilinadi?", o:["Signal beriladi","Signal shart emas","Faqat tunda signal"], c:0 },
  { img: IMG.masofa,   q:"Tezlik oshganda xavfsiz masofa qanday bo‘ladi?", o:["Kamayadi","O‘zgarmaydi","Oshadi"], c:2 },
  { img: IMG.belgi,    q:"Yo‘l belgisi nimaga xizmat qiladi?", o:["Ogohlantirish va xavfsizlik","Bezak","Faqat imtihon uchun"], c:0 },
  { img: IMG.svetofor, q:"Sariq chiroq nimani anglatadi?", o:["Tez yurish","Ogohlantirish / ehtiyot bo‘lish","Park qilish"], c:1 },
];

let qi = 0, score = 0, locked = false;

const qposEl = $("qpos");
const scoreEl = $("score");
const qimgEl = $("qimg");
const qtextEl = $("qtext");
const fbEl = $("feedback");
const optEls = [$("a0"), $("a1"), $("a2")];

function renderQuestion(){
  safe(() => {
    const item = quiz[qi];

    // reset
    optEls.forEach(b => { b.classList.remove("ok","bad"); b.style.display="block"; });

    if(!item){
      qposEl.textContent = "Yakun";
      scoreEl.textContent = `Ball: ${score}`;
      qimgEl.src = IMG.masofa;
      qtextEl.textContent = "✅ Test tugadi!";
      fbEl.textContent = `Natija: ${score}/${quiz.length}`;

      optEls[0].textContent = "🔁 Qayta";
      optEls[1].textContent = "🏠 Home";
      optEls[2].style.display = "none";

      optEls[0].onclick = resetQuiz;
      optEls[1].onclick = () => showPage("home");
      return;
    }

    locked = false;
    qposEl.textContent = `Savol ${qi+1}/${quiz.length}`;
    scoreEl.textContent = `Ball: ${score}`;
    qimgEl.src = item.img;
    qtextEl.textContent = item.q;
    fbEl.textContent = "";

    optEls.forEach((b,i) => {
      b.textContent = item.o[i];
      b.onclick = () => answer(i);
    });
  });
}

function answer(i){
  if(locked) return;
  locked = true;

  const item = quiz[qi];
  const correct = item.c;

  if(i === correct){
    score++;
    optEls[i].classList.add("ok");
    fbEl.textContent = "To‘g‘ri ✅";
  } else {
    optEls[i].classList.add("bad");
    optEls[correct].classList.add("ok");
    fbEl.textContent = "Noto‘g‘ri ❌";
  }
  scoreEl.textContent = `Ball: ${score}`;

  setTimeout(() => { qi++; renderQuestion(); }, 650);
}

function resetQuiz(){
  qi = 0; score = 0; locked = false;
  optEls[2].style.display = "block";
  renderQuestion();
}

$("btn-reset")?.addEventListener("click", resetQuiz);
$("btn-home")?.addEventListener("click", () => showPage("home"));

// Lessons
const lessons = [
  { name:"1-dars: Chorraha qoidalari", desc:"Chorrahada o‘ng qoida, yo‘l berish, tartib va xavfsizlik.", yt:"dQw4w9WgXcQ" },
  { name:"2-dars: Masofa saqlash", desc:"Xavfsiz oraliq va 3 soniya qoidasi.", yt:"kJQP7kiw5Fk" },
  { name:"3-dars: Yo‘l belgilari", desc:"Eng ko‘p uchraydigan belgilar va ma’nolari.", yt:"3JZ_D3ELwOQ" },
  { name:"4-dars: Yuk gabaritlari", desc:"Yuk chiqib turishi va xavfsizlik bo‘yicha eslatmalar.", yt:"9bZkp7q19f0" },
];

const lessonVideo = $("lessonVideo");
const lessonName = $("lessonName");
const lessonDesc = $("lessonDesc");
const lessonBtns = document.querySelectorAll(".lessonBtn");

function setLesson(i){
  const L = lessons[i];
  if(!L) return;

  lessonBtns.forEach(b => b.classList.remove("active"));
  document.querySelector(`.lessonBtn[data-video="${i}"]`)?.classList.add("active");

  lessonName.textContent = L.name;
  lessonDesc.textContent = L.desc;
  lessonVideo.src = `https://www.youtube.com/embed/${L.yt}?rel=0&modestbranding=1`;
}

lessonBtns.forEach(btn => {
  btn.addEventListener("click", () => setLesson(Number(btn.dataset.video)));
});

setLesson(0);
renderQuestion();
