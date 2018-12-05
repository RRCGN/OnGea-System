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

      if ($cache = \Drupal::cache()->get('ongea_organization' . $entity->id() . $unique)) {
        $attributes = $cache->data;
        $attributes['manage'] = !empty($entity->manage);
      } else {
        $attributes = parent::normalize($entity, $format, $context);
        \Drupal::cache()->set('ongea_organization' . $entity->id() . $unique, $attributes, CacheBackendInterface::CACHE_PERMANENT, array('node:' . $entity->id()));
      }

      return $attributes;

    }
}
