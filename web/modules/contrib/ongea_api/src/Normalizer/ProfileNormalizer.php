<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 30.08.18
 * Time: 04:20
 */

namespace Drupal\ongea_api\Normalizer;


class ProfileNormalizer extends OngeaEntityNormalizer
{

    /**
     * @param \Drupal\profile\Entity\Profile $profile
     * @param null $format
     * @param array $context
     *
     * @return array|bool|float|int|string
     */
    public function normalize($profile, $format = null, array $context = [])
    {
        return $profile->toArray();
    }
}