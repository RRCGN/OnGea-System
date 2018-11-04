<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

use Drupal\node\Entity\Node;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class ActivityNodeEntityNormalizer extends OngeaNodeEntityNormalizer
{

    protected $container;

    /**
     * ActivityNodeEntityNormalizer constructor.
     */
    public function __construct()
    {
        $this->container = \Drupal::getContainer();
        parent::__construct(\Drupal::entityManager());
    }

    public function getScopeFields()
    {
        $parentConfig = parent::getScopeFields();
        $dev_config = [
          'small' => [
            'id',
            'title',
            'subtitle',
            'dateFrom',
            'dateTo',
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
          'field_ongea_project' => [
            'type' => 'ongea_project',
            'single' => true,
            'fetch' => true,
            'normalizer' => 'ongea_api.project_node_entity',
            'scope' => 'small',
          ],
          'field_ongea_online_sign_up' => [
            'type' => 'ongea_activity_signup_form',
            'single' => true,
            'fetch' => true,
            'normalizer' => 'ongea_api.activity_form_node_entity',
            'scope' => 'small',
          ],
          'field_ongea_ao_organisations' => [
            'type' => 'ongea_activity_organisation',
            'single' => false,
            'fetch' => true,
            'normalizer' => 'ongea_api.activity_organisation_node_entity',
            'scope' => 'small',
          ],
          'field_ongea_activity_mobilities' => [
            'type' => 'ongea_mobility',
            'single' => false,
            'fetch' => true,
            'normalizer' => 'ongea_api.mobility_node_entity',
            'scope' => 'small',
          ],
          'field_ongea_activity_places' => [
            'type' => 'ongea_place',
            'single' => false,
            'fetch' => true,
            'normalizer' => 'ongea_api.place_node_entity',
            'scope' => 'small',
          ],
        ];

        return $dev_config;
    }

    public function getAPIFields()
    {


        $dev_config = [
          'field_ongea_activity_places' => 'places',
          'field_ongea_activity_mobilities' => 'mobilities',
          'field_ongea_org_rights' => 'organisationRights',
          'field_ongea_description' => 'description',
          'field_ongea_project' => 'project',
          'field_ongea_sending_org' => 'sendingOrganisations',
          'field_ongea_ao_organisations' => 'organisations',
          'field_ongea_part_fee_red_active' => 'participationFeeReducedActive',

        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }


    public function getContentType()
    {
        return 'ongea_activity';
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
        //  $fieldMap = $container->get('entity_reference_integrity.field_map');
        //  $normalizer = EntityReferenceIntegrityEntityHandler()
        $attributes = parent::normalize($entity, $format, $context);
        if (isset($attributes['signUpForm']) && $attributes['signUpForm'] == null) {
            $attributes['signUpForm'] = false;
        }
        $attributes['manage'] = !empty($entity->manage);
//print_r(($attributes['organisations'][0]['organisationRights']));die();
        return $attributes;

    }
}
