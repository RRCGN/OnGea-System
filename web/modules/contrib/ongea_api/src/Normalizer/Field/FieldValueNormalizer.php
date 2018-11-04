<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 03.08.18
 * Time: 23:56
 */

namespace Drupal\ongea_api\Normalizer\Field;


class FieldValueNormalizer extends OngeaFieldNormalizer
{

    public function normalize($field, $options = [])
    {
        $options = array_merge(
          [
            'attributeName' => 'value',
          ],
          $options
        );

        $value = parent::normalize($field);


        if (is_array($value) && isset($value[$options['attributeName']])) {
            $value = $value[$options['attributeName']];
        }

        return $value;
    }
}