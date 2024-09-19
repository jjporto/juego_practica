document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById('game-board');
    const attemptsElement = document.getElementById('attempts');
    const timerElement = document.getElementById('timer');
    const matchesElement = document.getElementById('matches');
    const startBtn = document.getElementById('start-btn');
    const startGameBtn = document.getElementById('start-game-btn'); // Botón de "Comenzar" en la pantalla de inicio

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let attempts = 0;
    let pairsFound = 0;
    let matches = 0;
    let timer;
    let seconds = 0;

    const imagesArray = [
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/aguila1.jpg', code: "azul" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/aguila1.jpg', code: "azul" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/Azul1.jpg', code: "rojo" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/Azul1.jpg', code: "rojo" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/dino44.jpg', code: "verde" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/dino44.jpg', code: "verde" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/dragon33.jpg', code: "dorado" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/dragon33.jpg', code: "dorado" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/feliz1.jpg', code: "gris" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/feliz1.jpg', code: "gris" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/jj1.jpg', code: "cacorro" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/jj1.jpg', code: "cacorro" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/marica1.jpg', code: "homosexual" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/marica1.jpg', code: "homosexual" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/morado1.jpg', code: "morado" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/morado1.jpg', code: "morado" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/rosadito1.jpg', code: "rosadito" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/rosadito1.jpg', code: "rosadito" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/rosado.jpg', code: "oscuro" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/rosado.jpg', code: "oscuro" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/tt1.jpg', code: "amarillo" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/tt1.jpg', code: "amarillo" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/naranja1.jpg', code: "naranja" }, { name: 'https://imagegame.s3.us-east-2.amazonaws.com/naranja1.jpg', code: "naranja" }
    ];

    // Mostrar el tablero de juego al hacer clic en "Comenzar" en la pantalla de inicio
    startGameBtn.addEventListener('click', function() {
        document.getElementById('start-screen').style.display = 'none'; // Ocultar la pantalla de inicio
        document.getElementById('game-container').style.display = 'block'; // Mostrar el tablero de juego
        startGame(); // Iniciar el juego al hacer clic en "Comenzar"
    });

    // Agregar funcionalidad al botón de reinicio
    startBtn.addEventListener('click', function() {
        startGame(); // Reiniciar el juego al hacer clic en "Reiniciar Juego"
    });

    // Función para comenzar el juego
    function startGame() {
        board.innerHTML = ''; // Limpiar el tablero al comenzar
        attempts = 0;
        matches = 0;
        pairsFound = 0;
        seconds = 0;
        attemptsElement.textContent = attempts;
        matchesElement.textContent = matches;
        timerElement.textContent = seconds;

        // Mezclar las imágenes de forma aleatoria
        shuffleArray(imagesArray);

        // Crear las cartas en el tablero
        imagesArray.forEach((image, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image.code;
            card.dataset.index = index;
            card.addEventListener('click', flipCard);

            const img = document.createElement('img');
            img.src = image.name;
            img.style.display = 'none'; // Ocultar la imagen hasta que se voltee la carta
            card.appendChild(img);

            board.appendChild(card);
        });

        // Iniciar el temporizador
        clearInterval(timer);
        timer = setInterval(() => {
            seconds++;
            timerElement.textContent = seconds;
        }, 1000);
    }

    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

        this.classList.add('flipped');
        const img = this.querySelector('img');
        img.style.display = 'block'; // Mostrar la imagen al voltear la carta

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            lockBoard = true;
            checkForMatch();
        }
    }

    function checkForMatch() {
        attempts++;
        attemptsElement.textContent = attempts;

        if (firstCard.dataset.image === secondCard.dataset.image) {
            disableCards();
            pairsFound++;
            matches++;
            matchesElement.textContent = matches;
            //mensaje final de juego 
            if (pairsFound === Math.floor(imagesArray.length / 2)) {
                clearInterval(timer);
                setTimeout(() => alert(`¡Ganaste en ${attempts} intentos, con ${matches} aciertos en ${seconds} segundos!`), 500);
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.querySelector('img').style.display = 'none'; // Esconder la imagen
            secondCard.querySelector('img').style.display = 'none'; // Esconder la imagen
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Intercambiar las posiciones
        }
    }
});
