Raven.context(function () {

	(function () /** ajax settings */ {

		NProgress.configure({showSpinner: false, easing: 'ease', speed: 500});
		var _csrf = document.getElementById('csrf_token_meta');
		if (_csrf) {
			var sesshash = _csrf.getAttribute('sesshash');
			var isIgnoredRequest = function (url, data) {
				url = url || '';
				data = data || '';
				if (typeof data !== 'string') {
					return false;
				}
				return url.indexOf('chat.') >= 0
					|| url.indexOf('.json') >= 0
					|| url.indexOf('.svg') >= 0;

			};
			var checkNotifications = function (data) {

				if (data.notifications !== undefined) {
					var has_new = 0;
					for (var i in data.notifications) {
						var notice = data.notifications[i];

						if (typeof NoticeCenter.list[notice.id] === 'undefined') {
							NoticeCenter.list[notice.id] = notice;

							if ($.tmpl && $('#tmpl-notice_item').length > 0) {
								$('#notice__center__items').append($('#tmpl-notice_item').tmpl(notice));
							}

							if (notice.new === 1) {
								if (notice.auto_open == 1) {
									NoticeCenter.overlay(notice.id);
								} else {
									has_new++;
								}
							}
						}
					}

					if (has_new > 0) {

						$('#bell_counter').text("+" + has_new).show();
						$('.notice__center__item.new').filter('.auto-open:eq(0)').trigger('click'); // открываем auto-open

					}
				}
			}
			//if (window.sessionStorage.getItem('csrf_token_' + sesshash) === null) {
			window.sessionStorage.setItem('csrf_token_' + sesshash, document.getElementById('csrf_token_meta').getAttribute('content'));
			//}
		}
		var setCSRF = function (jqXHR) {
			var csrf = jqXHR.getResponseHeader('X-CSRF-TOKEN');
			if (this.type !== 'GET') {
				if (csrf === null && typeof jqXHR.responseJSON !== 'undefined' && typeof jqXHR.responseJSON.csrf_token !== 'undefined') {
					csrf = jqXHR.responseJSON.csrf_token;
				}
				if (csrf === null) {
					try {
						var json = JSON.parse(jqXHR.responseText);
						if (json && json.csrf_token) {
							csrf = json.csrf_token;
						}
					} catch (e) {

					}
				}
				if (csrf !== null) {
					window.sessionStorage.setItem('csrf_token_' + sesshash, csrf);
					$('.csrf-token').val(csrf);
				}
			}
		}

		var getUrlVars = function (url) {
			if (typeof url === 'undefined') {
				return {};
			}
			try {
				var hash;
				var myJson = {};
				var hashes = url.slice(url.indexOf('?') + 1).split('&');
				for (var i = 0; i < hashes.length; i++) {
					hash = hashes[i].split('=');
					myJson[hash[0]] = hash[1];
					// If you want to get in native datatypes
					// myJson[hash[0]] = JSON.parse(hash[1]);
				}
				return myJson;
			} catch (e) {
				console.error(e);
				return {}
			}
		}

		function errorHandler(data, textStatus) {
			$('form').data('loading', false);
			if (typeof data.responseJSON !== 'undefined') {
				if (NProgress.isStarted()) {
					NProgress.done(true);
				}
				$('body').removeClass('load').find('.kmfdm-button__load').removeClass('kmfdm-button__load');

				if (data.status === 422) {
					swal({
						type: 'warning',
						title: $GL('swal_validation_error_title:Ошибка валидации'),
						text: Object.values(data.responseJSON.error_details).join('<br>'),
					});
					this.errorHandled = true;
					return;
				}

				var message = data.responseJSON.user_message || data.responseJSON.error_description + ' ' + data.responseJSON.error_details

				iziToast.show({
					message: data.responseJSON.error_code + ' ' + message,
					color: 'red',
					position: 'topRight',
					title: $GL('error:Ошибка!')
				});

			} else if (typeof data.responseText !== 'undefined') {
				if (data.status == 403) {
					show_message('red', $GL('request_error_403:Доступ запрещен'), $GL('error:Ошибка!'));
				} else if (data.status == 403) {
					show_message('red', $GL('request_error_404:404 Страница не существует'), $GL('error:Ошибка!'));
				} else if (data.status == 500) {
					if (UserData.moder) {
						MY_OVERLAY.active('<h1>' + data.status + ' # ' + textStatus + '</h1>' + data.responseText);
					} else {
						show_message('red', $GL('request_error_500:500 Не удалось выполнить операцию'), $GL('error:Ошибка!'));
					}
				} else {
					show_message('red', data.responseText, $GL('error:Ошибка!'));
				}

				if (NProgress.isStarted()) {
					NProgress.done(true);
				}
				$('body').removeClass('load').find('.kmfdm-button__load').removeClass('kmfdm-button__load');
			} else {
				throw 'error';
			}
		}

		$.ajaxPrefilter('script', function (options) { options.cache = true; });
		$.ajaxSetup({
			beforeSend: function (jqXHR, settings) {
				this.errorHandled = false;
				if (document.hidden === true && typeof settings.data == 'string' && settings.data.indexOf('__ignoreAbort') >= 0) {
					console.log('Abort ajax');
					jqXHR.abort();
				}

				try {
					if (settings.url === '/ajax.php') {
						if (settings.data instanceof FormData) {
							var data = {module: settings.data.get('module'), act: settings.data.get('act')};
						} else {
							var data = getUrlVars(settings.data);
						}
						if (typeof data.module !== 'undefined' || typeof data.act !== 'undefined') {

							settings.url = '/ajax.php?';

							if (data.module) {
								settings.url += 'module=' + data.module + "&";
							}

							if (data.act) {
								settings.url += 'act=' + data.act;
							}
						}
					}
				} catch (e) {
					console.error(e)
				}

				var csrf = window.sessionStorage.getItem('csrf_token_' + sesshash);
				if (csrf === null) {
					csrf = $('#csrf_token_meta').attr('content');
				}
				jqXHR.setRequestHeader("X-CSRF-TOKEN", csrf);
				jqXHR.setRequestHeader("X-SPACE-ID", window.SpaceId + ':' + window.SpaceIdHash);
				if (settings.noLoader === true || isIgnoredRequest(settings.url, settings.data)) {
					return;
				}
				NProgress.start();
				setTimeout(function () {
					if (NProgress.isStarted()) {
						NProgress.set(0.4);
					}
				}, 300);
				console.log(settings.url);
				console.log(settings.data);
				$('body').addClass('load');
			},
			error: function (data, textStatus, jqXHR) {
				if (isIgnoredRequest(this.url, this.data)) {
					return;
				}
				this._errorHandled = true
				errorHandler(data, textStatus);
			},
			success: function (data, textStatus, jqXHR) {
				setCSRF(jqXHR);
			},
			complete: function (jqXHR, settings) {
				setCSRF(jqXHR);
				if (jqXHR.responseJSON) {
					checkNotifications(jqXHR.responseJSON);
				}

				if (isIgnoredRequest(this.url, this.data)) {
					return;
				}

				if (jqXHR.status != 200) {
					//	errorHandler(jqXHR, jqXHR.statusText);
				}

				$('body').removeClass('load');
				if (NProgress.isStarted()) {
					NProgress.done(true);
				}

				if (typeof jqXHR.responseJSON !== 'undefined') {
					if (jqXHR.responseJSON.result !== undefined && jqXHR.responseJSON.result === 'error') {
						show_message('red', jqXHR.responseJSON.error_code + ' # ' + jqXHR.responseJSON.error_description
							+ '<br>' + (jqXHR.responseJSON.error_message || ''));
					} else if (typeof jqXHR.responseJSON.error_message !== 'undefined' && this.errorHandled === false) {
						if (jqXHR.responseJSON.error_code === 100) {
							window.location.href = "/login?redirect=" + encodeURIComponent(window.location.href);
						}
						if (typeof jqXHR.responseJSON.error_message === 'Object') {
							new swal({
								type: 'warning',
								title: $GL('swal_validation_error_title:Ошибка валидации'),
								text: Object.values(jqXHR.responseJSON.error_message).join('<br>'),
							});
							this.errorHandled = true;
							return;
						} else if (jqXHR.responseJSON.error_message !== '') {
							var params = {
								title: $GL('error'),
								text: (jqXHR.responseJSON.error !== 0 && jqXHR.responseJSON.error !== undefined ? "#" + jqXHR.responseJSON.error + "  " : '') + (jqXHR.responseJSON.user_message || jqXHR.responseJSON.error_message),
								type: typeof jqXHR.responseJSON.error_type !== 'undefined' ? jqXHR.responseJSON.error_type : 'error'
							};
							params.html = params.text;
							try {
								if (SweetAlert.isLoading()) {
									SweetAlert.showValidationMessage(
										params.text
									)
									return;
								}
							} catch (e) {
							}
							if ($('.sa-error-container').length > 0 && $('.hideSweetAlert').length == 0) {
								swal.showInputError(params.text);
								return;
							}

							if (typeof jqXHR.responseJSON.swal !== 'undefined') {
								var swalData = jqXHR.responseJSON.swal;
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
							if (this._errorHandled !== true || typeof jqXHR.responseJSON.swal !== 'undefined') {
								new swal(params, function (res) {
									if (res && typeof swalData !== 'undefined' && (typeof res.isConfirmed === 'undefined' || res.isConfirmed === true)) {
										eval(swalData.callback);
									}
								});
							}
						}
					}
				}

			}
		});
		$(document).ready(function () {
			var formSenderFlag = 'in_progress';

			$('body:not(.binded)')
				.on('click', 'form button', function (e) {
					var type = $(this).prop('type');
					var $form = $(this).parents('form');
					if ((type === 'submit' || type === undefined) && $form.length && $form.attr('target') !== '_blank' && $form[0].checkValidity()) {
						if ($(this).hasClass('kmfdm-button__load')) {
							e.preventDefault();
							return;
						}
						$(this).addClass('kmfdm-button__load');
					}
				})
				.on('submit', 'form[target=space_saveform]', function (e) {
					e.preventDefault();
					var $form    = $(this),
					    formData = new FormData($form[0]);

					if ($form.data(formSenderFlag) && $form.find('.kmfdm-button__load')) {
						return;
					}
					$form.data(formSenderFlag, 1);

					$form.find('input[type=file]').each((i, el) => {
						if ($(el).get(0).files.length === 0) {
							formData.delete($(el).attr('name'));
						}
					});

					var submit = function (formData, promise) {
						$form.data(formSenderFlag, $form.data(formSenderFlag) + 1);
						if ($form.data(formSenderFlag) > 2) {
							return;
						}

						$.ajax({
							type: 'POST',
							url: $form.attr('action'),
							data: formData,
							processData: false,
							contentType: false,
							headers: {'X-SPACE-SAVE-FORM': 1},
							success: function (data, textStatus, jqXHR) {
								setCSRF(jqXHR);
								$('#space_saveform').append(data);
								$form.find('.kmfdm-button__load').removeClass('kmfdm-button__load');
								$form.data(formSenderFlag, 0);
								$form.data('canSubmit', false);
								if (promise) {
									promise.resolve({success: true});
								}
							},
							error: function () {
								$form.find('.kmfdm-button__load').removeClass('kmfdm-button__load');
								$form.data(formSenderFlag, 0);
								if (promise) {
									promise.reject(false);
								}
							}
						});
					};

					if ($form.data('canSubmit') !== true) {

						var $confirmAction = $form.find('input[name=confirmAction]');
						if ($confirmAction.length === 0) {
							$form.data('canSubmit', true);
							submit(new FormData($form[0]));
							return true;
						}
						var $confirmActionCode = $form.find('input[name=confirmActionCode]');
						if ($confirmActionCode.val() !== '') {
							$form.data('canSubmit', true);
							submit(new FormData($form[0]));
							return true;
						}
						$form.data('canSubmit', false);

						$.post("/ajax.php", {act: 'setCheckActionSession', module: 'main', actionName: $confirmAction.val()}, function (data) {
								if (data.result !== 'success') {
									return;
								}
								var text = $GL('mail_session:Сессия') + " " + data.session;
								switch (data.reciever) {
									case 'email':
										text = $GL('mail_reciever_email:Мы отправили вам на email код подтверждения') + "<br>" + text;
										break;
									case 'telegram':
										text = $GL('mail_reciever_telegram:Мы отправили вам на telegram код подтверждения') + "<br>" + text;
										break;
									case '2fa':
										text = $GL('mail_reciever_2fa:Введите код из Google Authentificator');
										break;
								}
								swalPromptDelay({title: $GL('set_delaycode_title:Подтвердите ваше действие'), text: text}, function (inputVal, promise) {
										$confirmActionCode.val(inputVal);
										submit(new FormData($form[0]), promise);
									}, function () {
										$form.data('canSubmit', false);
										$form.find('.kmfdm-button__load').removeClass('kmfdm-button__load');
										$form.data(formSenderFlag, 0);
										$form.find('input[name=confirmActionCode]').val('');
									}, function () {
										$form.data('canSubmit', false);
										$form.find('.kmfdm-button__load').removeClass('kmfdm-button__load');
										$form.data(formSenderFlag, 0);
									}
								);
							}
							,
							'json'
						)
						;

					} else {
						submit(new FormData($form[0]));
					}
				})
				.on('submit', 'form[data-type=ajax]', function (e) {
					e.preventDefault();

					var $form = $(this);

					if ($form.data('loading') === true) {
						console.warn('Form abort');
						return;
					}

					$form.data('loading', true);

					var formData = new FormData($form[0]);
					$form.find('input[type=file]').each((i, el) => {
						if ($(el).get(0).files.length == 0) {
							formData.delete($(el).attr('name'));
						}
					});
					var successCallback = $form.data('success-callback');
					var successMessage = $form.data('success-message');
					var successUrl = $form.data('success-url');
					var successContentWrap = $form.data('success-contentwrap')

					let method = $form.attr('method');
					var action = $(this).attr('action');
					if (method == 'GET') {
						formData = new URLSearchParams(formData).toString();
					}

					$.ajax({
						url: action,
						dataType: 'json',
						data: formData,
						type: method || 'POST',
						processData: false,
						contentType: false,
						success: function (response, textStatus, jqXHR) {
							$form.data('loading', false);
							$form.find('.kmfdm-button__load').removeClass('kmfdm-button__load');

							if (typeof grecaptcha !== 'undefined') {
								try {
									grecaptcha.reset();
								}catch (e){
									console.log(e);
								}
							}
							setCSRF(jqXHR);
							if (successContentWrap && (typeof response == 'string' || !(response instanceof Object && response.error_message && response.error_message != ''))) {
								$wrap = $(successContentWrap);
								if ($wrap.is($form)) {
									$wrap.after(response instanceof Object ? response.html : response);
									$form.remove();
								} else {
									$wrap.html(response instanceof Object ? response.html : response);
								}
							}

							if (!response.error_message || response.error_message === '') {
								if (successCallback) {
									eval(successCallback)(response, $form);
								} else {
									if (response.eval) {
										eval(response.eval);
									}
									if (response.redirect) {
										window.location.href = response.redirect;
										return;
									}
									if (response.successMessage) {
										swal({title: $GL('success:Успешно!'), text: response.successMessage, type: 'success'}, function () {
											if (successUrl) {
												window.location.href = successUrl;
											}
										});
									} else if (successMessage || successMessage === '') {
										if (successMessage !== '') {
											swal({title: $GL('success:Успешно!'), text: successMessage, type: 'success'}, function () {
												if (successUrl) {
													window.location.href = successUrl;
												}
											});
										}
									} else if (successUrl) {
										window.location.href = successUrl;
									} else {
										iziToast.show({
											title: 'Успешно!',
											color: 'green',
											position: 'topRight'
										});
									}
								}

							}
						}
					});
				});
			$('body').addClass('binded');
		});
	})();
})

class SpaceSocket {

	constructor(room) {
		if (typeof room === 'undefined') {
			room = 'default';
		}
		this.room = room;
		this.pingInterval = null;
		this.piesocket = null;
		this.socketTryConnect = 0;

		this.startSocket();
	}

	startSocket() {
		let _this = this;
		this.socketTryConnect++;
		this.piesocket = new WebSocket(
			'ws' + window.location.protocol.replace(/[^s]/g,
				'') + '://' + window.SpaceWebsoketServer + '/ws?gate=' + window.SpaceId + '-space&room=' + this.room, window.UserData.ws_hash_mac);

		this.piesocket.onopen = () => {
			console.log('Opened');
			_this.socketTryConnect = 0;
			if (_this.pingInterval === null) {
				_this.pingInterval = setInterval(() => {
					_this.piesocket.send(JSON.stringify({action: 'ping', user_id: window.UserData.id, token: window.UserData.ws_hash_mac}))
				}, 29000);
			}
		}

		this.piesocket.onmessage = function (message) {
			try {
				let json = JSON.parse(message.data);
				console.log('Incoming message', json);

				if (json.action === 'redirect') {
					window.location.href = json.url;
				}
			} catch (e) {
				console.log('Incoming message', message.data);
			}
		}

		this.piesocket.onclose = () => {
			console.warn('Socket closed');
			_this.piesocket = null;
			clearInterval(_this.pingInterval);
			_this.pingInterval = null;
			if (_this.socketTryConnect < 3) {
				_this.startSocket();
			}
		}
	}
}

function refreshPage() {
	NProgress.start();
	window.location.href = window.location.href;
}