$(function () {

	var $notice_bell = $('#notice_bell');
	var $bell_counter = $('#bell_counter');
	var $notice__center__list = $('#notice__center__list');
	var _notice_center_item_new = $('.notice__center__item.new');

	var NoticeCenter = {
		list: {}
		, overlay: function (id) {

			if (!this.list[id]['eval'] || this.list[id]['eval'] == '') {
				if ($.tmpl) {
					MY_OVERLAY.active($('#tmpl-notice_overlayopen').tmpl(this.list[id]).html());
				}
			} else {
				eval(this.list[id]['eval']);
			}

			this.SetRodeNotice(id);
			this.closeList();
		}
		, SetRodeNotice: function (id) {
			$.post("/ajax.php", {module: 'notice', act: 'SetRodeNotice', id: id});
			$('#notice-' + id).removeClass('new');
			var cnt = $(_notice_center_item_new).length;
			$bell_counter.text("+" + cnt);
			if (cnt === 0) {
				$bell_counter.hide();
			}
		}
		, closeList: function () {
			$notice_bell.removeClass('notice-list-open');
			$notice__center__list.fadeOut(300);
			$('body').unbind('click');
		}
	};

	if (UserData.id > 0) {

		GoAjax({module: 'notice', dataType: 'json', act: 'getNoticeList', offset: 0}, function (data) {
			var has_new = 0, auto_open = false;
			if (!data.notifications || data.notifications.length === 0) {
				$notice__center__list.addClass('notice__center__list_empty');
			}

			if (typeof data.new_pm_cnt && data.new_pm_cnt > 0) {
				var last = $('.newpm-cnt').text();
				last = last === '' ? 0 : parseInt(last);
				if (last < data.new_pm_cnt) {
					$('.newpm-cnt').text(data.new_pm_cnt).showImportant();
					if (data.new_pm_cnt >= 10) {
						$('.newpm-cnt').addClass('cnt10');
					}
				}
			} else if ($.hideImportant) {
				$('.newpm-cnt').hideImportant();
			}

			if (typeof data.delivery_cnt && data.delivery_cnt > 0) {
				var last = $('.delivery-cnt').text();
				last = last === '' ? 0 : parseInt(last);
				if (last < data.new_pm_cnt) {
					$('.delivery-cnt').text(data.delivery_cnt).showImportant();
					if (data.new_pm_cnt >= 10) {
						$('.delivery-cnt').addClass('cnt10');
					}
				}
			} else if ($.hideImportant) {
				$('.delivery-cnt').hideImportant();
			}

		}, undefined, undefined, true);
	}

	$('#notice__center__list').on("click", '.notice__center__item', function () {
		var id = $(this).data('id');
		if (!NoticeCenter.list[id].link) {
			NoticeCenter.overlay(id);
		} else {
			NoticeCenter.SetRodeNotice(id);
			window.location.href = NoticeCenter.list[id].link;
		}
	});

	$notice_bell.on('click', function () {
		if (!$(this).hasClass('notice-list-open')) {
			$(this).addClass('notice-list-open');
			$('#notice__center__list').fadeIn(300, function () {
				var top  = $notice_bell.offset().top + 32,
				    left = $notice_bell.offset().left - $notice__center__list.width() + 33;
				if (left < 10) {
					left = 10;
				}
				$notice__center__list.css({top: top, left: left});
				$('body').bind('click', function (e) {
					if ($(e.target).parents('#notice__center__list').length == 0) {
						NoticeCenter.closeList();
					}
				});
			});

		}
	});

	window.NoticeCenter = NoticeCenter;
});