class Sudoku {
    constructor(startString) {
        const start = startString.split('');

        this.body = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.body.push({
                    id: i * 9 + j + 1,
                    x: i,
                    y: j, 
                    segment: Math.floor(i / 3) * 3 + Math.floor(j / 3),
                    value: parseInt(start[i * 9 + j]),
                    supposedNumber: 0
                })
            }
        }
    }

    getRow(rowNumber) {
        const row = [];

        for (let i = 0; i < 9; i++) {
            row.push(this.body[rowNumber * 9 + i])
        }

        return row;
    }

    getColumn(columnNumber) {
        const column = [];

        for (let j = 0; j < 9; j++) {
            column.push(this.body[j * 9 + columnNumber])
        }

        return column;
    }

    getSegment(segmentNumber) {
        const segment = [];
        const x = Math.floor(segmentNumber / 3) * 3;
        const y = Math.floor(segmentNumber % 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                segment.push(this.body[(x + i) * 9 + (y + j)]);
            }
        }

        return segment;
    }

    findCellById(id) {
        for (const cell of this.body) {
            //console.log(cell.element.id); cell1
            //console.log(cell.id); 1
            if (cell.id == id) {
                return cell;
            }
        }
    }

    update() {
        for (const cell of this.body) {
            cell.element.value = cell.value;
        }
    }

    getHTML(size) {
        const rootElement = document.createElement('div');
        rootElement.classList.add('game');
        rootElement.style.width = `${size}px`;
        rootElement.style.height = `${size}px`;        
        let counter = 1;

        for (const item of this.body) {

            const inputElement = document.createElement('input');
            inputElement.classList.add("cell");
            inputElement.setAttribute("id", "cell" + String(counter));
            inputElement.setAttribute("type", "text");
            inputElement.setAttribute("readonly", "readonly");

            item.element = inputElement;
            counter++;
        }

        for (let i = 0; i < 9; i++) {
            const segmentElement = document.createElement('div');
            segmentElement.classList.add("segment");

            for (const cell of this.getSegment(i)) {
                segmentElement.append(cell.element);
            }

            rootElement.append(segmentElement);
        }

        this.update();

        return rootElement;
    }

    getFooter() {
        const root = document.createElement('div');
        root.classList.add('numbersPanel');
        root.style.width = `390px`;
        root.style.height = `70px`;

        for (let i = 0; i < 9; i++) {
            const numberButton = document.createElement('input');
            numberButton.classList.add("button");
            let val = String(i + 1);
            numberButton.setAttribute("type", "button");
            numberButton.setAttribute("value", val);
            numberButton.style.color = "white";
            root.append(numberButton);
        }

        const numberButton = document.createElement('input');
      //  numberButton.classList.add("button");
        numberButton.setAttribute("type", "button");
        numberButton.setAttribute("value", "X");
        numberButton.setAttribute("id", "clear");
        numberButton.style.color = "white";
        root.append(numberButton);

        return root;
    }

    getStartWindow() {
        const textStorage = document.createElement('div');
        textStorage.classList.add('textStorage');

        const text = document.createElement('p');
        text.classList.add("textParagraph");
        textStorage.append(text);

        return textStorage;
    }

    getStartButton() {
        const startBtn = document.createElement("input");
        startBtn.classList.add("startButton");
        startBtn.setAttribute("type", "button");
        startBtn.setAttribute("value", "Начать игру");
        startBtn.setAttribute("onclick", "startGame()");

        return startBtn;
    }

    getQuestionPanel() {
        const questionStorage = document.createElement('div');
        questionStorage.classList.add('questionStorage');

        const questionStore = document.createElement('div');
        questionStore.classList.add('questionStore');

        questionStorage.append(questionStore);

        const text = document.createElement('p');
        text.classList.add("question");
        questionStore.append(text);

        const buttonsBox = document.createElement('div');
        buttonsBox.classList.add('buttonsBox');
        questionStorage.append(buttonsBox);

        const noBtn = document.createElement("input");
        noBtn.classList.add("questionButton");
        noBtn.setAttribute("id", "no");
        noBtn.setAttribute("type", "button");
        noBtn.setAttribute("value", "Нет");
        noBtn.setAttribute("onclick", "no()");

        const yesBtn = document.createElement("input");
        yesBtn.classList.add("questionButton");
        yesBtn.setAttribute("id", "yes");
        yesBtn.setAttribute("type", "button");
        yesBtn.setAttribute("value", "Да");
        yesBtn.setAttribute("onclick", "yes()");

        buttonsBox.append(noBtn);
        buttonsBox.append(yesBtn);

        return questionStorage;
    }
   
}