import { generateWord } from "./words.js";

const resetButton = document.getElementById("reset-game")
const keyboardInput = document.getElementsByClassName("keyboard-button")
let currentLine = 1;
let correctWord = randomWord();
let gameOver = false;
let userInput = [];
let box_num = 0;

resetButton.addEventListener('click', function() { //Resets game board, chooses new word
  if (gameOver === true) {
    gameOver = false;
  }
  currentLine = 1;
  box_num = 0;
  userInput = [];

  correctWord = randomWord();

  const display = document.querySelectorAll('td.game-box')

  for (let box = 0; box < display.length; box++) {
    display[box].textContent = '';
    display[box].style.backgroundColor = 'rgba(0, 0, 0, 0)';
  }

  for (let key of keyboardInput) {
    key.style.backgroundColor = 'rgba(77, 77, 82, 1)'
  };
});

playerAttempt();

function playerAttempt() {

  for (let button of keyboardInput) { //Keyboard click logic
    button.addEventListener('click', function(event) {
      let clickedLetter = event.target.textContent;

      if (gameOver === true) {
        return;
      }

      const currentRow = document.querySelector(`[row="${currentLine}"]`); //Current row
      let currentBox = currentRow.querySelector(`[box="${box_num}"]`); //Current box

      if (isCharacterALetter(clickedLetter) && userInput.length < 5) {
        userInput.push(clickedLetter.toUpperCase());
        currentBox.textContent = clickedLetter.toUpperCase();
        box_num += 1;
        event.target.blur();
      }
    })
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== null) {
      if (gameOver === true) {
        return;
      }

      const currentRow = document.querySelector(`[row="${currentLine}"]`); //Current row
      let currentBox = currentRow.querySelector(`[box="${box_num}"]`); //Current box

      if (isCharacterALetter(event.key) && userInput.length < 5) {
        userInput.push(event.key.toUpperCase());
        currentBox.textContent = event.key.toUpperCase();
        box_num += 1;
      }

      if (event.key === 'Backspace' && userInput.length !== 0) {
        box_num = box_num - 1;
        currentBox = currentRow.querySelector(`[box="${box_num}"]`);
        userInput.pop();
        currentBox.textContent = '';
      }
  
      if (event.key === 'Enter' && userInput.length === 5) {
        scanWord(userInput);
        if (currentLine !== 6) {
          currentLine += 1;
          userInput = [];
        }
        box_num = 0;
      }
    }
  });
}  

function scanWord(letters) {
  let guess = letters.join('');
  let correctWordArray = correctWord.split('');
  box_num = 0;
  let keyIndex = 0;

  for (const char of guess) {
    for (let key of keyboardInput) {
      if (key.textContent === char) {
        if (correctWordArray.includes(char) && guess[keyIndex] === correctWordArray[keyIndex]) {
          key.style.backgroundColor = 'green'; //Change to green
        }
        else if (correctWordArray.includes(char)) {
          key.style.backgroundColor = 'rgba(228, 221, 62, 0.8)'; //Changes to yellow
        } 
        else {
          key.style.backgroundColor = 'rgba(56, 56, 59, 1)'; //Changes to dark grey
        }
      }
    }
    keyIndex++;
  }

  const currentRow = document.querySelector(`[row="${currentLine}"]`); // Current row
  const tdElements = currentRow.querySelectorAll('td'); // Select all td elements within the current row

  if (guess === correctWord) { //Correct word guessed
    console.log("Game over");
    gameOver = true;
    for (const tdElement of tdElements) {
      tdElement.style.backgroundColor = 'green';
    }
  }
  else {
    for (const char of guess) {
      if (correctWordArray.includes(char)) {
        tdElements[box_num].style.backgroundColor = 'rgba(228, 221, 62, 0.8)';
        box_num++;
      }
      else {
        tdElements[box_num].style.backgroundColor = 'rgba(102, 102, 110, 1)';
        box_num++;
      }
    };
    box_num = 0;
    for (let i = 0; i < 5; i++) { //Checks if letters match along with index
      if (guess[i] === correctWordArray[i]) {
        tdElements[box_num].style.backgroundColor = 'green';
      }
      box_num++;
    }
  }
}

function isCharacterALetter(char) { //Verifies input is a letter
  let check = /^[a-zA-Z]$/.test(char);
  return check;
}

function randomWord() {
  let word = generateWord();
  console.log(word)
  return word;
}