<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\ParticipantNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 *
 * @RestResource(
 *   id = "participants_entity_resource",
 *   label = @Translation("Ongea Participant Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/participants/{id}",
 *     "create" = "/api/v2/participants/{id}"
 *   }
 *
 * )
 */
class ParticipantsEntityResource extends EntityResourceBase
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
          'resource' => 'participants',
          'content' => 'ongea_participant',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new ParticipantNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()


        );
    }


}