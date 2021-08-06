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
            if (text === "") {
                res.jsone({
                    error: "No text to translate"
                });
                return;
            }
            if (locale !== 'american-to-british' && locale !== 'british-to-american') {
                res.json({
                    error: 'Invalid value for locale field'
                });
                return;
            }
            let translatedText;
            let textWords = text.split(' ');
            switch (locale) {
                case 'american-to-british':
                    translatedText = translator.americanToBritish(text);
                    break;
                case 'british-to-american':
                    translatedText = translator.britishToAmerican(text);
                    break;
                default:
                    break;
            }
            if (translatedText === text) {
                res.json({
                    text: text,
                    translation: 'Everything looks good to me!'
                });
                return;
            }

            translatedText
                .split(' ')
                .map(d => {
                    return textWords.includes(d) ?
                        spanEncapsulate(d) :
                        d;
                })
                .join(' ');

            res.json({
                text: text,
                translation: translatedText
            });

        });
};

function spanEncapsulate(text) {
    return '<span class="highlight">' + text + '</span>';
}