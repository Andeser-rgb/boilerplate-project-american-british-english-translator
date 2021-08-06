'use strict';
/*jshint esversion: 6, node: true */

const Translator = require('../components/translator.js');

module.exports = function(app) {

    const translator = new Translator();

    app.route('/api/translate')
        .post((req, res) => {
            const {
                text,
                locale
            } = req.body;

            if (!text || !locale) {
                res.json({
                    error: 'Required field(s) missing'
                });
                return;
            }
            let translatedText = 'ciccio';
            let textWords = text.split(' ');
            if (locale === 'american-to-british') {
                translatedText = translator.americanToBritish(text)
                    .split(' ')
                    .map(d => {
                        return textWords.includes(d) ? d : spanEncapsulate(d);
                    })
                    .join(' ');
            } else if (locale === 'british-to-american') {
                translatedText = translator.britishToAmerican(text)
                    .split(' ')
                    .map(d => {
                        return textWords.includes(d) ?
                            spanEncapsulate(d) :
                            d;
                    })
                    .join(' ');
            }
            res.json({
                text: text,
                translation: translatedText
            });

        });
};

function spanEncapsulate(text) {
    return '<span class="highlight">' + text + '</span>';
}