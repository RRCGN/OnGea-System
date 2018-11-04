(function ($, Drupal, drupalSettings){
    // START //
    
    // Open / close the mobile menu.
    $(document).ready(function() {

        $('.user-register-form').find('.form-item-name').addClass('hidden');
        var username = $('.user-register-form').find('.username');
        username.removeClass('required').attr('required', false);
        // Fill Username field on email field change
        $('.user-register-form').on('change', '.form-email', function() {
            var val = $(this).val();
            username.val(val);
        });

    });

// END //
})(jQuery, Drupal, drupalSettings); 