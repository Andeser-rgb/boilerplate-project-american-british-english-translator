/*jshint esversion: 6, node: ture*/
const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {
    americanToBritish(text) {
        if (!text) return text;

        return this.languageToLanguage(text, americanOnly, americanToBritishSpelling, americanToBritishTitles);
    }

    britishToAmerican(text) {
        if (!text) return text;

        const britishToAmericanSpelling = this.invertObj(americanToBritishSpelling);
        const britishToAmericanTitles = this.invertObj(americanToBritishTitles);

        return this.languageToLanguage(text, britishOnly, britishToAmericanSpelling, britishToAmericanTitles, ['.', ':']);

    }

    languageToLanguage(text, only, spelling, titles, regex = [':', '.']) {
        let copy = text;
        for (let key in only)
            if (RegExp('\(\^' + key + '\|\\s' + key + '\)' + '\[\\s.\]', 'i').test(copy))
                copy = copy.replace(RegExp(key, 'i'), only[key]);

        return copy
            .split(' ')
            .map(d => {
                const dLower = d.toLowerCase();
                return RegExp('\\d\{1,2\}\[' + regex[0] + '\]\\d\{2\}').test(dLower) ?
                    dLower.replace(regex[0], regex[1]) :
                    spelling.hasOwnProperty(dLower) ?
                    spelling[dLower] :
                    titles.hasOwnProperty(dLower) ?
                    titles[dLower].replace(/^\w/, c => c.toUpperCase()) :
                    d;
            })
            .join(' ');
    }
    highlighter(text, translatedText) {
        const textWords = text.split(' ');

        return translatedText
            .split(' ')
            .map(d => textWords.includes(d) ? d : this.spanEncapsulate(d))
            .join(' ');
    }

    invertObj(obj) {
        let invObj = {};
        for (let key in obj)
            invObj[obj[key]] = key;
        return invObj;
    }


    spanEncapsulate(text) {
        return '<span class="highlight">' + text + '</span>';
    }
}


module.exports = Translator;