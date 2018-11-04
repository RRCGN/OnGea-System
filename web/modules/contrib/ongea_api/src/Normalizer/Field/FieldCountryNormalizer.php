<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 03.08.18
 * Time: 23:45
 */

namespace Drupal\ongea_api\Normalizer\Field;

class FieldCountryNormalizer extends FieldValueNormalizer
{

    /**
     * @var array
     */
    protected $countries;

    public function __construct($em)
    {

        parent::__construct($em);

        $this->countries = \Drupal::service('country_manager')->getList();
    }

    public function denormalize($field, $options = [])
    {

        $result = $this->countryCodeGuesser($field);

        return $result;


        //return parent::denormalize($field, $options);
    }

    public function countryCodeGuesser($countryName)
    {
        $countries = $this->countries;

        // Sometimes a coutry code is passed instead
        if (strlen($countryName) == 2 && isset($countries[$countryName])) {
            return $countryName;            
        } else {
        
            $countryName = strtolower($countryName);
            foreach ($countries as $key => $value) {
                if (strtolower($value->__toString()) === $countryName) {
    
                    return $key;
                }
            }
        }

        return null;
    }

    public function normalize($field, $options = [])
    {


        $options = array_merge($options, ['attributeName' => 'value']);
        $value = parent::normalize($field, $options);


        if (isset($this->countries[$value])) {
            return $this->countries[$value];
        }


        return $value;
    }

}