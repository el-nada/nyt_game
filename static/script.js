
let word = '';

let currentRow = 0; 
let currentTile = 0; 

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitGuess();
    } else if (e.key === 'Backspace') {
      deleteLetter();
    } else if (isLetter(e)) {
      addLetter(e.key.toUpperCase());
    }
});

document.querySelector('.keyboard').addEventListener('click', (e) => {
    const key = e.target.closest('.key'); 
    if (!key) return;
  
    const keyText = key.textContent.trim();
    console.log(keyText)
    if (keyText === 'Enter') {
      submitGuess();
    } else if (keyText === 'backspace') {
      deleteLetter();
    } else if (/[A-Z]/.test(keyText)) {
      addLetter(keyText);
    }
});
  
function addLetter(letter) {
    if (currentTile >= 5 || currentRow >5) return;
    const tiles = document.querySelectorAll('.row')[currentRow].children;
    tiles[currentTile].textContent = letter;
    tiles[currentTile].classList.add('hover'); 
    currentTile++;
}

function deleteLetter() {
    if (currentTile <= 0) return;
    currentTile--;
    const tiles = document.querySelectorAll('.row')[currentRow].children;
    tiles[currentTile].classList.remove('hover');
    tiles[currentTile].textContent = '';
}

function isLetter(event){
    if (event.keyCode >= 65 && event.keyCode <= 90) {
        return true; // Alphabet upper case
    } else if (event.keyCode >= 97 && event.keyCode <= 122) {
        return true; // Alphabet lower case
    }
    return false; 
}

async function submitGuess(){
    const tiles = document.querySelectorAll(`.row:nth-child(${currentRow + 1}) .tile`);
    const guess = Array.from(tiles, tile => tile.textContent);

    let valid = await isValidWord(guess.join('')); 


    if (guess.join('')==word){
        applyColors(new Array(5).fill(2), guess)
        currentRow=5
    }
    else if (currentTile ==5 && currentRow==5){
        if (!valid) {
            const currentRowElement = document.querySelectorAll('.row')[currentRow];
            currentRowElement.classList.add('invalid');
    
            // Remove class after animation
            setTimeout(() => {
            currentRowElement.classList.remove('invalid');
            }, 600);
            
            addMessage("Not a valid word!");
            return;
        }
        addMessage(word)
        updateRow(guess); 
        currentTile=0; 
        currentRow++; 
    }
    else if (currentTile==5 && currentRow<6){
        if (!valid) {
            const currentRowElement = document.querySelectorAll('.row')[currentRow];
            currentRowElement.classList.add('invalid');
    
            // Remove class after animation
            setTimeout(() => {
            currentRowElement.classList.remove('invalid');
            }, 800);
            
            addMessage("Not a valid word!");
            return;
        }
        updateRow(guess); 
        currentTile=0; 
        currentRow++; 
    }
}

async function isValidWord(guess) {
    try {
      const response = await fetch(
        `https://api.datamuse.com/words?exact=${guess}&sp=${guess}&max=1`
      );
      const data = await response.json();
      return data.some(entry => entry.word === guess.toLowerCase());
    } catch {
      return false;
    }
}
  
function updateRow(guess){
    const colors = new Array(5).fill(0); // 0 = gray, 1 = yellow, 2 = green
    const wordLetterCounts = {};

    for (let i = 0; i < 5; i++) {
        if (guess[i] !== word[i]) {
          wordLetterCounts[word[i]] = (wordLetterCounts[word[i]] || 0) + 1;
        }
      }
    
    for (let i = 0; i < 5; i++) {
        if (guess[i] === word[i]) {
            colors[i] = 2; // Green
        } else if (wordLetterCounts[guess[i]] > 0) {
            colors[i] = 1; // Yellow
            wordLetterCounts[guess[i]]--;
        }
    }

    applyColors(colors, guess)
}

function applyColors(colors, guess){
    const tiles = document.querySelectorAll(`.row:nth-child(${currentRow + 1}) .tile`);
    colors.forEach((color, i) => {
        tiles[i].classList.remove('hover');
        tiles[i].classList.add('flip');

        setTimeout(() => {
            tiles[i].classList.remove('flip');
            tiles[i].classList.add('revealed', 
              colors[i] === 2 ? 'correct' : 
              colors[i] === 1 ? 'present' : 'absent');
          }, i * 400); // Delay each tile by 200ms

    })
    
    updateKeyboardColors(guess)
}

function updateKeyboardColors(guess) {
    const keys = document.querySelectorAll('.key');
    for (let i = 0; i < guess.length; i++) {

        const letter = guess[i];
        const key = [...document.querySelectorAll('.key')].find(
            k => k.textContent.trim() === letter
        );

        if (letter === word[i]) {
            key.classList.add('keyCorrect');
        } else if (word.includes(letter)) {
            if (!key.classList.contains('keyCorrect')) {
                key.classList.add('keyPresent');
            }
        } else {
            key.classList.add('keyAbsent'); 
        }
    };
}

function addMessage(message) {
    const messageDiv = document.querySelector('.message')
    messageDiv.textContent=message
    messageDiv.classList.add('active');

    setTimeout(() => {
        messageDiv.classList.remove('active');
        messageDiv.textContent=''; 
      }, 3000); 
}

async function initGame(difficulty='easy') {
    word = await getWord(difficulty);
    if (!word || word.length !== 5) {
        word = 'HELLO'; 
    }
    resetGame();
}

async function getWord(difficulty='easy') {
    const res = await fetch(`https://random-word-api.vercel.app/api?length=5&difficulty=${difficulty}`);
    const [word] = await res.json();
    console.log(word)
    return word.toUpperCase();
}

function resetGame() {
    document.querySelectorAll('.tile').forEach(tile => {
        tile.textContent = '';
        tile.className = 'tile';
    });
    
    document.querySelectorAll('.key').forEach(key => {
        key.className = 'key';
    });

    currentRow = 0;
    currentTile = 0;
}

document.querySelector('.easy').addEventListener('click', (e) => {
    initGame('easy'); 
})

document.querySelector('.medium').addEventListener('click', (e) => {
    initGame('medium'); 
})

document.querySelector('.hard').addEventListener('click', (e) => {
    initGame('hard'); 
})

document.querySelector('.random').addEventListener('click', (e) => {
    const options = ['easy','medium', 'hard']
    const i = Math.floor(Math.random() * 3);
    initGame(options[i]); 
})

initGame();