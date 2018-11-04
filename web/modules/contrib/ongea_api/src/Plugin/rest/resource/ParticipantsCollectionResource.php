<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\ParticipantNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\rest\ModifiedResourceResponse;

/**
 *
 * @RestResource(
 *   id = "participants_collection_resource",
 *   label = @Translation("Ongea Participant Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/participants",
 *     "create" = "/api/v2/participants"
 *   }
 *
 * )
 */
class ParticipantsCollectionResource extends CollectionResourceBase
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
          /*gr > org > ao > orgs > mob > profiles
          $org_id = ongea_activity_group2org();

          $db = \Drupal::database();
          $query1 = $db->select('node__field_ongea_ao_organisation', 'o');
          $query1->join('node__field_ongea_ao_organisations', 'a', 'a.field_ongea_ao_organisations_target_id = o.entity_id');
          $query1->fields('o', array('entity_id'))
                ->condition('o.field_ongea_ao_organisation_target_id', $org_id);

          $query2 = $db->select('node__field_ongea_ao_organisations', 'a2');
          $query2->join('node__field_ongea_ao_organisation', 'o2', 'a2.field_ongea_ao_organisations_target_id = o2.entity_id');
          $query2->join('node__field_ongea_sending_organisation', 'm', 'm.field_ongea_sending_organisation_target_id = o2.entity_id');
          $query2->join('node__field_ongea_participant', 'p', 'p.entity_id = m.entity_id');
          $query2
              ->fields('p', array('field_ongea_participant_target_id'))
              ->condition('a2.entity_id', $query1, 'IN');
        */
            $db = \Drupal::database();
            $query = $db->select('group_content_field_data', 'gc');
            $query->join('node', 'n', 'n.nid = gc.entity_id');
            $query->fields('gc', array('entity_id'))
                ->condition('n.type', 'ongea_participant')
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