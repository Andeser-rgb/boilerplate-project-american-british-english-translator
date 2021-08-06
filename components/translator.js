const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    americanToBritish(text) {
        if (!text) return text;

        let copy = text;
        for (let key in americanOnly)
            if (copy.indexOf(key) !== -1)
                copy = copy.replace(key, americanOnly[key]);

        return copy
            .split(' ')
            .map(d => {
                const newD = d.toLowerCase();
                return /\d{1,2}:\d{2}/.test(newD) ?
                    newD.replace(':', '.') :
                    americanToBritishSpelling.hasOwnProperty(newD) ?
                    americanToBritishSpelling[newD] :
                    americanToBritishTitles.hasOwnProperty(newD) ?
                    americanToBritishTitles[newD].replace(/^\w/, c => c.toUpperCase()) :
                    d;
            })
            .join(' ');
    }

    britishToAmerican(text) {
        if (!text) return text;

        let copy = text;
        const britishToAmericanSpelling = this.invertObj(americanToBritishSpelling);
        const britishToAmericanTitles = this.invertObj(americanToBritishTitles);

        for (let key in britishOnly)
            if (copy.includes(key))
                copy = copy.replace(key, britishOnly[key]);

        return copy
            .split(' ')
            .map(d => {
                const newD = d.toLowerCase();
                return /\d{1,2}[.]\d{2}/.test(newD) ?
                    newD.replace('.', ':') :
                    britishToAmericanSpelling.hasOwnProperty(newD) ?
                    britishToAmericanSpelling[newD] :
                    britishToAmericanTitles.hasOwnProperty(newD) ?
                    britishToAmericanTitles[newd].replace(/^\w/, c => c.toUpperCase()) :
                    d;
            })
            .join(' ');
    }

    invertObj(obj) {
        let invObj = {};
        for (let key in obj)
            invObj[obj[key]] = key;
        return invObj;
    }

}

module.exports = Translator;