<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\ProjectNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Drupal\rest\ModifiedResourceResponse;

/**
 *
 * @RestResource(
 *   id = "projects_collection_resource",
 *   label = @Translation("Ongea Project Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/projects",
 *     "create" = "/api/v2/projects"
 *   }
 *
 * )
 */
class ProjectsCollectionResource extends CollectionResourceBase
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
          'resource' => 'projects',
          'content' => 'ongea_project',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new ProjectNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()


        );
    }
    //
    //    /**
    //     * @return ModifiedResourceResponse
    //     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
    //     */
    //    public function get()
    //    {
    //
    //        $query = \Drupal::entityQuery('node')
    //            ->condition('type', $this->getNodeType());
    //        $nids = $query->execute();
    //        $controller = \Drupal::entityManager()->getStorage('node');
    //        //$nodes = array_values($controller->loadMultiple($nids));
    //        $nodes = $controller->loadMultiple($nids);
    //        // user has permissions?
    //
    //        $result = [];
    //
    ////        print_r(9);
    ////        print_r(10);
    ////        print_r(sizeof($nodes));
    ////        die();
    ////        foreach ($nodes as $node) {
    ////            /** @var ProjectEntityWrapper $projectWrapper */
    ////            $projectWrapper = ProjectEntityWrapper::start($node);
    ////            print_r(3);
    ////            $result[] = $node;
    ////            die();
    ////            if ($projectWrapper->hasAccess()) {
    ////                print_r(4);
    ////                $result[] = $node;
    ////                print_r(1);
    ////            }
    ////        }
    //
    //
    //        $response = new ModifiedResourceResponse(array_values($nodes), 200);
    //
    //        return $response;
    //    }


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
        $diff = [];

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
            $nids = $query->execute()->fetchCol();

            $param = \Drupal::request()->query->all();
            // Return project if project lists my org as connected
            $db = \Drupal::database();
            $query = $db->select('node__field_ongea_project_orgs', 'po')
                ->fields('po', array('entity_id'))
                ->condition('po.field_ongea_project_orgs_target_id', ongea_activity_group2org($_SESSION['ongea']['selected_group']));
            if ($count != null && $count != false) {
                $query = $query->range(0, $count);
            }
            $nids2 = $query->execute()->fetchCol();
            $just_activity_admin = $this->hasGroupRole(['activitie_admin']) && !$this->hasGroupRole(['org_admin']);
            $diff = $just_activity_admin ? array_unique(array_merge($nids2, $nids)) : array_diff($nids2, $nids);
            $nids = array_merge($nids, $nids2);
            $nids = array_unique($nids);
        }

        $controller = $this->nodeManager;
        $nodes = $controller->loadMultiple($nids);
        foreach ($diff as $i) {
            $nodes[$i]->readonly = TRUE;
        }
        $nodes = array_values($nodes);

        $new = false;
        if($this->hasGroupRole(['org_admin'])) {
            $new = true;
        }
        foreach($nodes as $n) {
            $n->new = $new;
        }

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
              "Can't create entity with an id")
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

        $this->addNodeTranslations($entity, [
            'title',
            'field_ongea_project_subtitle',
            'field_ongea_project_desc',
            'field__ongea_project_funding_txt'
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