const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const bestEl = document.getElementById('best');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverEl = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');

let score = 0;
let best = 0;
let timeLeft = 30;
let gameActive = false;
let moleTimer = null;
let countdownTimer = null;
let lastHole = null;

function randomHole() {
  const idx = Math.floor(Math.random() * holes.length);
  if (holes[idx] === lastHole) return randomHole();
  lastHole = holes[idx];
  return holes[idx];
}

function showMole() {
  if (!gameActive) return;
  const hole = randomHole();
  hole.classList.add('up');

  const duration = Math.max(500, 1200 - score * 15);
  moleTimer = setTimeout(() => {
    hole.classList.remove('up');
    if (gameActive) showMole();
  }, duration);
}

function whack(e) {
  if (!gameActive || !this.parentElement.classList.contains('up')) return;
  score++;
  scoreEl.textContent = score;

  const hole = this.parentElement;
  hole.classList.remove('up');
  hole.classList.add('whacked');
  setTimeout(() => hole.classList.remove('whacked'), 300);

  clearTimeout(moleTimer);
  showMole();
}

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = 0;
  timerEl.textContent = 30;
  gameActive = true;
  gameOverEl.classList.add('hidden');
  startBtn.disabled = true;
  startBtn.textContent = 'Playing...';

  holes.forEach(h => h.classList.remove('up', 'whacked'));

  showMole();
  countdownTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearTimeout(moleTimer);
  clearInterval(countdownTimer);
  holes.forEach(h => h.classList.remove('up', 'whacked'));

  if (score > best) {
    best = score;
    bestEl.textContent = best;
  }

  finalScoreEl.textContent = score;
  gameOverEl.classList.remove('hidden');
  startBtn.disabled = false;
  startBtn.textContent = 'Start Game';
}

moles.forEach(mole => mole.addEventListener('click', whack));
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
