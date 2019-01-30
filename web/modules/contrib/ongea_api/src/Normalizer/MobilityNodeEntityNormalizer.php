<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

use Drupal\Core\Field\FieldItemList;
use Drupal\node\Entity\Node;
use Drupal\ongea_api\Entity\Project;
use Drupal\serialization\Normalizer\ContentEntityNormalizer;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\node\NodeInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Drupal\Core\Cache\CacheBackendInterface;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class MobilityNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{

    public function getAPIFields()
    {


        $dev_config = array(
          'field_ongea_particiption_fee' => 'participationFee',
          'field_ongea_parti_fee_cur' => 'participationFeeCurrency',
          'field_ongea_eugrantspeccur' => 'euGrantSpecialCurrency',
          'field_ongea_exceptional_costscur' => 'exceptionalCostsCurrency'

        );
        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }

    public function getScopeFields()
    {
        $parentConfig = parent::getScopeFields();
        $dev_config = array(
          'small' => [
            'id',
            'participant',

          ],

        );

        return array_merge(
          $parentConfig,
          $dev_config
        );

    }
    public function getContentType()
    {
        return 'ongea_mobility';
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

        if ($cache = \Drupal::cache()->get('ongea_mobility' . $entity->id() . $unique)) {
          $attributes = $cache->data;
        } else {  
          $attributes = parent::normalize($entity, $format, $context);
          $node = $entity->toArray();

          /*if (isset($node['field_ongea_motivation'][0]['value'])) {
          $db = \Drupal::database();
          $query = $db->select('node__field_ongea_motivation', 'm');
          $query->fields('m', array('field_ongea_motivation_value'))
                ->condition('m.entity_id', $entity->id());
          $result = $query->execute()->fetchAssoc();    
          }
          if (isset($node['field_ongea_motivation'][0]['value'])) {
          error_log((string)$result['field_ongea_motivation_value']);
          $attributes['motivation'] = (string)$result['field_ongea_motivation_value'];
          }*/
          $attributes['participantAgreement'] = empty($attributes['participantAgreement']) ? FALSE : TRUE;
          $attributes['participantSpecial'] = empty($attributes['participantSpecial']) ? FALSE : TRUE;
          $attributes['accompanyingPerson'] = empty($attributes['accompanyingPerson']) ? FALSE : TRUE;
          $attributes['groupLeader'] = empty($attributes['groupLeader']) ? FALSE : TRUE;
          $attributes['participantCouldntStay'] = empty($attributes['participantCouldntStay']) ? FALSE : TRUE;

          if (isset($node['field_ongea_eu_grant_special'][0]['value'])) {
            if ($node['field_ongea_eu_grant_special'][0]['value'] == 0) {
              $attributes['euGrantSpecial'] = '0';
            }
            else {
              $attributes['euGrantSpecial'] = $node['field_ongea_eu_grant_special'][0]['value'];
            }
          }
          if (isset($node['field_ongea_exceptional_costs'][0]['value'])) {
            if ($node['field_ongea_exceptional_costs'][0]['value'] == 0) {
              $attributes['exceptionalCosts'] = '0';
            }
            else {
              $attributes['exceptionalCosts'] = $node['field_ongea_exceptional_costs'][0]['value'];
            }
          }
          if (isset($node['field_ongea_how_many_days_count'][0]['value'])) {
            if ($node['field_ongea_how_many_days_count'][0]['value'] == 0) {
              $attributes['howManyDaysCount'] = '0';
            }
            else {
              $attributes['howManyDaysCount'] = $node['field_ongea_how_many_days_count'][0]['value'];
            }
          }
          if (isset($node['field_ongea_in_case_of_inter'][0]['value'])) {
            if ($node['field_ongea_in_case_of_inter'][0]['value'] == 0) {
              $attributes['inCaseOfInterruption'] = '0';
            }
            else {
              $attributes['inCaseOfInterruption'] = $node['field_ongea_in_case_of_inter'][0]['value'];
            }
          }
          if (isset($node['field_ongea_how_many_dayswithout'][0]['value'])) {
            if ($node['field_ongea_how_many_dayswithout'][0]['value'] == 0) {
              $attributes['howManyDaysWithoutFunding'] = '0';
            }
            else {
              $attributes['howManyDaysWithoutFunding'] = $node['field_ongea_how_many_dayswithout'][0]['value'];
            }
          }

          if (isset($node['field_ongea_from_country'][0]['value'])) {
            $attributes['fromCountry'] = $node['field_ongea_from_country'][0]['value'];
          }
          if (isset($node['field_ongea_to_country'][0]['value'])) {
            $attributes['toCountry'] = $node['field_ongea_to_country'][0]['value'];
          }
          /*if (isset($node['field_ongea_hear_about'][0]['value'])) {
            $attributes['hearAbout'] = $node['field_ongea_hear_about'][0]['value'];
          }*/
          $attributes['arrivalDate'] = NULL;
          $attributes['arrivalTime'] = NULL;
          if (isset($node['field_arrival'][0]['value'])) {
            $tmp = explode('T', $node['field_arrival'][0]['value']);
            $attributes['arrivalDate'] = $tmp[0];
            $attributes['arrivalTime'] = $tmp[1];
          }

          $attributes['departureDate'] = NULL;
          $attributes['departureTime'] = NULL;
          if (isset($node['field_departure'][0]['value'])) {
            $tmp = explode('T', $node['field_departure'][0]['value']);
            $attributes['departureDate'] = $tmp[0];
            $attributes['departureTime'] = $tmp[1];
          }

          $attributes['created'] = $node['created'][0]['value'];
          $attributes['manage'] = TRUE;

          $tags[] = 'node:' . $entity->id();
          foreach ($entity->get('field_ongea_mobility_events') as $ent) {
            $tags[] = 'node:' . $ent->entity->id();
          }
          foreach ($entity->get('field_ongea_mobility_places') as $ent) {
            $tags[] = 'node:' . $ent->toArray()['target_id'];
          }
          foreach ($entity->get('field_ongea_mobility_stays') as $ent) {
            $tags[] = 'node:' . $ent->toArray()['target_id'];
          }
          foreach ($entity->get('field_ongea_participant') as $ent) {
            $tags[] = 'node:' . $ent->entity->id();
          }
          foreach ($entity->get('field_ongea_sending_organisation') as $ent) {
            $tags[] = 'node:' . $ent->entity->id();
          }
          foreach ($entity->get('field_ongea_stays') as $ent) {
            $tags[] = 'node:' . $ent->entity->id();
          }
          foreach ($entity->get('field_ongea_travels') as $ent) {
            $tags[] = 'node:' . $ent->entity->id();
          }
          \Drupal::cache()->set('ongea_mobility' . $entity->id() . $unique, $attributes, CacheBackendInterface::CACHE_PERMANENT, array_unique($tags));
        }

        return $attributes;

    }
}