'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _markdownItMathLoose = require('markdown-it-math-loose');

var _markdownItMathLoose2 = _interopRequireDefault(_markdownItMathLoose);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _mathRenderer = require('./internal/math-renderer');

var _mathRenderer2 = _interopRequireDefault(_mathRenderer);

var _highlightRenderer = require('./internal/highlight-renderer');

var _highlightRenderer2 = _interopRequireDefault(_highlightRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(input, cache, callbackFilter) {
    var cacheKey, cachedResult, uuidReplaces, mathRenderer, highlightRenderer, renderer, htmlResult, replacedHtmlResult, uuid;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Check cache first.
            cacheKey = void 0;

            if (!cache) {
              _context.next = 8;
              break;
            }

            cacheKey = (0, _objectHash2.default)({
              type: "Markdown",
              task: input
            });

            _context.next = 5;
            return cache.get(cacheKey);

          case 5:
            cachedResult = _context.sent;

            if (!cachedResult) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', cachedResult);

          case 8:

            // Maths and highlights are rendered asynchronously, so a UUID placeholder is
            // returned to markdown-it during markdown rendering process. After markdown
            // and these finish rendering, replace the placeholder with rendered content
            // in markdown rendering result.
            uuidReplaces = {};
            mathRenderer = new _mathRenderer2.default(cache, function (uuid, result) {
              uuidReplaces[uuid] = result;
            });
            highlightRenderer = new _highlightRenderer2.default(cache, function (uuid, result) {
              uuidReplaces[uuid] = result;
            });
            renderer = new _markdownIt2.default({
              html: true,
              breaks: false,
              linkify: true,
              typographer: false,
              highlight: function highlight(code, language) {
                return highlightRenderer.addRenderTask(code, language);
              }
            });


            renderer.use(_markdownItMathLoose2.default, {
              inlineOpen: '$',
              inlineClose: '$',
              blockOpen: '$$',
              blockClose: '$$',
              inlineRenderer: function inlineRenderer(str) {
                return mathRenderer.addRenderTask(str, false);
              },
              blockRenderer: function blockRenderer(str) {
                return mathRenderer.addRenderTask(str, true);
              }
            });

            htmlResult = renderer.render(input);

            if (callbackFilter) {
              // Useful for XSS filtering.
              htmlResult = callbackFilter(htmlResult);
            }

            // Do math and highlight rendering.
            _context.next = 17;
            return mathRenderer.doRender(function (uuid) {
              return htmlResult.indexOf(uuid) === -1;
            });

          case 17:
            _context.next = 19;
            return highlightRenderer.doRender(function (uuid) {
              return htmlResult.indexOf(uuid) === -1;
            });

          case 19:

            // Replace placeholders back.
            replacedHtmlResult = htmlResult;

            for (uuid in uuidReplaces) {
              replacedHtmlResult = replacedHtmlResult.replace(uuid, uuidReplaces[uuid]);
            }

            // Set cache.

            if (!cache) {
              _context.next = 24;
              break;
            }

            _context.next = 24;
            return cache.set(cacheKey, replacedHtmlResult);

          case 24:
            return _context.abrupt('return', replacedHtmlResult);

          case 25:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function render(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  }

  return render;
}();