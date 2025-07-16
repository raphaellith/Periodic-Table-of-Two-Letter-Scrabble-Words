const COLORS: string[] = [
    "#C7F9FF",
    "#E2CFC4",
    "#EDC7FF",
    "#FFF2C7",
    "#C7FFE9",
    "#e6c3a1",
    "#DBFFC7",
    "#C7DCFF",
    "#FFC7C7",
    "#FFC7E9",
    "#FFDCC7",
    "#d2d2cf",
];

const CATEGORIES: string[] = [
    "English letters or homophones thereof",
    "Letters from foreign alphabets",
    "Family",
    "Interjections and slang",
    "Solfège notes",
    "Abbreviations",
    "Common words",
    "Pronouns",
    "Double vowels",
    "Spirituality",
    "Asian terms",
    "Miscellaneous terms"
];

function categoryNumToColor(categoryNum: number): string {
    return COLORS[categoryNum % COLORS.length];
}

function categoryNumToCategoryName(categoryNum: number): string {
    return CATEGORIES[categoryNum % CATEGORIES.length];
}

function darkenColor(color: string): string {
    return `color-mix(in srgb, black 50%, ${color} 50%)`
}

function setBulletColor(bulletSpan: HTMLElement, color: string) {
    bulletSpan.style.backgroundColor = color;
    bulletSpan.style.border = `${darkenColor(color)} solid 2px`;
}