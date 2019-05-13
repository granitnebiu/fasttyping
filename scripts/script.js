const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const randomText = document.querySelector('#newText');
const errorsMade = document.querySelector('.errors');
const wordPerMinute = document.querySelector('.wordperminute');
const secondsTwo = document.querySelector('.seconds2');
const hiddeSeconds = document.querySelector('#hiddeSeconds');
const typingText = document.querySelector('#typingText');
const attempts = document.querySelector('.attempt');
const animationIfResult = document.querySelector('.animationIfResult');
const noResult = document.querySelector('.no-result');

let menu = document.querySelector('#menu-container');
let wordCount = document.querySelector('.wordcount');

const menuOpen = document.querySelector('#open-menu-btn');
const menuClose = document.querySelector('#close-menu-btn');
const countSavedResult = document.querySelector('.count-saved-result');

function showMenu() { menu.style.right = 0; } // show menu
function hideMenu() { menu.style.right = '-65%'; } //hide menu

const LOCALSTORAGE = (function() {
    let savedResult = [];

    function save(result) {
        savedResult.push(result);
        localStorage.setItem('savedResult', JSON.stringify(savedResult));
    }

    function get() {
        if (localStorage.getItem('savedResult') != null) {
            savedResult = JSON.parse(localStorage.getItem('savedResult'));
        }
    }

    function remove(index) {
        if (index < savedResult.length) {
            // delete the element from the positon "index"
            savedResult.splice(index, 1);
            // update
            localStorage.setItem('savedResult', JSON.stringify(savedResult));
        }
    }
    const getSavedResult = () => savedResult;
    // function getSavedResult() {
    //     savedResult;
    // }

    // console.log(savedResult);
    return {
        save,
        get,
        remove,
        getSavedResult
    };

})();

const SAVEDRESULT = (function() {
    let container = document.querySelector('#saved-result-wrapper');

    //draw saved result inside menu 
    function drawResult(result) {

        let resultBox = document.createElement('div'),
            resultWrapper = document.createElement('div'),
            deleteWrapper = document.createElement('div'),
            resultTextNode = document.createElement('p'),

            deleteBtn = document.createElement('button');

        resultBox.classList.add('result-box', 'flex-container');
        resultTextNode.innerHTML = result;
        resultTextNode.classList.add('set-result');
        resultWrapper.classList.add('ripple', 'set-result');
        resultWrapper.append(resultTextNode);

        resultBox.append(resultWrapper);
        deleteBtn.classList.add('ripple', 'remove-result');
        deleteBtn.innerHTML = 'delete';
        deleteWrapper.append(deleteBtn);
        resultBox.append(deleteWrapper);

        container.append(resultBox);
        // console.log(container);
    }
    // delete a result
    const deleteResult = (resultHTMLBtn) => { // resultHTMLBtn -> the delete button on which the user clicked
        // create a real array with all the saved cities from the interface
        let nodes = Array.prototype.slice.call(container.children),
            // go up in DOM tree until you find the wrapper for the result
            resultWrapper = resultHTMLBtn.closest('.result-box'),
            //get the index of that result inside the array
            resultIndex = nodes.indexOf(resultWrapper);
        // remove from local storage and interface
        LOCALSTORAGE.remove(resultIndex);
        resultWrapper.remove();

        if (nodes.length <= 1) {
            noResult.style.display = "block";
        }
        console.log(nodes.length);
        console.log(nodes.indexOf(resultWrapper));

    };

    // click event on minus button
    // add an event on the document, because these elements will be created dinamically
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-result')) {
            deleteResult(event.target);
            attempts.innerHTML = decrement();
            countSavedResult.innerHTML = attempts.innerHTML;
        }
    });
    return {
        drawResult
    };
})();

originText.style.userSelect = "none"; //disble paragraph not to be selected; 
hiddeSeconds.style.visibility = "hidden"; //hidde seconds interval
hiddeSeconds.style.display = "none"; //display none for secods interval 

//array of time [mins, secds, hunders/sec, thouseds/sec]
var timer = [0, 0, 0, 0];
var interval;
var timerRunning = false;
var errors = 1;
var seconds = 1;
var interval_seconds = 0;
var text = 0; //typing text
var getText = "This is a typing test. Your goal is to duplicate the provided text, EXACTLY, in the field below. The timer starts when you start typing, and only stops when you match this text exactly. Good Luck!";
var speed = 50;

//typingText function 
(function typeWriter() {
    if (text < getText.length) {
        typingText.innerHTML += getText.charAt(text);
        text++;
        setTimeout(typeWriter, speed);
    }
}());


// Add leading zero to numbers 9 or below (purely for aesthetics):
//helper function 
function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}
//function increment 
LOCALSTORAGE.get();
let atteptsLength = LOCALSTORAGE.getSavedResult();
var attempt = atteptsLength.length;
console.log(atteptsLength.length);

function increment() {
    attempt++;
    return attempt;
}

function decrement() {
    attempt--;
    return attempt;
}

//function count words    
function countWords(str) {
    var word = str.length;

    var wordcount = 0;
    for (var i = 0; i <= word; i++) {
        if (str.charAt(i) == " ") {
            wordcount++;
        }
    }
    return wordcount + 1;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime = `${leadingZero(timer[0])}:${leadingZero(timer[1])}:${leadingZero(timer[2])} `;
    theTimer.innerHTML = currentTime;
    timer[3]++;

    timer[0] = Math.floor((timer[3] / 100) / 60);
    timer[1] = Math.floor((timer[3] / 100) - (timer[0] * 60));
    timer[2] = Math.floor((timer[3]) - (timer[1] * 100) - (timer[0] * 6000));
    // console.log(timer[1]);
}

//Only seconds for time
function runSeconds() {
    secondsTwo.innerHTML = seconds++;
    if (seconds == 0 && wordCount == 0) {
        seconds = 1;
        wordCount = 1;
    }
    wordPerMinute.innerHTML = Math.round(wordCount.innerHTML / (seconds / 60));
}

// Match the text entered with the provided text on the page:
function spellCheck() {
    let textEntered = testArea.value;
    let originTextMatch = originText.innerHTML.substring(0, textEntered.length);

    if (textEntered == originText.innerHTML) {
        //Match the total correct
        clearInterval(interval);
        clearInterval(interval_seconds);
        testWrapper.style.borderColor = '#429890';
        testWrapper.style.animation = "none";
        theTimer.style.color = '#429890';
        testArea.disabled = true;
        attempts.innerHTML = increment();
        countSavedResult.innerHTML = attempts.innerHTML;
        animationIfResult.classList.add('pulsating-circle');
        noResult.style.display = "none";

        LOCALSTORAGE.save(`Atempt: ${attempts.innerText} <br> Time: ${theTimer.innerText} <br> Errors: ${errorsMade.innerText} <br> Wordcount ${wordCount.innerText} <br> Word/min ${wordPerMinute.innerText}`);
        // LOCALSTORAGE.save(errorsMade.innerText);
        SAVEDRESULT.drawResult(`Atempt: ${attempts.innerText} <br> Time: ${theTimer.innerText} <br> Errors: ${errorsMade.innerText} <br> Wordcount ${wordCount.innerText} <br> Word/min ${wordPerMinute.innerText}`);
        // SAVEDRESULT.drawResult(errorsMade.innerText);
        // }
    } else {
        if (textEntered == originTextMatch) {
            //the string matches
            testWrapper.style.animation = "none";
            testWrapper.style.borderColor = '#65CCF3';
            theTimer.style.color = '#65CCF3';
            wordCount.innerHTML = countWords(originTextMatch);

        } else {
            //the string dose not match
            testWrapper.style.animation = "pulse 1s infinite";

            testWrapper.style.borderColor = '#E95D0F';
            theTimer.style.color = '#E95D0F';
            errorsMade.innerHTML = errors++;
        }
    }
}

// Start the timer:
function start() {
    let textEnteredLength = testArea.value.length;
    if (textEnteredLength === 0 && !timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
        interval_seconds = setInterval(runSeconds, 1000);
    }
}

// Reset everything:
function reset() {
    clearInterval(interval);
    clearInterval(interval_seconds);
    interval_seconds = null;
    interval = null;
    timer = [0, 0, 0, 0];
    timerRunning = false;
    testArea.disabled = false;
    testWrapper.style.animation = "none";
    errors = 1; //reset error 
    secondsTwo.innerHTML = "0";
    wordPerMinute.innerHTML = "0";
    wordCount.innerHTML = "0";
    errorsMade.innerHTML = "0";
    testArea.value = '';
    theTimer.innerHTML = "00:00:00";
    testWrapper.style.borderColor = 'gray';
    theTimer.style.color = '#65f371';
}

//ramdom game text 
function newtext() {

    if (testArea.value != "" || testArea.value == "") {
        reset();
    }

    var quotes = new Array();
    quotes[0] = "Just living is not enough... one must have sunshine, freedom, and a little flower.";
    quotes[1] = "Lead with your strengths, not your weaknesses.";
    quotes[2] = "Life is short, and if we enjoy every moment of every day, then we will be happy no matter what happens or what changes along the way.";
    quotes[3] = "I would classify myself as an individual. That's what I try to stay true with - being myself, 100 percent.";
    quotes[4] = "Choosing to be positive and having a grateful attitude is going to determine how you're going to live your life.";
    quotes[5] = "Happiness is a choice. You can choose to be happy. There's going to be stress in life, but it's your choice whether you let it affect you or not.";

    function getQuote() {
        var thisquote = Math.floor(Math.random() * (quotes.length));
        originText.innerHTML = quotes[thisquote];

    }
    getQuote();
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keydown", start, false);
//keypress is not working anymore changed to keydown;
testArea.addEventListener('keyup', spellCheck, false);
resetButton.addEventListener('click', reset, false);
randomText.addEventListener('click', newtext, false);
menuOpen.addEventListener('click', showMenu, false);
menuClose.addEventListener('click', hideMenu, false);


// when the app has finished loading the content, images, files .....
window.onload = function() {
    // get items from local storage and store them inside "savedCities" array
    LOCALSTORAGE.get();
    // get that array and store it in a variable for ease of use
    let resulties = LOCALSTORAGE.getSavedResult();
    attempts.innerHTML = resulties.length;
    if (resulties != 0) {
        // countSavedResult.innerHTML = resulties.length;
        // attempts.innerHTML = resulties.length;
        animationIfResult.classList.add('pulsating-circle');
        countSavedResult.innerHTML = resulties.length;
        console.log(resulties.length);
        noResult.style.display = "none";
    }
    // console.log(resulties);
    // check if there were any elements inside the local storage
    if (resulties.length !== 0) {
        // if so then draw each saved result inside the menu
        resulties.forEach((result) => {
            SAVEDRESULT.drawResult(result);
        });
    }
};