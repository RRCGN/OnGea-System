<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\Core\Entity\EntityStorageException;
use Drupal\node\Entity\Node;
use Drupal\ongea_api\Exception\CannotBeNullException;
use Drupal\ongea_api\Normalizer\MobilityNodeEntityNormalizer;
use Drupal\rest\ModifiedResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 *
 * @RestResource(
 *   id = "mobilities_collection_resource",
 *   label = @Translation("Ongea Mobilities Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/mobilities",
 *     "create" = "/api/v2/mobilities"
 *   }
 *
 * )
 */
class MobilitiesCollectionResource extends CollectionResourceBase
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
          'resource' => 'mobilities',
          'content' => 'ongea_mobility',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new MobilityNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()

        );
    }

    /**
     * @return ModifiedResourceResponse
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     */
    public function get()
    {

        // get filter

        $request = $this->currentRequest;
        $activityId = $request->query->get('activityId');

        if ($activityId != null) {
            if ($this->hasGroupRole(['org_admin', 'activitie_admin'])) {
                // Get own + connected
                $this->getReferencedByEntity($activityId);
            }
            elseif ($this->hasGroupRole(['sender'])) {
                // Get own
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

                $controller = $this->entityManager->getStorage('node');
                $nodes = array_values($controller->loadMultiple($nids));

                $response = new ModifiedResourceResponse($nodes, 200);

                return $response;
            }
        }
/*
        $query = \Drupal::entityQuery('node')
          ->condition('type', $this->getNodeType());
        $nids = $query->execute();
        $controller = $this->entityManager->getStorage('node');
        $nodes = array_values($controller->loadMultiple($nids));

        $response = new ModifiedResourceResponse($nodes, 200);

        return $response;*/
    }



    /**
     * Responds to entity POST requests and saves the new entity.
     *
     * @return \Drupal\rest\ModifiedResourceResponse
     */
    public function post($data)
    {
        if ($data === null || (is_array($data) && sizeof($data) === 0)) {
            throw new BadRequestHttpException(t('No data received.'));
        }


        if (isset($data['id'])) {
            throw new BadRequestHttpException(t(
              "Can't create entity with an id")
            );

        }

        $activityId = null;
        if (isset($data['activityId'])) {

            $activityId = $data['activityId'];
            unset($data['activityId']);
        }
        $hasDependents = false;


        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        if (!$this->hasGroupRole(['org_admin', 'activitie_admin', 'sender'])) {
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

        /* Set mobility owner to participant user */
        $participant = Node::load($normalizedData['field_ongea_participant']['target_id']);
        $participant = $participant->get('field_ongea_participant_user')->target_id;

        try {
        $wrapper->save();
        } catch (EntityStorageException $e) {

            throw new CannotBeNullException($e);
        }
        //$entity->save();

        if($activityId != null) {

            $activity = Node::load($activityId);

            if ($activity->bundle() != 'ongea_activity') {
                throw new BadRequestHttpException(t('Wrong activtiy ID.'));
            }
            $activity->field_ongea_activity_mobilities[] = ['target_id' => $wrapper->getId()];

            try {
                $activity->save();
            } catch (EntityStorageException $e) {
            }

        }
        // create dependents
        if (isset($newDependendents)) {
            // 'activities', 'activityId'. 'ongea_project', projectId

            $wrapper->setDependents($newDependendents);
        }

        return new ModifiedResourceResponse($entity, 201); // 3. arg = headers

    }

    public function getReferencedByEntity($entityId)
    {
        $wrapper = $this->wrapperManager->load($entityId);
        if (!$wrapper->isContentType('ongea_activity')) {
            throw new BadRequestHttpException(t('Wrong content type.'));
        }
        $nodes = $wrapper->getMobiltityEntities();
        $response = new ModifiedResourceResponse($nodes, 200);

        return $response;
    }

}
