
const word = 'hello'; 

let currentRow = 0; 
let currentTile = 0; 

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitGuess();
    } else if (e.key === 'Backspace') {
      deleteLetter();
    } else if (isLetter(e.key)) {
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

