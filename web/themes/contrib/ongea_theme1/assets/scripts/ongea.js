(function ($, Drupal, drupalSettings){
// START //

    // Open / close the mobile menu.
    $(document).ready(function() {
        $("a[href^='http']").each(function() {
            $(this).click(function(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  window.open(this.href, '_blank');
             }).addClass('externalLink');
        });
        $(document).on('click', '.-burger', function() {
            $(this).toggleClass('fa-bars fa-times');
            $(this).parent('.burger').toggleClass('open');
            $('.main-menu .-content').slideToggle();
        });

        // Mobile menu actions.
        $('#block-mainmenu').on('click','.menu-icon', function () {
            if ($(window).width() < 768) {
                $(this).parent().find('.menu-icon').toggleClass('hidden');
                $(this).parent().parent().find('.dropdown-menu').slideToggle();
            }
        });

        // On window resize, normalize the menu.
        $(window).on('resize', function() {
            if ($(window).width() > 768) {
                var menu = $('#block-mainmenu');
                $(document).find('.ongea-navigation .-content').attr('style', '');
                menu.find('.dropdown-menu').attr('style', '');
                menu.find('.fa-chevron-down').removeClass('hidden');
                menu.find('.fa-chevron-up').addClass('hidden');
            }
        });

        // Go to the url on a click.
        $('#block-mainmenu').on('click', 'a', function(){
            var url = $(this).attr('href');
            window.location.href = url;
        });


        // Translate prev button.
        $('.indicators, .slider-indicators').find('.prev').each( function() {
            if ($(this).text().length > 0) {
                var prevText = Drupal.t($(this).text());
                $(this).text(prevText);
            }
        });

        // Translate next button.
        $('.indicators, .slider-indicators').find('.next').each( function() {
            if ($(this).text().length > 0) {
                var nextText = Drupal.t($(this).text());
                $(this).text(nextText);
            }
        });

        // Slider
        $('.indicators').on('click', '.link', function() {
            var data = parseInt($(this).attr('data'));
            var next = data + 1;
            var prev = data - 1;

            var slider = $(this).parent().parent().parent().parent();
            var all = slider.find('.all').attr('data');

            slider.find('.slide').removeClass('slide-active');
            slider.find(`.slide:nth-child(${data})`).addClass('slide-active');
            slider.find('.current').text(data);
            
            // Set prev data
            slider.find('.prev').attr('data', prev);

            // Set next data
            slider.find('.next').attr('data', next);
            
            // Show / hide prev button.
            if (prev < 1) {
                slider.find('.prev').addClass('hidden');
            } else {
                slider.find('.prev').removeClass('hidden');
            }

            // Show / hide next button.
            if (next > all) {
                slider.find('.next').addClass('hidden');
            } else {
                slider.find('.next').removeClass('hidden');
            }

        });

        // Login form open/show
        $('#block-userlogin').on('click', '.lock-login', function() {
            $('.loginform-content').fadeToggle();
        });
        
        // Close the form
        $('#block-userlogin').on('click', '.close-form', function(){
            $('.loginform-content').fadeOut();
        });


        // HOME SLIDER START
        // =================
        // Home slider
        function slider (id) {
            var view = $(id);
            var indicators = view.find('.slider-indicators');
            var all = view.find('.slider-item').length;

            if (all > 0) {
                view.find('.slider-item').first().addClass('active leftside-effect');

                // Add all count to indicators
                indicators.find('.all').text(all);

                // On next / prev click
                leftside = false;
                indicators.on('click', '.link', function() {
                    var view = $(id);
                    var indicators = view.find('.slider-indicators');
                    var data = parseInt($(this).attr('data'));
                    var next = data + 1;
                    var prev = data - 1;
                    var slider = $(this).parent().parent().parent().parent();
                    var all = view.find('.slider-item').length;

                    slider.find('.slider-item').removeClass('active leftside-effect rightside-effect');
                    var currentSlide = slider.find(`.slider-item:eq(${data})`)
                    currentSlide.addClass('active');

                    // Add effect to the slider
                    if (leftside) {
                        currentSlide.addClass('leftside-effect');
                    } else {
                        currentSlide.addClass('rightside-effect');
                    }

                    // Invert this value
                    leftside = !leftside;
                    
                    slider.find('.current').text(data+1);
                    
                    // Set prev data
                    indicators.find('.prev').attr('data', prev);
                    if (prev < 0 ) indicators.find('.prev').attr('data', parseInt(all)-1);

                    // Set next data
                    indicators.find('.next').attr('data', next);
                    if (next >= all) indicators.find('.next').attr('data', 0);

                    indicators.find('.prev').removeClass('hidden');

                });
            } else {
                $(id).hide();
            }

            /**
             * Click function
             * @param {string} id 
             */
            function click(id) {
                $(id).find('.next').click()
            }
            setInterval(click, 9000, id);   
        }

        // Set slider ids
        var ids = [
            '#block-ongeaslider',
            '#block-ongeaslider-2',
            '#block-ongeaslider-3',
            '#block-ongeaslider-4'
        ];

        // Activate slider.
        for (let index = 0; index < ids.length; index++) {
            slider(ids[index]);
        }

        // =================
        // HOME SLIDER END


        // HOME LISTS START
        // ================

        // Set list ids
        var listIds = [
            '#block-small-list',
            '#block-medium-list',
            '#block-large-list',
            '.organization-view',
            '.project-view',
            '.activities-view',
            '.news-view',
            '.profiles-view'
        ];

        /**
         * Add classes to lists
         * @param {string} id 
         */
        function addListClass(id) {
            console.log('id', id);
            var invert = false;
            $(id).find('.list-container').each(function() {
                if (invert) $(this).addClass('invert');
                invert = !invert;
            });
        }

        // Add classes using list ids and addListClass function.
        for (let index = 0; index < listIds.length; index++) {
            addListClass(listIds[index]);
        }

        // ==============
        // HOME LISTS END


        //
        function adjustHeightContent(){
            if($('.page-content .left-content .-flex').length){
                var flexHeight = $('.page-content .left-content .-flex').outerHeight();
                var upperHalfHeight = $('.page-content .center-content .upper-half').outerHeight() + 50 + 45 + 25;

                if(flexHeight > upperHalfHeight && $(window).width() > 992){
                    $('.page-content .center-content .upper-half').height(flexHeight);
                }
                else {
                    $('.page-content .center-content .upper-half').height('auto');
                }
            }
        }
        adjustHeightContent();

        $( window ).resize(function() {
            adjustHeightContent();
        });
    });

// END //
})(jQuery, Drupal, drupalSettings); 