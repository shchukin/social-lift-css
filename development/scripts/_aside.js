(function($) {

    $('.aside__heading').on('click', function (event) {
        event.preventDefault();
        $(this).parents('.aside__section').toggleClass('aside__section--expanded');
    });

})(jQuery);
