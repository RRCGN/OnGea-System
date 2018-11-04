<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

use Drupal\ongea_api\Entity\Project;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class OrganisationNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{

    public function getScopeFields()
    {
        $parentConfig = parent::getScopeFields();
        $dev_config = [
          'small' => [
            'id',
            'title',
            'subtitle',
            'acronym',
            'dateFrom',
            'dateTo',
          ],
        ];

        return array_merge(
          $parentConfig,
          $dev_config
        );

    }

    public function getAPIFields()
    {


        $dev_config = [
          'title' => 'title',
        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }

    public function getContentType()
    {
        return 'ongea_organisation';
    }
}
