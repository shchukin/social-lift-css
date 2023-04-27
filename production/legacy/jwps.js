var jWps           = function (selector, context) {
	    return new jWps.fn.init(selector, context);
    },

    document       = window.document,

    userAgent      = navigator.userAgent,

    toString       = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty;

jWps.fn = jWps.prototype = {
	init: function (selector, context) {

		if (selector == undefined) {
			return;
		}
		// Если selector DOMElement
		if (selector.nodeType || selector === window) {
			this[0] = selector;
			this.length = 1;
			return this;
		}

		// Если требуется вернуть элемент body
		if (selector === "body" && !context) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		if (typeof selector === 'string') {
			selector = jWps.find(selector, context);
		}
		selector = jWps.merge(this, selector);
		return selector;
	},

	selector: "",

	jWps: "0.0.1",

	length: 0,

	find: function (selector) {
		var i = 0, oldthis = [], length = this.length;
		jWps.merge(oldthis, this);

		for (var n = 0; n < length; n++) {
			delete this[n];
		}
		this.length = 0;
		for (; i < length; i++) {
			selector = jWps.find(selector, oldthis[i]);
			jWps.merge(this, selector);
		}

		return this;
	}
}

jWps.fn.init.prototype = jWps.fn;

jWps.extend = jWps.fn.extend = function () {
	// copy ссылка на текущий объект
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	if (typeof target !== "object" && !jWps.isFunction(target)) {
		target = {};
	}

	if (length === i) {
		target = this;
		--i;
	}

	for (; i < length; i++) {
		// Только не null объекты
		if ((options = arguments[i]) != null) {
			// Расширяем базовый объект
			for (var name in options) {
				src = target[name];
				copy = options[name];
				// Предотвращаем бесконечный цикл
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging object literal values or arrays
				if (deep && copy && (jWps.isPlainObject(copy) || jWps.isArray(copy))) {
					var clone = src && (jWps.isPlainObject(src) || jWps.isArray(src)) ? src
						: jWps.isArray(copy) ? [] : {};

					// Never move original objects, clone them
					target[name] = jWps.extend(deep, clone, copy);

					// Не копировать объект, если он undefined
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}
	// Возврат модифицированного объекта
	return target;
};

// Расширение: Кэширование
function now() { return (new Date).getTime(); }

var expando = "jWps" + now(), uuid = 0, windowData = {};

// Расширение: Различные функции
jWps.extend({

	readyList: [],

	trim: function (text) {
		return (text || "").replace(/^\s+|\s+$/g, "");
	},
});

window.jWps = jWps;

function setCookie(name, value) {
	var valueEscaped = escape(value);
	var expiresDate = new Date();
	expiresDate.setTime(expiresDate.getTime() + 365 * 24 * 60 * 60 * 1000); // срок - 1 год
	var expires = expiresDate.toGMTString();
	var newCookie = name + "=" + valueEscaped + "; path=/; expires=" + expires;
	if (valueEscaped.length <= 4000) {
		document.cookie = newCookie + ";";
	}
}

function getGMT() {
	var d = new Date();
	return (((d.getTimezoneOffset() / 60) + 1) / -1);
}

function tpl_compare(template, params) {
	for (var key in params) {
		var value = params[key];
		template = template.replaceAll('[#' + key + ']', value);
	}
	while (match = (/{\s*(\d)\s*:\s*sex\s*\|([^\]]+)}/g).exec(template)) {
		var sex_text = match[2].split(";");
		template = template.split(match[0]).join((match[1] == '2') ? jWps.trim(sex_text[1]) : jWps.trim(sex_text[0]));
	}
	while (match = (/{\s*(\d)\s*:\s*count\s*\|([^\]]+)}/g).exec(template)) {
		var dec = match[2].split(";");
		var count = parseInt(match[1]);

		if (jWps.isRu(jWps.trim(dec[0]))) {
			if (dec[2] == '') {
				dec[2] = dec[1];
			}
			var plural = (count % 10 == 1 && count % 100 != 11) ? 0 : ((count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) ? 1 : 2);
		} else {
			var plural = (count == 1) ? 0 : 1;
		}
		template = template.split(match[0]).join(jWps.trim(dec[plural]));
	}
	return template;
}

setCookie('gmt', getGMT());

/**
 * End Ajax class
 *********************/



function wps_form_message(message, timeout) {

	iziToast.show({
		message: message,
		color: 'green',
		position: 'topRight'
	});
}

function getSiblingIds(elem) {
	var after, before;

	after = before = elem;

	while ((after = after.previousSibling) && after.nodeType !== 1) {
	}
	while ((before = before.nextSibling) && before.nodeType !== 1) {
	}

	return {
		after: after ? after.id.match(/(\d+)/)[1] : 0,
		before: before ? before.id.match(/(\d+)/)[1] : 0
	};
}

function explode(delimiter, string) {

	var emptyArray = {0: ''};

	if (arguments.length != 2
		|| typeof arguments[0] == 'undefined'
		|| typeof arguments[1] == 'undefined') {
		return null;
	}

	if (delimiter === ''
		|| delimiter === false
		|| delimiter === null) {
		return false;
	}

	if (typeof delimiter == 'function'
		|| typeof delimiter == 'object'
		|| typeof string == 'function'
		|| typeof string == 'object') {
		return emptyArray;
	}

	if (delimiter === true) {
		delimiter = '1';
	}

	return string.toString().split(delimiter.toString());
}

String.prototype.replaceAll = function (search, replace) {
	return this.split(search).join(replace);
}

function langConstruct(code, params) {
	if (params) {
		for (var key in params) {
			var value = params[key];
			code = code.replaceAll('[#' + key + ']', value);
			code = code.replaceAll('{#' + key + '}', value);
		}
		while (match = (/{\s*(\d+)\s*:\s*sex\s*\|([^\]\}]+)}/g).exec(code)) {
			var sex_text = match[2].split(";");
			code = code.split(match[0]).join((match[1] == '2') ? jWps.trim(sex_text[1]) : jWps.trim(sex_text[0]));
		}
		while (match = (/{\s*(\d+)\s*:\s*count\s*\|([^\]\}]+)}/g).exec(code)) {
			var dec = match[2].split(";");
			var count = parseInt(match[1]);

			if (UserData.language == 'ru') {
				if (dec[2] == '') {
					dec[2] = dec[1];
				}
				var plural = (count % 10 == 1 && count % 100 != 11) ? 0 : ((count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) ? 1 : 2);
			} else {
				var plural = (count == 1) ? 0 : 1;
			}
			code = code.split(match[0]).join(jWps.trim(dec[plural]));
		}
	}
	return code;
}

if (typeof window.Lang === 'undefined') {

	window.Lang = async function () {
		let response = await fetch('/languages/jslang_' + UserData.language + '.js');
		return await response.json();
	}
}

function getLang(code, params) {

	window.translation = undefined;
	if (Lang[code]) {
		return langConstruct(Lang[code], params);
	} else {
		var arr = explode(':', code);
		if (typeof Lang[arr[0]] != 'undefined') {
			return langConstruct(Lang[arr[0]], params);
		} else if (typeof arr[1] != 'undefined') {

			if (typeof UserData != 'undefined' && UserData.language != 'ru' && UserData.language != '' && 0/*  && /mlmprm/.test(window.location.host */) { // TODO: додумать как делать налету перевод фраз..
				window.google_callback = function (response) {
					try {
						code = response.data.translations[0].translatedText;
						window.translation_ok = langConstruct(code, params);
					} catch (e) {
						window.translation_ok = langConstruct(arr[1], params);
					}
					console.log(window.translation_ok);
				}
				window.google_script = document.createElement("script");
				window.google_script.src = "https://www.googleapis.com/language/translate/v2?key=AIzaSyD8yDkTPlHMjpmSDRkHL4A4Wk04WMx7Uiw&callback=google_callback&source=ru&target=" + UserData.language + "&callback=translateText&q=" + encodeURIComponent(
					htmlspecialchars_decode(arr[1]));
				document.getElementsByTagName("head")[0].appendChild(window.google_script);

			} else {
				delete arr[0];
				return langConstruct(arr.join(':').substr(1), params);
			}
		}
	}

	var i = 0;

	return window.translation;
}

function $GL(code, params) {
	return getLang(code, params);
}

window.$GL = $GL;

Function.prototype.bind = function () {
	var func = this, args = Array.prototype.slice.call(arguments);
	var obj = args.shift();
	return function () {
		var curArgs = Array.prototype.slice.call(arguments);
		return func.apply(obj, args.concat(curArgs));
	}
}
Function.prototype.extBind = function () {
	var func = this, args = arguments;
	return function () {
		var argsArray = [];
		each(args, function (i, obj) { argsArray[i] = obj; });
		var obj = argsArray.shift(), currArgs = [];
		each(arguments, function (i, obj) { currArgs[i] = obj; });
		return func.apply(obj, currArgs.concat(argsArray));
	}
}

function LOG(text) {
	window.console.log(text);
}

function iosCopyToClipboard(string) {

	var range = document.createRange();
	range.selectNode(string);
	window.getSelection().addRange(range);

	try {
		// Now that we've selected the anchor text, execute the copy command
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Copy email command was ' + msg);
	} catch (err) {
		console.log('Oops, unable to copy');
	}

	// Remove the selections - NOTE: Should use
	// removeRange(range) when it is supported
	window.getSelection().removeAllRanges();

	return;

	var oldContentEditable = el.contentEditable,
	    oldReadOnly        = el.readOnly,
	    range              = document.createRange();

	el.contentEditable = true;
	el.readOnly = false;
	range.selectNodeContents(el);

	var s = window.getSelection();
	s.removeAllRanges();
	s.addRange(range);

	el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

	el.contentEditable = oldContentEditable;
	el.readOnly = oldReadOnly;

	document.execCommand('copy');
}

