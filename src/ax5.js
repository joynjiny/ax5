/*!
 * AX5 JavaScript UI Library v0.0.1
 * www.axisj.com
 *
 * Copyright 2013, 2015 AXISJ.com and other contributors
 * Released under the MIT license
 * www.axisj.com/ax5/license
 */

/*
argument
 - O : Object 전달받은 오브젝트 인자
 - _fn : 사용자정의 함수 인자
 - msg : 메세지
 */

// 필수 Ployfill
(function(){

	var root = this;

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
		Object.keys = (function() {
			'use strict';
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function(obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
					throw new TypeError('Object.keys called on non-object');
				}

				var result = [], prop, i;

				for (prop in obj) {
					if (hasOwnProperty.call(obj, prop)) {
						result.push(prop);
					}
				}

				if (hasDontEnumBug) {
					for (i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}());
	}

	// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
	// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function (fun /*, thisp */) {
			if (this === void 0 || this === null) { throw TypeError(); }

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function") { throw TypeError(); }

			var thisp = arguments[1], i;
			for (i = 0; i < len; i++) {
				if (i in t) {
					fun.call(thisp, t[i], i, t);
				}
			}
		};
	}

	// Document.querySelectorAll method
	// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
	// Needed for: IE7-
	if (!document.querySelectorAll) {
		document.querySelectorAll = function(selectors) {
			var style = document.createElement('style'), elements = [], element;
			document.documentElement.firstChild.appendChild(style);
			document._qsa = [];

			style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
			window.scrollBy(0, 0);
			style.parentNode.removeChild(style);

			while (document._qsa.length) {
				element = document._qsa.shift();
				element.style.removeAttribute('x-qsa');
				elements.push(element);
			}
			document._qsa = null;
			return elements;
		};
	}

	// Document.querySelector method
	// Needed for: IE7-
	if (!document.querySelector) {
		document.querySelector = function(selectors) {
			var elements = document.querySelectorAll(selectors);
			return (elements.length) ? elements[0] : null;
		};
	}

	// Document.getElementsByClassName method
	// Needed for: IE8-
	if (!document.getElementsByClassName) {
		document.getElementsByClassName = function(classNames) {
			classNames = String(classNames).replace(/^|\s+/g, '.');
			return document.querySelectorAll(classNames);
		};
	}

	// Console-polyfill. MIT license. https://github.com/paulmillr/console-polyfill
	// Make it safe to do console.log() always.
	(function(con) {
		'use strict';
		var prop, method;
		var empty = {};
		var dummy = function() {};
		var properties = 'memory'.split(',');
		var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
			'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
			'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
		while (prop = properties.pop()) con[prop] = con[prop] || empty;
		while (method = methods.pop()) con[method] = con[method] || dummy;
	})(root.console = root.console || {}); // Using `this` for web workers.

}.call(this));

(function() {
	'use strict';

	// root of function
	var root = this;

	/** @namespace {Object} ax5 */
	var ax5 = {};

	/**
	 * 상수모음
	 * @namespace ax5.const
	 */
	var CV = ax5.const = {
/**
 * event keyCodes
 * @member {Object} ax5.const.event_keys
 * @example
 ```
 {
	KEY_BACKSPACE: 8,
	KEY_TAB: 9,
	KEY_RETURN: 13, KEY_ESC: 27, KEY_LEFT: 37, KEY_UP: 38, KEY_RIGHT: 39, KEY_DOWN: 40, KEY_DELETE: 46,
	KEY_HOME: 36, KEY_END: 35, KEY_PAGEUP: 33, KEY_PAGEDOWN: 34, KEY_INSERT: 45, KEY_SPACE: 32
 }
 ```
 */
		event_keys: {
			KEY_BACKSPACE: 8,
			KEY_TAB: 9,
			KEY_RETURN: 13, KEY_ESC: 27, KEY_LEFT: 37, KEY_UP: 38, KEY_RIGHT: 39, KEY_DOWN: 40, KEY_DELETE: 46,
			KEY_HOME: 36, KEY_END: 35, KEY_PAGEUP: 33, KEY_PAGEDOWN: 34, KEY_INSERT: 45, KEY_SPACE: 32
		},
/**
 * 사용자 브라우저 식별용 오브젝트
 * @member {Object} ax5.const.browser
 * @example
 ```
 console.log( ax5.const.browser );
 //Object {name: "chrome", version: "39.0.2171.71", mobile: false}
 ```
 */
		browser  : (function () {
			var ua = navigator.userAgent.toLowerCase();
			var mobile = (ua.search(/mobile/g) != -1);
			if (ua.search(/iphone/g) != -1) {
				return { name: "iphone", version: 0, mobile: true }
			} else if (ua.search(/ipad/g) != -1) {
				return { name: "ipad", version: 0, mobile: true }
			} else if (ua.search(/android/g) != -1) {
				var match = /(android)[ \/]([\w.]+)/.exec(ua) || [];
				var browserVersion = (match[2] || "0");
				return { name: "android", version: browserVersion, mobile: mobile }
			} else {
				var browserName = "";
				var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
					/(webkit)[ \/]([\w.]+)/.exec(ua) ||
					/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
					/(msie) ([\w.]+)/.exec(ua) ||
					ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
					[];

				var browser = (match[1] || "");
				var browserVersion = (match[2] || "0");

				if (browser == "msie") browser = "ie";
				return {
					name: browser,
					version: browserVersion,
					mobile: mobile
				}
			}
		})(),
/**
 * 브라우저에 따른 마우스 휠 이벤트이름
 * @member {Object} ax5.const.mousewheelevt
 */
		mousewheelevt: ((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel")
	};

/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.util
 */
	ax5.util = (function(){
		var _toString = Object.prototype.toString;
/**
 * Object나 Array의 아이템으로 사용자 함수를 호출합니다.
 * @method ax5.util.each
 * @param {Object|Array} O
 * @param {Function} _fn
 * @example
```js
 var axf = ax5.util;
 axf.each([0,1,2], function(){
	// with this
 });
 axf.each({a:1, b:2}, function(){
	// with this
 });
```
 */
		function each(O, _fn){
			if(O){
				var name, i = 0, length = O.length,
					isObj = length === undefined || typeof O === "function";
				if ( isObj ) {
					for ( name in O ) {
						if( typeof O[ name ] != "undefined" ) {
							if (_fn.call(O[ name ], name, O[ name ]) === false) {
								break;
							}
						}
					}
				} else {
					for ( ; i < length; ) {
						if( typeof O[ i ] != "undefined" ) {
							if (_fn.call(O[ i ], i, O[ i++ ]) === false) {
								break;
							}
						}
					}
				}
			}
			return O;
		}

		// In addition to using the http://underscorejs.org : map, reduce, reduce_right, find
		// todo : map, reduce 등등 구현
		function map(O, _fn){

		}
		function reduce(){

		}
		function reduce_right(){

		}
		function find(){

		}
/**
 * 에러를 발생시킵니다.
 * @method ax5.util.error
 * @param {String} msg
 * @example
 ```js
 ax5.util.error( "에러가 발생되었습니다." );
 ```
 */
		function error( msg ){
			throw new Error( msg );
		}
/**
 * Object를 JSONString 으로 반환합니다.
 * @method ax5.util.to_json
 * @param {Object|Array} O
 * @returns {String} JSON
 * @example
```js
 var ax = ax5.util;
 var myObject = {a:1, b:"2", c:{axj:"what", arrs:[0,2,"3"]},
        fn: function(abcdd){
            return abcdd;
        }
    };
 console.log( ax.to_json(myObject) );
```
 */
		function to_json(O){
			var json_string = "";
			if(ax5.util.is_array(O)){
				O.forEach(function(item, index){
					if(index == 0) json_string += "[";
					else json_string += ",";
					json_string += to_json(item);
				});
				json_string += "]";
			}
			else
			if(ax5.util.is_object(O)){
				json_string += "{";
				var json_object_body = [];
				each(O, function(key, value) {
					json_object_body.push( '"' + key + '": ' + to_json(value) );
				});
				json_string += json_object_body.join(", ");
				json_string += "}";
			}
			else
			if(ax5.util.is_string(O)){
				json_string = '"' + O + '"';
			}
			else
			if(ax5.util.is_number(O)){
				json_string = O;
			}
			else
			if(ax5.util.is_undefined(O)){
				json_string = "undefined";
			}
			else
			if(ax5.util.is_function(O)){
				json_string = '"{Function}"';
			}
			return json_string;
		}

/**
 * 타겟 오브젝트의 키를 대상 오브젝트의 키만큼 확장합니다.
 * @method ax5.util.extend
 * @param {Object} O - 타겟 오브젝트
 * @param {Object} _O - 대상 오브젝트
 * @param {Boolean} overwrite - 덮어쓰기 여부
 * @returns {Object} extened Object
 * @example
 ```js
 var axf = ax5.util;
 var obja = {a:1};
 axf.extend(obja, {b:2});
 axf.extend(obja, {a:2});
 axf.extend(obja, {a:2}, true);
 ```
 */
		function extend(O, _O, overwrite) {
			if ( typeof O !== "object" && typeof O !== "function" ) O = {};
			if(typeof _O === "string") O = _O;
			else {
				if(overwrite === true) {
					for(var k in _O) O[k] = _O[k];
				}
				else
				{
					for(var k in _O) if(typeof O[k] === "undefined") O[k] = _O[k];
				}
			}
			return O;
		}
/**
 * 타겟 오브젝트를 복제하여 참조를 다르게 합니다.
 * @method ax5.util.clone
 * @param {Object} O - 타겟 오브젝트
 * @returns {Object} clone Object
 * @example
 ```js
 var axf = ax5.util;
 var obja = {a:1};
 var objb = axf.clone( obja );
 obja.a = 3; // 원본 오브젝트 수정
 console.log(obja, objb);
 // Object {a: 3} Object {a: 2}
 ```
 */
		function clone(O){
			return extend({}, O);
		}
/**
 * 인자의 타입을 반환합니다.
 * @method ax5.util.get_type
 * @param {Object|Array|String|Number|Element|Etc} O
 * @returns {String} element|object|array|function|string|number|undefined
 * @example
 ```js

 ```
 */
		function get_type(O){
			var typeName;
			if( !!(O && O.nodeType == 1) ){
				typeName = "element";
			}
			else
			if(_toString.call(O) == "[object Object]") {
				typeName = "object";
			}
			else
			if(_toString.call(O) == "[object Array]") {
				typeName = "array";
			}
			else
			if(_toString.call(O) == "[object String]") {
				typeName = "string";
			}
			else
			if(_toString.call(O) == "[object Number]") {
				typeName = "number";
			}
			else
			if(typeof O === "function") {
				typeName = "function";
			}
			else
			if(typeof O === "undefined") {
				typeName = "undefined";
			}
			return typeName;
		}
		/**
		 * 오브젝트가 HTML 엘리먼트여부인지 판단합니다.
		 * @method ax5.util.is_element
		 * @param {Object} O
		 * @returns {Boolean}
		 */
		function is_element(O) { return !!(O && O.nodeType == 1); }
		/**
		 * 오브젝트가 Object인지 판단합니다.
		 * @method ax5.util.is_object
		 * @param {Object} O
		 * @returns {Boolean}
		 */
		function is_object(O) { return _toString.call(O) == "[object Object]"; }
		/**
		 * 오브젝트가 Array인지 판단합니다.
		 * @method ax5.util.is_array
		 * @param {Object} O
		 * @returns {Boolean}
		 */
		function is_array(O) { return _toString.call(O) == "[object Array]"; }
		/**
		 * 오브젝트가 Function인지 판단합니다.
		 * @method ax5.util.is_function
		 * @param {Object} O
		 * @returns {Boolean}
		 */
		function is_function(O) { return typeof O === "function"; }
		/**
		 * 오브젝트가 String인지 판단합니다.
		 * @method ax5.util.is_string
		 * @param {Object} O
		 * @returns {Boolean}
		 */
		function is_string(O) { return _toString.call(O) == "[object String]"; }
		/**
		 * 오브젝트가 Number인지 판단합니다.
		 * @method ax5.util.is_number
		 * @param {Object} O
		 * @returns {Boolean}
		 */
		function is_number(O) { return _toString.call(O) == "[object Number]"; }
		/**
		 * 오브젝트가 undefined인지 판단합니다.
		 * @method ax5.util.is_undefined
		 * @param {Object} O
		 * @returns {Boolean}
		 */
		function is_undefined(O) { return typeof O === "undefined"; }
		/**
		 * 오브젝트가 undefined이거나 null이거나 빈값인지 판단합니다.
		 * @method ax5.util.is_nothing
		 * @param {Object} O
		 * @returns {Boolean}
		 */
		function is_nothing(O) { return (typeof O === "undefined" || O === null || O === ""); }
/**
 * 오브젝트의 첫번째 아이템을 반환합니다.
 * @method ax5.util.first
 * @param {Object|Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.first({a:1, b:2});
 // Object {a: 1}
 ```
 */
		function first(O){
			if( is_object(O) ) {
				var keys = Object.keys(O);
				var item = {}; item[keys[0]] = O[keys[0]];
				return item;
			}
			else
			if( is_array(O) ) {
				return O[0];
			}
			else
			{
				console.error("ax5.util.object.first", "argument type error");
				return undefined;
			}
		}
/**
 * 오브젝트의 마지막 아이템을 반환합니다.
 * @method ax5.util.last
 * @param {Object|Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.last({a:1, b:2});
 // Object {b: 2}
 ```
 */
		function last(O){
			if( is_object(O) ) {
				var keys = Object.keys(O);
				var item = {}; item[keys[keys.length-1]] = O[keys[keys.length-1]];
				return item;
			}
			else
			if( is_array(O) ) {
				return O[O.length-1];
			}
			else
			{
				console.error("ax5.util.object.last", "argument type error");
				return undefined;
			}
		}

/**
 * 쿠키를 설정합니다.
 * @method ax5.util.set_cookie
 * @param {String} cname - 쿠키이름
 * @param {String} cvalue - 쿠키값
 * @param {Number} [exdays] - 쿠키 유지일수
 * @example
```js
 ax5.util.set_cookie("jslib", "AX5");
 ax5.util.set_cookie("jslib", "AX5", 3);
```
 */
		function set_cookie(cname, cvalue, exdays){
			document.cookie = cname + "=" + escape(cvalue) + "; path=/;" + (function(){
				if(typeof exdays != "undefined"){
					var d = new Date();
					d.setTime(d.getTime() + (exdays*24*60*60*1000));
					return "expires=" + d.toUTCString();
				}else{
					return "";
				}
			})();
		}
/**
 * 쿠키를 가져옵니다.
 * @method ax5.util.get_cookie
 * @param {String} cname
 * @returns {String} cookie value
 * @example
```js
 ax5.util.get_cookie("jslib");
```
 */
		function get_cookie(cname){
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) != -1) return unescape(c.substring(name.length, c.length));
			}
			return "";
		}

/**
 * jsonString 으로 alert 합니다.
 * @method ax5.util.alert
 * @param {Object|Array|String|Number} O
 * @returns {Object|Array|String|Number} O
 * @example
```js
 ax5.util.alert({a:1,b:2});
 ax5.util.alert("정말?");
```
 */
		function alert(O){
			window.alert( to_json(O) );
			return O;
		}

		function url_info() {
			var url, url_param, param, referUrl, pathName, AXparam, pageProtocol, pageHostName;
			url_param = window.location.href;
			param = window.location.search;
			referUrl = document.referrer;
			pathName = window.location.pathname;
			url = url_param.replace(param, '');
			param = param.replace(/^\?/, '');
			pageProtocol = window.location.protocol;
			pageHostName = window.location.hostname;
			AXparam = url_param.replace(pageProtocol + "//", "");
			AXparam = (param) ? AXparam.replace(pageHostName + pathName + "?" + param, "") : AXparam.replace(pageHostName + pathName, "");
			return {
				url : url,
				param : param,
				anchorData : AXparam,
				urlParam : url_param,
				referUrl : referUrl,
				pathName : pathName,
				protocol : pageProtocol,
				hostName : pageHostName
			};
		}

		return {
			each        : each,
			map         : map,
			reduce      : reduce,
			reduce_right: reduce_right,
			find        : find,
			error       : error,
			to_json     : to_json,
			extend      : extend,
			clone       : clone,
			get_type    : get_type,
			is_element  : is_element,
			is_object   : is_object,
			is_array    : is_array,
			is_function : is_function,
			is_string   : is_string,
			is_number   : is_number,
			is_undefined: is_undefined,
			is_nothing  : is_nothing,
			first       : first,
			last        : last,
			set_cookie  : set_cookie,
			get_cookie  : get_cookie,
			alert       : alert, 
			url_info    : url_info
		}
	})();

/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.dom
 */
	// todo : querySelectAll 을 활용한 dom 구현
	ax5.dom = (function(){
		return function(select){
			console.log(select);
		}
	})();

	if ( typeof module === "object" && module && typeof module.exports === "object" ){
		module.exports = ax5; // commonJS
	}else{
		root.ax5 = ax5;
		if ( typeof define === "function" && define.amd ) define("_ax5", [], function () { return ax5; }); // requireJS
	}

}.call(this));
