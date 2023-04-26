/**
 * @param {string} selector
 */
function ZeroClipboardCreate(selector) {

	/**
	 * Try to copy a selected text
	 *
	 * @returns {boolean}
	 */
	function tryCopy() {
		var select = false;
		try {
			select = document.execCommand('copy');
		} catch (err) {
		}

		return select;
	}

	/**
	 * @param {string} text
	 */
	function copied(text) {

		$('body').append('<div class="zero-copyed show">' + (/^http[s]?:\/\//.test(text) ? $GL('copyed_link:Ссылка скопирована') : $GL('copyed:Скопировано')) + '</div>');

		setTimeout(function () {
			$('.zero-copyed').removeClass('show');
			setTimeout(function () {
				$('.zero-copyed').remove();
			});
		}, 1000);
	}

	/**
	 * @param {jQuery} $copiedHelper
	 * @param {jQuery} $inputHelp
	 */
	function hideCopyHelper($copiedHelper, $inputHelp) {
		window.keymap = [];
		$copiedHelper.fadeOut(300, function () {
			$copiedHelper.remove();
			$inputHelp.remove();
		});
	}

	$(selector).each(function (i, btn) {
		var $btn = $(btn);

		if ($btn.hasClass('zerocpSet')) {
			return;
		}

		$btn.addClass('zerocpSet');

		var clipboard = new ClipboardJS($(btn).get(0));

		clipboard.on('success', function (e) {
			console.info('Action:', e.action);
			console.info('Text:', e.text);
			console.info('Trigger:', e.trigger);
			if ($btn.data('clipboard-goal')) {
				try {
					yandexMetricaCall('reachGoal', $btn.data('clipboard-goal'));
				} catch (e) {
					console.error(e)
				}
			}
			copied($btn.data('clipboard-text'));
			e.clearSelection();
		});

		clipboard.on('error', function (e) {
			console.error('Action:', e.action);
			console.error('Trigger:', e.trigger);
			alert(e.action);
		});
		$btn.on('click', function (e) {
			e.preventDefault();
		})

		return;
	});

}

$(document).ready(function () {
	ZeroClipboardCreate('.clipboard-btn,.js-copy');
});