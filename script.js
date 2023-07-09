const inputSlider = document.querySelector("[data-slider]");
const copyBtn = document.querySelector("[cpybtn]");
const passwordDisplay = document.querySelector("[data-input]");
const copyMessage = document.querySelector("[copy-message]");
const passLength = document.querySelector("[data-length]");
const lower = document.querySelector("#lowercase");
const upper = document.querySelector("#uppercase");
const number = document.querySelector("#numbers");
const symbol = document.querySelector("#symbol");
const button = document.querySelector("[data-button]");
const checkBoxAll = document.querySelectorAll("input[type=checkbox]");
const symbolString = '!@#$%^&*()-_=+[{]};:,<.>?/';
const indicator = document.querySelector("[data-indicator]");
let length = 10;
let checkCount = 0;
let password = "";
handleSlider();

function handleSlider(){
    inputSlider.value = length;
    passLength.innerText = length;
}
function getRand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function getRandomNumber(){
    return getRand(0,9);
}
function getRandomLowercase(){
    return String.fromCharCode(getRand(97,123));
}
function getRandomUppercase(){
    return String.fromCharCode(getRand(65,91));
}
function getRandomSymbol(){
    let random =getRand(0,symbolString.length);
    return symbolString.charAt(random);
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upper.checked) hasUpper = true;
    if (lower.checked) hasLower = true;
    if (number.checked) hasNum = true;
    if (symbol.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && length >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      length >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow - HW
}
async function copyContent(){
    try{
       await navigator.clipboard.writeText(passwordDisplay.value);
       copyMessage.innerText = "copied"; 
    }
    catch(e){
        copyMessage.innerText = "failed";
    }
    copyMessage.classList.add("active");
}
setTimeout( () =>{
    copyMessage.classList.remove("active");
},2000);

inputSlider.addEventListener('input', (e) => {
    length = e.target.value;
    handleSlider();
}) 

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

function handleCheckBoxChange() {
    checkCount = 0;
    checkBoxAll.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    if(length < checkCount ) {
        length = checkCount;
        handleSlider();
    }
}

checkBoxAll.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})
 
button.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(length < checkCount) {
        length = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(upper.checked)
        funcArr.push(getRandomUppercase);

    if(lower.checked)
        funcArr.push(getRandomLowercase);

    if(number.checked)
        funcArr.push(getRandomNumber);

    if(symbol.checked)
        funcArr.push(getRandomSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");

    //remaining adddition
    for(let i=0; i<length-funcArr.length; i++) {
        let randIndex = getRand(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});