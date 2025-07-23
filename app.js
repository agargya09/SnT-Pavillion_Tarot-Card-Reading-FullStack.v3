/* app.js – handles page flow, card logic & fortunes */
import { tarotCards } from "./tarotData.js";

const areaSelect = document.getElementById("areaSelect");
const genderSelect = document.getElementById("genderSelect");
const startBtn = document.getElementById("startBtn");

const welcomeSec = document.getElementById("welcome");
const readerSec = document.getElementById("reader");
const cardGrid = document.getElementById("cardGrid");
const revealBtn = document.getElementById("revealBtn");
const fortuneBox = document.getElementById("fortuneBox");
const againBtn = document.getElementById("againBtn");

let selectedArea = "";
let selectedGender = "";
let selectedCards = [];

/* ----------  WELCOME FLOW  ---------- */
[areaSelect, genderSelect].forEach(sel =>
  sel.addEventListener("change", () => {
    startBtn.disabled = !(areaSelect.value && genderSelect.value);
  })
);

startBtn.addEventListener("click", () => {
  selectedArea = areaSelect.value;
  selectedGender = genderSelect.value;
  welcomeSec.classList.add("hidden");
  readerSec.classList.remove("hidden");
  initCardGrid();
});

/* ----------  CARD GRID  ---------- */
function initCardGrid() {
  cardGrid.innerHTML = "";
  selectedCards = [];
  tarotCards.forEach((card, idx) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.dataset.index = idx;

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <span>${card.name}</span>
        </div>
      </div>
    `;

    cardEl.addEventListener("click", handleCardClick);
    cardGrid.appendChild(cardEl);
  });
}

/* ----------  CARD CLICK  ---------- */
function handleCardClick(e) {
  const cardEl = e.currentTarget;
  const idx = +cardEl.dataset.index;

  if (selectedCards.includes(idx)) return; // already picked
  if (selectedCards.length === 3) return;  // limit reached

  cardEl.classList.add("flipped");
  selectedCards.push(idx);

  if (selectedCards.length === 3) {
    revealBtn.classList.remove("hidden");
  }
}

/* ----------  REVEAL FORTUNE  ---------- */
revealBtn.addEventListener("click", () => {
  revealBtn.disabled = true;
  setTimeout(() => {
    revealFortune();
    revealBtn.classList.add("hidden");
    againBtn.classList.remove("hidden");
  }, 1200); // suspense pause
});

function revealFortune() {
  const lines = selectedCards.map(
    idx => `• ${tarotCards[idx].name}: ${tarotCards[idx].meaning}`
  );

  const roast = generateRoast();
  fortuneBox.textContent =
    `Area of Interest: ${selectedArea}\n\n` +
    lines.join("\n") +
    `\n\n${roast}`;
  fortuneBox.classList.remove("hidden");
}

/* ----------  ROAST GENERATOR  ---------- */
function generateRoast() {
  const base =
    selectedArea === "Romantic"
      ? "Bacche, your love life is shakier than a Hall 4 chair."
      : selectedArea === "Academics"
      ? "Brace yourself; your grades may resemble C-type curves—deep and unpredictable."
      : selectedArea === "Social Life"
      ? "Your social calendar will be as empty as the library at 5 a.m."
      : "Destiny says you’ll juggle tasks like an 8-tab CODAL window, mostly lagging.";

  const genderTail =
    selectedGender === "Female"
      ? "At least you don’t need to worry about Hall 13’s plumbing chaos."
      : selectedGender === "Male"
      ? "Hall 4’s mosquitoes salute your resilience."
      : "The cosmos has no bias; chaos is gender-neutral.";

  return `${base} ${genderTail}`;
}

/* ----------  READ AGAIN  ---------- */
againBtn.addEventListener("click", () => {
  readerSec.classList.add("hidden");
  fortuneBox.classList.add("hidden");
  revealBtn.disabled = false;
  revealBtn.classList.add("hidden");
  againBtn.classList.add("hidden");
  areaSelect.value = "";
  genderSelect.value = "";
  startBtn.disabled = true;
  welcomeSec.classList.remove("hidden");
});
