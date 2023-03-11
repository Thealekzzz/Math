function $(str, all=false) {
    return all ? document.querySelectorAll(str) : document.querySelector(str);
}

function generatePower(pow=4) {
    // Генерирует степень десятки от -1 до pow / 2 + 1
    return Math.floor(Math.random() * pow) - (pow / 2 - 1);
}

function generateNumber() {
    // Функция создает число, которое будет несложно умножить на другое такое же
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
        operationNum = getOperationNum();
    
        if (operationNum == 0) {
            secondNumberNum = 10 ** generatePower() * Math.floor(Math.random() * 5 + 1);
        } else if (operationNum == 1 && firstNumberNum < secondNumberNum) {
            let temp = firstNumberNum;
            firstNumberNum = secondNumberNum;
            secondNumberNum = temp;
        }
    } while (("" + operationsFunc[operationNum]()).length > 10);
    
    history.push([firstNumberNum, secondNumberNum, operationNum, [], "SL"]);

    localStorage.setItem("N1", firstNumberNum);
    localStorage.setItem("N2", secondNumberNum);
    localStorage.setItem("Act", operationNum);

}

function fillNumbers() {
    drawHistory();
    updateScores();
    
    firstNumber.textContent = firstNumberNum;
    secondNumber.textContent = secondNumberNum;
    
    operation.setAttribute("src", `../images/${operations[operationNum]}`);

    problemNumber.textContent = `${history.length}`;

    localStorage.setItem("His", JSON.stringify(history));
    localStorage.setItem("N1", firstNumberNum);
    localStorage.setItem("N2", secondNumberNum);
    localStorage.setItem("Act", operationNum);
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

    if (operationsFunc[operationNum]() == answer.value) {
        // Если ответ верный
        tries = 3;
        history[history.length - 1][4] = "OK";
        correctAnsws++;
        localStorage.setItem("CoA", correctAnsws);

        checkAnswer.classList.add("buttonCorrect");
        checkAnswer.textContent = "Верно!";

        // setTimeout(() => {
        //     generateParticles();
            
        // }, 50);

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

function getOperationNum() {
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

    history.forEach(elem => {
        // Если пример в стадии решения - пропустить его
        if (elem[4] === "SL") {
            return;
        }

        const li = historyItem.cloneNode(true);

        const status = li.querySelector(".problem-section__history-item-status");
        const problem = li.querySelector(".problem-section__history-item-problem");
        const steps = li.querySelector(".problem-section__history-item-steps");


        if (elem[4] == "OK") {
            status.classList.add("problem-section__history-item-status_right");
        } else {
            status.classList.add("problem-section__history-item-status_wrong");
        }

        problem.textContent = `${elem[0]} ${operationsSym[elem[2]]} ${elem[1]} = ${operationsFunc[elem[2]](elem[0], elem[1])}`
        steps.textContent = `[ ${elem[3].length} попытк${elem[3].length === 1 ? "а" : "и"} ]`;

        historyList.appendChild(li);
    });

    // history.forEach((elem, index) => {
    //     if (elem[4] != "SL") {
    //         let historyElem = document.createElement("div");
    //         historyElem.classList.add("historyElem");

    //         let text = `${index + 1}. ${elem[0]} ${operationsSym[elem[2]]} ${elem[1]} = ${operationsFunc[elem[2]](elem[0], elem[1])}. `
            
    //         if (elem[4] == "OK") {
    //             switch (elem[3].length) {
    //                 case 1:
    //                     text += "Решено за 1 попытку.";
    //                     break;
    //                 case 2:
    //                     text += "Решено за 2 попытки.";
    //                     break;
    //                 case 3:
    //                     text += "Решено за 3 попытки.";
    //                     break;
    //             }

    //             historyElem.classList.add("historyCorrect");

    //         } else {
    //             text += "Не решено за 3 попытки";
    //             historyElem.classList.add("historyIncorrect");

    //         }

    //         historyElem.textContent = text;
    //         historyList.appendChild(historyElem);
            
    //     }
    // });
}

function updateScores() {
    rightAnswers.textContent = correctAnsws;
    wrongAnswers.textContent = wrongAnsws;

}

function generateParticles() {
    let particleNames = ["ell", "rec", "pol"];
    let particles = [];
    let spread = 15;

    for (let i = 0; i < 50; i++) {
        let radius = Math.round((Math.random() * spread) ** 2);
        let angle = Math.random() * 2 * Math.PI;

        particles.push(document.createElement("img"));
        particles[i].setAttribute("src", `../images/particles/${particleNames[Math.round(Math.random() * 2)]}.png`);
        particles[i].classList.add("problem-section__particle");

        particlesField.appendChild(particles[i]);
        particles[i].style.transform = "translate(-80px, 0px) rotate(0deg)";
        particles[i].style.opacity = "1";

        setTimeout(() => {
            particles[i].style.transform = `translate(${Math.round(Math.sin(angle) * radius - 80)}px, ${Math.round(Math.cos(angle) * radius)}px) rotate(${Math.round(Math.random() * 180 - 90)}deg)`;
        }, 100);


        setTimeout(() => {
            particles[i].style.opacity = "0";
        }, 2000);


        setTimeout(() => {
            particlesField.innerHTML = "";
        }, 800);
    }


}


const problemNumber = $(".problem-section__number");
const firstNumber = $(".problem-section__first-number");
const secondNumber = $(".problem-section__second-number");
const operation = $(".problem-section__operation");
const answer = $(".problem-section__answer");
const checkAnswer = $(".problem-section__check-button");
const historyList = $(".problem-section__history-list");
const rightAnswers = $(".problem-section__answers_right");
const wrongAnswers = $(".problem-section__answers_wrong");
const particlesField = $(".problem-section__particles");
const historyItem = $("#history-item").content;

const operationsSym = ["/", "-", "x", "+"];
const operations = ["Divide.png", "Minus.png", "Multiply.png", "Plus.png"];

const operationsFunc = [ (n1=firstNumberNum, n2=secondNumberNum) => n1 / n2, 
                    (n1=firstNumberNum, n2=secondNumberNum) => n1 - n2, 
                    (n1=firstNumberNum, n2=secondNumberNum) => n1 * n2, 
                    (n1=firstNumberNum, n2=secondNumberNum) => +n1 + +n2];

let history = [];
let correctAnsws = 0;
let wrongAnsws = 0;
let tries = 3;
let operationNum = getOperationNum();
let firstNumberNum;
let secondNumberNum;


// Генерирую данные, либо беру их из LS
if (localStorage.getItem("N1") == null) {
    generateData();

} else {
    console.log("roughj")    
    firstNumber.textContent = localStorage.getItem("N1");
    secondNumber.textContent = localStorage.getItem("N2");
    firstNumberNum = localStorage.getItem("N1");
    secondNumberNum = localStorage.getItem("N2");
    correctAnsws = localStorage.getItem("CoA");
    wrongAnsws = localStorage.getItem("WrA");
    operationNum = localStorage.getItem("Act");
    history = JSON.parse(localStorage.getItem("His"));
    tries = localStorage.getItem("Tri");

    if (!history) {
        history = [[firstNumberNum, secondNumberNum, operationNum, [], "SL"]];
    }

}

fillNumbers();

checkAnswer.addEventListener("click", checkHandler);
// checkAnswer.addEventListener("click", generateParticles);

answer.addEventListener("input", (e) => {
    if (answer.value === "") {
        // Изменяю ширину инпута
        answer.style.width = `${answer.value.length * 19 + 20}px`;
        return;
    }

    const lastIndex = answer.value.length - 1;
    const lastSymbol = answer.value[lastIndex];

    // Если введена буква - убрать ее
    if (lastSymbol.charCodeAt(0) >= 95 && lastSymbol.charCodeAt(0) <= 122 || lastSymbol.charCodeAt(0) >= 1040 && lastSymbol.charCodeAt(0) <= 1103) {
        answer.value = answer.value.slice(0, lastIndex);
        return;
    } 

    // Если введена запятая - поменять ее на точку
    if (lastSymbol === ",") {
        answer.value = answer.value.slice(0, answer.value.length - 1) + ".";
    }
    
    // Изменяю ширину инпута
    answer.style.width = `${answer.value.length * 19 + 20}px`;
})





// TODO: Сохранять значения полей в localStorage, 
// чтобы нельзя было поменять хначения, обновив страницу OK

// + Сохранять текущий счёт (сколько было решено правильно) OK

// На правильные ответ есть 3 попытки. потом - смена цифр OK

// Счетчик неправильных тоже надо сделать OK

// Сброс счетчиков тоже надо сделать


