<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class ActivityFormNodeEntityNormalizer extends OngeaNodeEntityNormalizer
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
          'field_ongea_signup_emphone' => 'signupEmergencyPhone',
          'field_ongea_signup_emergcon' => 'signupEmergencyContact',

        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }


    public function getContentType()
    {
        return 'ongea_activity_signup_form';
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

        if (empty($attributes['whoCanSee'])) {
            $attributes['whoCanSee'] = NULL;
        }
        if ($attributes['assigningOrgs'] == 'off') {
            $attributes['assigningOrgs'] = NULL;
        }

        $attributes['signupSkills'] = $node['field_ongea_signup_skills'][0]['value'];

        return $attributes;

    }
}
