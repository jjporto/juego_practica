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
        { name: 'Azul1.jpg', code: "azul" }, { name: 'Azul2.jpg', code: "azul" },
        { name: 'aguila1-copia.jpg', code: "rojo" }, { name: 'aguila1.jpg', code: "rojo" },
        { name: 'dino44.jpg', code: "verde" }, { name: 'dino44-copia.jpg', code: "verde" },
        { name: 'dragon33.jpg', code: "dorado" }, { name: 'dragon33-copia.jpg', code: "dorado" },
        { name: 'feliz1.jpg', code: "gris" }, { name: 'feliz1-copia.jpg', code: "gris" },
        { name: 'jj1.jpg', code: "cacorro" }, { name: 'jj1-copia.jpg', code: "cacorro" },
        { name: 'marica1.jpg', code: "homosexual" }, { name: 'marica1-copia.jpg', code: "homosexual" },
        { name: 'morado1.jpg', code: "morado" }, { name: 'morado1-copia.jpg', code: "morado" },
        { name: 'rosadito1.jpg', code: "rosadito" }, { name: 'rosadito1-copia.jpg', code: "rosadito" },
        { name: 'rosado.jpg', code: "oscuro" }, { name: 'rosado.jpg', code: "oscuro" },
        { name: 'tt1.jpg', code: "amarillo" }, { name: 'tt1-copia.jpg', code: "amarillo" },
        { name: 'naranja2.jpg', code: "naranja" }, { name: 'naranja1.jpg', code: "naranja" }
    ];

    // Mostrar el tablero de juego al hacer clic en "Comenzar" en la pantalla de inicio
    startGameBtn.addEventListener('click', function() {
        document.getElementById('start-screen').style.display = 'none'; // Ocultar la pantalla de inicio
        document.getElementById('game-container').style.display = 'block'; // Mostrar el tablero de juego
        startGame(); // Iniciar el juego al hacer clic en "Comenzar"
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
            img.src = `images/${image.name}`;
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
                setTimeout(() => alert(`¡Ganaste en ${attempts} intentos, con ${matches} aciertos y ${seconds} segundos!`), 500);
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
