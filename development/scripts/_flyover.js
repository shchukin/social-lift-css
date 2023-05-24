/**
 * Здесь сложный момент с тем что на мобилках и десктопах разное поведение.
 * На десктопах показ флайоверов случается по mouseenter и mouseleave и нужно считать координаты.
 * На смартфонах показ по обычному click.
 * Сложность в том, что бы понять что есть десптоп, а что смартфорн.
 * Будем следовать за адаптивностью в стилях (ширина 992+) и проверять условие:
 * window.matchMedia('(min-width: 992px)').matches
 */

(function($) {

    if (window.matchMedia('(min-width: 992px)').matches) {

        $('[data-flyover]').on('mouseenter', function () {

            var target = $($(this).attr('data-flyover'));

            if (target.hasClass('flyover--avatar')) {
                target.css({
                    'bottom': $(window).outerHeight() - $(this)[0].getBoundingClientRect().top,
                    'left': $(this)[0].getBoundingClientRect().left - (target.outerWidth() / 2) + ($(this).outerWidth() / 2)
                });
            }

            // Ещё несколько примеров:
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
            $('.flyover').removeClass('flyover--visible');
        });

        $(window).on('scroll', function () {
            $('.flyover').removeClass('flyover--visible');
        });

        $('.scrollbar').on('scroll', function () {
            $('.flyover').removeClass('flyover--visible');
        });

        $('.carousel__container').on('scroll', function () {
            $('.flyover').removeClass('flyover--visible');
        });

    } else {

        $('[data-flyover]').on('click', function () {
            $($(this).attr('data-flyover')).addClass('flyover--visible');
        });

        $('[data-close-flyover]').on('click', function () {
            $(this).parents('.flyover').removeClass('flyover--visible');
        });

        $('.flyover').on('click', function (event) {
            if (!$(event.target).closest('.window').length) {
                $(this).removeClass('flyover--visible');
            }
        });
    }

})(jQuery);
