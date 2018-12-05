<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Drupal\Core\Cache\CacheBackendInterface;

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
      
      if ($cache = \Drupal::cache()->get('ongea_place' . $entity->id() . $unique)) {
        $attributes = $cache->data;
      } else {
        $attributes = parent::normalize($entity, $format, $context);
        $tags[] = 'node:' . $entity->id();
        \Drupal::cache()->set('ongea_place' . $entity->id() . $unique, $attributes, CacheBackendInterface::CACHE_PERMANENT, $tags);
      }

      return $attributes;

    }

}
