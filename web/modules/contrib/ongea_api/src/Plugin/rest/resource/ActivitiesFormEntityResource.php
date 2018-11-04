<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\ActivityFormNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;


/**
 *
 * @RestResource(
 *   id = "activities_form_entity_resource",
 *   label = @Translation("Ongea Form Activities Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/activitiesform/{id}",
 *     "create" = "/api/v2/activitiesform/{id}"
 *   }
 *
 * )
 */
class ActivitiesFormEntityResource extends EntityResourceBase
{

    /**
     * {@inheritdoc}
     */
    public static function create(
      ContainerInterface $container,
      array $configuration,
      $plugin_id,
      $plugin_definition
    ) {
        $types = [
          'resource' => 'activitiesform',
          'content' => 'ongea_activity_signup_form',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new ActivityFormNodeEntityNormalizer(),
          $container->get('request_stack')->getCurrentRequest()
        );
    }


}