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

            if (text === undefined || locale === undefined) {
                res.json({
                    error: 'Required field(s) missing'
                });
                return;
            }
            if (/^\s*$/.test(text)) {
                res.json({
                    error: "No text to translate"
                });
                return;
            }
            let translatedText;
            switch (locale) {
                case 'american-to-british':
                    translatedText = translator.americanToBritish(text);
                    break;
                case 'british-to-american':
                    translatedText = translator.britishToAmerican(text);
                    break;
                default:
                    res.json({
                        error: 'Invalid value for locale field'
                    });
                    return;
            }
            if (translatedText === text) {
                res.json({
                    text: text,
                    translation: 'Everything looks good to me!'
                });
                return;
            }

            translatedText = translator.highlighter(text, translatedText);

            res.json({
                text: text,
                translation: translatedText
            });

        });
};