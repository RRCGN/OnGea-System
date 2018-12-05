<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 30.05.18
 * Time: 00:52
 */

namespace Drupal\ongea_api\Plugin\rest\resource;


use Drupal\Core\Session\AccountProxyInterface;
use Drupal\node\Entity\Node;
use Drupal\ongea_api\Normalizer\OngeaNodeEntityNormalizerInterface;
use Drupal\ongea_api\Plugin\rest\resource;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\rest\resource\EntityResourceValidationTrait;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\JsonResponse;

class EntityResourceBase extends OngeaNodeResource
{

    use EntityResourceValidationTrait;

    /**
     * Constructs a Drupal\rest\Plugin\ResourceBase object.
     *
     * @param array $configuration
     *   A configuration array containing information about the plugin instance.
     * @param string $plugin_id
     *   The plugin_id for the plugin instance.
     * @param mixed $plugin_definition
     *   The plugin implementation definition.
     * @param array $serializer_formats
     *   The available serialization formats.
     * @param \Psr\Log\LoggerInterface $logger
     *   A logger instance.
     * @param \Drupal\Core\Session\AccountProxyInterface $current_user
     *   A current user instance.
     *   The current request
     */
    public function __construct(
      array $configuration,
      $plugin_id,
      $plugin_definition,
      array $serializer_formats,
      LoggerInterface $logger,
      AccountProxyInterface $current_user,
      $types,
      OngeaNodeEntityNormalizerInterface $normalizer,
      Request $current_request
    ) {
        parent::__construct(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $serializer_formats,
          $logger,
          $current_user,
          $types,
          $normalizer,
          $current_request
        );
        $this->currentUser = $current_user;
        $this->types = $types;
        $this->entityManager = \Drupal::entityManager();
    }


    /**
     * @param $id
     *
     * @return ModifiedResourceResponse
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     */
    public function get($id)
    {
        if (!$id) {
            throw new BadRequestHttpException(t('Relevant data not provided.'));
        }
        $controller = $this->entityManager->getStorage('node');
        /** @var Node $entity */
        $wrapper = $this->wrapperManager->load($id);
        //$entity = $controller->load($id);
        $entity = $wrapper->getEntity();
        $entity_access = $entity->access('view', null, true);
        $group_access = $this->hasGroupRole(['org_admin', 'activitie_admin'], $entity);
        if (!$entity_access->isAllowed()) {
            throw new AccessDeniedHttpException('Content access denied.');
            //throw new CacheableAccessDeniedHttpException($entity_access, $entity_access->getReason() ?: $this->generateFallbackAccessDeniedMessage($entity, 'view'));
        }
        if (!$entity) {
            throw new NotFoundHttpException(
              t('No @resource found.', ['@id' => $id, '@resource' => $this->types['resource']])
            );
        }

        if ($entity->getType() != $this->getNodeType()) {
            throw new BadRequestHttpException(t('Wrong datatype.'));
        }
        $entity->manage = $group_access;

        // TODO: replace with ResourceResponse
        // Attention with Cached Data
        return new ModifiedResourceResponse($entity, 200);

    }

    public function post($id, $data)
    {
        return $this->patch($id, $data);
    }

    /**
     * @param $id
     * @param $data
     *
     * @return ModifiedResourceResponse
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function patch($id, $data)
    {

        if (!$id) {
            throw new BadRequestHttpException(t('Id not provided.'));
        }

        if (!$data) {
            throw new BadRequestHttpException(
              t('No @resource content received.', ['@resource' => $this->types['resource']])
            );
        }
        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }


        $wrapper = $this->wrapperManager->load($id);


        /** @var Node $orginalEntity */
        $orginalEntity = $wrapper->getEntity();

        if ($orginalEntity->bundle() != $this->types['content']) {
            throw new BadRequestHttpException(t('Wrong content type provided.'));
        }


        if (!$orginalEntity) {
            throw new NotFoundHttpException(
              t(
                'No @resource found.',
                [
                  '@id' => $id,
                  '@data' => $data, '@resource' => $this->types['resource']
                ]
              )
            );
        }

        if ($orginalEntity->bundle() != 'ongea_activity_signup_form') {
            $this->checkGroupAccess($orginalEntity, ['org_admin', 'activitie_admin', 'sender']);
        }

        $newEntity = $this->normalizer->denormalize($data, null);

        /**
         * TODO: refactor to own dependents normalizer
         */
        if (isset($newEntity['ongea_dependents'])) {
            $newDependendents = $newEntity['ongea_dependents'];
            unset($newEntity['ongea_dependents']);
        }


        if (isset($newEntity['field_ongea_project_activities'])) {

            unset($newEntity['field_ongea_project_activities']);
        }


        if ($orginalEntity->bundle() == 'ongea_participant') {
            $this->updateNodeTranslation($newEntity, $orginalEntity, ['field_ongea_about_me']);
        }
        $wrapper->update($newEntity);

        // TODO Update target entities if required

        $wrapper->validate($newEntity);
        $wrapper->save();

        if (isset($newDependendents)) {
            // 'activities', 'activityId'. 'ongea_project', projectId


            $wrapper->setDependents($newDependendents);

        }

        return new ModifiedResourceResponse($orginalEntity, 200, $data);
    }

    /**
     * @param $id
     * @param $data
     *
     * @return \Drupal\rest\ModifiedResourceResponse
     *
     * alias for patch
     */
    public function put($id, $data)
    {
        return $this->patch($id, $data);
    }

    /**
     * @param $id
     *
     * @return ModifiedResourceResponse
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function delete($id)
    {
        if (!$id) {
            throw new BadRequestHttpException(t('Relevant data not provided.'));
        }

        /** @var Node $entity */
        //$entity = \Drupal::entityTypeManager()->getStorage('node')->load($id);
        $wrapper = $this->wrapperManager->load($id);
        $entity = $wrapper->getEntity();
        if (!$entity) {
            throw new NotFoundHttpException(
              t('No @resource found.', ['@id' => $id, '@resource' => $this->types['resource']])
            );
        }

        if ($entity->getType() != $this->getNodeType()) {
            throw new BadRequestHttpException(t('Invalid entity type.'));
        }

        $this->checkGroupAccess($entity, ['org_admin', 'activitie_admin', 'sender']);


        try {
            $entity->delete();
            $response = [];
            //return new ModifiedResourceResponse(null, 200);
        } catch(Exception $e){
            $response = ['Node delete error'];
        }
        return new JsonResponse($response);

    }

    public function checkGroupAccess($orginalEntity, $roles) {
        if (\Drupal::currentUser()->id() == 1) {
            return TRUE;
        }
        if (!OngeaResourceBase::hasGroupRole($roles)) {
            throw new AccessDeniedHttpException(t('Content access denied.'));
        } else {
            // Check if this is a node in my group
            $db = \Drupal::database();
            $query = $db->select('node', 'n');
            $query->join('group_content_field_data', 'gc', 'gc.entity_id = n.nid');
            $query
                ->fields('n', array('nid'))
                ->condition('n.type', $orginalEntity->bundle())
                ->condition('gc.gid', $_SESSION['ongea']['selected_group'])
                ->condition('gc.type',  "%" . $db->escapeLike('group_content_type') . "%", 'LIKE');
            $nids = $query->execute()->fetchCol();
            // if not...
            if (empty($nids)) {
                // then if this is an org node
                if ($orginalEntity->bundle() == 'ongea_organisation') {
                    // check if my group is the creator
                    $db = \Drupal::database();
                    $query = $db->select('node__field_creator_gid', 'c')
                        ->fields('c', array('entity_id'))
                        ->condition('c.field_creator_gid_value', $_SESSION['ongea']['selected_group'])
                        ->condition('c.entity_id', $orginalEntity->id());
                    $nids = $query->execute()->fetchCol();
                    // let me through if it is
                    if (empty($nids)) {
                        throw new AccessDeniedHttpException(t('Content access denied.'));
                    }

                } else {
                    throw new AccessDeniedHttpException(t('Content access denied.'));
                }
            }
        }

    }
}
