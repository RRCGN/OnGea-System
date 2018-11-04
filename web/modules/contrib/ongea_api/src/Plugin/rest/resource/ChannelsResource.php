<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\entity_reference_integrity\EntityReferenceDependencyManager;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;

/**
 *
 * @RestResource(
 *   id = "ongea_channel_resource",
 *   label = @Translation("Ongea Channels Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/channel",
 *     "create" = "/api/v2/channel"
 *   }
 *
 * )
 */
class ChannelsResource extends ResourceBase
{

    /**
     * @return \Drupal\rest\ModifiedResourceResponse
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     */
    public function get()
    {


        // default channel test

        // actual channel
        $result = [];


        // get request

        // get hostname

        // get domain record


        $loader = \Drupal::service('domain.negotiator');
        /** @var \Drupal\domain\DomainInterface $activeDomain */
        $activeDomain = $loader->getActiveDomain();
        // get channel


        $query = \Drupal::entityQuery('node')
          //->condition('status', NODE_PUBLISHED)
          ->condition('type', 'ongea_channel')
          ->condition('field_ongea_channel_domain', $activeDomain->id());

        $nids = $query->execute();


        if ($nids != null && sizeof($nids) > 0) {
            $id = (int)array_pop($nids);
            $em = \Drupal::entityTypeManager();
            $nodeManager = $em->getStorage('node');


            $channel = $nodeManager->load($id);
            if ($channel) {
                $result = $channel;
            }


            /** @var EntityReferenceDependencyManager $dependencyManager */
            //$dependencyManager = $this->container->get('entity_reference_integrity.dependency_manager');
            // actual channel
            //or id channel
        }

        return new ModifiedResourceResponse($channel, 200);

    }

}