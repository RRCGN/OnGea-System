<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 25.07.18
 * Time: 23:58
 */

namespace Drupal\ongea_api\Normalizer;


class AnnouncementNodeEntityNormalizer extends OngeaNodeEntityNormalizer
{


    public function getContentType()
    {
        return 'ongea_announcement';
    }
}