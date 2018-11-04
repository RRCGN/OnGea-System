<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 30.08.18
 * Time: 02:35
 */

namespace Drupal\ongea_api\Normalizer\Field;


class FieldTargetIdNormalizer extends FieldValueNormalizer
{

    public function denormalize($data, $options = [])
    {
        return $data;
    }

    public function normalize($field, $options = [])
    {
        $options = array_merge($options, ['attributeName' => 'target_id']);

        $value = parent::normalize($field, $options);

        return (string)$value;
    }

}