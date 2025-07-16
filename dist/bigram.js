var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Bigram {
    constructor(bigram, posX, posY, def, categoryNum) {
        this.word = properCase(bigram); // stored in proper case
        this.posX = posX;
        this.posY = posY;
        this.definitions = def;
        this.categoryNum = categoryNum;
    }
    getPoints() {
        return [...this.word].map(scoreOfLetter).reduce((acc, val) => acc + val);
    }
    getFirstLetter() {
        return this.word[0].toUpperCase();
    }
    getSecondLetter() {
        return this.word[1].toUpperCase();
    }
    isWord(word) {
        // Whether this bigram represents the input word (case-insensitive)
        return this.word.toUpperCase() == word.toUpperCase();
    }
    getCategoryName() {
        return categoryNumToCategoryName(this.categoryNum);
    }
    getCategoryColor() {
        return categoryNumToColor(this.categoryNum);
    }
}
function properCase(word) {
    if (!word) {
        return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
}
function scoreOfLetter(letter) {
    const points = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];
    const index = letter.toUpperCase().charCodeAt(0) - 65;
    return points[index];
}
function getBigramFromJsonObject(jsonObj) {
    const definitions = typeof jsonObj.d === "string" ? [jsonObj.d] : jsonObj.d;
    return new Bigram(jsonObj.w, jsonObj.x, jsonObj.y, definitions, jsonObj.c);
}
function getBigramsFromJsonFile(bigramsJsonFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(bigramsJsonFilePath)
            .then(response => response.json()) // Parse the JSON from the response
            .then(data => data.map(getBigramFromJsonObject))
            .catch(error => {
            console.error('Error fetching JSON:', error);
        });
    });
}
