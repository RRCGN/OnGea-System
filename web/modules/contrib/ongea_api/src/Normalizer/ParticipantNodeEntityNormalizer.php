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
class ParticipantNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{

    public function getAPIFields()
    {


        $dev_config = [
          'field__ongea_participant_langs' => 'languages',
          'field_ongea_food_options' => 'iEat',
          'field_ongea_birthdate' => 'birthDate',

        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }

    public function getScopeFields()
    {
        $parentConfig = parent::getScopeFields();
        $dev_config = [
          'small' => [
            'id',
            'firstname',
            'lastname',
          ],
        ];

        return array_merge(
          $parentConfig,
          $dev_config
        );

    }

    public function getContentType()
    {
        return 'ongea_participant';
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
        //$attributes['date'] = date('Y-m-d H:i:s', $node['field_ongea_event_day_date'][0]['value']);
        //$attributes['domainAllAffiliates'] = $node['field_domain_all_affiliates'][0]['value'];

        if (isset($node['field_ongea_country'][0]['value'])) {
          $attributes['country'] = $node['field_ongea_country'][0]['value'];
        }
        if (isset($node['field_ongea_nationality'][0]['value'])) {
          $attributes['nationality'] = $node['field_ongea_nationality'][0]['value'];
        }

        return $attributes;

    }
}
