function $(str, all=false) {
    return all ? document.querySelectorAll(str) : document.querySelector(str);
}

function generatePower(pow=4) {
    // Генерирует степень десятки от -1 до pow / 2 + 1
    return Math.floor(Math.random() * pow) - (pow / 2 - 1);
}

function generateNumber() {
    let pwr = generatePower();
    let rnd = Math.random();

    if (rnd < 0.1 && pwr != 0.1 && pwr != 0) {
        return 10 ** pwr;
    }

    rnd = Math.floor(rnd * 10 ** (pwr + 3)) / 1000;

    if (rnd > 50) {
        rnd = Math.floor(rnd) * Math.floor(Math.random() * 5 + 1);
    }

    return rnd;
}

function roundTo(num, pwr=8) {
    return Math.floor(num * 10 ** pwr) / 10 ** pwr;
}

function generateData() {
    do {
        firstNumberNum = generateNumber();
        secondNumberNum = generateNumber();
        actionNum = getActionNum();
    
        if (actionNum == 0) {
            secondNumberNum = 10 ** generatePower() * Math.floor(Math.random() * 5 + 1);
        } else if (actionNum == 1 && firstNumberNum < secondNumberNum) {
            let temp = firstNumberNum;
            firstNumberNum = secondNumberNum;
            secondNumberNum = temp;
        }
    } while (("" + actionsFunc[actionNum]()).length > 10);
    
    history.push([firstNumberNum, secondNumberNum, actionNum, [], "SL"]);

    localStorage.setItem("N1", firstNumberNum);
    localStorage.setItem("N2", secondNumberNum);
    localStorage.setItem("Act", actionNum);

}

function fillNumbers() {
    drawHistory();
    updateScores();
    
    firstNumber.textContent = firstNumberNum;
    secondNumber.textContent = secondNumberNum;
    
    action.setAttribute("src", `src/imgs/${actions[actionNum]}`);

    problemNumber.textContent = `${history.length})`;

    localStorage.setItem("His", JSON.stringify(history));
    localStorage.setItem("N1", firstNumberNum);
    localStorage.setItem("N2", secondNumberNum);
    localStorage.setItem("Act", actionNum);
    localStorage.setItem("Tri", tries);
    localStorage.setItem("CoA", correctAnsws);
    localStorage.setItem("WrA", wrongAnsws);
}

function checkHandler() {
    checkAnswer.removeEventListener("click", checkHandler);    
    history[history.length - 1][3].push(answer.value);

    setTimeout(() => {
        checkAnswer.addEventListener("click", checkHandler);
        checkAnswer.classList.remove("buttonCorrect");
        checkAnswer.classList.remove("buttonIncorrect");
        checkAnswer.textContent = "Проверить";

    }, 1600);

    if (actionsFunc[actionNum]() == answer.value) {
        // Если ответ верный
        tries = 3;
        history[history.length - 1][4] = "OK";
        correctAnsws++;
        localStorage.setItem("CoA", correctAnsws);

        checkAnswer.classList.add("buttonCorrect");
        checkAnswer.textContent = "Верно!";

        setTimeout(() => {
            generateParticles();
            
        }, 50);

        setTimeout(() => {
            generateData();
            fillNumbers();
            answer.value = "";
            answer.style.width = "100px";
            answer.focus();
            
        }, 2000);

    } else {
        // Если ответ неверный
        tries--;
        checkAnswer.classList.add("buttonIncorrect");
        let transforms = [-25, 10, -8, 5, -2, 0];

        transforms.forEach((elem, index) => {
            setTimeout(() => {
                checkAnswer.style.transform = `translateX(${elem}px)`
            }, index * 100);
        });

        if (tries == 1) {
            checkAnswer.textContent = `Осталось ${tries} попытка`;
        } else {
            checkAnswer.textContent = `Осталось ${tries} попытки`;
        }

        if (tries <= 0) {
            history[history.length - 1][4] = "NO";
            wrongAnsws++;
            localStorage.setItem("WrA", wrongAnsws);

            checkAnswer.textContent = "Неверно";
        }

        setTimeout(() => {
            answer.value = "";
            answer.style.width = "100px";
            answer.focus();

            if (tries <= 0) {
                // Попыток не осталось. Генерирую новые числа
                generateData()
                fillNumbers();
                tries = 3;
    
            }

            
        }, 2000);
    }

    localStorage.setItem("His", JSON.stringify(history));
    localStorage.setItem("Tri", tries);
    drawHistory();
    updateScores();
}

function getActionNum() {
    let temp = Math.round(Math.random() * 8);
    let range = [0, 2, 3, 7, 8];
    if (temp >= range[0] && temp <= range[1]) return 0;
    if (temp > range[1] && temp <= range[2]) return 1;
    if (temp > range[2] && temp <= range[3]) return 2;
    if (temp > range[3] && temp <= range[4]) return 3;
}

function clearData() {
    localStorage.clear();
}

function drawHistory() {
    historyList.innerHTML = "";

    history.forEach((elem, index) => {
        if (elem[4] != "SL") {
            let historyElem = document.createElement("div");
            historyElem.classList.add("historyElem");

            let text = `${index + 1}. ${elem[0]} ${actionsSym[elem[2]]} ${elem[1]} = ${actionsFunc[elem[2]](elem[0], elem[1])}. `
            
            if (elem[4] == "OK") {
                switch (elem[3].length) {
                    case 1:
                        text += "Решено за 1 попытку.";
                        break;
                    case 2:
                        text += "Решено за 2 попытки.";
                        break;
                    case 3:
                        text += "Решено за 3 попытки.";
                        break;
                }

                historyElem.classList.add("historyCorrect");

            } else {
                text += "Не решено за 3 попытки";
                historyElem.classList.add("historyIncorrect");

            }

            historyElem.textContent = text;
            historyList.appendChild(historyElem);
            
        }
    });
}

function updateScores() {
    rightAnswers.textContent = correctAnsws;
    wrongAnswers.textContent = wrongAnsws;

}

function generateParticles() {
    let particleNames = ["ell", "rec", "pol"];
    let particles = [];
    let particlesField = $(".particles");
    let spread = 15;

    for (let i = 0; i < 50; i++) {
        let radius = Math.round((Math.random() * spread) ** 2);
        let angle = Math.random() * 2 * Math.PI;

        particles.push(document.createElement("img"));
        particles[i].setAttribute("src", `src/imgs/particles/${particleNames[Math.round(Math.random() * 2)]}.png`);
        particles[i].classList.add("particle");

        particlesField.appendChild(particles[i]);
        particles[i].style.transform = "translate(-80px, 0px) rotate(0deg)";
        particles[i].style.opacity = "1";

        setTimeout(() => {
            particles[i].style.transform = `translate(${Math.round(Math.sin(angle) * radius - 80)}px, ${Math.round(Math.cos(angle) * radius)}px) rotate(${Math.round(Math.random() * 180 - 90)}deg)`;
        }, 10);


        setTimeout(() => {
            particles[i].style.opacity = "0";
        }, 200);


        setTimeout(() => {
            particlesField.innerHTML = "";
        }, 800);
    }


}


let firstNumber = $(".firstNumber");
let secondNumber = $(".secondNumber");
let action = $(".action");
let answer = $(".answer");
let checkAnswer = $(".checkAnswer");
let historyList = $(".historyList");
let rightAnswers = $(".rightAnswers");
let wrongAnswers = $(".wrongAnswers");
let problemNumber = $(".problemNumber");

let actionsSym = ["/", "-", "x", "+"];
let actions = ["Divide.png", "Minus.png", "Multiply.png", "Plus.png"];

let actionsFunc = [ (n1=firstNumberNum, n2=secondNumberNum) => n1 / n2, 
                    (n1=firstNumberNum, n2=secondNumberNum) => n1 - n2, 
                    (n1=firstNumberNum, n2=secondNumberNum) => n1 * n2, 
                    (n1=firstNumberNum, n2=secondNumberNum) => +n1 + +n2];

let history = [];
let correctAnsws = 0;
let wrongAnsws = 0;
let tries = 3;
let actionNum = getActionNum();
let firstNumberNum;
let secondNumberNum;


if (localStorage.getItem("N1") == null) {
    generateData()
} else {
    firstNumber.textContent = localStorage.getItem("N1");
    secondNumber.textContent = localStorage.getItem("N2");
    firstNumberNum = localStorage.getItem("N1");
    secondNumberNum = localStorage.getItem("N2");
    correctAnsws = localStorage.getItem("CoA");
    wrongAnsws = localStorage.getItem("WrA");
    actionNum = localStorage.getItem("Act");
    history = JSON.parse(localStorage.getItem("His"));
    tries = localStorage.getItem("Tri");

}

fillNumbers();

checkAnswer.addEventListener("click", checkHandler);
// checkAnswer.addEventListener("click", generateParticles);

answer.addEventListener("input", () => {
    answer.style.width = `${answer.value.length * 19 + 20}px`
    
    if (answer.value[answer.value.length - 1] == ",") {
        answer.value = answer.value.slice(0, answer.value.length - 1) + "."
    }
})





// TODO: Сохранять значения полей в localStorage, 
// чтобы нельзя было поменять хначения, обновив страницу OK

// + Сохранять текущий счёт (сколько было решено правильно) OK

// На правильные ответ есть 3 попытки. потом - смена цифр OK

// Счетчик неправильных тоже надо сделать OK

// Сброс счетчиков тоже надо сделать


