'use strict';

// Cryptographic replacement for Math.random()
function randomNumberBetweenZeroAndOne() {
  var crypto = window.crypto || window.msCrypto;
  return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
}

function generatePassword(numberOfWords, wordSeparator) {
  numberOfWords = parseInt(numberOfWords);

  // Empty array to be filled with wordlist
  var generatedPasswordArray = [];

  // Grab a random word, push it to the password array
  for (var i = 0; i < numberOfWords; i++) {
      var index = Math.floor(randomNumberBetweenZeroAndOne() * 7776)
      generatedPasswordArray.push(capitalizeFirstLetter(wordlist[index]));
  }

  return generatedPasswordArray.join(wordSeparator);
}

function capitalizeFirstLetter(string) {
  var newString = string[0].toUpperCase() + string.slice(1); 
  return newString
}

function setStyleFromWordNumber(passwordField, numberOfWords) {
  var baseSize = '40';
  var newSize = baseSize * (4/numberOfWords);
  passwordField.setAttribute('style', 'font-size: ' + newSize + 'px;');
}

function convertSecondsToReadable(seconds) {
  var timeString = '';
  var crackabilityColor = 'green';

  // Enumerate all the numbers
  var numMilliseconds = seconds * 1000;
  var numSeconds     = Math.floor(seconds);
  var numMinutes     = Math.floor(numSeconds / 60);
  var numHours       = Math.floor(numSeconds / (60 * 60));
  var numDays        = Math.floor(numSeconds / (60 * 60 * 24));
  var numYears       = Math.floor(numSeconds / (60 * 60 * 24 * 365));
  var numCenturies   = Math.floor(numSeconds / (60 * 60 * 24 * 365 * 100));

  if (numMilliseconds < 1000) {
    timeString = numMilliseconds + ' milliseconds';
  } else if (numSeconds < 60) {
    timeString = numSeconds + ' seconds';
  } else if (numMinutes < 60) {
    timeString = numMinutes + ' minutes';
  } else if (numHours < 24) {
    timeString = numHours + ' hours';
  } else if (numDays < 365) {
    timeString = numDays + ' days';
  } else if (numYears < 100) {
    timeString = numYears + ' years';
  } else {
    timeString = numCenturies + ' centuries';
  }

  return timeString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function calculateAndSetCrackTime() {
  var timeToCrack = zxcvbn(passwordField.value);
  var readableCrackTime = convertSecondsToReadable(timeToCrack.crack_time);
  document.querySelector('.crack-time').innerHTML = readableCrackTime;
}


// Start of the main program

// Global variables
var selectField = document.getElementById('passphrase_select');
var passwordField = document.getElementById('passphrase');
var button = document.querySelector('.btn-generate');

function mainFunction() {
  var numberOfWords = 3
  var wordSeparator = ' '

  switch(selectField.options[selectField.selectedIndex].value) {
    case "3s":
      numberOfWords = 3;
      wordSeparator = ' ';
      break;
    case "3d":
      numberOfWords = 3;
      wordSeparator = '-';
      break;
    case "4s":
      numberOfWords = 4;
      wordSeparator = ' ';
      break;
    case "4d":
      numberOfWords = 4;
      wordSeparator = '-';
      break;
    case "5s":
      numberOfWords = 5;
      wordSeparator = ' ';
      break;
    case "5d":
      numberOfWords = 5;
      wordSeparator = '-';
      break;
  }

  passwordField.value = generatePassword(numberOfWords, wordSeparator);
  setStyleFromWordNumber(passwordField, numberOfWords);
  calculateAndSetCrackTime();
}

// Run upon load and generate a "Three-word passphrase, with spaces"
passwordField.setAttribute('value', generatePassword(3,' '));
calculateAndSetCrackTime();

// Listen for a button click
button.addEventListener('click', mainFunction);

// Listen for password value change
passwordField.addEventListener('input', function (evt) {
  calculateAndSetCrackTime();
});
