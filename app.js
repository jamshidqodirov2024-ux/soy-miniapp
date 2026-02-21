// ===== Router (bo'limlar) =====
const pages = {
  home: document.getElementById("page-home"),
  test: document.getElementById("page-test"),
  lessons: document.getElementById("page-lessons"),
  chat: document.getElementById("page-chat"),
};

function go(pageName){
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[pageName].classList.add("active");

  document.querySelectorAll(".navBtn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(`[data-go="${pageName}"]`).forEach(b => b.classList.add("active"));
}

document.querySelectorAll("[data-go]").forEach(btn=>{
  btn.addEventListener("click", ()=> go(btn.dataset.go));
});

// ===== TEST (bal faqat userda) =====
const qpos = document.getElementById("qpos");
const scoreEl = document.getElementById("score");
const qtext = document.getElementById("qtext");
const answersEl = document.getElementById("answers");
const btnNext = document.getElementById("btn-next");
const btnRestart = document.getElementById("btn-restart");

const quiz = [
  {
    q: "Chorraha (svetoforsiz) holatda kim birinchi o'tadi?",
    a: ["O'ng tomondagi", "Chap tomondagi", "Tezroq kelayotgan"],
    correct: 0,
  },
  {
    q: "Tezlikni belgilovchi belgi qaysi?",
    a: ["⚠️ Ogohlantiruvchi", "🔵 Majburiy", "⭕ Taqiqlovchi (raqam bilan)"],
    correct: 2,
  },
  {
    q: "Piyodalar o'tish joyida haydovchi nima qiladi?",
    a: ["Tezlashtiradi", "Piyodaga yo‘l beradi", "Signal beradi"],
    correct: 1,
  },
  {
    q: "Avtomobilni to'xtatish masofasi nimaga bog'liq?",
    a: ["Faqat rulga", "Yo'l va tezlikka", "Faqat rangiga"],
    correct: 1,
  },
  {
    q: "Telefonni rulda ishlatish…",
    a: ["Ruxsat", "Tavsiya", "Taqiqlangan"],
    correct: 2,
  },
];

let idx = 0;
let score = 0;
let locked = false;

function renderQuestion(){
  locked = false;
  const total = quiz.length;

  qpos.textContent = `Savol ${idx+1}/${total}`;
  scoreEl.textContent = `Ball: ${score}`;
  qtext.textContent = quiz[idx].q;

  answersEl.innerHTML = "";
  quiz[idx].a.forEach((txt, i)=>{
    const b = document.createElement("button");
    b.className = "btn ans";
    b.textContent = txt;
    b.addEventListener("click", ()=> choose(i, b));
    answersEl.appendChild(b);
  });
}

function choose(i, btn){
  if(locked) return;
  locked = true;

  const correct = quiz[idx].correct;
  const all = [...answersEl.querySelectorAll(".ans")];

  if(i === correct){
    score += 1;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    all[correct].classList.add("correct");
  }
  scoreEl.textContent = `Ball: ${score}`;
}

btnNext.addEventListener("click", ()=>{
  if(idx < quiz.length - 1){
    idx += 1;
    renderQuestion();
  } else {
    // Finish
    qtext.textContent = `✅ Test tugadi! Sizning natija: ${score}/${quiz.length}`;
    answersEl.innerHTML = "";
    qpos.textContent = "Yakun";
  }
});

btnRestart.addEventListener("click", ()=>{
  idx = 0;
  score = 0;
  renderQuestion();
});

// ===== Darslar =====
const lessonTitle = document.getElementById("lessonTitle");
const lessonDesc = document.getElementById("lessonDesc");
const lessonLink = document.getElementById("lessonLink");

const lessons = [
  {
    title: "1-dars: Chorrahada qoida",
    desc: "Chorraha tartibi: o'ng qoida, yo'l berish, xavfsizlik.",
    url: "https://www.youtube.com/", // keyin o'zingiz link qo'yasiz
  },
  {
    title: "2-dars: Yo'l belgilari",
    desc: "Asosiy belgilar va ularning ma'nosi.",
    url: "https://www.youtube.com/",
  },
  {
    title: "3-dars: Tezlik",
    desc: "Tezlik cheklovi va xavfsiz masofa.",
    url: "https://www.youtube.com/",
  },
];

function setLesson(i){
  const L = lessons[i];
  lessonTitle.textContent = L.title;
  lessonDesc.textContent = L.desc;
  lessonLink.href = L.url;
}

document.querySelectorAll("[data-lesson]").forEach(b=>{
  b.addEventListener("click", ()=> setLesson(Number(b.dataset.lesson)));
});

// ===== Chat demo =====
const toast = document.getElementById("toast");
document.getElementById("btn-send").addEventListener("click", ()=>{
  const v = (document.getElementById("chatMsg").value || "").trim();
  if(!v) return;
  document.getElementById("chatMsg").value = "";
  toast.classList.add("show");
  setTimeout(()=> toast.classList.remove("show"), 1400);
});

document.getElementById("btn-call").addEventListener("click", ()=>{
  window.location.href = "tel:+998889884840";
});
document.getElementById("btn-telegram").addEventListener("click", ()=>{
  window.open("https://t.me/uzactive", "_blank");
});

// ===== Start =====
setLesson(0);
renderQuestion();
go("home");