/*
 * Copyright (c) 2018. Space LLC
 */

function toggleLeftMenu() {
	$('html,body').toggleClass('left_navigate__open');
}

(() => {
	const Config = {
		handler: '.kmfdm-sub-header__user',
		close: '.kmfdm-page__sidebar-close',
	};

	$(Config.close).on('click', function () {
		toggleLeftMenu();
	});
	$(Config.handler).on('click', function () {
		toggleLeftMenu();
	});

})()