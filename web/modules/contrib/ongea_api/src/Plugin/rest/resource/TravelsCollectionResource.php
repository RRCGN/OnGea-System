<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\TravelNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\rest\ModifiedResourceResponse;

/**
 *
 * @RestResource(
 *   id = "travels_collection_resource",
 *   label = @Translation("Ongea Travel Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/travels",
 *     "create" = "/api/v2/travels"
 *   }
 *
 * )
 */
class TravelsCollectionResource extends CollectionResourceBase
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

        if ($this->hasGroupRole(['org_admin', 'activitie_admin', 'sender'])) {
            $db = \Drupal::database();
            $query = $db->select('group_content_field_data', 'gc');
            $query->join('node', 'n', 'n.nid = gc.entity_id');
            $query->fields('gc', array('entity_id'))
                ->condition('n.type', 'ongea_travel')
                ->condition('gc.gid', $_SESSION['ongea']['selected_group']);
            if ($count != null && $count != false) {
            $query = $query->range(0, $count);
            }
            $nids = $query->execute()->fetchCol();
        }

        //->range(0, 10);

        /*// DEBUG
        if (sizeof($nids) == 0) {
            \Drupal::logger('ongea_api')->notice('nothing in get ' . $this->getNodeType());
        }*/
        $controller = $this->nodeManager;
        $nodes = array_values($controller->loadMultiple($nids));



        // user has permissions?
        $response = new ModifiedResourceResponse($nodes, 200);

        return $response;
    }


}