if (typeof window.MY_OVERLAY === 'undefined') {

	window.MY_OVERLAY = {
		toggleOverlay: function () {
			if (this.$overlay.hasClass('open')) {
				this.close();
			} else {
				this.open();
			}
		},
		scrollTop: null,
		open: function ($layer) {
			$layer.show();

			$('body, html').addClass('overlay-open');
			this.$overlay.removeClass('close').addClass('open');
			this.$container.addClass('overlay-open');
			if (this.$overlayBody.height() > $(window).height()) {
				this.$container.addClass('overlay-long');
			} else {
				this.$container.removeClass('overlay-long');
			}
			let top = $layer.data('scroll-top');

			if (top == null) {
				top = parseInt($('#overlay-body').css('margin-top')) - 10;
			}

			this.$overlay.scrollTop(top)

			if (this.scrollTop === null) {
				this.scrollTop = $(window).scrollTop();
			}
			var mceLight = $layer.find('.js-tiny-mce-editor-light');
			if (mceLight.length) {
				tinymce.init({
					selector: '#overlay .js-tiny-mce-editor-light:not(.no_edit)',
					inline: true,
					force_br_newlines: true,
					force_p_newlines: false,
					plugins: 'textcolor colorpicker link table lists',
					toolbar: 'undo redo |  bold italic | fontsizeselect | forecolor backcolor | jbimages | link lists | alignleft aligncenter alignright alignjustify',
					fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 22pt 24pt 26pt 28pt 32pt 36pt',
					menubar: false,
					forced_root_block: false,
					setup: function (editor) {
						editor.on('keyup', function (e) {
							$($(this.getBody()).data('ref')).val(this.getContent());
						});
					}
				});
			}
			if ($.expanding) {
				$layer.find('.kmfdm-input_resize_auto .kmfdm-input__widget').expanding();
			}

			setTimeout(function () {
				initVideoPlayer();
			}, 2000)

		},
		close: function (callback) {
			if (typeof MY_OVERLAY.beforeClose == 'function') {
				MY_OVERLAY.beforeClose();
				MY_OVERLAY.beforeClose = undefined;
			}
			let $layeer = this.$overlayBody.find('.overlay-layer').length == 1 ? this.$overlayBody : this.$overlayBody.find('.overlay-layer:last')
			if (typeof tinymce != 'undefined') {
				var $editor = $layeer.find('.editor');
				if ($editor.length > 0) {
					$editor.each(function (i, el) {
						if ($(el).tinymce()) {
							$(el).tinymce().remove();
						}
					});
				}
			}
			if ($.countdown) {
				$layeer.find('.is-countdown').countdown('destroy');
			}

			if ($layeer.hasClass('overlay-layer')) {
				$layeer.remove();
				this.open(this.$overlayBody.find('.overlay-layer:last'));
				return;
			}
			$('body, html').removeClass('overlay-open');
			this.$overlay.removeClass('open');
			this.$container.removeClass('overlay-open').css({'transform': ''});

			this.$overlay.addClass('close');

			$(window).scrollTop(this.scrollTop || 0)
			this.scrollTop = null;

			var _this = this;
			this.$overlayBody.fadeOut(300, function () {
				_this.$overlayBody.empty();
				if (typeof callback === 'function') {
					callback();
				}
			});
			var onEndTransitionFn = function (ev) {
				if (MY_OVERLAY.support.transitions) {
					if (ev.propertyName !== 'visibility') {
						return;
					}
					$(this).off(MY_OVERLAY.transEndEventName, onEndTransitionFn);
				}
				MY_OVERLAY.$overlay.removeClass('close');

			};
			if (MY_OVERLAY.support.transitions) {
				$(this).on(MY_OVERLAY.transEndEventName, onEndTransitionFn);
			} else {
				onEndTransitionFn();
			}

		},
		active: function (html, callback, callbackClose) {

			let $layer = this.$overlayBody.find('.overlay-layer');
			if ($layer.length) {
				$layer.data('scroll-top', this.$overlay.scrollTop())
				$layer.hide()
			}
			this.$overlayBody.append("<div class='overlay-layer' style='display: none'></div>");
			try {
				this.$overlayBody.find('.overlay-layer:last-child').append(html);
			} catch (e) {
				console.error(e);
			}
			this.$overlayBody.show();

			$layer = this.$overlayBody.find('.overlay-layer:last');
			$layer.data('scroll-top', $('.overlay-layer').length > 1 ? null : 0);

			this.open($layer);

			if ($('body').colorTip) {
				$layer.find('.tip[title]').colorTip({color: 'black'});
			}

			ZeroClipboardCreate('.overlay-layer:visible .clipboard-btn,.overlay-layer:visible .js-copy');
			setPhoneMask('#overlay-body .phone-field,#overlay-body input[type=tel]');
			$layer.find('input[type=text],input[type=email]').eq(0).focus();

			if (typeof callback === 'function') {
				callback($layer);
			}
			if (typeof callbackClose === 'function') {
				this.beforeClose = callbackClose;
			}
		}
	};

	var $overlay = $('#overlay');
	MY_OVERLAY.$container = $overlay;
	MY_OVERLAY.$overlay = $overlay;
	MY_OVERLAY.$overlayBody = $('#overlay-body');
	MY_OVERLAY.$closeBttn = $overlay.find('#overlay-close');
	MY_OVERLAY.transEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'msTransition': 'MSTransitionEnd',
		'transition': 'transitionend'
	};
	MY_OVERLAY.transEndEventName = MY_OVERLAY.transEndEventNames[Modernizr.prefixed('transition')];
	MY_OVERLAY.support = {transitions: Modernizr.csstransitions};

	MY_OVERLAY.$closeBttn.on('click', function () {
		MY_OVERLAY.toggleOverlay();
	});
	MY_OVERLAY.$container.on('mousedown', function (e) {
		if ($(e.target).attr('id') == 'overlay') {
			$(e.target).data('can-close', true);
		}
	})
	MY_OVERLAY.$container.on('click', function (e) {
		if ($(e.target).attr('id') == 'overlay' && $(e.target).data('can-close') === true) {
			MY_OVERLAY.toggleOverlay();
			$(e.target).data('can-close', false);
		}
	});

	$('document').ready(function () {
		$('body').on('click', '[data-overlay]', function () {
			var popup = $(this).data('overlay');
			MY_OVERLAY.active($(popup).html());
		});
		$('html').on('click', '.js-overlay-close', function () {
			MY_OVERLAY.close();
		});
	});

}
