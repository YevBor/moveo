import { generateSlug } from 'random-word-slugs';

export const categories = {
    easy: { words: 'food', points: 1 },
    medium: { words: 'animals', points: 3 },
    hard: { words: 'education', points: 5 }
}

class Word {
    constructor(word, points) {
        this.word = word;
        this.points = points;
    }
}

function point(word){
    if(word.length <= 3){
        return 1;
    }if(word.length == 5){
        return 5;
    }
    return 6;
}

export const generateWord = category => {
    const word = generateSlug(1, {
        partsOfSpeech: ['noun'],
        categories: {
            noun: [`${category.words}`]
        }
    });
    const p = point(word)
    return new Word(word, p);
}
