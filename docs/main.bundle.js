(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(2);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "body {\n  background: #000;\n  color: #fff;\n  min-height: calc(100vh *20)\n}\n\n._4PyOE {\n  position: fixed;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  overflow: hidden;\n  z-index: 999;\n}\n\n._3tj5d {\n  position: relative;\n}\n\n._1wy0w {\n  position: absolute;\n  width: 50px;\n  height: 50px;\n  object-fit: cover;\n  object-position: 50% 50%;\n  //border-radius: 45% / 10%;\n  padding: 0px;\n  box-sizing: border-box;\n}\n\n._1iqqG {\n  opacity: 0;\n}\n", ""]);
// Exports
exports.locals = {
	"root": "_4PyOE",
	"group": "_3tj5d",
	"img": "_1wy0w",
	"empty": "_1iqqG"
};
module.exports = exports;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/i/zaha-2.png
/* harmony default export */ var zaha_2 = (__webpack_require__.p + "zaha-2.png");
// CONCATENATED MODULE: ./src/i/zaha-1.png
/* harmony default export */ var zaha_1 = (__webpack_require__.p + "zaha-1.png");
// CONCATENATED MODULE: ./src/i/biarke-1.png
/* harmony default export */ var biarke_1 = (__webpack_require__.p + "biarke-1.png");
// CONCATENATED MODULE: ./src/i/biarke-2.png
/* harmony default export */ var biarke_2 = (__webpack_require__.p + "biarke-2.png");
// CONCATENATED MODULE: ./src/i/aalto-1.png
/* harmony default export */ var aalto_1 = (__webpack_require__.p + "aalto-1.png");
// CONCATENATED MODULE: ./src/i/aalto-2.png
/* harmony default export */ var aalto_2 = (__webpack_require__.p + "aalto-2.png");
// CONCATENATED MODULE: ./src/i/zumtor-1.png
/* harmony default export */ var zumtor_1 = (__webpack_require__.p + "zumtor-1.png");
// CONCATENATED MODULE: ./src/i/zumtor-2.png
/* harmony default export */ var zumtor_2 = (__webpack_require__.p + "zumtor-2.png");
// EXTERNAL MODULE: ./src/index.css
var src = __webpack_require__(0);
var src_default = /*#__PURE__*/__webpack_require__.n(src);

// CONCATENATED MODULE: ./src/index.ts









const zahaImgs = [zaha_2, zaha_1];
const biarkeImgs = [biarke_1, biarke_2];
const aaltoImgs = [aalto_1, aalto_2];
const zumtorImgs = [zumtor_1, zumtor_2];
const root = document.getElementById('root');
root.className = src_default.a.root;
const src_size = window.innerWidth > 400 ? 100 : 15;
let winWidth;
let winHeight;
let blockXCount;
let blockYCount;
let blockTotalCount;
let blocks;

function recalcSizes() {
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;
  blockXCount = Math.ceil(winWidth / src_size);
  blockYCount = Math.ceil(winHeight / src_size);
  blockTotalCount = blockXCount * blockYCount;
  blocks = createBuilding(zaha_2);
  root.innerHTML = '';
  blocks.forEach(block => root.appendChild(block));
}

setTimeout(() => {}, 1000);
recalcSizes();

if (window.innerWidth > 400) {
  window.addEventListener('resize', () => recalcSizes(), false);
}

function createBuilding(imgSrc, offsetX = 0) {
  const blocks = [];

  for (let y = 0; y < blockYCount; y++) {
    for (let x = 0; x < blockXCount; x++) {
      const xPos = x * src_size + offsetX * (src_size + 2);
      const yPos = y * src_size;
      blocks.push(createBlock(src_size, imgSrc, xPos, yPos, false));
    }
  }

  return blocks;
}

function createBlock(size, imgSrc, x, y, isEmpty) {
  const img = document.createElement('img');
  img.className = src_default.a.img + (isEmpty ? ` ${src_default.a.empty}` : '');
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  img.style.width = `${size}px`;
  img.style.height = `${size}px`;
  img.style.objectPosition = `${randObjPos()}% ${randObjPos()}%`;
  img.src = [zaha_2, zaha_1][getRandomInt(0, 1)];
  return img;
}

function createGroup() {
  const g = document.createElement('div');
  g.className = src_default.a.group;
  return g;
}

let i = window.pageYOffset;
let prevScrollY = window.pageYOffset;
setTimeout(() => {
  window.addEventListener('scroll', () => {
    const pageYOffset = window.pageYOffset;

    const scrollPerc = _get_scroll_percentage();

    let inc = 1;

    if (prevScrollY > pageYOffset) {
      inc = -1;
    }

    prevScrollY = pageYOffset;

    for (let j = 0; j < blockXCount; j++) {
      const block = blocks[i % blockTotalCount];
      i += inc;
      block.style.objectPosition = `${randObjPos()}% ${randObjPos()}%`;
      block.src = getRandImgByScrollPos(scrollPerc);
    }
  }, {
    passive: true
  });
}, 1000);

function getRandImgByScrollPos(scrollPerc) {
  // pageYOffset -- ?
  // scrollHeight -- 100
  //
  // ? = (pageYOffset / scrollHeight) * 100
  const currPerc = scrollPerc;
  let imgs = zahaImgs;

  if (currPerc < 10) {
    imgs = zahaImgs;
  } else if (currPerc < 20) {
    imgs = zahaImgs.concat(biarkeImgs);
  } else if (currPerc < 30) {
    imgs = biarkeImgs;
  } else if (currPerc < 40) {
    imgs = biarkeImgs.concat(aaltoImgs);
  } else if (currPerc < 50) {
    imgs = aaltoImgs;
  } else if (currPerc < 60) {
    imgs = aaltoImgs.concat(zumtorImgs);
  } else if (currPerc < 70) {
    imgs = zumtorImgs;
  } else if (currPerc < 80) {
    imgs = zumtorImgs.concat(biarkeImgs).concat(aaltoImgs);
  } else {
    imgs = zumtorImgs.concat(biarkeImgs).concat(aaltoImgs).concat(zahaImgs);
  }

  return imgs[getRandomInt(0, imgs.length - 1)];
}

function randObjPos() {
  return getRandomInt(0, 80);
}

function getRandomInt(min, max) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
/**
 * Get current browser viewpane heigtht
 */


function _get_window_height() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
}
/**
 * Get current absolute window scroll position
 */


function _get_window_Yscroll() {
  return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
}
/**
 * Get current absolute document height
 */


function _get_doc_height() {
  return Math.max(document.body.scrollHeight || 0, document.documentElement.scrollHeight || 0, document.body.offsetHeight || 0, document.documentElement.offsetHeight || 0, document.body.clientHeight || 0, document.documentElement.clientHeight || 0);
}
/**
 * Get current vertical scroll percentage
 */


function _get_scroll_percentage() {
  return (_get_window_Yscroll() + _get_window_height()) / _get_doc_height() * 100;
}

/***/ })
],[[4,0]]]);
//# sourceMappingURL=main.bundle.js.map