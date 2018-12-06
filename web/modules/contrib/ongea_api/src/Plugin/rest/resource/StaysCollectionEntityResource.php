<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\StayNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\rest\ModifiedResourceResponse;


/**
 *
 * @RestResource(
 *   id = "stays_collection_entity_resource",
 *   label = @Translation("Ongea Stay Collection Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/stayscol",
 *     "create" = "/api/v2/stayscol"
 *   }
 *
 * )
 */
class StaysCollectionEntityResource extends CollectionResourceBase
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
          'resource' => 'stays',
          'content' => 'ongea_stay',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new StayNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()

        );
    }


    /**
     * @return ModifiedResourceResponse
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     */
    public function get()
    {
      $nodes = [];
      return new ModifiedResourceResponse($nodes, 200);
    }


    /**
     * Responds to entity POST requests and saves the new entity.
     *
     * @return \Drupal\rest\ModifiedResourceResponse
     */
    public function post($data)
    {

        if ($data == null || (is_array($data) && sizeof($data) == 0) && (is_array($data[0]) && sizeof($data[0]) == 0)) {
            throw new NoPostDataReceived();
        }

        if (isset($data[0]['id'])) {
            throw new BadRequestHttpException(
              t("Can't create a entity with an id.")
            );

        }
        $hasDependents = false;


        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        if (!$this->hasGroupRole(['org_admin', 'activitie_admin', 'sender'])) {
            throw new AccessDeniedHttpException(t('Content access denied.'));
        }

        /** @var Node $entity */
        $out = [];
        foreach ($data as $d) {
          $normalizedData = $this->normalizer->denormalize($d, null);

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
          $out[] = $entity;

          if (!$entity->validate()) {
              throw new BadRequestHttpException(t('Not valid.'));
          }
          $wrapper->save();
          //$entity->save();

          // create dependents
          if (isset($newDependendents)) {
              $wrapper->setDependents($newDependendents);
          }
        }

        return new ModifiedResourceResponse($out, 201); // 3. arg = headers

    }



}