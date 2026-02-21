const $ = (id) => document.getElementById(id);

// ===== Router =====
const pages = { home:$("page-home"), test:$("page-test"), lessons:$("page-lessons"), chat:$("page-chat") };
const navBtns = { home:$("nav-home"), test:$("nav-test"), lessons:$("nav-lessons"), chat:$("nav-chat") };
let current = "home";

function go(name){
  if(!pages[name]) return;

  pages[current].classList.remove("active");
  pages[current].classList.add("back");

  pages[name].classList.remove("back");
  pages[name].classList.add("active");

  Object.keys(navBtns).forEach(k => navBtns[k].classList.toggle("active", k === name));
  current = name;

  if(name === "test") renderQuestion();

  setTimeout(() => {
    Object.values(pages).forEach(p => { if(!p.classList.contains("active")) p.classList.remove("back"); });
  }, 380);
}

navBtns.home.onclick = ()=>go("home");
navBtns.test.onclick = ()=>go("test");
navBtns.lessons.onclick = ()=>go("lessons");
navBtns.chat.onclick = ()=>go("chat");

// ===== Home actions =====
$("btn-call").onclick = ()=>{ window.location.href = "tel:+998889884840"; };
$("btn-maps").onclick = ()=>{ window.open("https://www.google.com/maps?q=Andijon%20Konchilik%20ko%27chasi%2077", "_blank"); };

// ===== Chat preview =====
const toast = $("toast");
$("btn-send").onclick = ()=>{
  const v = ($("chatMsg").value || "").trim();
  if(!v) return;
  $("chatMsg").value = "";
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 1600);
};
$("btn-call2").onclick = ()=>{ window.location.href = "tel:+998889884840"; };
$("btn-telegram").onclick = ()=>{ window.open("https://t.me/uzactive", "_blank"); };

// ===== Quiz: offline images via SVG (simple) =====
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
    <rect x="350" y="115" width="60" height="90" rx="12" fill="#00B4FF" opacity=".9"/>
    <rect x="200" y="235" width="90" height="55" rx="12" fill="#00B4FF" opacity=".9"/>
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
    <polygon points="520,285 610,310 520,335" fill="rgba(255,255,255,.25)"/>
    <polygon points="610,275 710,310 610,345" fill="rgba(255,255,255,.18)"/>
  </svg>`),
  svetofor: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500">
    <rect width="900" height="500" fill="#06101b"/>
    <rect x="0" y="280" width="900" height="220" fill="#0b1118"/>
    <rect x="120" y="110" width="120" height="260" rx="28" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.2)" stroke-width="4"/>
    <circle cx="180" cy="240" r="34" fill="rgba(0,180,255,.55)"/>
  </svg>`)
};

const quiz = [
  { img: IMG.chorraha, q:"Teng huquqli chorrahada odatda kimga yo‘l beriladi?", o:["A) Chap tomondagiga","B) O‘ng tomondagiga","C) Tezroq kelayotganiga"], c:1 },
  { img: IMG.signal,   q:"Burilishdan oldin nima qilinadi?", o:["A) Signal beriladi","B) Signal shart emas","C) Faqat tunda signal"], c:0 },
  { img: IMG.masofa,   q:"Tezlik oshganda xavfsiz masofa qanday bo‘ladi?", o:["A) Kamayadi","B) O‘zgarmaydi","C) Oshadi"], c:2 },
  { img: IMG.belgi,    q:"Yo‘l belgisi nimaga xizmat qiladi?", o:["A) Ogohlantirish va xavfsizlik","B) Bezak","C) Faqat imtihon uchun"], c:0 },
  { img: IMG.svetofor, q:"Svetoforning sariq chirog‘i nimani anglatadi?", o:["A) Tez yurish","B) Ogohlantirish / ehtiyot bo‘lish","C) Park qilish"], c:1 },
];

let qpos = 0, score = 0, locked = false;
const qposEl  = $("qpos");
const scoreEl = $("score");
const qtextEl = $("qtext");
const fbEl    = $("feedback");
const qimgEl  = $("qimg");
const optEls  = [$("a0"), $("a1"), $("a2")];

function animSwapImg(){
  qimgEl.classList.remove("imgAnim");
  void qimgEl.offsetWidth;
  qimgEl.classList.add("imgAnim");
}

function renderQuestion(){
  const item = quiz[qpos];
  optEls.forEach(b=>{
    b.classList.remove("ok","bad");
    b.style.display = "block";
  });

  if(!item){
    qtextEl.textContent = "✅ Test tugadi!";
    qposEl.textContent  = "Yakun";
    fbEl.textContent    = `Natija: ${score}/${quiz.length}`;
    qimgEl.src = IMG.masofa;
    animSwapImg();

    optEls[0].textContent = "🔁 Qayta";
    optEls[1].textContent = "🏠 Home";
    optEls[2].style.display = "none";

    optEls[0].onclick = () => resetQuiz();
    optEls[1].onclick = () => go("home");
    return;
  }

  locked = false;
  fbEl.textContent = "";
  qposEl.textContent  = `Savol ${qpos+1}/${quiz.length}`;
  scoreEl.textContent = `Ball: ${score}`;
  qtextEl.textContent = item.q;

  qimgEl.src = item.img;
  animSwapImg();

  optEls.forEach((b,i)=>{
    b.textContent = item.o[i];
    b.onclick = () => answer(i);
  });
}

function answer(i){
  if(locked) return;
  locked = true;

  const item = quiz[qpos];
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

  setTimeout(()=>{ qpos++; renderQuestion(); }, 700);
}

function resetQuiz(){
  qpos = 0; score = 0; locked = false;
  optEls[2].style.display = "block";
  renderQuestion();
}

$("btn-reset").onclick = resetQuiz;
$("btn-home").onclick = ()=>go("home");
renderQuestion();

// ===== Video lessons =====
const lessons = [
  { name: "1-dars: Chorraha qoidalari", desc: "Chorrahada o‘ng qoida, yo‘l berish, tartib va xavfsizlik.", yt: "dQw4w9WgXcQ" },
  { name: "2-dars: Masofa saqlash (3 soniya)", desc: "Oldingi mashinaga xavfsiz masofani saqlash bo‘yicha amaliy tushuntirish.", yt: "kJQP7kiw5Fk" },
  { name: "3-dars: Yo‘l belgilari asoslari", desc: "Eng ko‘p uchraydigan belgilar va ularning ma’nosi.", yt: "3JZ_D3ELwOQ" },
  { name: "4-dars: Yuk gabaritlari (misol bilan)", desc: "Yuk chiqib turishi va xavfsizlik belgilarini amaliy misolda ko‘rsatish.", yt: "9bZkp7q19f0" },
];

const lessonVideo = $("lessonVideo");
const lessonName = $("lessonName");
const lessonDesc = $("lessonDesc");
const lessonButtons = document.querySelectorAll(".lessonBtn");

function setLesson(i){
  const L = lessons[i];
  if(!L) return;

  lessonButtons.forEach(b => b.classList.remove("active"));
  document.querySelector(`.lessonBtn[data-video="${i}"]`)?.classList.add("active");

  lessonName.textContent = L.name;
  lessonDesc.textContent = L.desc;

  const src = `https://www.youtube.com/embed/${L.yt}?rel=0&modestbranding=1`;
  lessonVideo.src = src;
}

lessonButtons.forEach(btn=>{
  btn.onclick = ()=>{
    const i = Number(btn.getAttribute("data-video"));
    setLesson(i);
  };
});

setLesson(0);
