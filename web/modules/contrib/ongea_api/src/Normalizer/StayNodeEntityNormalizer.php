<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class StayNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{

    public function getContentType()
    {
        return 'ongea_stay';
    }

    /**
     * @return array
     */
    public function getDependentsTypes()
    {
        return [
          'ongea_mobility' => 'mobilityIds',
          'ongea_event' => 'eventIds',
        ];
    }


    /**
     * @return array
     */
    public function getScopeFields()
    {
        $parentConfig = parent::getScopeFields();
        $dev_config = [
          'small' => [
            'id',
            'title',
            'dateFrom',
          ],
        ];

        return array_merge(
          $parentConfig,
          $dev_config
        );

    }

    public function getAPIReferences()
    {
        $dev_config = [
          'field_ongea_event' => [
            'type' => 'ongea_event',
            'single' => true,
            'fetch' => true,
            'normalizer' => 'ongea_api.event_node_entity',
            'scope' => 'small',
          ],

        ];

        return $dev_config;
    }

    public function getAPIFields()
    {


        $dev_config = [
          'field_ongea_event' => 'event',

        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }

}
