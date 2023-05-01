(function($) {
    var target;
    var peak;

    $('[data-flyover]').on('mouseenter', function () {

        target = $($(this).attr('data-flyover'));

        if( target.hasClass('flyover--avatar') ) {
            target.css({
                'bottom': $(window).outerHeight() + 8 - $(this)[0].getBoundingClientRect().top,
                'left': $(this)[0].getBoundingClientRect().left - (target.outerWidth() / 2) + ($(this).outerWidth() / 2)
            });
        }

        // if( target.hasClass('flyover--side-card') ) {
        //     target.css({
        //         'top': $(this)[0].getBoundingClientRect().top + $(this).height(),
        //         'right': $(window).outerWidth() - $(this)[0].getBoundingClientRect().left - $(this).outerWidth(),
        //         'padding-top': '15px'
        //     });
        // }
        //
        // if (target.hasClass('flyover--org-angle')) {
        //     target.css({
        //         'top': $(this)[0].getBoundingClientRect().top + 36,
        //         'right': $(window).outerWidth() - $(this)[0].getBoundingClientRect().left - 26,
        //         'padding-bottom': '15px'
        //     });
        // }

        target.addClass('flyover--visible');

    }).on('mouseleave', function () {
        target.removeClass('flyover--visible');
    });


    /* to reload on next hover */
    $(window).on('scroll', function () {
        $('.flyover').removeClass('flyover--visible');
    });

    $('.scrollbar').on('scroll', function () {
        $('.flyover').removeClass('flyover--visible');
    });

    $('.carousel__container').on('scroll', function () {
        $('.flyover').removeClass('flyover--visible');
    });

})(jQuery);
