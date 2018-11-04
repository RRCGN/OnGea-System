<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\EventNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Drupal\rest\ModifiedResourceResponse;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 *
 * @RestResource(
 *   id = "events_entity_resource",
 *   label = @Translation("Ongea Event Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/events/{id}",
 *     "create" = "/api/v2/events/{id}"
 *   }
 *
 * )
 */
class EventsEntityResource extends EntityResourceBase
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
          'resource' => 'event',
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
            throw new BadRequestHttpException(t(
              'No @resource content received.', ['@resource' => $this->types['resource']])
            );
        }
        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }


        $wrapper = $this->wrapperManager->load($id);


        /** @var Node $orginalEntity */
        $orginalEntity = $wrapper->getEntity();

        if ($orginalEntity->bundle() != $this->types['content']) {
            throw new BadRequestHttpException(t('Wrong content type provided'));
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

        $this->checkGroupAccess($orginalEntity, ['org_admin', 'activitie_admin']);

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

        $this->checkGroupAccess($entity, ['org_admin', 'activitie_admin']);


        try {
            $entity->delete();
            $response = [];
            //return new ModifiedResourceResponse(null, 200);
        } catch(Exception $e){
            $response = ['Node delete error'];
        }
        return new JsonResponse($response);

    }

}