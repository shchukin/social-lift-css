/*$.mask.definitions['~'] = '[A-Za-z0-9%-]+';
delete($.mask.definitions['a']);
delete($.mask.definitions['?']);*/

InvestPortfolio = {
	create: function (type) {
		type = type || 'own';
		MY_OVERLAY.active($('#new_edit_project').tmpl(
			{project_id: 0, type: type, link: '', instruction: '', description: '', company_name: '', placeholder_link: '', placeholder_login: ''}),
			function () {
				if ($('#company_id').length > 0 && $('#company_id').find('option').length == 0) {
					MY_OVERLAY.close();
					swal({title: "Вы уже добавили все доступные проекты"});
					return;
				}

				function changePlaceholder($obj) {
					$('[name=login]').attr('placeholder', $GL('portfolio_example:Например') + ": " + $obj.data('login'));
					var link = $obj.data('link')
					var link_inp = $('[name=link]')
					if (0 && /\[[^\]]+\]/.test(link)) {
						var a, b;
						[a, b] = link.replace(/\[[^\]]+\]/gi, '[]').split('[]');

						//$('.link_before').html(a).show()
						//$('.link_after').html(b).show()
						link_inp.mask(a.replace('?', '\?') + "*****?******************************" + b.replace('?', '\?'));
						//link_inp.addClass('fixed-link-format')
						link_inp.attr('placeholder', a);
					} else {
						link_inp.removeClass('fixed-link-format')
						$('.link_before').html('').hide()
						$('.link_after').html('').hide()
						link_inp.attr('placeholder', $GL('portfolio_example:Например') + ": " + $obj.data('link'));
					}

				}

				changePlaceholder($('#company_id option').eq(0));
				$('#company_id').on('change', function () {
					changePlaceholder($(this).find('option[value=' + $(this).val() + ']'));
				});
				tinymce.init({
					selector: '#instruction,#description',
					// height: 300,
					language: UserData.language,
					paste_preprocess: function (plugin, args) {},
					language_url: '/jscripts/tinymce/langs/' + UserData.language + '.js', // site absolute URL
					menubar: false,
					plugins: ['advlist autolink lists link preview anchor jbimages code'],
					toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link jbimages | code',
					invalid_elements: "script",
					content_css: ['/templates/space/css/_form-builder.css']
				});
			});
	},
	remove: function (id) {
		swal({
			type: 'warning',
			title: $GL('attention:Внимание!'),
			text: $GL('portfolio_real_remove:Вы действительно хотите удалить этот проект?'),
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: $GL("yes:Да"),
			cancelButtonText: $GL("No:Нет")
		}).then(function (result) {
			if (result) {
				GoAjax({module: "main", act: "removePortfolioProject", id: id});
				$('#project_item_' + id).remove();
			}
		});
	},
	ShowDescr: function (id) {
		$('body').addClass('load');
		GoAjax({module: 'main', act: 'portfolioShowInfo', id: id}, function (data) {
			$('body').removeClass('load');

			MY_OVERLAY.active("<h2>" + $GL('portfolio_description:Описание проекта') + ": " + data.response.company_name + "</h2>" + data.response.description);
		}, 'json');
	},
	ShowInstruction: function (id) {
		$('body').addClass('load');
		GoAjax({module: 'main', act: 'portfolioShowInfo', id: id}, function (data) {
			$('body').removeClass('load');
			MY_OVERLAY.active("<h2>" + $GL('portfolio_instruction:Инструкция') + ": " + data.response.company_name + "</h2>" + data.response.instruction);
		}, 'json');
	},
	edit: function (id) {
		$('body').addClass('load');
		GoAjax({module: 'main', act: 'portfolioGetOne', id: id}, function (data) {
			$('body').removeClass('load');
			MY_OVERLAY.active($('#new_edit_project').tmpl({
				project_id: data.response.id,
				type: data.response.default_id > 0 ? 'recomended' : '',
				link: data.response.link,
				login: data.response.login,
				instruction: data.response.instruction,
				description: data.response.description,
				company_name: data.response.company_name,
				capital_percent: data.response.capital_percent,
				telegram_chat: data.response.telegram_chat
			}), function () {

				tinymce.init({
					selector: '#instruction,#description',
					// height: 300,
					language: UserData.language,
					paste_preprocess: function (plugin, args) {},
					language_url: '/jscripts/tinymce/langs/' + UserData.language + '.js', // site absolute URL
					menubar: false,
					plugins: ['advlist autolink lists link preview anchor jbimages code'],
					toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link jbimages | code',
					invalid_elements: "script",
					content_css: ['/templates/space/css/_form-builder.css']
				});

			})
		}, 'json');
	},
	allow: function (project_id) {
		swal({
			title: $GL('attention:Внимание!'),
			text: $GL('portfolio_real_allow:Вы действительно, хотите верифицировать эту заявку?'),
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: $GL("yes:Да"),
			cancelButtonText: $GL("No:Нет")
		}, function () {
			GoAjax({module: 'main', act: 'allowPortfolio', project_id: project_id}, function () {
				$('#verify_request_' + project_id).fadeOut(300);
			});
		})
	},
	reject: function (project_id) {
		swal({
			type: "input",
			title: $GL('attention:Внимание!'),
			text: $GL('portfolio_real_reject:Вы действительно, хотите ОТКЛОНИТЬ эту заявку? Укажите причину:'),
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: $GL("yes:Да"),
			cancelButtonText: $GL("No:Нет"),
			allowOutsideClick: false
		}, function (reason) {
			if (reason !== false) {
				GoAjax({module: 'main', act: 'rejectPortfolio', project_id: project_id, reason: reason}, function () {
					$('#verify_request_' + project_id).fadeOut(300);
				});
			}
		})
	},
	mylink: function (link, campaign_id, project_id) {
		MY_OVERLAY.active($('#myLink').tmpl({link: link, campaign_id: campaign_id, project_id: project_id}));
	}
}
$(document).ready(function () {
	$('.portfolioWrap').scrollbar({debug: true});
})
