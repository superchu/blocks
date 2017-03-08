/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 59);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(21)('wks')
  , uid        = __webpack_require__(25)
  , Symbol     = __webpack_require__(2).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(19)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(4)
  , IE8_DOM_DEFINE = __webpack_require__(38)
  , toPrimitive    = __webpack_require__(54)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(1) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(10);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(3)
  , createDesc = __webpack_require__(12);
module.exports = __webpack_require__(1) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , core      = __webpack_require__(5)
  , ctx       = __webpack_require__(16)
  , hide      = __webpack_require__(7)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(21)('keys')
  , uid    = __webpack_require__(25);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(33);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(10)
  , document = __webpack_require__(2).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(3).f
  , has = __webpack_require__(6)
  , TAG = __webpack_require__(0)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(39)
  , defined = __webpack_require__(8);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(14)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(8);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(30);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(29);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(31), __esModule: true };

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(32), __esModule: true };

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(58);
__webpack_require__(56);
module.exports = __webpack_require__(5).Array.from;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(57);
var $Object = __webpack_require__(5).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(22)
  , toLength  = __webpack_require__(23)
  , toIndex   = __webpack_require__(53);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(15)
  , TAG = __webpack_require__(0)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(3)
  , createDesc      = __webpack_require__(12);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).document && document.documentElement;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(1) && !__webpack_require__(19)(function(){
  return Object.defineProperty(__webpack_require__(17)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(15);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(11)
  , ITERATOR   = __webpack_require__(0)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(4);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(46)
  , descriptor     = __webpack_require__(12)
  , setToStringTag = __webpack_require__(20)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(7)(IteratorPrototype, __webpack_require__(0)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(45)
  , $export        = __webpack_require__(9)
  , redefine       = __webpack_require__(51)
  , hide           = __webpack_require__(7)
  , has            = __webpack_require__(6)
  , Iterators      = __webpack_require__(11)
  , $iterCreate    = __webpack_require__(42)
  , setToStringTag = __webpack_require__(20)
  , getPrototypeOf = __webpack_require__(48)
  , ITERATOR       = __webpack_require__(0)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(0)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(4)
  , dPs         = __webpack_require__(47)
  , enumBugKeys = __webpack_require__(18)
  , IE_PROTO    = __webpack_require__(13)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(17)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(37).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(3)
  , anObject = __webpack_require__(4)
  , getKeys  = __webpack_require__(50);

module.exports = __webpack_require__(1) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(6)
  , toObject    = __webpack_require__(24)
  , IE_PROTO    = __webpack_require__(13)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(6)
  , toIObject    = __webpack_require__(22)
  , arrayIndexOf = __webpack_require__(34)(false)
  , IE_PROTO     = __webpack_require__(13)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(49)
  , enumBugKeys = __webpack_require__(18);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(14)
  , defined   = __webpack_require__(8);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(14)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(10);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(35)
  , ITERATOR  = __webpack_require__(0)('iterator')
  , Iterators = __webpack_require__(11);
module.exports = __webpack_require__(5).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(16)
  , $export        = __webpack_require__(9)
  , toObject       = __webpack_require__(24)
  , call           = __webpack_require__(41)
  , isArrayIter    = __webpack_require__(40)
  , toLength       = __webpack_require__(23)
  , createProperty = __webpack_require__(36)
  , getIterFn      = __webpack_require__(55);

$export($export.S + $export.F * !__webpack_require__(44)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(9);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(1), 'Object', {defineProperty: __webpack_require__(3).f});

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(52)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(43)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = __webpack_require__(28);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = __webpack_require__(26);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(27);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Blocks game by Oscar Wallhult
 *
 */
var GameState;
(function (GameState) {
    GameState[GameState["Playing"] = 0] = "Playing";
    GameState[GameState["Paused"] = 1] = "Paused";
    GameState[GameState["GameOver"] = 2] = "GameOver";
})(GameState || (GameState = {}));
var Key;
(function (Key) {
    Key[Key["Up"] = 38] = "Up";
    Key[Key["Down"] = 40] = "Down";
    Key[Key["Left"] = 37] = "Left";
    Key[Key["Right"] = 39] = "Right";
    Key[Key["Space"] = 32] = "Space";
    Key[Key["P"] = 80] = "P";
})(Key || (Key = {}));
var BLOCKS = [[[0, 1, 0], [0, 1, 0], [1, 1, 0]], [[0, 2, 0], [0, 2, 0], [0, 2, 2]], [[3, 3, 0], [0, 3, 3], [0, 0, 0]], [[0, 4, 4], [4, 4, 0], [0, 0, 0]], [[0, 0, 5, 0], [0, 0, 5, 0], [0, 0, 5, 0], [0, 0, 5, 0]], [[6, 6], [6, 6]], [[0, 7, 0], [7, 7, 7], [0, 0, 0]]];
var COLORS = {
    1: '#fc9f4f',
    2: '#c0a3f5',
    3: '#8a96ad',
    4: '#a8d0fe',
    5: '#90bf5e',
    6: '#ff7586',
    7: '#ffd45c'
};
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
})(Direction || (Direction = {}));
var BLOCK_SIZE = 10;
var ROW_POINTS = [0, 40, 100, 300, 1200];
var LOCK_DELAY = 2;

var Blocks = function () {
    function Blocks(selector, width, height) {
        (0, _classCallCheck3.default)(this, Blocks);

        this.width = width;
        this.height = height;
        this.gameTime = 0;
        this.gameState = GameState.Paused;
        this.rows = [];
        this.container = document.querySelector(selector);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.reset();
        this.bindKeys();
        this.mainloop();
    }

    (0, _createClass3.default)(Blocks, [{
        key: "reset",
        value: function reset() {
            this.lockDelay = 0;
            this._block = null;
            this.level = 0;
            this.score = 0;
            this.xPos = this.width / BLOCK_SIZE / 2;
            this.yPos = 0;
            this.fillRows();
            this.gameState = GameState.Playing;
        }
    }, {
        key: "bindKeys",
        value: function bindKeys() {
            var _this = this;

            document.addEventListener('keydown', function (e) {
                return _this.onKeyDown(e);
            });
        }
    }, {
        key: "onKeyDown",
        value: function onKeyDown(e) {
            var isPlaying = this.gameState === GameState.Playing;
            if (e.keyCode === Key.P) {
                if (isPlaying) {
                    this.gameState = GameState.Paused;
                } else {
                    this.gameState = GameState.Playing;
                }
            }
            if (!isPlaying) {
                if (this.gameState === GameState.GameOver) {
                    this.reset();
                }
                return;
            }
            switch (e.keyCode) {
                case Key.Up:
                    this.rotateBlock(Direction.Right);
                    break;
                case Key.Down:
                    this.move(this.block, Direction.Down);
                    break;
                case Key.Left:
                    this.move(this.block, Direction.Left);
                    break;
                case Key.Right:
                    this.move(this.block, Direction.Right);
                    break;
                case Key.Space:
                    this.dropBlock();
                    break;
            }
        }
    }, {
        key: "move",
        value: function move(block, direction) {
            if (direction === Direction.Down) {
                var newY = this.yPos + 1;
                if (this.isValidPosition(block, this.newX, newY)) {
                    this.yPos = newY;
                    this.score++;
                }
            } else {
                var newX = this.xPos + (direction === Direction.Left ? -1 : 1);
                if (this.isValidPosition(block, newX, this.yPos)) {
                    this.newX = newX;
                }
            }
        }
    }, {
        key: "dropBlock",
        value: function dropBlock() {
            var rows = 0;
            while (this.isValidPosition(this.block, this.xPos, this.yPos + rows + 1)) {
                rows++;
            }
            this.yPos += rows;
            this.score += rows * 2;
        }
    }, {
        key: "isValidPosition",
        value: function isValidPosition(block, xPos, yPos) {
            var _this2 = this;

            var isValid = true;
            block.forEach(function (row, rowY) {
                row.forEach(function (column, rowX) {
                    if (column !== 0) {
                        var x = xPos + rowX;
                        var y = yPos + rowY;
                        if (x < 0) {
                            isValid = false;
                        } else if (x >= _this2.width / BLOCK_SIZE) {
                            isValid = false;
                        } else if (y >= _this2.height / BLOCK_SIZE) {
                            isValid = false;
                        } else if (_this2.rows[yPos + rowY][xPos + rowX]) {
                            isValid = false;
                        }
                    }
                });
            });
            return isValid;
        }
    }, {
        key: "mergeCurrentBlock",
        value: function mergeCurrentBlock() {
            var block = this.block,
                xPos = this.xPos,
                yPos = this.yPos,
                rows = this.rows;

            block.forEach(function (row, rowY) {
                row.forEach(function (column, rowX) {
                    if (column !== 0) {
                        var x = xPos + rowX;
                        var y = yPos + rowY;
                        rows[yPos + rowY][xPos + rowX] = column;
                    }
                });
            });
            this.yPos = 0;
            this._block = null;
            this.lockDelay = 0;
        }
    }, {
        key: "fillRows",
        value: function fillRows() {
            var rows = this.rows,
                width = this.width,
                height = this.height;

            for (var y = 0; y < height / BLOCK_SIZE; y++) {
                rows[y] = [];
                for (var x = 0; x < width / BLOCK_SIZE; x++) {
                    rows[y][x] = 0;
                }
            }
        }
    }, {
        key: "rotateBlock",
        value: function rotateBlock(direction) {
            var _this3 = this;

            var newBlock = [];
            this.block.forEach(function (row, y) {
                row.forEach(function (column, x) {
                    var yy = direction === Direction.Right ? x : _this3.block.length - 1 - x;
                    var xx = direction === Direction.Right ? _this3.block.length - 1 - y : y;
                    newBlock[yy] = newBlock[yy] || [];
                    newBlock[yy][xx] = column;
                });
            });
            if (this.isValidPosition(newBlock, this.newX, this.yPos)) {
                this._block = newBlock;
            }
        }
    }, {
        key: "clearFullRows",
        value: function clearFullRows() {
            var _this4 = this;

            var rowCount = 0;
            var rows = [].concat((0, _toConsumableArray3.default)(this.rows));
            rows.forEach(function (row, index) {
                if (!row.some(function (column) {
                    return column === 0;
                })) {
                    _this4.rows.splice(index, 1);
                    _this4.rows.unshift(row.map(function (column) {
                        return 0;
                    }));
                    rowCount++;
                }
            });
            this.score += (Math.floor(this.level) + 1) * ROW_POINTS[rowCount];
            this.level += rowCount / 10;
        }
    }, {
        key: "mainloop",
        value: function mainloop() {
            var _this5 = this;

            if (this.gameState === GameState.Playing) {
                this.gameTime++;
                this.update(this.gameTime);
            }
            this.render(this.gameTime, this.ctx);
            window.requestAnimationFrame(function () {
                return _this5.mainloop();
            });
        }
    }, {
        key: "update",
        value: function update(gameTime) {
            this.xPos = this.newX;
            var speed = Math.max(1, 10 - Math.floor(this.level));
            if (gameTime % speed === 0) {
                var newY = this.yPos + 1;
                if (this.isValidPosition(this.block, this.xPos, newY)) {
                    this.yPos = newY;
                } else if (this.yPos === 0) {
                    this.gameState = GameState.GameOver;
                } else {
                    if (this.lockDelay >= LOCK_DELAY) {
                        this.mergeCurrentBlock();
                    }
                    this.lockDelay++;
                }
                this.clearFullRows();
            }
        }
    }, {
        key: "renderBlock",
        value: function renderBlock(x, y, color, ctx) {
            if (color !== 0) {
                ctx.fillStyle = COLORS[color];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }, {
        key: "renderCurrentBlock",
        value: function renderCurrentBlock(ctx) {
            var _this6 = this;

            ctx.save();
            ctx.translate(this.xPos * BLOCK_SIZE, this.yPos * BLOCK_SIZE);
            // Render currentBlock
            this.block.forEach(function (row, y) {
                row.forEach(function (column, x) {
                    return _this6.renderBlock(x, y, column, ctx);
                });
            });
            ctx.restore();
        }
    }, {
        key: "renderGameOver",
        value: function renderGameOver(ctx) {
            ctx.fillStyle = 'rgba(255, 255, 255, .8';
            ctx.fillRect(0, this.height / 2 - 30, this.width, 45);
            ctx.font = '20px sans-serif';
            ctx.fillStyle = '#505e79';
            ctx.fillText('Game Over!', 76, 200);
        }
    }, {
        key: "render",
        value: function render(gameTime, ctx) {
            var _this7 = this;

            ctx.fillStyle = '#d2f0ea';
            ctx.fillRect(0, 0, this.width, this.height);
            // Render rows
            this.rows.forEach(function (row, y) {
                row.forEach(function (column, x) {
                    return _this7.renderBlock(x, y, column, ctx);
                });
            });
            if (this.block) {
                this.renderCurrentBlock(ctx);
            }
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#505e79';
            ctx.fillText("" + this.score, 10, 20);
            if (this.gameState === GameState.GameOver) {
                this.renderGameOver(ctx);
            }
        }
    }, {
        key: "block",
        get: function get() {
            if (!this._block) {
                this.yPos = 0;
                this._block = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
                this.xPos = Math.floor((this.width / BLOCK_SIZE - this._block[0].length) / 2);
                this.newX = this.xPos;
            }
            return this._block;
        }
    }]);
    return Blocks;
}();

exports.default = Blocks;

window.onload = function () {
    new Blocks('#gameContainer', 260, 400);
};

/***/ })
/******/ ]);
//# sourceMappingURL=blocks.js.map