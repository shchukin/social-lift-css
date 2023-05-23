/**
 * Здесь сложный момент с тем когда вызывать функции showFlyover и hideFlyover.
 * На десктопах это делается по mouseenter и mouseleave, а на смартфонах по click.
 * Сложность в том, что бы понять что есть десптоп, а что смартфорн.
 * Будем следовать за адаптивностью в стилях (ширина 992+) и проверять условие:
 * window.matchMedia('(min-width: 992px)').matches
 */

(function($) {

    if (window.matchMedia('(min-width: 992px)').matches) {
        $('[data-flyover]').on('mouseenter', function () {
            showFlyover($(this), $($(this).attr('data-flyover')));
        }).on('mouseleave', function () {
            hideFlyover($($(this).attr('data-flyover')))
        });
    } else {
        $('[data-flyover]').on('click', function () {
            showFlyover($(this), $($(this).attr('data-flyover')));
        });
    }


    function showFlyover(handler, target) {
        if (target.hasClass('flyover--avatar')) {
            target.css({
                'bottom': $(window).outerHeight() + 8 - handler[0].getBoundingClientRect().top,
                'left': handler[0].getBoundingClientRect().left - (target.outerWidth() / 2) + (handler.outerWidth() / 2)
            });
        }
        // Few more examples:
        // if( target.hasClass('flyover--side-card') ) {
        //     target.css({
        //         'top': handler[0].getBoundingClientRect().top + handler.height(),
        //         'right': $(window).outerWidth() - handler[0].getBoundingClientRect().left - handler.outerWidth(),
        //         'padding-top': '15px'
        //     });
        // }
        // if (target.hasClass('flyover--org-angle')) {
        //     target.css({
        //         'top': handler[0].getBoundingClientRect().top + 36,
        //         'right': $(window).outerWidth() - handler[0].getBoundingClientRect().left - 26,
        //         'padding-bottom': '15px'
        //     });
        // }
        target.addClass('flyover--visible');
    }

    function hideFlyover(target) {
        if(target.length) {
            target.removeClass('flyover--visible');
        } else {
            $('.flyover').removeClass('flyover--visible');
        }
    }


    /* to reload on next hover */
    $(window).on('scroll', hideFlyover);
    $('.scrollbar').on('scroll', hideFlyover);
    $('.carousel__container').on('scroll', hideFlyover);

})(jQuery);
