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
        $attributes = parent::normalize($entity, $format, $context);
        $node = $entity->toArray();

        if (isset($node['field_ongea_from_country'][0]['value'])) {
          $attributes['fromCountry'] = $node['field_ongea_from_country'][0]['value'];
        }
        if (isset($node['field_ongea_to_country'][0]['value'])) {
          $attributes['toCountry'] = $node['field_ongea_to_country'][0]['value'];
        }

        return $attributes;

    }
}