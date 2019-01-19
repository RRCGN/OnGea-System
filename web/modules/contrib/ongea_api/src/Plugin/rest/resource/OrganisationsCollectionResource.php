<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\OrganisationNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Drupal\rest\ModifiedResourceResponse;

/**
 *
 * @RestResource(
 *   id = "organisations_collection_resource",
 *   label = @Translation("Ongea Organisations Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/organisations",
 *     "create" = "/api/v2/organisations"
 *   }
 *
 * )
 */
class OrganisationsCollectionResource extends CollectionResourceBase
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
        $entityManager = \Drupal::entityManager();
        $types = [
          'resource' => 'organisations',
          'content' => 'ongea_organisation',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new OrganisationNodeEntityNormalizer($entityManager),
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
            // Give me all orgs connected to the activity
            $db = \Drupal::database();
            $query = $db->select('node__field_ongea_ao_organisations', 'a');
            $query->join('node__field_ongea_ao_organisation', 'o', 'o.entity_id = a.field_ongea_ao_organisations_target_id');
            $query
                ->fields('o', array('field_ongea_ao_organisation_target_id'))
                ->condition('a.entity_id', $param['activityId']);
            if ($count != null && $count != false) {
                $query = $query->range(0, $count);
            }
            $nids = $query->execute()->fetchCol();
            $controller = $this->nodeManager;
            $nodes = array_values($controller->loadMultiple($nids));
        } elseif (isset($param['activity'])) {
            if ($this->hasGroupRole(['org_admin', 'activitie_admin', 'sender'])) {
                $query = \Drupal::entityQuery('node')
                    ->condition('type', $this->getNodeType());
                if ($count != null && $count != false) {
                    $query = $query->range(0, $count);
                }
                $nids += $query->execute();
            }
            $controller = $this->nodeManager;
            $nodes = array_values($controller->loadMultiple($nids));
        } else {
            $mynids = [];
            $nids = [];
            // If in the selected group the user has the role of org or act
            if ($this->hasGroupRole(['org_admin', 'activitie_admin', ])) {
                $query = \Drupal::entityQuery('node')
                    ->condition('type', $this->getNodeType());
                if ($count != null && $count != false) {
                    $query = $query->range(0, $count);
                }
                $nids += $query->execute();

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
                $mynids = $query->execute()->fetchCol();
            }
            if($this->hasGroupRole(['sender'])) {
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

            $nids = array_unique($nids);
    
            $controller = $this->nodeManager;
            $nodes = $controller->loadMultiple($nids);
            if($this->hasGroupRole(['org_admin'])) {
                foreach ($mynids as $i) {
                    $nodes[$i]->manage = TRUE;
                }
            }
            $nodes = array_values($nodes);
        }
            $new = false;
            if($this->hasGroupRole(['org_admin'])) {
                $new = true;
            }
            foreach($nodes as $n) {
                $n->new = $new;
            }

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
              "Can't create entity with an id.")
            );

        }
        $hasDependents = false;


        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        if (!$this->hasGroupRole(['org_admin'])) {
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

        $this->addNodeTranslations($entity, ['field_ongea_about_us']);

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
