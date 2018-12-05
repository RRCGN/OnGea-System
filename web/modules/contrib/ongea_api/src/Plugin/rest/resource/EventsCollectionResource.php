<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\EventNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Drupal\rest\ModifiedResourceResponse;

/**
 *
 * @RestResource(
 *   id = "events_collection_resource",
 *   label = @Translation("Ongea Event Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/events",
 *     "create" = "/api/v2/events"
 *   }
 *
 * )
 */
class EventsCollectionResource extends CollectionResourceBase
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
          'resource' => 'events',
          'content' => 'ongea_event',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new EventNodeEntityNormalizer(\Drupal::entityManager()),
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
                $query = $db->select('node__field_ongea_activity_events', 'e')            
                            ->fields('e', array('field_ongea_activity_events_target_id'))
                            ->condition('e.entity_id', $param['activityId']);
                if ($count != null && $count != false) {
                    $query = $query->range(0, $count);
                }
                $nids = $query->execute()->fetchCol();
            }
        } else {
            if ($this->hasGroupRole(['org_admin', 'activitie_admin'])) {
                // only return nodes in my selected group
                $db = \Drupal::database();
                $query = $db->select('node', 'n');
                $query->join('group_content_field_data', 'gc', 'gc.entity_id = n.nid');
                $query
                    ->fields('n', array('nid'))
                    ->condition('n.type', $this->getNodeType())
                    ->condition('gc.gid', $_SESSION['ongea']['selected_group'])
                    ->condition('gc.type',  "%" . $db->escapeLike('group_content_type') . "%", 'LIKE');
                if ($count != null && $count != false) {
                    $query = $query->range(0, $count);
                }
                $nids2 = $query->execute()->fetchCol();
                $nids = array_merge($nids, $nids2);
            }
        }
/*
        if ($this->hasGroupRole(['sender'])) {

            $org_id = ongea_activity_group2org($_SESSION['ongea']['selected_group']);
            // rerurn events connected to the activity my org is connected to
            $db = \Drupal::database();
            $query = $db->select('field_ongea_ao_organisation', 'o');
            $query->join('node__field_ongea_ao_organisations', 'ao', 'o.entity_id = ao.field_ongea_ao_organisations_target_id');
            $query->join('node__field_ongea_activity_events', 'e', 'ao.entity_id = e.entity_id');
            $query
                ->fields('e', array('field_ongea_activity_events_target_id'))
                ->condition('o.field_ongea_ao_organisation_target_id', $org_id);
            if ($count != null && $count != false) {
                $query = $query->range(0, $count);
            }
            $nids2 = $query->execute()->fetchCol();
            $diff = array_diff($nids2, $nids);
            $nids = array_merge($nids, $nids2);
            $nids = array_unique($nids);
        }
*/
        

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


    /**
     * Responds to entity POST requests and saves the new entity.
     *
     * @return \Drupal\rest\ModifiedResourceResponse
     */
    public function post($data)
    {

        if ($data == null || (is_array($data) && sizeof($data) == 0)) {
            throw new NoPostDataReceived();
        }


        if (isset($data['id'])) {
            throw new BadRequestHttpException(t(
              "Can't create a entity with an id")
            );

        }
        $hasDependents = false;


        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        if (!$this->hasGroupRole(['org_admin', 'activitie_admin'])) {
            throw new AccessDeniedHttpException(t('Content access denied.'));
        }

        /** @var Node $entity */
        $normalizedData = $this->normalizer->denormalize($data, null);

        if (isset($normalizedData['ongea_dependents'])) {
            $newDependendents = $normalizedData['ongea_dependents'];
            unset($normalizedData['ongea_dependents']);
        }

        $wrapper = $this->wrapperManager->create(
          $this->types['content'],
          $normalizedData
        );
        //$entity = $this->normalizer->hydrate($normalizedData);
        $entity = $wrapper->getEntity();

        if (!$entity->validate()) {
            throw new BadRequestHttpException(t('Not valid.'));
        }

        $this->addNodeTranslations($entity, [
            'title',
            'field_ongea_event_subtitle',
            'field_ongea_event_description'
        ]);
        $wrapper->save();
        //$entity->save();

        // create dependents
        if (isset($newDependendents)) {
            // 'activities', 'activityId'. 'ongea_project', projectId

            $wrapper->setDependents($newDependendents);
        }

        return new ModifiedResourceResponse($entity, 201); // 3. arg = headers

    }


}