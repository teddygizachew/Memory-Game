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
var gameTime = (60 * 1/10);

function randomPattern(min, max) {
  for (let i = 0; i < 3; i++) {
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

var audio1 = document.getElementById("aud1");
var audio2 = document.getElementById("aud2");
var audio3 = document.getElementById("aud3");
var audio4 = document.getElementById("aud4");
var audio5 = document.getElementById("aud5");
var audio6 = document.getElementById("aud6");
var audio7 = document.getElementById("aud7");
var audio8 = document.getElementById("aud8");

function playTone(btn, len) {
  if (btn == 1) {
    audio1.play();
  } else if (btn == 2) {
    audio2.play();

  } else if (btn == 3) {
    audio3.play();
    
  } else if (btn == 4) {
    audio4.play();
    
  } else if (btn == 5) {
    audio5.play();
    
  } else if (btn == 6) {
    audio6.play();
    
  } else if (btn == 7) {
    audio7.play();
    
  } else if (btn == 8) {
    audio8.play();
  }
  tonePlaying = true;
  setTimeout(function () {
    stopTone(btn);
  }, len);
}

function startTone(btn) {
  // context.resume();
  if (!tonePlaying) {
    if (btn == 1) {
      audio1.play();
    } else if (btn == 2) {
      audio2.play();
  
    } else if (btn == 3) {
      audio3.play();
      
    } else if (btn == 4) {
      audio4.play();
      
    } else if (btn == 5) {
      audio5.play();
      
    } else if (btn == 6) {
      audio6.play();
      
    } else if (btn == 7) {
      audio7.play();
      
    } else if (btn == 8) {
      audio8.play();
    }
    tonePlaying = true;
  }
}

function stopTone(btn) {
  if (btn == 1) {
    audio1.pause();
    audio1.currentTime = 0;
  } else if (btn == 2) {
    audio2.pause()
    audio2.currentTime = 0;
  } else if (btn == 3) {
    audio3.pause();
    audio3.currentTime = 0;
    
  } else if (btn == 4) {
    audio4.pause();
    audio4.currentTime = 0;
    
  } else if (btn == 5) {
    audio5.pause();
    audio5.currentTime = 0;
    
  } else if (btn == 6) {
    audio6.pause();
    audio6.currentTime = 0;
    
  } else if (btn == 7) {
    audio7.pause();
    audio7.currentTime = 0;
  } else if (btn == 8) {
    audio8.pause();
    audio8.currentTime = 0;
  }
  tonePlaying = false;
}

document.getElementById("startBtn").addEventListener('click', function() {
  context.resume().then(() => {
    console.log('Playback resumed successfully');
  });
});

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
  stopGame();
  alert("Game Over. You lost.");
  resetTimer();
}

function winGame() {
  winnerGame = true;
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

function startTimer() {
  timer = gameTime;
  // var minutes, seconds;
  var intervalId = setInterval(function() {
    if (timer <= 0) {
      clearInterval(intervalId);
      if (winnerGame == false) {
        console.log('lostttttttt');
        loseGame();
      }
      resetTimer();
    }

    if (winnerGame == true && timer > 0) {
      // clearInterval(intervalId);
      // resetTimer();
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
