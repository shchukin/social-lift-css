(function ($) {

	/*
	 * Browser detect
	 */
	(function getBrowser() {
		if (navigator.userAgent.indexOf('WebKit') + 1) {
			$('html').addClass('webkit');
		}
	})();

	/*
	 * Tabs
	 */
	$('.tabs__tags__item').on('click', function () {
		if ($(this).hasClass('tabs__tags__item_active') == false) {
			$('.tabs__tags__item').each(function () {
				$(this).removeClass('tabs__tags__item_active');
			});
			$(this).addClass('tabs__tags__item_active');
		}
		var blockID = $(this).attr('rel');
		$('.tabs__bodies__item').css('display', 'none');
		$('#' + blockID).toggle().show();
	});

})(jQuery);

$.fn.hideImportant = function () {
	$(this).attr('style', 'display:none!important');
}

function openLoginForm(act, type_of_reg, params) {
	let href = '/app/profile/' + act;
	let url = href + '?is_overlay=1' + (type_of_reg ? '&type_of_reg=' + type_of_reg : '');
	AsOverlayRequest(url, {}, href)
}

function setPhoneMask(elem) {
	if (typeof $.masksSort === 'undefined') {
		return false;
	}
	var PHONE_MASK_PATH = '/jscripts/phones-mask/';
	var maskList = $.masksSort($.masksLoad(PHONE_MASK_PATH + "phone-codes.json"), ['#'], /[0-9]|#/, "mask");
	var maskOpts = {
		inputmask: {
			definitions: {
				'#': {
					validator: "[0-9]",
					cardinality: 1
				}
			},
			//clearIncomplete: true,
			showMaskOnHover: false,
			autoUnmask: true
		},
		match: /[0-9]/,
		replace: '#',
		list: maskList,
		listKey: "mask",
		onMaskChange: function (maskObj, determined) {
			if (determined) {
				var hint = maskObj.name_en;
				if (maskObj.desc_ru && maskObj.desc_ru != "") {
					hint += " (" + maskObj.desc_ru + ")";
				}
				$('#phone_region').val(hint);
			} else {
				$('#phone_region').val('');
			}
			$(this).attr("placeholder", $(this).inputmask("getemptymask"));
		}
	};
	$(elem).inputmasks(maskOpts);

}

$(document).ready(function () {
	$('.tip[title!=""]:not(.icons__clickboard)').colorTip({color: 'black'});

	(function () {
		var $menu     = $('#leftNavigate,.js-card-oil'),
		    clsMenu   = '.primary-navigation',
		    clsLi     = clsMenu + '__item',
		    $subMenu  = $menu.find(clsMenu),
		    liH       = $menu.find(clsLi + ':first').height(),
		    cls       = clsLi.substr(1) + '_has-long-submenu-to-drop-',
		    clsDown   = cls + 'down',
		    clsUp     = cls + 'up',
		    $win      = $(window),
		    menuAlign = function () {
			    var winTop      = $win.scrollTop(),
			        winH        = $win.height(),
			        needClsUp   = false,
			        needClsDown = false,
			        menuTop     = $menu.offset().top - winTop;

			    $subMenu.each(function () {
				    var $this     = $(this),
				        posTop    = $this.offset().top - winTop,
				        menuH     = $this.height(),
				        marginTop = 0,
				        $parent   = $this.closest(clsLi);

				    if (posTop + menuH > winH) {
					    var notVisibleH = Math.abs(winH - posTop - menuH + 80),
					        needH       = liH * Math.round(notVisibleH / liH);

					    marginTop = -1 * needH;
					    needClsDown = true;
				    }

				    if (posTop + marginTop < menuTop) {
					    needClsUp = true;
				    }
				    $this.css('marginTop', marginTop);

				    if (needClsDown) {
					    $parent.addClass(clsDown);
				    } else {
					    $parent.removeClass(clsDown);
				    }

				    if (needClsUp) {
					    $parent.addClass(clsUp);
				    } else {
					    $parent.removeClass(clsUp);
				    }

			    });
		    };

		if ($menu.length) {
			menuAlign();

			$(window).on('resize', function () {
				menuAlign();
			});
		}
	})();

	(function () {
		var UserIp = {
			_geo: {},
			_cookieNameIpLast: 'user_ip_last',
			_cookieNameIpCurrent: 'user_ip_current',
			/** @returns {Promise} */
			_get: function () {
				return new Promise(function (resolve, reject) {
					$.getJSON('https://api.sypexgeo.net/', resolve).error(reject)
				})
			},
			/** @returns {Promise} */
			_send: function () {
				var geoData = this._geo;
				return new Promise(function (resolve, reject) {
					$.post("/ajax.php", {module: 'account', act: 'saveGeo', geoData: geoData}, resolve).error(reject)
				})
			},
			/** @returns {string|undefined} */
			_getCookie: function (name) {
				name = name || this._cookieNameIpLast;
				match = document.cookie.match(new RegExp(name + '=([^;]+)'));

				return match ? match[1] : undefined;
			},
			_setCookie: function (name, value, days) {
				name = name || this._cookieNameIpLast;
				days = days || 365;
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				var expires = "; expires=" + date.toGMTString();
				document.cookie = name + "=" + value + expires + "; path=/; domain =." + location.hostname.replace('www.', '');
			},
			/** @returns {Promise} */
			getGeo: function () {
				return this
					._get()
					.then(function (data) {
						UserIp._geo = data;
					})
			},
			/** @returns {string} */
			getIpCurrent: function () {
				return this._getCookie(this._cookieNameIpCurrent);
			},
			/** @returns {string} */
			getIpLast: function () {
				return this._getCookie(this._cookieNameIpLast);
			},
			/** @returns {bool} */
			isIpChanged: function () {
				return this.getIpCurrent() !== this.getIpLast();
			},
			saveNewGeo: function () {
				this._setCookie(this._cookieNameIpLast, this._geo.ip);
				this._send()
			},
			init: function () {
				if (UserIp.isIpChanged()) {
					this.getGeo()
						.then(function () {
							UserIp.saveNewGeo();
						})
						.catch(function (e) {
							console.log('Ошибка при получении IP', e);
						})
				}
			}
		};
		setTimeout(function () {UserIp.init()}, 5000);
	})();
});