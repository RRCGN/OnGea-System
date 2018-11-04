<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

use Drupal\node\Entity\Node;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class ActivityOrganisationNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{

    public function getScopeFields()
    {
        $parentConfig = parent::getScopeFields();
        $dev_config = [
          'small' => [
            'id',
            'title',
            'isHost',
            'organisation',
            'organisationRights',
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
          'field_ongea_ao_organisation' => [
            'type' => 'ongea_organisation',
            'single' => false,
            'fetch' => true,
            'normalizer' => 'ongea_api.organisation_node_entity',
            'scope' => 'small',
          ],
        ];

        return $dev_config;
    }


    public function getAPIFields()
    {

        $dev_config = [
          'field_ongea_ao_permission' => 'organisationRights',
          'field_ongea_is_host_organisation' => 'isHost',
          'field_ongea_ao_organisation' => 'organisation',

        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }

    public function getContentType()
    {
        return 'ongea_activity_organisation';
    }


    /**
     * @param array $data
     * @param null $format
     * @param array $context
     *
     * @return array|\Symfony\Component\Serializer\Normalizer\scalar
     */
    public function denormalize(
      $data,
      $class,
      $format = null,
      array $context = []
    ) {

        if (isset($data['id'])) {
            // remove organisation id
            $data['organisation']['id'] = $data['id'];
            unset($data['id']);
        }

        if (isset($data['aoid'])) {
            $data['id'] = $data['aoid'];
            unset($data['aoid']);
        }

        $attributes = parent::denormalize($data, $class, $format, $context);

        return $attributes;
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


        if (isset($attributes['organisation'])) {

            if (isset($attributes['organisation']['id'])) {
                $attributes['aoid'] = $attributes['id'];
                //$attributes['referenceId'] = $attributes['id'];
                $attributes['id'] = $attributes['organisation']['id'];

            }

            foreach ($attributes['organisation'] as $key => $attr) {
                $attributes[$key] = $attr;
            } // load org id
        } // load entity && org id
        unset($attributes['organisation']);


        return $attributes;

    }
}
