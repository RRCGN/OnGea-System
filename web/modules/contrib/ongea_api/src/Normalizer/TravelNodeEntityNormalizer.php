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
use Drupal\Core\Cache\CacheBackendInterface;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class TravelNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{


    public function getContentType()
    {
        return 'ongea_travel';
    }

    /**
     * @param Node $entity
     * @param null $format
     * @param array $context
     *
     * @return array|\Symfony\Component\Serializer\Normalizer\scalar
     */
    public function normalize($entity, $format = null, array $context = [])
    {
      $unique = $format . (isset($_GET['scope']) ? $_GET['scope'] : '');
      /*
      \Drupal\Core\Cache\Cache::invalidateTags(array('node:5', 'my_tag'));
      $renderCache = \Drupal::service('cache.render');
      $renderCache->invalidateAll();
      \Drupal\Core\Entity\EntityInterface::getCacheTags();
      \Drupal\Core\Entity\EntityTypeInterface::getListCacheTags();
      */
      
      if ($cache = \Drupal::cache()->get('ongea_travel' . $entity->id() . $unique)) {
        $attributes = $cache->data;
      } else {
        $attributes = parent::normalize($entity, $format, $context);
        $tags[] = 'node:' . $entity->id();
        foreach ($entity->get('field_ongea_arrival_place') as $nodes) {
          $tags[] = 'node:' . $nodes->entity->id();
        }
        foreach ($entity->get('field_ongea_departure_existing') as $nodes) {
          $tags[] = 'node:' . $nodes->entity->id();
        }
        \Drupal::cache()->set('ongea_travel' . $entity->id() . $unique, $attributes, CacheBackendInterface::CACHE_PERMANENT, array_unique($tags));
      }

      return $attributes;

    }


}