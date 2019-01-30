<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Field\FieldItemList;
use Drupal\node\Entity\Node;
use Drupal\ongea_api\Entity\Project;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Drupal\Core\Cache\CacheBackendInterface;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class EventNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{

    public function getAPIFields()
    {

        $dev_config = [
          'field_ongea_event_subtitle' => 'subtitle',
          'field_ongea_limit_particip' => 'limitParticipants',
          'field_ongea_event_days' => 'eventDays',
        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }

    public function getContentType()
    {
        return 'ongea_event';
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
        
        if ($cache = \Drupal::cache()->get('ongea_event' . $entity->id() . $unique)) {
          $attributes = $cache->data;
        } else {
  
          $attributes = parent::normalize($entity, $format, $context);
          $node = $entity->toArray();
          $gid = '';
          if (isset($attributes['eventDays']['gid'])) {
            $gid = $attributes['eventDays']['gid'];
          }
          elseif (isset($_SESSION['ongea']['selected_group'])) {
            $gid = $_SESSION['ongea']['selected_group'];
          }
          $eds = [];
          foreach ($node['field_ongea_event_days'] as $day) {
            $eventDay = \Drupal\node\Entity\Node::load($day['target_id']);
            $eventDay = $eventDay->toArray();
            $eds[] = [
              'id' => $eventDay['nid'][0]['value'],
              'gid' => $gid,
              'title' => $eventDay['title'][0]['value'],
              'date' => date('Y-m-d H:i:s', $eventDay['field_ongea_event_day_date'][0]['value']),
              'domainAllAffiliates' => 0
            ];
          }
          $attributes['eventDays'] = $eds;


          // Convert parallel event ids to int
          if (isset($attributes['parallelEvents'][0]['id'])) {
            $nids = [];
            foreach ($attributes['parallelEvents'] as $key => $ids) {
              $attributes['parallelEvents'][$key]['id'] = intval($ids['id']);
              $nids[] = intval($ids['id']);
            }


            // Get paralel events title and subtitle
            $db = \Drupal::database();
            $query = $db->select('node_field_data', 'd');
            $query->leftJoin('node__field_ongea_event_subtitle', 's', 's.entity_id = d.nid');
            $query->fields('d', array('nid', 'title'))
                  ->fields('s', array('field_ongea_event_subtitle_value'))
                  ->condition('d.nid', $nids, 'IN');
            $res = $query->execute();
            foreach ($res as $row) {
              $result[$row->nid] = $row;
            }
            foreach ($attributes['parallelEvents'] as $key => $ids) {
              $attributes['parallelEvents'][$key]['title'] = $result[$ids['id']]->title;
              $attributes['parallelEvents'][$key]['subtitle'] = $result[$ids['id']]->field_ongea_event_subtitle_value;
            }
          }

          // datetime to date & time
          $complexFields = [
            'field_ongea_start_date' => [
              'ongea_complex' => [
                'ongea_date_time_split' => [
                  'resultFields' => [
                    'date' => 'startDate',
                    'time' => 'startTime',
                  ],
                ],
              ],


            ],
          ];

          $attributes = array_merge(
            $attributes,
            $this->normalizeComplexField(
              $entity->get('field_ongea_start_date'),
              $format,
              array_merge(
                $context,
                [
                  'ongea_complex' => $complexFields['field_ongea_start_date']['ongea_complex'],
                ]
              )
            )
          );
          $attributes['id'] = intval($attributes['id']);

          $this->getNodeTranslations($attributes, $entity, [
            'title' => 'title',
            'field_ongea_event_subtitle' => 'subtitle',
            'field_ongea_event_description' => 'description'
          ]);


          $tags[] = 'node:' . $entity->id();
          foreach ($entity->get('field_ongea_event_days') as $nodes) {
            $tags[] = 'node:' . $nodes->entity->id();
          }
          foreach ($entity->get('field_ongea_parallel_events') as $nodes) {
            $tags[] = 'node:' . $nodes->toArray()['target_id'];
          }
          foreach ($entity->get('field_ongea_event_place') as $nodes) {
            $tags[] = 'node:' . $nodes->entity->id();
          }

          \Drupal::cache()->set('ongea_event' . $entity->id() . $unique, $attributes, CacheBackendInterface::CACHE_PERMANENT, array_unique($tags));
        }

        return $attributes;

    }

    /**
     * @param FieldItemList $field
     * @param null $format
     * @param array $context
     */
    public function normalizeComplexField(
      $field,
      $format = null,
      array $context = []
    ) {

        // TODO: refactor
        $attributes = [];
        $result = [];
        if (isset($context['ongea_complex'])) {
            foreach ($context['ongea_complex'] as $key => $complexField) {
                if ($key == 'ongea_date_time_split') {
                    $attributes = $this->complexFieldDateTimeSplit(
                      $field,
                      $complexField
                    );
                }
            }

        }

        return $attributes;
    }

    public function complexFieldDateTimeSplit($field, $complexOptions)
    {
        $attributes = [];
        $first = $field->first();
        if ($first != null && $first->date != null) {

            $startAndEndDate = $this->datetimeToDateAndTime($first->date);
            foreach ($complexOptions['resultFields'] as $resultFieldKey => $resultField) {
                if (isset($startAndEndDate[$resultFieldKey])) {
                    $attributes[$resultField] = $startAndEndDate[$resultFieldKey];
                }
            }
        }

        return $attributes;
    }

    /**
     * @param DrupalDateTime $datetime
     */
    public function datetimeToDateAndTime($datetime)
    {
        return [
          'date' => $datetime->format('Y-m-d'),
          'time' => $datetime->format('H:i'),
        ];
    }

}