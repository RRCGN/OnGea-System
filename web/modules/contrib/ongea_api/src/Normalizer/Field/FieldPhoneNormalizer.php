<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 03.08.18
 * Time: 23:45
 */

namespace Drupal\ongea_api\Normalizer\Field;


class FieldPhoneNormalizer extends FieldValueNormalizer
{

    public function normalize($field, $options = [])
    {
        $options = array_merge($options, ['attributeName' => 'value']);

        return parent::normalize($field, $options);
    }

}