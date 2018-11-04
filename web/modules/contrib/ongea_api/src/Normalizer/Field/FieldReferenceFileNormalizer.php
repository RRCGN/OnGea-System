<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 04.08.18
 * Time: 00:41
 */

namespace Drupal\ongea_api\Normalizer\Field;


class FieldReferenceFileNormalizer extends FieldReferenceNormalizer
{


    public function denormalize($data, $options = [])
    {


        $result = [];
        if (isset($data['id'])) {
            if (isset($data['alt'])) {
                $result['alt'] = $data['alt'];
            }
            if (isset($data['title'])) {
                $result['title'] = $data['title'];
            }
            $result['target_id'] = $data['id'];
        }

        return $result;
    }

    public function normalize($field, $options = [])
    {
        $targetAttributes = parent::normalize($field, $options);
        $value = $field->getValue();
        unset($value['target_id']);

        return array_merge($value, $targetAttributes);

    }
}