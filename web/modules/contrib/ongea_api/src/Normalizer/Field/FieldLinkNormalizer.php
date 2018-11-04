<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 03.08.18
 * Time: 23:31
 */

namespace Drupal\ongea_api\Normalizer\Field;


use Drupal\Core\Field\FieldItemInterface;

class FieldLinkNormalizer extends FieldValueNormalizer
{

    /**
     * @param FieldItemInterface $field
     * @param string $attributeName
     *
     * @return mixed
     */
    public function normalize($field, $options = ['attributeName' => 'uri'])
    {
        return parent::normalize($field, $options);
    }
}