<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\TravelNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;


/**
 *
 * @RestResource(
 *   id = "travels_entity_resource",
 *   label = @Translation("Ongea Travel Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/travels/{id}",
 *     "create" = "/api/v2/travels/{id}"
 *   }
 *
 * )
 */
class TravelsEntityResource extends EntityResourceBase
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
          'resource' => 'travels',
          'content' => 'ongea_travel',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new TravelNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()


        );
    }

}