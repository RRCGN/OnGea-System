<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\MobilityNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 *
 * @RestResource(
 *   id = "mobilities_entity_resource",
 *   label = @Translation("Ongea Mobilities Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/mobilities/{id}",
 *     "create" = "/api/v2/mobilities/{id}"
 *   }
 *
 * )
 */
class MobilitiesEntityResource extends EntityResourceBase
{

    /**
     * {@inheritdoc}
     */
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
          'resource' => 'mobilities',
          'content' => 'ongea_mobility',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new MobilityNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()
        );
    }

}