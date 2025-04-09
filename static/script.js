
const word = "LEOHS"; 

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
  
function addLetter(letter) {
    if (currentTile >= 5) return;
    const tiles = document.querySelectorAll('.row')[currentRow].children;
    tiles[currentTile].textContent = letter;
    currentTile++;
}

function deleteLetter() {
    if (currentTile <= 0) return;
    currentTile--;
    const tiles = document.querySelectorAll('.row')[currentRow].children;
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

    console.log(colors)
}