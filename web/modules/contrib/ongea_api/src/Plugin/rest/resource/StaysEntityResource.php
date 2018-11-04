<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\StayNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;


/**
 *
 * @RestResource(
 *   id = "stays_entity_resource",
 *   label = @Translation("Ongea Stay Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/stays/{id}",
 *     "create" = "/api/v2/stays/{id}"
 *   }
 *
 * )
 */
class StaysEntityResource extends EntityResourceBase
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
          'resource' => 'stays',
          'content' => 'ongea_stay',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new StayNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()

        );
    }


}