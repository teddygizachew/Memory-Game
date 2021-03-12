// Global Constants
const clueHoldTime = 1000; // Time to hold each clue's light/sound
const cluePauseTime = 333; // How long to pause in between clues
const nextClueWaitTime = 1000; // How long to wait before starting playback of the clue sequence

// Global variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

function startGame() {
  // Initialize the game variables
  progress = 0;
  gamePlaying = true;

  // Swap the Start and End buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");

  // Play Sequence
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  // Swap the Start and End buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}

// ----------------------------------
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

// ---------------------------------

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
}

// Check user's response in order to check that it matches with the correct sequence
function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. Congrats, You Won!");
}

// Function to check guess
function guess(btn) {
  console.log("User guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  // User's guess
  if (btn == pattern[guessCounter]) {
    // If guess is correct
    if (guessCounter == progress) {
      // If turn is over
      if (progress == pattern.length - 1) {
        // If it is the last turn
        winGame();
      } else {
        progress += 1;
        playClueSequence();
      }
    } else {
      guessCounter += 1;
    }
  } else {
    loseGame();
  }
}
