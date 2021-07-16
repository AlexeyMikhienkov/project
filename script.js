const sudoku = new Sudoku(`123456789456789123789123456234567891567891234891234567345678912678912345912345678`);

const startWindow = document.querySelector(".mainBlock").append(sudoku.getStartWindow());
const startButton = document.querySelector(".mainBlock").append(sudoku.getStartButton());
let currentFocusCell;
let startNumberOfSupposedElements = 10;
let numberOfSupposedElements = startNumberOfSupposedElements;
let lastHiddenCell;
let hiddenCellsId = [];

let startText = document.querySelector(".textParagraph");
startText.innerHTML = "Заполните игровое поле цифрами от 1 до 9 так, чтобы каждая цифра встречалась только 1 раз в каждой строке, столбце и малых квадратах 3х3 клетки";

function swapRows(a, b) {
    const row1 = sudoku.getRow(a);
    const row2 = sudoku.getRow(b);

    for (let i = 0; i < 9; i++) {
        const cell1 = row1[i];
        const cell2 = row2[i];

        let tmp = cell1.value;
        cell1.value = cell2.value;
        cell2.value = tmp;
    }
}

function swapColumns(a, b) {
    const column1 = sudoku.getColumn(a);
    const column2 = sudoku.getColumn(b);

    for (let i = 0; i < 9; i++) {
        const cell1 = column1[i];
        const cell2 = column2[i];

        let tmp2 = cell1.value;
        cell1.value = cell2.value;
        cell2.value = tmp2;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function createGame() {
    for (let i = 0; i < 3; i++) {
        let a = getRandomInt(0, 9);
        let b = getRandomInt(0, 9);

        swapRows(a, b);
    }

    for (let i = 0; i < 3; i++) {
        let a = getRandomInt(0, 9);
        let b = getRandomInt(0, 9);

        swapColumns(a, b);
    }

    updateGame();

    return sudoku;
}

function updateGame() {
    for (const cell of sudoku.body) {
        cell.element.value = cell.value;
    }
}

function updateSupposed() {
    for (const cell of sudoku.body) {
        if (cell.supposedNumber != 0) {
            cell.element.value = cell.supposedNumber;
        }
    }
}

function hideCells() {
    let number;

    for (let i = 0; i < numberOfSupposedElements; i++) {
        while (true) {
            number = getRandomInt(1, 82);

            if (!hiddenCellsId.includes(number)) {
                hiddenCellsId.push(number);
                break;
            }
        }
    }

    hiddenCellsId.forEach(id => document.getElementById("cell" + String(id)).className = "hiddenCell");
}

function getCurrentFocus(e) {
    const focused = e.srcElement;
    let id;

    if (focused.className == "hiddenCell" || focused.className == "supposedCell") { //нажатая ячейка судоку получает текущий фокус
        currentFocusCell = focused;
    } 
    else if (focused.className == "button") { //нажата кнопка с числом (1-9)
        if (currentFocusCell != undefined) {
            if (String(currentFocusCell.id).length == 6) {
                id = parseInt(String(currentFocusCell.id).substring(4, 6));
            } else {
                id = parseInt(String(currentFocusCell.id).substring(4, 5));
            }

            const cellElement = sudoku.findCellById(id);
            cellElement.supposedNumber = parseInt(focused.value);

            //htmlElement.setAttribute("background-color", "#e92a9c");

            updateSupposed();

            document.getElementById("cell" + String(id)).className = "supposedCell";

            if (numberOfSupposedElements == 1) {
                lastHiddenCell = cellElement;
            }

            numberOfSupposedElements--;

            if (numberOfSupposedElements == 0) {
                askQuestion();
            }

        }
    }
    else if (focused.id == "clear") {
        if (currentFocusCell != undefined) {
            if (String(currentFocusCell.id).length == 6) {
                id = parseInt(String(currentFocusCell.id).substring(4, 6));
            } else {
                id = parseInt(String(currentFocusCell.id).substring(4, 5));
            }

            const cellElement = sudoku.findCellById(id);
            cellElement.supposedNumber = 0;

            updateSupposed();

            document.getElementById("cell" + String(id)).className = "hiddenCell";
            numberOfSupposedElements++;

        }
    }    
}

function askQuestion() {
    const buttons = document.querySelectorAll(".button");
    const clear = document.getElementById("clear");
    const panel = document.querySelector(".numbersPanel");

    for (const button of buttons) {
        button.remove();
    }

    clear.remove();
    panel.remove();

    const questionPanel = document.querySelector(".footer").append(sudoku.getQuestionPanel());

    let questionText = document.querySelector(".question");
    questionText.innerHTML = "Проверить судоку?";
}

function startGame() {
    const paragraph = document.querySelector(".textParagraph");
    const btn = document.querySelector(".startButton");
    const storage = document.querySelector(".textStorage");

    paragraph.remove();
    btn.remove();
    storage.remove();

    const game = document.querySelector(".app").append(sudoku.getHTML(380));
    const buttons = document.querySelector(".footer").append(sudoku.getFooter());

    const startSudoku = createGame();
    hideCells();    
}

function no() {
    const cell = lastHiddenCell;
    const id = cell.id;

    const cellElement = sudoku.findCellById(id);
    cellElement.supposedNumber = 0;

    updateSupposed();

    numberOfSupposedElements++;
    document.getElementById("cell" + String(id)).className = "hiddenCell";

    const paragraph = document.querySelector(".question");
    const btn1 = document.getElementById("no");
    const btn2 = document.getElementById("yes");
    const qStore = document.querySelector(".questionStore");
    const qStorage = document.querySelector(".questionStorage");

    paragraph.remove();
    btn1.remove();
    btn2.remove();
    qStore.remove();
    qStorage.remove();

    const buttons = document.querySelector(".footer").append(sudoku.getFooter());
}

function yes() {
    if (checkAnswers()) {
        alert("ПОЗДРАВЛЯЕМ, ВЫ ВЕРНО РЕШИЛИ СУДОКУ!");
        game();
    } else {
        alert("К СОЖАЛЕНИЮ, ВЫ ОШИБЛИСЬ. ПОПРОБУЙТЕ ЕЩЕ РАЗ!");

        for (const id of hiddenCellsId) {
            const cellElement = sudoku.findCellById(id);
            cellElement.supposedNumber = 0;
            document.getElementById("cell" + String(id)).className = "hiddenCell";
        }

        updateSupposed();

        numberOfSupposedElements = startNumberOfSupposedElements;

        const paragraph = document.querySelector(".question");
        const btn1 = document.getElementById("no");
        const btn2 = document.getElementById("yes");
        const qStore = document.querySelector(".questionStore");
        const qStorage = document.querySelector(".questionStorage");
    
        paragraph.remove();
        btn1.remove();
        btn2.remove();
        qStore.remove();
        qStorage.remove();
    
        const buttons = document.querySelector(".footer").append(sudoku.getFooter());
    }
}

function checkAnswers() {

    for (const id of hiddenCellsId) {
        checkedElement = sudoku.findCellById(id);
        if (checkedElement.value != checkedElement.supposedNumber) {
            return false;
        }   
    }

    return true;
}

const cell = document.addEventListener('click', getCurrentFocus);

