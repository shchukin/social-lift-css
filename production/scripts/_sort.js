(function($) {

    $('.sort__handler').on('click', function (event) {
        event.preventDefault();
        $(this).parents('.sort').toggleClass('sort--expanded');
    });

    $(document).on('click', function (event) {
        if (!$(event.target).closest('.sort').length) {
            $('.sort--expanded').removeClass('sort--expanded');
        }
    });

    $(document).on('keyup', function (event) {
        if (event.keyCode === 27) {
            $('.sort--expanded').removeClass('sort--expanded');
        }
    });

})(jQuery);
