var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const NUM_OF_ROWS = 10;
const NUM_OF_COLS = 15;
const BIGRAMS = [];
let selectedBigram;
function getBigramByWord(word) {
    for (const b of BIGRAMS) {
        if (b.isWord(word)) {
            return b;
        }
    }
    return null;
}
function addBigramToPTable(bigram) {
    const tileDiv = document.createElement("div");
    tileDiv.classList.add("tile");
    tileDiv.id = `p-table-tile-${bigram.posX}-${bigram.posY}`;
    const letterDiv = document.createElement("div");
    letterDiv.classList.add("letter");
    letterDiv.textContent = bigram.word;
    const valueDiv = document.createElement("div");
    valueDiv.classList.add("value");
    valueDiv.textContent = bigram.getPoints().toString();
    tileDiv.style.gridRow = `${bigram.posY + 1} / ${bigram.posY + 2}`;
    tileDiv.style.gridColumn = `${bigram.posX + 1} / ${bigram.posX + 2}`;
    const tileColor = categoryNumToColor(bigram.categoryNum);
    tileDiv.style.backgroundColor = tileColor;
    tileDiv.style.border = `${darkenColor(tileColor)} solid 2px`;
    tileDiv.appendChild(letterDiv);
    tileDiv.appendChild(valueDiv);
    document.getElementById("p-table").appendChild(tileDiv);
}
function addCategoryToLegend(categoryNum) {
    const color = categoryNumToColor(categoryNum);
    const categoryName = categoryNumToCategoryName(categoryNum);
    const legendItemDiv = document.createElement("div");
    legendItemDiv.classList.add("legend-item");
    const bulletSpan = document.createElement("span");
    bulletSpan.classList.add("bullet");
    setBulletColor(bulletSpan, color);
    const categoryNameSpan = document.createElement("span");
    categoryNameSpan.textContent = categoryName;
    legendItemDiv.appendChild(bulletSpan);
    legendItemDiv.appendChild(categoryNameSpan);
    const colNum = categoryNum < CATEGORIES.length / 2 ? 1 : 2;
    document.getElementById(`legend-item-list-col${colNum}`).appendChild(legendItemDiv);
}
function initPTable(bigrams) {
    for (const b of bigrams) {
        addBigramToPTable(b);
    }
}
function initLegend() {
    for (let i = 0; i < CATEGORIES.length; i++) {
        addCategoryToLegend(i);
    }
}
function updateInfoBox(selectedBigramWord) {
    let selectedBigram = getBigramByWord(selectedBigramWord);
    if (selectedBigram == null) {
        return;
    }
    const letters = [selectedBigram.getFirstLetter(), selectedBigram.getSecondLetter()];
    const letterScores = letters.map(scoreOfLetter);
    for (let i = 0; i < 2; i++) {
        document.querySelectorAll(`.selected-word-letter${i + 1}`).forEach(span => {
            span.textContent = letters[i];
        });
        document.querySelectorAll(`.selected-word-value${i + 1}`).forEach(span => {
            span.textContent = letterScores[i].toString();
        });
        document.querySelectorAll(`.selected-word-value${i + 1}-pluralisation`).forEach(span => {
            span.style.display = letterScores[i] == 1 ? "none" : "inline-block";
        });
    }
    document.querySelectorAll(".selected-word-total-score").forEach(span => {
        span.textContent = selectedBigram.getPoints().toString();
    });
    const defList = document.getElementById("selected-word-definitions");
    defList.replaceChildren(); // Clear all children
    for (const definition of selectedBigram.definitions) {
        const listItem = document.createElement("li");
        listItem.textContent = definition;
        defList.appendChild(listItem);
    }
    setBulletColor(document.getElementById("selected-word-category-bullet"), selectedBigram.getCategoryColor());
    document.getElementById("selected-word-category").textContent = selectedBigram.getCategoryName();
}
function initEventListeners() {
    document.querySelectorAll("#p-table .tile").forEach(tile => {
        tile.addEventListener("click", _ => {
            updateInfoBox(tile.querySelector(".letter").textContent);
            document.getElementById("selected-word").scrollIntoView({
                behavior: 'smooth', // For smooth scrolling animation
                block: 'start' // Align top of element with top of viewport
            });
        });
    });
    Array.from(document.getElementsByClassName("legend-item")).forEach(legendItem => {
        const categoryName = legendItem.lastChild.textContent;
        const tileDivsInCategory = BIGRAMS
            .filter(b => b.getCategoryName() == categoryName)
            .map(b => document.getElementById(`p-table-tile-${b.posX}-${b.posY}`));
        legendItem.addEventListener("mouseover", _ => {
            tileDivsInCategory.forEach(tile => tile.classList.add("in-selected-category"));
        });
        legendItem.addEventListener("mouseout", _ => {
            tileDivsInCategory.forEach(tile => tile.classList.remove("in-selected-category"));
        });
    });
}
function initTotalNumOfBigrams() {
    Array.from(document.getElementsByClassName("total-num-of-bigrams")).forEach(element => {
        element.textContent = BIGRAMS.length.toString();
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        initLegend();
        const bigrams = yield getBigramsFromJsonFile('assets/bigrams.json');
        initPTable(bigrams);
        for (const b of bigrams) {
            BIGRAMS.push(b); // Add to global BIGRAMS array
        }
        initTotalNumOfBigrams();
        updateInfoBox("AA");
        initEventListeners();
    });
}
init();
