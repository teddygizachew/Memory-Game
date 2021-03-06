// Global Constants
const originalClueHoldTime = 1000;
const cluePauseTime = 333; // How long to pause in between clues
const nextClueWaitTime = 1000; // How long to wait before starting playback of the clue sequence

// Global variables
var clueHoldTime = 1000; // Time to hold each clue's light/sound
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var mistakes;
var winnerGame = false;

// Timer
var timer;
var gameTime = (60 * 1/6);
var rounds = 5;

function randomPattern(min, max) {
  for (let i = 0; i < rounds; i++) {
    pattern[i] = Math.floor(Math.random() * (max - min) + min);
  }
  console.log('pattern length: ' + pattern.length);
  console.log('pattern length: ' + pattern.toString());
  console.log('pattern 1: ' + pattern[0]);
}

function startGame() {
  // Generate random numbers from 1 to 8 (8 buttons)
  randomPattern(1, 9);

  // Timer
  startTimer();

  // Initialize the game variables
  progress = 0;
  gamePlaying = true;
  mistakes = 0;

  // Swap the Start and End buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");

  // Play Sequence
  playClueSequence();
}

function stopGame() {

  // setTimerText();
  timer = 0;

  // document.getElementById('time-left').innerHTML = gameTime;

  gamePlaying = false;
  // Swap the Start and End buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  // Hide turn complete message
  document.getElementById("guess-message").classList.add("hidden");
  // Hide text displayed after the game ends
  document.getElementById("message").classList.add("hidden");
  document.getElementById("mistakes-message").classList.add("hidden");
  // Reset the clue hold time
  clueHoldTime = originalClueHoldTime;
}

var audio1 = new Audio('https://cdn.glitch.com/b87cfcc3-2b1b-4b16-ae90-6a593187013a%2Faud1.mp3?v=1616294619303');
var audio2 = new Audio('https://cdn.glitch.com/b87cfcc3-2b1b-4b16-ae90-6a593187013a%2Faud2-2.mp3?v=1616294619822');
var audio3 = new Audio('https://cdn.glitch.com/b87cfcc3-2b1b-4b16-ae90-6a593187013a%2Faud3.mp3?v=1616294619684');
var audio4 = new Audio('https://cdn.glitch.com/b87cfcc3-2b1b-4b16-ae90-6a593187013a%2Faud4-4.mp3?v=1616294619556');
var audio5 = new Audio('https://cdn.glitch.com/b87cfcc3-2b1b-4b16-ae90-6a593187013a%2Faud5-5.mp3?v=1616294620141');
var audio6 = new Audio('https://cdn.glitch.com/b87cfcc3-2b1b-4b16-ae90-6a593187013a%2Faud6-6.mp3?v=1616294619959');
var audio7 = new Audio('https://cdn.glitch.com/b87cfcc3-2b1b-4b16-ae90-6a593187013a%2Faud7-7.mp3?v=1616294620372');
var audio8 = new Audio('https://cdn.glitch.com/b87cfcc3-2b1b-4b16-ae90-6a593187013a%2Faud8-8.mp3?v=1616294620480');

const audioMap = {
  1: audio1,
  2: audio2,
  3: audio3,
  4: audio4,
  5: audio5,
  6: audio6,
  7: audio7,
  8: audio8
};

function playTone(btn, len) {
  var temp = audioMap[btn];
  temp.play();
  console.log("audioMap");
  tonePlaying = true;
  setTimeout(function () {
    stopTone(btn);
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    document.addEventListener("mouseup", function stopPlayOutside() {
      stopTone(btn);
      document.removeEventListener("mouseup", stopPlayOutside);
    })
    var temp = audioMap[btn];
    temp.play();
    tonePlaying = true;
  }
}

function stopTone(btn) {
  var temp = audioMap[btn];
  temp.pause();
  temp.currentTime = 0;
  tonePlaying = false;
}

// Functions to light or clear the buttons
function lightButton(btn) {
  document.getElementById("Btn" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("Btn" + btn).classList.remove("lit");
}

// Function to play single clue
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

// Function to play a sequence of clues
function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; // delay is set to initial wait time

  // for each clue revealed so far
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // Timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  console.log("Original CHT: " + clueHoldTime);
  decreaseClueHoldTime();
  console.log("After player CHT: " + clueHoldTime);
}

// Check user's response in order to check that it matches with the correct sequence
function loseGame() {
  clearInterval(intervalId);
  document.querySelector("#time-left").textContent = gameTime;
  stopGame();
  alert("Game Over. You lost.");
  resetTimer();
}

function winGame() {
  // winnerGame = true;
  stopGame();
  alert("Game Over. Congrats, You Won!");
  timer = 0;
}

// Function to check guess
function guess(btn) {
  console.log("User guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  // User's guess
  // If guess is correct
  if (btn == pattern[guessCounter]) {
    // If turn is over
    if (guessCounter == progress) {
      console.log('GuessCnt: ' + guessCounter + ', prog: ' + progress);
      // If it is the last turn
      if (progress == pattern.length - 1) {
        winGame();
        winnerGame = true;
      } else {
        progress += 1;

        // Timer reset
        playClueSequence();
        resetTimer();
        decreaseClueHoldTime();
      }
    } else {
      guessCounter += 1;
    }
  } else {
    mistakes += 1;
    if (mistakes == 1) {
      // alert("You have " + 2 + " attempts left");
      document.getElementById("mistakes").innerHTML = mistakes;
      document.getElementById("message").innerHTML = "You have " + 2 + " attempts left!";
      document.getElementById("message").classList.remove("hidden");
      document.getElementById("mistakes-message").classList.remove("hidden");
    }
    if (mistakes == 2) {
      // alert("You have " + 1 + " attempts left");
      document.getElementById("mistakes").innerHTML = mistakes;
      document.getElementById("message").innerHTML = "You have " + 1 + " attempts left!";
      document.getElementById("message").classList.remove("hidden");
      document.getElementById("mistakes-message").classList.remove("hidden");
    }
    console.log("mistakes: " + mistakes);
    document.getElementById("mistakes").innerHTML = mistakes;
    increaseClueHoldTime();
    playClueSequence();

    if (mistakes > 2) {
      document.getElementById("message").classList.add("hidden");
      document.getElementById("mistakes-message").classList.add("hidden");
      clueHoldTime = originalClueHoldTime;
      loseGame();
    }
  }
}

function decreaseClueHoldTime() {
  clueHoldTime = clueHoldTime - originalClueHoldTime / 10;
}

function increaseClueHoldTime() {
  clueHoldTime = clueHoldTime + originalClueHoldTime / 10;
}

var intervalId;

function startTimer() {
  timer = gameTime;
  // var minutes, seconds;
  intervalId = setInterval(function() {
    if (timer <= 0) {
      clearInterval(intervalId);
      if (winnerGame == false) {
        console.log('lostttttttt');
        loseGame();
      }
      resetTimer();
    }
    
    document.querySelector("#time-left").textContent = timer;
    console.log('---------timerrrrr-------: ' + timer);
    timer--;
  }, 1000);
}

function resetTimer() {
  timer = gameTime;
}

function setTimerText() {
  document.getElementById('time-left').innerHTML = gameTime;
}
