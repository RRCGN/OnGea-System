<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 05.08.18
 * Time: 17:31
 */

namespace Drupal\ongea_api\Normalizer\Field;


class FieldBooleanNormalizer extends FieldValueNormalizer
{

    public function normalize($field, $options = [])
    {


        $options = array_merge($options, ['attributeName' => 'value']);
        $data = parent::normalize($field, $options);
        if ($data == true || $data == 1) {
            return true;
        }

        return false;
    }

}