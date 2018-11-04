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

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class EventDayNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{

    public function getAPIFields()
    {

        $dev_config = [
          'title' => 'title',
          'field_ongea_event_day_date' => 'date',
          'field_domain_all_affiliates' => 'domainAllAffiliates',
        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }

    public function getContentType()
    {
        return 'ongea_event_days';
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
        $attributes = parent::normalize($entity, $format, $context);
        $node = $entity->toArray();
        $attributes['title'] = $node['title'][0]['value'];
        $attributes['date'] = date('Y-m-d H:i:s', $node['field_ongea_event_day_date'][0]['value']);
        $attributes['domainAllAffiliates'] = $node['field_domain_all_affiliates'][0]['value'];

        return $attributes;

    }

}