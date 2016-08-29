"use strict"

/** 翻译文案
 *  @param {string} text 待翻译文本
 */
exports.translate = (text) => {
    let translation ={
      'hello world!': '您好，世界！'
    };

    let lowerText = text.toLowerCase();

    return lowerText in translation ? translation[lowerText] : text
};
