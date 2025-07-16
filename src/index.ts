const NUM_OF_ROWS: number = 10;
const NUM_OF_COLS: number = 15;

const BIGRAMS: Bigram[] = [];

let selectedBigram;

function getBigramByWord(word: string): Bigram {
    for (const b of BIGRAMS) {
        if (b.isWord(word)) {
            return b;
        }
    }
    return null;
}

function addBigramToPTable(bigram: Bigram) {
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

function addCategoryToLegend(categoryNum: number): void {
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

    const colNum = categoryNum < CATEGORIES.length/2 ? 1 : 2;

    document.getElementById(`legend-item-list-col${colNum}`).appendChild(legendItemDiv);
}

function initPTable(bigrams: Bigram[]): void {
    for (const b of bigrams) {
        addBigramToPTable(b);
    }
}

function initLegend(): void {
    for (let i = 0; i < CATEGORIES.length; i++) {
        addCategoryToLegend(i);
    }
}

function updateInfoBox(selectedBigramWord: string): void {
    let selectedBigram = getBigramByWord(selectedBigramWord);

    if (selectedBigram == null) { return; }

    const letters: [string, string] = [selectedBigram.getFirstLetter(), selectedBigram.getSecondLetter()];
    const letterScores: [number, number] = [scoreOfLetter(letters[0]), scoreOfLetter(letters[1])];

    for (let i = 0; i < 2; i++) {
        document.querySelectorAll(`.selected-word-letter${i+1}`).forEach(span => {
            span.textContent = letters[i];
        });

        document.querySelectorAll(`.selected-word-value${i+1}`).forEach(span => {
            span.textContent = letterScores[i].toString();
        });

        document.querySelectorAll<HTMLElement>(`.selected-word-value${i+1}-pluralisation`).forEach(span => {
            span.style.display = letterScores[i] == 1 ? "none" : "inline-block";
        });
    }

    document.querySelectorAll(".selected-word-total-score").forEach(span => {
        span.textContent = selectedBigram.getPoints().toString();
    });

    const defList = document.getElementById("selected-word-definitions");
    defList.replaceChildren();  // Clear all children
    for (const definition of selectedBigram.definitions) {
        const listItem = document.createElement("li");
        listItem.textContent = definition;
        defList.appendChild(listItem);
    }
    
    setBulletColor(document.getElementById("selected-word-category-bullet"), selectedBigram.getCategoryColor());

    document.getElementById("selected-word-category").textContent = selectedBigram.getCategoryName();
}

function initEventListeners(): void {
    document.querySelectorAll("#p-table .tile").forEach(tile => {
        tile.addEventListener("click", (e) => {
            updateInfoBox(tile.querySelector(".letter").textContent);

            document.getElementById("selected-word").scrollIntoView({
                behavior: 'smooth', // For smooth scrolling animation
                block: 'start'      // Align top of element with top of viewport
            });
        })
    })

    Array.from(document.getElementsByClassName("legend-item")).forEach(legendItem => {
        const categoryName = legendItem.lastChild.textContent;
        const tileDivsInCategory = BIGRAMS
            .filter(b => b.getCategoryName() == categoryName)
            .map(b => document.getElementById(`p-table-tile-${b.posX}-${b.posY}`));
        
        legendItem.addEventListener("mouseover", (e) => {
            tileDivsInCategory.forEach(
                tile => tile.classList.add("in-selected-category")
            );
        });

        legendItem.addEventListener("mouseout", (e) => {
            tileDivsInCategory.forEach(
                tile => tile.classList.remove("in-selected-category")
            );
        });
    });
}

function initTotalNumOfBigrams(): void {
    Array.from(document.getElementsByClassName("total-num-of-bigrams")).forEach(element => {
        element.textContent = BIGRAMS.length.toString();
    });
}

async function init(): Promise<void> {
    initLegend();

    const bigrams = await getBigramsFromJsonFile('assets/bigrams.json');

    initPTable(bigrams);

    for (const b of bigrams) {
        BIGRAMS.push(b);  // Add to global BIGRAMS array
    }
    
    initTotalNumOfBigrams();
    updateInfoBox("AA");
    initEventListeners();
}


init();