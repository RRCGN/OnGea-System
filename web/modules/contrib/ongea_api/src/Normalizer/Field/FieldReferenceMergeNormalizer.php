<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 04.08.18
 * Time: 00:41
 */

namespace Drupal\ongea_api\Normalizer\Field;


class FieldReferenceMergeNormalizer extends FieldReferenceNormalizer
{


    /**
     * @param $data
     */
    public function denormalize($data, $options = [])
    {

        $result = [];
        if (isset($data['id'])) {
            $result = [
              'target_id' => $data['id'],
            ];
        }

        return $result;
    }

    public function normalize($field, $options = [])
    {
        return parent::normalize($field);

    }
}