document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const nextRoundButton = document.getElementById('next-round-button');
    const finishButton = document.getElementById('finish-button');
    const restartButton = document.getElementById('restart-button');
    const playerNameInput = document.getElementById('player-name');
    const gameSection = document.getElementById('game-section');
    const resultSection = document.getElementById('result-section');
    const currentLetterSpan = document.getElementById('current-letter');
    const scoreSpan = document.getElementById('score');
    const finalScoreSpan = document.getElementById('final-score');
    const timerElement = document.getElementById('time-left');
    const categories = ['name', 'place', 'object'];
    let currentLetter = '';
    let score = 0;
    let timer;
    let timeLeft = 60;

    // Função para salvar dados no LocalStorage
    function saveToLocalStorage() {
        localStorage.setItem('playerName', playerNameInput.value);
        localStorage.setItem('score', score);
    }

    // Função para carregar dados do LocalStorage
    function loadFromLocalStorage() {
        const savedPlayerName = localStorage.getItem('playerName');
        const savedScore = localStorage.getItem('score');

        if (savedPlayerName) {
            playerNameInput.value = savedPlayerName;
        }
        if (savedScore) {
            score = parseInt(savedScore, 10);
            scoreSpan.textContent = score;
        }
    }

    function getRandomLetter() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return letters[Math.floor(Math.random()*letters.length)];
    }

    function animateLetterSelection(callback) {
        let count = 0;
        const interval = setInterval(() => {
            currentLetter = getRandomLetter();
            currentLetterSpan.textContent = currentLetter;
            count++;
            if (count === 19) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }

    function startTimer() {
        timeLeft = 60;
        timerElement.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('Tempo esgotado! Finalizando rodada.');
                stopButton.click();
            }
        }, 1000);
    }

    function startRound() {
        gameSection.style.display = 'block';
        resultSection.style.display = 'none';
        animateLetterSelection(() => {
            console.log(`Letra selecionada: ${currentLetter}`);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            startTimer();
        });
    }

    startButton.addEventListener('click', () => {
        if (playerNameInput.value.trim() === '') {
            alert('Por favor, insira seu nome.');
            return;
        }
        startRound();
        saveToLocalStorage();
    });

    stopButton.addEventListener('click', () => {
        clearInterval(timer);
        const inputs = document.querySelectorAll('input[data-category]');
        let roundScore = 0;

        inputs.forEach(input => {
            if (input.value.trim().toUpperCase().startsWith(currentLetter)) {
                roundScore += 10;
            }
            console.log(`${input.dataset.category}: ${input.value}`);
        });

        score += roundScore;
        scoreSpan.textContent = score;

        if (roundScore < 30) {
            alert('Você não atingiu 30 pontos. Redirecionando...');
            window.location.href = 'roda.html';
        } else {
            alert(`Você fez ${roundScore} pontos nesta rodada!`);
            inputs.forEach(input => input.value = '');
            nextRoundButton.style.display = 'inline-block';
            finishButton.style.display = 'inline-block';
        }
        saveToLocalStorage();
    });

    nextRoundButton.addEventListener('click', () => {
        nextRoundButton.style.display = 'none';
        finishButton.style.display = 'none';
        startRound();
        saveToLocalStorage();
    });

    finishButton.addEventListener('click', () => {
        gameSection.style.display = 'none';
        resultSection.style.display = 'block';
        finalScoreSpan.textContent = score;
        saveToLocalStorage();
    });

    restartButton.addEventListener('click', () => {
        score = 0;
        scoreSpan.textContent = score;
        playerNameInput.value = '';
        gameSection.style.display = 'none';
        resultSection.style.display = 'none';
        alert('Recomeçando o jogo! Insira seu nome para começar novamente.');
        localStorage.clear(); // Limpa o LocalStorage ao reiniciar
    });

    loadFromLocalStorage();
});
