(function($) {

    $('.floor__head, .floor__preview').on('click', function (event) {
        if (!$(event.target).closest('.floor__heading .choice').length) {
            event.preventDefault();
            $(this).parents('.floor').toggleClass('floor--expanded');
        }
    });


})(jQuery);
