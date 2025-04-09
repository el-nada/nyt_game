
const word = "HELLO"; 

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
    if (currentTile >= 5) return;
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

function submitGuess(){
    const tiles = document.querySelectorAll(`.row:nth-child(${currentRow + 1}) .tile`);
    const guess = Array.from(tiles, tile => tile.textContent);
    if (guess.join('')==word){
        applyColors(new Array(5).fill(2), guess)
        currentRow=5
        alert()
    }
    else if (currentTile==5 && currentRow<5){
        updateRow(guess)
        currentTile=0; 
        currentRow++; 
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