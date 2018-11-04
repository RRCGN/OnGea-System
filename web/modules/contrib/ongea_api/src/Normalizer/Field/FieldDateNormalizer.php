<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 05.08.18
 * Time: 17:31
 */

namespace Drupal\ongea_api\Normalizer\Field;


use Drupal\Core\Datetime\DrupalDateTime;

class FieldDateNormalizer extends FieldDateTimeNormalizer
{

    /**
     * @param $data
     */
    public function denormalize($data, $options = [])
    {
        // validate date string
        // TODO: better date guesser
        $date = new DrupalDateTime($data);

        $return_date = $date->format($this::ONGEA_DATE_FORMAT);

        if(!empty($options)){
            switch($options){
                case 'Full Date': {
                    // tail is needed when updating mobility field type datetime
                    $return_date .= 'T00:00:00';
                }
                break;
            }
        }

        return $return_date;

    }

    /**
     * @param \Drupal\datetime\Plugin\Field\FieldType\DateTimeItem $field
     * @param array $options
     *
     * @return array|mixed
     */
    public function normalize($field, $options = [])
    {
        $options = array_merge($options, ['attributeName' => 'value']);
        $data = parent::normalize($field, $options);
        // validate date string
        // TODO: better date guesser
        $date = new DrupalDateTime($data);

        return $date->format($this::ONGEA_DATE_FORMAT);
    }

}