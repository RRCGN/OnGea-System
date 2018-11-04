<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class ChannelNodeEntityNormalizer extends OngeaNodeEntityNormalizer
{

    public function getContentType()
    {
        return 'ongea_channel';
    }

    /**
     * @return array
     */
    public function getDependentsTypes()
    {
        return [
        ];
    }
}
