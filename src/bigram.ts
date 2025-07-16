class Bigram {
    word: string;
    definitions: string[];
    posX: number;
    posY: number;
    categoryNum: number;

    constructor(bigram: string, posX: number, posY: number, def: string[], categoryNum: number) {
        this.word = properCase(bigram);  // stored in proper case
        this.posX = posX;
        this.posY = posY;
        this.definitions = def;
        this.categoryNum = categoryNum;
    }

    getPoints(): number {
        return [...this.word].map(scoreOfLetter).reduce((acc, val) => acc + val);
    }

    getFirstLetter(): string {
        return this.word[0].toUpperCase();
    }

    getSecondLetter(): string {
        return this.word[1].toUpperCase();
    }

    isWord(word: string): boolean {
        // Whether this bigram represents the input word (case-insensitive)
        return this.word.toUpperCase() == word.toUpperCase();
    }

    getCategoryName(): string {
        return categoryNumToCategoryName(this.categoryNum);
    }

    getCategoryColor(): string {
        return categoryNumToColor(this.categoryNum);
    }
}

interface BigramJsonObject {
    w: string;
    x: number;
    y: number;
    d: string | string[];
    c: number;
}

function properCase(word: string): string {
    if (!word) {
        return "";
    }
      
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function scoreOfLetter(letter: string) {
    const points: number[] = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];

    const index = letter.toUpperCase().charCodeAt(0) - 65;

    return points[index];
}

function getBigramFromJsonObject(jsonObj: BigramJsonObject): Bigram {
    const definitions: string[] = typeof jsonObj.d === "string" ? [jsonObj.d] : jsonObj.d; 

    return new Bigram(jsonObj.w, jsonObj.x, jsonObj.y, definitions, jsonObj.c);
}

async function getBigramsFromJsonFile(bigramsJsonFilePath: string): Promise<Bigram[]> {
    return fetch(bigramsJsonFilePath)
        .then(response => response.json()) // Parse the JSON from the response
        .then(data => data.map(getBigramFromJsonObject))
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
}
