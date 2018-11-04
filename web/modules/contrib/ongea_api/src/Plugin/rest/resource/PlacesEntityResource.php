<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\PlaceNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 *
 * @RestResource(
 *   id = "places_entity_resource",
 *   label = @Translation("Ongea Place Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/places/{id}",
 *     "create" = "/api/v2/places/{id}"
 *   }
 *
 * )
 */
class PlacesEntityResource extends EntityResourceBase
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