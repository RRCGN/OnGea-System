<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\PlaceNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\rest\ModifiedResourceResponse;

/**
 *
 * @RestResource(
 *   id = "places_collection_resource",
 *   label = @Translation("Ongea Place Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/places",
 *     "create" = "/api/v2/places"
 *   }
 *
 * )
 */
class PlacesCollectionResource extends CollectionResourceBase
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
          'resource' => 'places',
          'content' => 'ongea_place',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new PlaceNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()

        );
    }

    /**
     * @return ModifiedResourceResponse
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     */
    public function get()
    {
        $count = null;
        if (isset($this->currentRequest)) {
            $request = $this->currentRequest;
            $count = $request->query->get('count');

            $start = $request->query->get('start');
            $length = $request->query->get('length');
        }

        $nids = [];
        $param = \Drupal::request()->query->all();
        if (isset($param['activityId'])) {
            if ($this->hasGroupRole(['org_admin', 'activitie_admin', 'sender'])) {
                // only return events connected to this activity
                $db = \Drupal::database();
                $query = $db->select('node', 'n')
                            ->fields('n', array('nid'))
                            ->condition('n.type', 'ongea_place');
                $query->orderBy('n.nid', 'DESC');
                /*$query = $db->select('node__field_ongea_activity_places', 'p')            
                            ->fields('p', array('field_ongea_activity_places_target_id'));*/
                            //->condition('p.entity_id', $param['activityId']);
                if ($count != null && $count != false) {
                    $query = $query->range(0, $count);
                }
                $nids = $query->execute()->fetchCol();
            }
        }

        $controller = $this->nodeManager;
        $nodes = array_values($controller->loadMultiple($nids));

        // user has permissions?
        $response = new ModifiedResourceResponse($nodes, 200);

        return $response;
    }


}