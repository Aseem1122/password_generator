const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#Lowercase");
const numberscheck = document.querySelector("#Numbers");
const symbolscheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initally
let password = "";
let passwordLength = 10;
let checkcount = 0;
handelSlider()
//ste strength cricle color to grey
setIndicator("#ccc")


//set passwordLength
function handelSlider() {
    inputSlider.Value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {
       return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNumb = getRndInteger(0, symbols.length);
    return symbols.charAt(randNumb);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = true;
    let hasNum = false;
    let hasSym = false;
    if (uppercasecheck.checked) hasUpper = true;
    if (lowercasecheck.checked) hasLower = true;
    if (numberscheck.checked) hasNum = true;
    if (symbolscheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#ff0")
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.Value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("Active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000)

}

function ShufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
         //swap number at i index and j index
         const temp = array[i];
         array[i] = array[j]
         array[j] = temp
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handelCheckBoxChange() {
    checkcount = 0;
    allCheckBox.forEach( (checkBox) => {
        if(checkBox.checked)
        checkout++;
    });

    //special condition
    if(passwordLength < checkcount ) {
        passwordLength = checkcount
        handelSlider();
    }
}

allCheckBox.forEach( (checkBox) => {
    checkBox.addEventListener('change', handelCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handelSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () => {
       //nono of the checkbox are selected
       
      if(checkcount == 0) 
          return;

      if(passwordLength < checkcount) {
          passwordLength = checkcount;
          handelSlider();
      }

      // let's start the journey to find a new password
      console.log("Starting the Journey");
      //remove old password
      password = "";

      //let's put the stuff mentioned by checkboxes

    if(uppercaseCheck.checked) {
        password += generateUpperCase();
    }

    if(lowercaseCheck.checked) {
        password += generateLowerCase();
    }

    if(numbersCheck.checked) {
        password += generateRandomNumber();
    }

    if(symbolsCheck.checked) {
        password += generateSymbol();
    }

    let funcArr = [];

    if(uppercasecheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercasecheck.checked)
        funcArr.push(generateLowerCase);

    if(numberscheck.checked)
         funcArr.push(generateRandomNumber);

    if(symbolscheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("compulsory addition done");
    
    //remaning addition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaning addition done");
    //shuffle the password
    password = ShufflePassword(Array.from(password));
    console.log("shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI done");
    //calculate strength
    calcStrength();
});