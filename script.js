const destinations = {
  fukuoka: {
    name: "후쿠오카", english: "FUKUOKA", country: "JAPAN · FUKUOKA", coord: "33.5904° N", tagline: "골목마다 맛있는 순간이 기다리는 가까운 휴식", flight: "1시간 20분", season: "10월 — 5월", color: "#f9a482", accent: "#2854f4", base: 72,
    tastes: ["food", "relax", "shopping"],
    spots: [
      ["🍜", "하카타의 첫 끼", "도착하자마자 즐기는 진한 돈코츠 라멘"], ["🌊", "모모치 해변", "바닷바람과 노을을 따라 걷는 저녁"], ["♨️", "유후인 온천", "느린 골목과 따뜻한 료칸에서 하루"], ["🛍️", "텐진 산책", "로컬 숍과 카페를 발견하는 마지막 날"]
    ]
  },
  danang: {
    name: "다낭", english: "DA NANG", country: "VIETNAM · DA NANG", coord: "16.0544° N", tagline: "햇살과 미식, 리조트의 여유가 한곳에", flight: "4시간 40분", season: "2월 — 8월", color: "#53bcd2", accent: "#ff775f", base: 88,
    tastes: ["relax", "food", "nature"],
    spots: [
      ["🌴", "미케 비치", "파도 소리로 시작하는 가벼운 산책"], ["🥢", "한시장 미식", "반쎄오와 쌀국수로 채우는 로컬 테이블"], ["🏮", "호이안의 밤", "등불이 켜진 골목을 천천히 걷기"], ["⛰️", "바나힐", "구름 위 골든브리지와 시원한 전망"]
    ]
  },
  barcelona: {
    name: "바르셀로나", english: "BARCELONA", country: "SPAIN · BARCELONA", coord: "41.3874° N", tagline: "건축과 예술, 지중해의 리듬을 걷는 도시", flight: "14시간 10분", season: "4월 — 10월", color: "#ee8a49", accent: "#2854f4", base: 215,
    tastes: ["culture", "food", "shopping"],
    spots: [
      ["⛪", "사그라다 파밀리아", "빛과 곡선으로 만나는 가우디의 세계"], ["🎨", "고딕 지구", "오래된 골목과 작은 갤러리 탐험"], ["🥘", "보케리아 시장", "타파스와 해산물로 즐기는 현지의 맛"], ["🌅", "바르셀로네타", "지중해의 저녁빛을 따라 걷는 해변"]
    ]
  },
  chiangmai: {
    name: "치앙마이", english: "CHIANG MAI", country: "THAILAND · CHIANG MAI", coord: "18.7883° N", tagline: "초록빛 자연과 느린 하루가 있는 북쪽 도시", flight: "5시간 50분", season: "11월 — 2월", color: "#77a56a", accent: "#d8ff3e", base: 98,
    tastes: ["nature", "relax", "culture"],
    spots: [
      ["🛕", "올드타운 사원", "아침 햇살 아래 고요한 사원 산책"], ["☕", "님만해민 카페", "로컬 로스터리와 디자인 숍 탐험"], ["🌿", "도이인타논", "폭포와 구름숲을 만나는 트레킹"], ["🏮", "선데이 마켓", "수공예품과 길거리 음식으로 채운 밤"]
    ]
  }
};

const tasteNames = { food: "미식", relax: "휴식", culture: "문화", nature: "자연", shopping: "쇼핑" };
const budget = document.querySelector("#budget");
const budgetDisplay = document.querySelector("#budgetDisplay");
const durationButtons = [...document.querySelectorAll("[data-days]")];
const tasteButtons = [...document.querySelectorAll("[data-taste]")];
const itinerary = document.querySelector("#itinerary");
let days = 4;
let shuffleOffset = 0;

function selectedTastes() {
  return tasteButtons.filter((button) => button.classList.contains("active")).map((button) => button.dataset.taste);
}

function scoreDestination(destination, key) {
  const amount = Number(budget.value);
  const target = destination.base + Math.max(0, days - 3) * (destination.base * 0.16);
  const budgetScore = Math.max(0, 42 - Math.abs(amount - target) * 0.22);
  const tasteScore = selectedTastes().reduce((score, taste) => score + (destination.tastes.includes(taste) ? 27 : 2), 0);
  const shuffleScore = ((Object.keys(destinations).indexOf(key) + shuffleOffset) % 4) * 2;
  return budgetScore + tasteScore + shuffleScore;
}

function getRecommendation() {
  return Object.entries(destinations).sort((a, b) => scoreDestination(b[1], b[0]) - scoreDestination(a[1], a[0]))[0][1];
}

function createItinerary(destination) {
  itinerary.innerHTML = "";
  const visibleDays = Math.min(days, 4);
  for (let i = 0; i < visibleDays; i += 1) {
    const spot = destination.spots[i % destination.spots.length];
    const card = document.createElement("article");
    card.className = "day-card";
    card.innerHTML = `<span class="day">DAY ${i + 1}</span><i>${spot[0]}</i><strong>${spot[1]}</strong><p>${spot[2]}</p>`;
    itinerary.appendChild(card);
  }
}

function updatePlanner() {
  const amount = Number(budget.value);
  const destination = getRecommendation();
  const tastes = selectedTastes();
  const match = Math.min(98, Math.max(78, Math.round(82 + scoreDestination(destination, destination.english.toLowerCase().replace(" ", "")) / 10)));
  const cost = Math.round(destination.base + Math.max(0, days - 3) * destination.base * 0.16);
  const durationName = days >= 8 ? "7박 이상" : `${days - 1}박 ${days}일`;
  const tasteLabel = tastes.length ? tastes.map((taste) => tasteNames[taste]).join("과 ") : "새로운 발견";

  budgetDisplay.textContent = amount;
  budget.style.setProperty("--range-progress", `${((amount - 50) / 350) * 100}%`);
  document.querySelector("#destinationName").textContent = destination.name;
  document.querySelector("#destinationTagline").textContent = destination.tagline;
  document.querySelector("#countryLabel").textContent = destination.country;
  document.querySelector("#tripSummary").textContent = `${durationName} · ${tasteLabel}`;
  document.querySelector("#estimatedCost").textContent = `약 ${cost}만원`;
  document.querySelector("#flightTime").textContent = destination.flight;
  document.querySelector("#bestSeason").textContent = destination.season;
  document.querySelector("#dayCount").textContent = `DAY 1 — ${days}`;
  document.querySelector("#matchLabel").textContent = `${match}% MATCH`;
  document.querySelector("#matchRing strong").textContent = match;
  document.querySelector("#matchRing").style.background = `conic-gradient(var(--blue) ${match}%, #d8d5ca 0)`;
  document.querySelector("#destinationStage").style.background = destination.color;
  document.querySelector("#heroCity").textContent = destination.english;
  document.querySelector("#heroCoord").textContent = destination.coord;
  createItinerary(destination);
}

budget.addEventListener("input", updatePlanner);
durationButtons.forEach((button) => button.addEventListener("click", () => {
  durationButtons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  days = Number(button.dataset.days);
  updatePlanner();
}));

tasteButtons.forEach((button) => button.addEventListener("click", () => {
  if (!button.classList.contains("active") && selectedTastes().length >= 2) {
    tasteButtons.find((item) => item.classList.contains("active"))?.classList.remove("active");
  }
  button.classList.toggle("active");
  if (selectedTastes().length === 0) button.classList.add("active");
  updatePlanner();
}));

document.querySelector("#shuffleButton").addEventListener("click", () => {
  shuffleOffset += 3;
  const active = tasteButtons.filter((button) => button.classList.contains("active"));
  active.forEach((button) => button.classList.remove("active"));
  const start = shuffleOffset % tasteButtons.length;
  tasteButtons[start].classList.add("active");
  tasteButtons[(start + 2) % tasteButtons.length].classList.add("active");
  updatePlanner();
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => button.addEventListener("click", () => {
  document.querySelector(`#${button.dataset.scrollTo}`).scrollIntoView({ behavior: "smooth" });
}));

const saveButton = document.querySelector("#saveButton");
saveButton.addEventListener("click", () => {
  saveButton.classList.toggle("saved");
  saveButton.textContent = saveButton.classList.contains("saved") ? "♥" : "♡";
  showToast(saveButton.classList.contains("saved") ? "여행 후보에 저장했어요." : "저장을 취소했어요.");
});

document.querySelector("#planButton").addEventListener("click", () => showToast("맞춤 여행 초안이 완성됐어요!"));

let toastTimer;
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

updatePlanner();
