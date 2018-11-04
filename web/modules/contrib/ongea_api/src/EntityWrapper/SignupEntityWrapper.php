<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 17.08.18
 * Time: 00:43
 */

namespace Drupal\ongea_api\EntityWrapper;


class SignupEntityWrapper extends OngeaEntityWrapper
{

    /**
     * @return string
     */
    public static function getContentType()
    {
        return 'ongea_activity_signup_form';
    }
    // permissions
}