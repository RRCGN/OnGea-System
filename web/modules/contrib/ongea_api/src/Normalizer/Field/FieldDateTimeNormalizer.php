<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 05.08.18
 * Time: 17:31
 */

namespace Drupal\ongea_api\Normalizer\Field;


use Drupal\datetime\Plugin\Field\FieldType\DateTimeItem;

class FieldDateTimeNormalizer extends FieldValueNormalizer
{


    const ONGEA_DATE_FORMAT = 'Y-m-d';

    const ONGEA_TIME_FORMAT = 'H:i';

    /**
     * @param DateTimeItem $field
     * @param array $options
     *
     * @return array|mixed
     */
    public function normalize($field, $options = [])
    {
        $options = array_merge($options, ['attributeName' => 'value']);

        return $field->getString();
        //return parent::normalize($field, $options);
    }

}


