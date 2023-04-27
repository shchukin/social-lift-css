if (!Object.entries) {
	Object.entries = function (obj) {
		var ownProps = Object.keys(obj),
		    i        = ownProps.length,
		    resArray = new Array(i); // preallocate the Array
		while (i--) {
			resArray[i] = [ownProps[i], obj[ownProps[i]]];
		}

		return resArray;
	};
}

function onTelegramAuth(user, token) {
	AjaxRequest('POST', '/api/user/connected-telegram/' + token, user, function (data) {
		if (data.result === 'success') {
			$('#connect-telegram').slideUp(500);
			show_message('green', $GL('account_conneted_telegram:Вы успешно подключили телеграм к аккаунту.'), $GL('success:Успешно'));
			$('#js-telegram-connect-wrap').slideUp(300);
		}
	})
}

function initVideoPlayer() {
	const players = $('.js-plyr');
	if (players.length) {
		const players = Plyr.setup('.js-plyr');
	}
}

function show_message(color, text, title) {
	if (typeof title == 'undefined') {
		title = '';
	}
	var toast = document.querySelector('.iziToast');
	if (toast) {
		iziToast.hide({}, toast);
	}
	iziToast.show({
		message: text,
		color: color,
		displayMode: 'replace',
		position: 'topRight',
		title: title
	});
}

function GetHelp(mdl, auto) {

	var id = mdl;

	if (typeof help_config != 'undefined') {
		id = help_config[mdl];
	}

	if (id != undefined) {
		GoAjax({module: 'pages', id: id, act: 'getPage', autoPage: auto == true ? 1 : 0}, function (data) {
			$('body').removeClass('load');
			MY_OVERLAY.active(data.response);
		});
	}
}

$.fn.outerHTML = function (s) {
	return s
		? this.before(s).remove()
		: $("<p>").append(this.eq(0).clone()).html();
};

$(document).ready(function () {

	initVideoPlayer();

	var d = new Date(), year = d.getFullYear(), month_num = d.getMonth() + 1, day = d.getDate(), hours = d.getHours(), minutes = d.getMinutes(),
	    seconds                                                                                                                = d.getSeconds();

	// запрет к пунктам меню
	$('.page_is_closed').attr('href', '#').on('click', function (e) {
		e.preventDefault();
		var text = $GL(
			'close_page_closed_for:Эта страница доступна только пользователям с уровнем доступа "[#access]"', {access: $(this).data('access-title')});
		if (typeof MENU_ACCESS_DENY !== 'undefined') {
			if (typeof MENU_ACCESS_DENY[$(this).data('access')] !== 'undefined') {
				text = MENU_ACCESS_DENY[$(this).data('access')];
			} else if (typeof MENU_ACCESS_DENY[$(this).data('hash')] !== 'undefined') {
				text = MENU_ACCESS_DENY[$(this).data('hash')];
			}
		}
		console.log(text);
		debugger;
		swal({
			title: (UserData.id == 0 ? $GL('access_denied:Доступ не авторизованным пользователям к разделу запрещен') : $GL(
				'access_topage_denied:Доступ к странице запрещен')),
			type: 'error',
			text: text
		}, function () {
		});
	});
});

function AjaxRequest(method, url, objData = {}, fnCallback, errorFn, noLoader) {
	try {
		var response = jQuery.ajax({
			noLoader: noLoader,
			url: url,
			type: method,
			dataType: 'json',
			data: objData,
			success: function (data) {
				if (!(typeof data.error_message !== 'undefined' && data.error_message !== '')) {
					if (typeof fnCallback !== 'undefined') {
						fnCallback(data);
					}
					return;
				}

				var params = {
					title: $GL('error'),
					text: (data.error !== 0 ? "#" + data.error + "  " : '') + data.error_message,
					type: typeof data.error_type !== 'undefined' ? data.error_type : 'error'
				};
				if (typeof data.swal !== 'undefined') {
					var swalData = data.swal;
					if (swalData.title) {
						params.title = swalData.title;
					}
					if (swalData.showCancelButton) {
						params.showCancelButton = swalData.showCancelButton;
					}
					if (swalData.confirmButtonColor) {
						params.confirmButtonColor = swalData.confirmButtonColor;
					}
					if (swalData.confirmButtonText) {
						params.confirmButtonText = swalData.confirmButtonText;
					}
					if (swalData.cancelButtonText) {
						params.cancelButtonText = swalData.cancelButtonText;
					}
				}

				swal(params, function (res) {
					if (res && typeof swalData !== 'undefined') {
						eval(swalData.callback);
					}
				});
				if (typeof errorFn !== 'undefined') {
					errorFn();
				}
			},
			error: function (e) {
				if (typeof errorFn !== 'undefined') {
					errorFn(e);
				}
			},
			xhrFields: {
				withCredentials: true
			}
		});

		return response.responseJSON;
	} catch (e) {
		errorFn(e);
	}
}

function GoAjax(data, fnCallback, async, errorFn, noLoader) {
	AjaxRequest('POST', '/ajax.php', data, fnCallback, errorFn, noLoader);
}

function AjaxReload() {
	AjaxPage(window.location.href);
}

function AjaxPage(href) {
	url = (/\?/i.test(href) ? href + '&' : href + '?') + 'is_ajax=1';
	AjaxRequest('GET', url, {}, function (data) {
		window.history.replaceState({mainContent: $('.kmfdm-page__body .kmfdm-page__main').html()}, '');
		let html = data.html;
		let $old = $('.kmfdm-page__body .kmfdm-page__main');
		try {
			$('.is-countdown').countdown('destroy');
		} catch (e) {
		}
		$old.after(html);
		$old.remove();

		if ($('body').colorTip) {
			$('.tip[title]').colorTip({color: 'black'});
		}

		ZeroClipboardCreate('.kmfdm-page__body .kmfdm-page__main .clipboard-btn,.kmfdm-page__body .kmfdm-page__main .js-copy');
		try {
			if (typeof activateCountDown !== 'undefined') {
				activateCountDown('.countdown:not(.countdown-uniq)');
			}
		} catch (e) {
			console.error(e);
		}
		var top = $('.kmfdm-page__body .kmfdm-page__main').offset().top;
		if ($(window).scrollTop() > top) {
			$(window).scrollTop();
		}
		window.history.pushState({mainContent: $('.kmfdm-page__body .kmfdm-page__main').html()}, "", href);
	});
}

function AsOverlayRequest(url, data, href) {
	AjaxRequest('GET', url, data || {}, function (data) {
		let html = data.html;
		let oldHref = window.location.href;
		if (window.history.state == null) {
			//	window.history.pushState({}, "", oldHref);
		}
		MY_OVERLAY.active(html, function () {
			$('.overlay-layer:hidden').remove();
			$('.overlay .custom-css-menu-link').each((i, el) => {
				if (/is_overlay=1/g.test($(el).attr('href'))) {
					$(el).attr('as-overlay', 1);
				}
			});
		}, function () {
			if (href && window.location.href == href) {
				//	window.history.back();
			}
		});
		// window.history.pushState({overlayContent: html}, "", href);
	});
}

function GetTpl(type, name, mdl) {
	var html = GoAjax({act: 'getTpl', module: 'main', type: type, name: name, mdl: mdl}, function (data) {

	}, false);
	return html.responseTpl;
}

function setLanguage(ln) {
	history.pushState('', document.title, window.location.pathname + window.location.search);
	$.cookie('_ChangeLanguage', ln, {expire: 365, domain: "." + window.location.host, path: '/'});
	$('body').addClass('load');
	window.location.href = window.location.href;
}

function set2FACode(form_id, code) {
	var $form = $('#' + form_id);
	$form.append("<input type='hidden' id='fa2_" + form_id + "' name='code_2fa' value='" + code + "'>");
	$form.submit();
	$('#fa2_' + form_id).remove();
}

function swalPromptDelay(params, callback, successCallback, cancelCallback) {

	SweetAlert.fire({
		title: params.title,
		html: params.text,
		input: 'text',
		inputAttributes: {
			autocapitalize: 'off'
		},
		showCancelButton: true,
		confirmButtonText: 'OK',
		showLoaderOnConfirm: true,
		allowOutsideClick: false,
		preConfirm: (inputValue) => {
			if (inputValue === "") {
				window.top.SweetAlert.showValidationMessage($GL("set_delaycode_empty:Укажите проверочный код из письма").replace('"', '\"'));
				return false
			}

			if (window.check2FaSubmiting == inputValue) {
				return;
			}

			window.check2FaSubmiting = inputValue;
			if (callback) {
				return (new Promise((resolve, reject) => {
					callback(inputValue, {resolve: resolve, reject: reject});
				})).then(() => {
					window.check2FaSubmiting = null;
				})
			}

			return (new Promise((resolve, reject) => {

				$("body").addClass("load");

				GoAjax({act: "checkDelayQueryCode", module: 'main', code: inputValue}, function (data) {
					window.check2FaSubmiting = null;
					$("body").removeClass("load");
					if (data.result == "success") {
						window.top.swal($GL("success:Успешно"), params.success_message, "success");
						resolve(data);
					} else {
						window.top.SweetAlert.showValidationMessage($GL("set_delaycode_bad:Вы указали не верный проверочный код."))
						reject(false)
					}
				}, true, function () {
					reject(false)
				})

			})).then(response => {
				return response;
			}).catch(error => {
				if (error === false) {
					return;
				}
				let errorMessage = typeof error.responseText !== 'undefined' ? error.responseText : response.error_message;
				debugger;
				SweetAlert.showValidationMessage(
					`Request failed: ${error.responseText}`
				)
			});
		},
	}).then(result => {
		if (result.isConfirmed) {
			successCallback();
		} else {
			cancelCallback();
		}
	});

	/*window.top.swal({
			title: params.title
			, html: params.text
			, type: "input"
			, showCancelButton: true
			, cancelFunction: function () {
				if (cancelCallback) {
					debugger;
					cancelCallback();
				}
			}
			, closeOnConfirm: false
			, animation: "slide-from-top"
			, inputPlaceholder: $GL("set_delaycode:Введите проверочный код").replace('"', '\"')
		}, function (inputValue) {
			debugger;
			if (inputValue === false) {
				return false;
			}

			if (inputValue === "") {
				window.top.swal.showInputError($GL("set_delaycode_empty:Укажите проверочный код из письма").replace('"', '\"'));
				return false
			} else {
				if (window.check2FaSubmiting == inputValue) {
					return;
				}
				window.check2FaSubmiting = inputValue;
				if (callback) {
					callback(inputValue);
					setTimeout(function () {
						window.check2FaSubmiting = null;
					}, 1000)
					return;
				}
				$("body").addClass("load");
				$.post("/ajax.php", {act: "checkDelayQueryCode", code: inputValue}, function (data) {
					window.check2FaSubmiting = null;
					$("body").removeClass("load");
					if (data.result == "success") {
						window.top.swal($GL("success:Успешно"), params.success_message, "success");
					} else {
						window.top.swal.showInputError($GL("set_delaycode_bad:Вы указали не верный проверочный код."));
						return false;
					}
				}, "json");
			}
		}
	);*/
}

function getUserInfo(id) {
	GoAjax({module: 'team', act: 'getUserInfo', id: id}, function (data) {
		MY_OVERLAY.active(data.response);
		// detailse_On_activate();
	}, 'json');
	return false;
}

(function ($) {

	;(function () {
		var pushState = history.pushState;
		var replaceState = history.replaceState;

		history.pushState = function () {
			pushState.apply(history, arguments);
			window.dispatchEvent(new Event('pushstate'));
			window.dispatchEvent(new Event('locationchange'));
		};

		history.replaceState = function () {
			replaceState.apply(history, arguments);
			window.dispatchEvent(new Event('replacestate'));
			window.dispatchEvent(new Event('locationchange1'));
		};

		window.addEventListener('popstate', function () {
			window.dispatchEvent(new Event('locationchange2'))
		});
	})();

	// Usage example:
	// Добавление новой записи в историю
	let historyPage = {};
	window.addEventListener('pushstate', function () {
		console.log('pushstate event occurred!');
	})

	// изменение локации
	window.addEventListener('locationchange', function () {
		console.log('onlocationchange event occurred!');
	})

	window.addEventListener('locationchange1', function () {
		console.log('onlocationchange-1 event occurred!');
	})

	// перемещение по истории
	window.addEventListener('locationchange2', function () {
		//	debugger;
		console.log('locationchange2 call');
		var State = window.history.state

		if (typeof State === 'object' && State !== null) {
			if (State.mainContent !== undefined) {
				let $old = $('.kmfdm-page__body .kmfdm-page__main');
				$old.html(State.mainContent);
				$('.overlay-layer').remove();
				MY_OVERLAY.close();
			} else if (State.overlayContent !== undefined) {
				MY_OVERLAY.active(State.overlayContent, function () {
					$('.overlay-layer:hidden').remove();
				}, function () {

				});
			} else {
				MY_OVERLAY.close();
			}
		}
	})

	window.addEventListener('replacestate', function () {
		console.log('replacestate event occurred!');
	})

	var $body = $('body');

	$body.on('click', '.js-link-trigger', function () {
		$($(this).data('trigger')).slideToggle();
	}).on('click', '.js-ajax-pages a[data-page]', function (e) {
		e.preventDefault();
		let el = $(e.target);
		let href = el.attr('href');
		let needChangeUrl = /api\//.test(href) == false && $('.js-ajax-pages').data('no-change-url') != '1';
		url = href.replace('/app/', '/api/');
		url = (/\?/i.test(href) ? href + '&' : href + '?') + 'is_ajax=1';
		AjaxRequest('GET', url, {}, function (response) {
			let data = response instanceof Object ? (response.data instanceof Object ? response.data.html : response.html ) : response;
			$old = el.parents('#js-page-wrapper,.js-page-wrapper');
			let scrollTop = $old.offset().top
			let $overlay = el.parents('#overlay');
			if ($overlay.length > 0) {
				$overlay.scrollTop($overlay.scrollTop() + scrollTop)
			} else {
				$(window).scrollTop(scrollTop)
			}

			$old.after(data);
			$old.remove();

			if (needChangeUrl) {
			//	window.history.pushState("", "", href);
			}
		});
	}).on('click', 'a[as-overlay],[space-overlay-url]', function (e) {
		e.preventDefault();
		let $el = $(e.target);
		if ($el.attr('space-overlay-url') !== undefined || $el.parents('[space-overlay-url]').length > 0) {
			var href = $el.attr('space-overlay-url') || $el.parents('[space-overlay-url]').attr('space-overlay-url');
		} else {
			if ($el.attr('as-overlay') === undefined) {
				$el = $el.parents('[as-overlay]');
			}
			var href = $el.attr('href');
		}
		let url = /is_overlay=1/g.test(href) ? href : ((/\?/i.test(href) ? href + '&' : href + '?') + 'is_overlay=1')
		AsOverlayRequest(url, {}, href)
	}).on('click', 'a[as-ajax]', function (e) {
		e.preventDefault();
		let $el = $(e.target);
		if ($el.attr('as-ajax') === undefined) {
			$el = $el.parents('[as-ajax]');
		}
		let href = $el.attr('href');

		AjaxPage(href)
	});

	/*
	 * Tabs
	 */

	$body.on('click', '.kmfdm-tabs__tag', function (event) {
		event.preventDefault();

		if (!$(this).hasClass('kmfdm-tabs__tag_current')) {
			var tabs = $(this).closest('.kmfdm-tabs');

			tabs.find('.kmfdm-tabs__item_current').removeClass('kmfdm-tabs__item_current');
			tabs.find('.kmfdm-tabs__tag_current').removeClass('kmfdm-tabs__tag_current');

			tabs.find($(this).attr('href')).addClass('kmfdm-tabs__item_current');
			$(this).addClass('kmfdm-tabs__tag_current');
		}

	});

	$.fn.extend({
		limiter: function (limit, elem) {
			$(this).on("keyup focus", function () {
				setCount(this, elem);
			});

			function setCount(src, elem) {
				var chars = src.value.length;
				if (chars > limit) {
					src.value = src.value.substr(0, limit);
					chars = limit;
				}
				elem.html(limit - chars);
			}

			setCount($(this)[0], elem);
		}
	});

	/*
	* Collapse
	*/

	$body.on('click', '.kmfdm-collapse__handler', function (event) {
		event.preventDefault();
		$(this).closest('.kmfdm-collapse').toggleClass('kmfdm-collapse_active');
	});

	$body.on('change', '.js-checkbox-trigger', function () {
		$($(this).data('trigger'))[($(this).prop('checked') ? 'show' : 'hide')]();
	})

	$body.on('focus', 'input', () => {
		$('html.isMobile').addClass('focused-input');
	});

	$body.on('blur', 'input', () => {
		$('html.isMobile').removeClass('focused-input');
	});

	(function () {
		var element, circle, d, x, y;
		$(document).on('click', '.kmfdm-button, button, .kmfdm-mobile__navigation .kmfdm-nav__link, .kmfdm-sign', function (e) {

			element = $(this);

			if (element.find(".button-circle").length == 0) {
				element.prepend("<span class='button-circle'></span>");
			}

			circle = element.find(".button-circle");
			circle.removeClass("animate");

			if (!circle.height() && !circle.width()) {
				d = Math.max(element.outerWidth(), element.outerHeight());
				circle.css({height: d, width: d});
			}

			x = e.pageX - element.offset().left - circle.width() / 2;
			y = e.pageY - element.offset().top - circle.height() / 2;

			circle.css({top: y + 'px', left: x + 'px'}).addClass("animate");
		})
	})()

})(jQuery);

$.fn.hideImportant = function () {
	$(this).attr('style', 'display:none!important');
}
$.fn.showImportant = function (display) {
	$(this).attr('style', 'display:' + (display || 'block') + '!important');
}
