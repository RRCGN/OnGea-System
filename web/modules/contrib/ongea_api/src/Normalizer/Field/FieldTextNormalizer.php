<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 03.08.18
 * Time: 23:45
 */

namespace Drupal\ongea_api\Normalizer\Field;


class FieldTextNormalizer extends FieldValueNormalizer
{

    public function denormalize($data, $options = [])
    {
        return (string)$data;
    }

    public function normalize($field, $options = [])
    {
        $options = array_merge($options, ['attributeName' => 'value']);

        $value = parent::normalize($field, $options);

        return (string)$value;
    }

}