<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\EventDayNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 *
 * @RestResource(
 *   id = "eventdays_collection_resource",
 *   label = @Translation("Ongea EventDays Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/eventdays",
 *     "create" = "/api/v2/eventdays"
 *   }
 *
 * )
 */
class EventDaysCollectionResource extends CollectionResourceBase
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
          'resource' => 'event_days',
          'content' => 'ongea_event_days',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new EventDayNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()
        );
    }


}   