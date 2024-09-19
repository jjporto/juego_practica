document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById('game-board');
    const attemptsElement = document.getElementById('attempts');
    const timerElement = document.getElementById('timer');
    const matchesElement = document.getElementById('matches');
    const startBtn = document.getElementById('start-btn');
    const startGameBtn = document.getElementById('start-game-btn'); 

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let attempts = 0;
    let pairsFound = 0;
    let matches = 0;
    let timer;
    let seconds = 0;
    let cardData = []; // Aquí guardamos las respuestas en memoria, no en el HTML.

    const secretKey = 'mi_clave_secreta_123'; 

    const imagesArray = [
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/aguila1.jpg', code: "azul" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/aguila1.jpg', code: "azul" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/Azul1.jpg', code: "rojo" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/Azul1.jpg', code: "rojo" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/dino44.jpg', code: "verde" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/dino44.jpg', code: "verde" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/dragon33.jpg', code: "dorado" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/dragon33.jpg', code: "dorado" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/feliz1.jpg', code: "gris" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/feliz1.jpg', code: "gris" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/jj1.jpg', code: "cacorro" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/jj1.jpg', code: "cacorro" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/marica1.jpg', code: "homosexual" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/marica1.jpg', code: "homosexual" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/morado1.jpg', code: "morado" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/morado1.jpg', code: "morado" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/rosadito1.jpg', code: "rosadito" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/rosadito1.jpg', code: "rosadito" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/rosado.jpg', code: "oscuro" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/rosado.jpg', code: "oscuro" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/tt1.jpg', code: "amarillo" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/tt1.jpg', code: "amarillo" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/naranja1.jpg', code: "naranja" },
        { name: 'https://imagegame.s3.us-east-2.amazonaws.com/naranja1.jpg', code: "naranja" }
    ];

    startGameBtn.addEventListener('click', function() {
        document.getElementById('start-screen').style.display = 'none'; 
        document.getElementById('game-container').style.display = 'block'; 
        startGame(); 
    });

    startBtn.addEventListener('click', function() {
        startGame(); 
    });

    function startGame() {
        board.innerHTML = ''; 
        attempts = 0;
        matches = 0;
        pairsFound = 0;
        seconds = 0;
        attemptsElement.textContent = attempts;
        matchesElement.textContent = matches;
        timerElement.textContent = seconds;

        shuffleArray(imagesArray);

        // Guardamos el orden de las cartas y las respuestas en memoria, no en HTML
        cardData = imagesArray.map(image => ({
            name: CryptoJS.AES.encrypt(image.name, secretKey).toString(), 
            code: image.code
        }));

        // Creamos las cartas en el tablero sin las respuestas visibles
        cardData.forEach((data, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            card.addEventListener('click', flipCard);

            const img = document.createElement('img');
            img.src = ""; // No asignamos el src todavía
            img.style.display = 'none';
            card.appendChild(img);

            board.appendChild(card);
        });

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
        
        const decryptedUrl = CryptoJS.AES.decrypt(cardData[this.dataset.index].name, secretKey).toString(CryptoJS.enc.Utf8);
        img.src = decryptedUrl; // Desciframos y mostramos la imagen solo cuando se voltea la carta
        img.style.display = 'block'; 

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

        const firstCardCode = cardData[firstCard.dataset.index].code;
        const secondCardCode = cardData[secondCard.dataset.index].code;

        if (firstCardCode === secondCardCode) {
            disableCards();
            pairsFound++;
            matches++;
            matchesElement.textContent = matches;

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
            firstCard.querySelector('img').style.display = 'none'; 
            secondCard.querySelector('img').style.display = 'none'; 
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
            [array[i], array[j]] = [array[j], array[i]]; 
        }
    }
});