(function($) {

    $('.card__head, .card__preview').on('click', function (event) {
        if (!$(event.target).closest('.card__heading .choice').length) {
            event.preventDefault();
            $(this).parents('.card').toggleClass('card--expanded');
        }
    });


})(jQuery);
