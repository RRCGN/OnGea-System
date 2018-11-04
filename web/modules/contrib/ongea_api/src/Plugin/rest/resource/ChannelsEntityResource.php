<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\ChannelNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;


/**
 *
 * @RestResource(
 *   id = "channels_entity_resource",
 *   label = @Translation("Ongea Channel Admin Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/channels/{id}",
 *     "create" = "/api/v2/channels/{id}"
 *   }
 *
 * )
 */
class ChannelsEntityResource extends EntityResourceBase
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
          'resource' => 'channels',
          'content' => 'ongea_channel',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new ChannelNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()


        );
    }

}