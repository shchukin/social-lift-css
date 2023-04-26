/* sticky sidebar */

var $menu = $('.kmfdm-page__navigation');
var $leftMenu = $menu.find('.kmfdm-main-nav__body');
var stickyPosition;
var windowScrolled;
var bodyScrolled;
var $topMobileMenu = $('.isMobile .kmfdm-head .kmfdm-head__wrap');
var stickyMobilePosition;

function positionMenu() {

	windowScrolled = $(window).scrollTop();
	bodyScrolled = $('body').scrollTop();
	if ($topMobileMenu.length == 0) {
		if ((windowScrolled >= stickyPosition || bodyScrolled >= stickyPosition) && $leftMenu.height() < $(window).height()) {
			$menu.addClass('kmfdm-page__navigation_sticky');
			$('.isMobile #leftNavigate .kmfdm-main-nav__body').css(
				{height: 'calc(100vh - ' + ($('.kmfdm-page__sidebar .kmfdm-head__logo').height() + $('.kmfdm-mobile__navigation').height()) + ')'});
		} else {
			$menu.removeClass('kmfdm-page__navigation_sticky')
		}
	} else {
		if ((windowScrolled > 0 || bodyScrolled > 0) && (windowScrolled >= stickyMobilePosition || bodyScrolled >= stickyMobilePosition)) {
			$topMobileMenu.addClass('kmfdm-head__wrap-sticky')
		} else {
			$topMobileMenu.removeClass('kmfdm-head__wrap-sticky')
		}
	}
}

function init() {
	stickyPosition = $menu.offset().top;
	if ($topMobileMenu.length > 0) {
		stickyMobilePosition = $topMobileMenu.offset().top;
		positionMenu();
	}

}

if ($menu.length > 0) {
	$(window).on('scroll', positionMenu);
	$('body').on('scroll', positionMenu);
	$(window).on('resize', positionMenu);
	$(window).on('load', init);
}
$('.kmfdm-lang__value').on('click', function () {
	$(this).parents('.kmfdm-lang').toggleClass('kmfdm-lang_active');
});

$('body').on('click', '.js-dropdown-handler, .js-dropdown-item', function () {
	$(this).parents('.kmfdm-dropdown').toggleClass('kmfdm-dropdown_active');
});

(function ($) {

	/*
	 * Scrollbar init
	 */
	if (typeof $.scrollbar !== 'undefined') {
		$('.kmfdm-scroll').scrollbar();
	}

	if (typeof $.magnificPopup !== 'undefined') {
		$('.mfp-handler').magnificPopup({
			type: 'inline',
			showCloseBtn: false,
			removalDelay: 300,
			midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
			callbacks: {
				open: function () {
					$('.input_resize_auto .input__widget').expanding();
				},
				close: function () {

				}
			}
		});
	}

	function openWin(url) {
		var features, w = 626, h = 436;
		var top = (screen.height - h) / 2, left = (screen.width - w) / 2;
		if (top < 0) {
			top = 0;
		}
		if (left < 0) {
			left = 0;
		}
		features = 'top=' + top + ',left=' + left;
		features += ',height=' + h + ',width=' + w + ',resizable=no';
		open(url, 'displayWindow', features);
	}

	/**
	 * Social link share
	 */
	$('body').on('click', '.js-share-link', function () {
		if (!$(this).hasClass('js-share-link-no-window')) {
			openWin($(this).data("uri"));
		} else {
			window.location.href = $(this).data("uri");
		}
	});

})(jQuery);

