document.addEventListener("DOMContentLoaded", () => {
    // Se obtienen los elementos del DOM para manipularlos más adelante
    const board = document.getElementById('game-board');
    const attemptsElement = document.getElementById('attempts');
    const timerElement = document.getElementById('timer');
    const matchesElement = document.getElementById('matches'); // Elemento del contador de aciertos
    const startBtn = document.getElementById('start-btn');

    // Variables para controlar el estado del juego
    let firstCard = null;  // Primera carta seleccionada
    let secondCard = null; // Segunda carta seleccionada
    let lockBoard = false; // Bloqueo de tablero mientras se verifican cartas
    let attempts = 0;      // Contador de intentos
    let pairsFound = 0;    // Contador de pares encontrados
    let matches = 0;       // Contador de aciertos (pares correctos)
    let timer;             // Variable para el temporizador
    let seconds = 0;       // Contador de segundos

    // Array con las imágenes que representan las cartas, en pares
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

    // Se agrega un evento al botón de "Empezar Juego"
    startBtn.addEventListener('click', startGame);

    // Función para iniciar el juego
    function startGame() {
        // Reiniciar el estado del tablero y variables de control
        board.innerHTML = '';              // Vaciar el tablero
        attempts = 0;                      // Reiniciar contador de intentos
        matches = 0;                       // Reiniciar contador de aciertos
        attemptsElement.textContent = attempts;
        matchesElement.textContent = matches;
        pairsFound = 0;                    // Reiniciar contador de pares encontrados
        seconds = 0;                       // Reiniciar contador de tiempo
        timerElement.textContent = seconds;

        // Mezclar el array de imágenes
        shuffleArray(imagesArray);

        // Crear las cartas en el tablero
        imagesArray.forEach((image, index) => {
            const card = document.createElement('div');
            card.classList.add('card');    // Añadir clase de carta
            card.dataset.image = image.code;    // Guardar el código de la imagen para la comparación
            card.dataset.index = index;    // Guardar el índice como atributo de la carta
            card.addEventListener('click', flipCard); // Añadir evento para voltear la carta

            const img = document.createElement('img'); // Crear imagen para la carta
            img.src = `images/${image.name}`; // Asignar la ruta de la imagen
            card.appendChild(img); // Añadir la imagen al elemento carta

            board.appendChild(card); // Añadir la carta al tablero
        });

        // Iniciar el temporizador
        clearInterval(timer); // Reiniciar cualquier temporizador anterior
        timer = setInterval(() => {
            seconds++; // Incrementar los segundos
            timerElement.textContent = seconds; // Mostrar el tiempo en pantalla
        }, 1000); // Actualizar cada segundo
    }

    // Función para voltear la carta seleccionada
    function flipCard() {
        // Si el tablero está bloqueado o la carta ya está volteada, no hacer nada
        if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

        this.classList.add('flipped'); // Voltear la carta

        // Si no hay una primera carta seleccionada, asignar esta carta como la primera
        if (!firstCard) {
            firstCard = this;
        } else {
            // Si ya hay una primera carta seleccionada, asignar la segunda y bloquear el tablero
            secondCard = this;
            lockBoard = true;
            checkForMatch(); // Verificar si las cartas son iguales
        }
    }

    // Función para verificar si las dos cartas seleccionadas hacen par
    function checkForMatch() {
        attempts++; // Incrementar el contador de intentos
        attemptsElement.textContent = attempts;

        // Si las cartas coinciden
        if (firstCard.dataset.image === secondCard.dataset.image) {
            disableCards(); // Deshabilitar las cartas (mantenerlas volteadas)
            pairsFound++;   // Incrementar el número de pares encontrados
            matches++;      // Incrementar el contador de aciertos
            matchesElement.textContent = matches; // Mostrar aciertos en pantalla

            // Si se han encontrado todos los pares
            if (pairsFound === Math.floor(imagesArray.length / 2)) {
                clearInterval(timer); // Detener el temporizador
                // Mostrar alerta con los resultados
                setTimeout(() => alert(`¡Ganaste en ${attempts} intentos, con ${matches} aciertos y ${seconds} segundos!`), 500);
            }
        } else {
            // Si las cartas no coinciden, voltearlas de nuevo
            unflipCards();
        }
    }

    // Función para deshabilitar las cartas que hacen par (dejarlas volteadas)
    function disableCards() {
        if (firstCard && secondCard) {
            firstCard.classList.add('matched'); // Añadir clase 'matched' a ambas cartas
            secondCard.classList.add('matched');

            // Desactivar clic solo si las cartas son válidas
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            resetBoard(); // Reiniciar el estado del tablero
        }
    }

    // Función para voltear las cartas de nuevo si no hacen par
    function unflipCards() {
        setTimeout(() => {
            if (!firstCard.classList.contains('matched')) {
                firstCard.classList.remove('flipped'); // Voltear la primera carta de nuevo
            }
            if (!secondCard.classList.contains('matched')) {
                secondCard.classList.remove('flipped'); // Voltear la segunda carta de nuevo
            }
            resetBoard(); // Reiniciar las variables del estado del tablero
        }, 1000); // Voltearlas después de 1 segundo
    }

    // Función para reiniciar las variables que controlan las cartas seleccionadas
    function resetBoard() {
        [firstCard, secondCard] = [null, null]; // Eliminar referencias a las cartas seleccionadas
        lockBoard = false; // Desbloquear el tablero
    }

    // Función para mezclar las cartas utilizando el algoritmo Fisher-Yates
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Obtener un índice aleatorio
            [array[i], array[j]] = [array[j], array[i]];   // Intercambiar las posiciones
        }
    }
});
