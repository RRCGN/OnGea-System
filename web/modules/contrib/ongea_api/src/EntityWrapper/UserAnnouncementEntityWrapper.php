<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 02.08.18
 * Time: 01:08
 */

namespace Drupal\ongea_api\EntityWrapper;


class UserAnnouncementEntityWrapper extends OngeaEntityWrapper
{

    public static function getContentType()
    {
        return 'ongea_user_announcement';
    }

}