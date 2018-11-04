<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\ActivityFormNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 *
 * @RestResource(
 *   id = "activities_form_collection_resource",
 *   label = @Translation("Ongea Form Activities Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/activitiesform",
 *     "https://www.drupal.org/link-relations/create" = "/api/v2/activitiesform"
 *   }
 *
 * )
 */
class ActivitiesFormCollectionResource extends CollectionResourceBase
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