const cardsArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let firstCard, secondCard;
let hasFlipped = false;
let lockBoard = false;
let score = 0;
let timer = 0;
let interval;
let matchedCards = 0;
let gamePaused = false;

function createBoard() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    const shuffledCards = [...cardsArray, ...cardsArray].sort(() => Math.random() - 0.5);
    shuffledCards.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.innerHTML = '<div></div>';
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard || gamePaused) return;
    this.classList.add('flipped');
    this.firstChild.textContent = this.dataset.symbol;

    if (!hasFlipped) {
        hasFlipped = true;
        firstCard = this;
        startTimer();
    } else {
        secondCard = this;
        checkMatch();
    }
}

function checkMatch() {
    lockBoard = true;
    const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCards += 2;
    updateScore();
    resetBoard();
    checkGameEnd();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.firstChild.textContent = '';
        secondCard.firstChild.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlipped, lockBoard, firstCard, secondCard] = [false, false, null, null];
}

function updateScore() {
    score += Math.max(10 - timer % 10, 1);
    document.getElementById('score').textContent = score;
}

function startTimer() {
    if (!interval) {
        interval = setInterval(() => {
            if (!gamePaused) {
                timer++;
                document.getElementById('timer').textContent = timer;
            }
        }, 1000);
    }
}

function checkGameEnd() {
    if (matchedCards === cardsArray.length * 2) {
        clearInterval(interval);
        document.querySelectorAll('.card').forEach(card => card.classList.add('blurred'));
        document.getElementById('overlay').style.display = 'flex';
        document.getElementById('overlay').textContent = `Game Over! Final Score: ${score}, Time: ${timer}s`;
    }
}

document.getElementById('restart').addEventListener('click', () => {
    clearInterval(interval);
    [score, timer, matchedCards, gamePaused] = [0, 0, 0, false];
    interval = null;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timer;
    document.getElementById('overlay').style.display = 'none';
    createBoard();
});

document.getElementById('pause-resume').addEventListener('click', () => {
    gamePaused = !gamePaused;
    document.getElementById('pause-resume').textContent = gamePaused ? 'Resume' : 'Pause';
});

createBoard();