/*
 * Copyright (c) 2020. Space LLC
 */

function initWidget(container) {
	$(container).each(function (i, el) {
		var $wrap = $(el);
		var params = $wrap.data('params');
		var loading = parseInt($wrap.data('loading'));
		if (typeof params === 'string') {
			params = params.replace(/'/g, "\"");
			if (params != '') {
				params = JSON.parse(params);
			}
		}
		if (loading === 1) {
			$wrap.html('<div class="refresh-icon"><i class="zmdi zmdi-refresh zmdi-hc-spin"></i></div>');
			$wrap.addClass('loading');
		}
		GoAjax({module: 'main', act: 'widget', widget: $wrap.data('widget'), params: params, needAssets: $wrap.data('need-assets')}, function (data) {
			$wrap.removeClass('loading');
			var html = data.html;
			if (parseInt($wrap.data('need-assets')) == 1) {
				html = `<frame>${html}</frame>`
			}
			$wrap.html(html);
			ZeroClipboardCreate(".clipboard-btn,.js-copy");
		});
	});
}

(function () {
	$(document).ready(function () {
		initWidget('div[data-widget],widget[data-widget]');
	});
})(jQuery)

