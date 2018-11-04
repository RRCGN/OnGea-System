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
class PlaceNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{

    public function getContentType()
    {
        return 'ongea_place';
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

        ];

        return $dev_config;
    }

    public function getAPIFields()
    {
        $dev_config = [
          'nid' => 'id',
        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }

}
