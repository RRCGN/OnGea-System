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
class TravelNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{


    public function getContentType()
    {
        return 'ongea_travel';
    }


}