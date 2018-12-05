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
      
      if ($cache = \Drupal::cache()->get('ongea_stay' . $entity->id() . $unique)) {
        $attributes = $cache->data;
      } else {
        $attributes = parent::normalize($entity, $format, $context);
        $tags[] = 'node:' . $entity->id();
        foreach ($entity->get('field_ongea_event') as $orgs) {
          $tags[] = 'node:' . $orgs->entity->id();
        }
        foreach ($entity->get('field_ongea_stay_event_day') as $orgs) {
          $tags[] = 'node:' . $orgs->entity->id();
        }

        $db = \Drupal::database();
        $query = $db->select('node__field_ongea_mobility_stays', 's')
            ->fields('s', array('entity_id'))
            ->condition('s.field_ongea_mobility_stays_target_id', $entity->id());
        $mob = $query->execute()->fetchField();

        if ($mob) {
          $attributes['mobilityIds'] = [['id' => $mob]];
        }

        \Drupal::cache()->set('ongea_stay' . $entity->id() . $unique, $attributes, CacheBackendInterface::CACHE_PERMANENT, array_unique($tags));
      }

      return $attributes;

    }

}
