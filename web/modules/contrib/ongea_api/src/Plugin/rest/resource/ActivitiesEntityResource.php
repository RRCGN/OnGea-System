<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\ongea_api\Normalizer\ActivityNodeEntityNormalizer;
use Drupal\ongea_api\Normalizer\ActivityOrganisationNodeEntityNormalizer;
use Drupal\rest\ModifiedResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\JsonResponse;


/**
 *
 * @RestResource(
 *   id = "activities_entity_resource",
 *   label = @Translation("Ongea Activities Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/activities/{id}",
 *     "create" = "/api/v2/activities/{id}"
 *   }
 *
 * )
 */
class ActivitiesEntityResource extends EntityResourceBase
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
          'resource' => 'activities',
          'content' => 'ongea_activity',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new ActivityNodeEntityNormalizer(\Drupal::entityManager()),
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
            throw new BadRequestHttpException(
              t('No @resource content received.', ['@resource' => $this->types['resource']])
            );
        }
        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        $controller = $this->entityManager->getStorage('node');

        /** @var Node $orginalEntity */
        $orginalEntity = $controller->load($id);

        if (!$orginalEntity) {
            throw new NotFoundHttpException(
              t(
                'No @resource found.',
                ['@id' => $id, '@data' => $data, '@resource' => $this->types['resource']]
              )
            );
        }
        // Check if in my group
        $this->checkIfInMyGroup($orginalEntity);
        // end check
        $this->checkGroupAccess($orginalEntity, ['org_admin', 'activitie_admin']);

        $hasSignupForm = false;
        if (isset($data['signUpForm'])) {
            $signupFormData = $data['signUpForm'];
            $hasSignupForm = true;

            unset($data['signUpForm']);

        }

        $newEntity = $this->normalizer->denormalize($data, null);

        // Reset editedBy if editing is finished
        $editedBy = $orginalEntity->get('field_iseditedby')->value;
        $same = FALSE;
        if (!empty($editedBy)) {
            $editedByUid = explode(',', $editedBy)[0];
            $same = $editedByUid == \Drupal::currentUser()->id();
        }
        if ($_SERVER['REQUEST_METHOD'] == 'PUT' && isset($data['isEditedBy']) && $data['isEditedBy'] === "0" && $same) {
            $newEntity['field_iseditedby'] = [];
        }

        if (isset($newEntity['ongea_dependents'])) {
            $newDependendents = $newEntity['ongea_dependents'];
            unset($newEntity['ongea_dependents']);
        }


        if (isset($newEntity['field_ongea_project_activities'])) {

            //$newDependendents = $newEntity['field_ongea_project_activities'];
            unset($newEntity['field_ongea_project_activities']);
        }

        // is signupform set
        if ($hasSignupForm) {


            if ($signupFormData == false) {
                $newEntity['field_ongea_online_sign_up'] = [];
                // empty signup form
            } else {
                $signupFormId = null;
                $container = \Drupal::getContainer();

                $formNormalizer = $container->get(
                  'ongea_api.activity_form_node_entity'
                );
                $formDataDenormalized = $formNormalizer->denormalize(
                  $signupFormData,
                  null
                );

                if (isset($signupFormData['id'])) {
                    $signupFormId = $signupFormData['id'];
                    //signupform exists load existing and update
                    $signupForm = $controller->load($signupFormId);

                    unset($signupFormData['id']);
                    foreach ($formDataDenormalized as $signupFormKey => $signupFormField) {
                        $signupForm->set($signupFormKey, $signupFormField);
                    }
                    $signupForm->save();
                    //TODO: check if is signupform


                } else {
                    // create new signup form
                    $signupForm = Node::create(
                      array_merge(
                        $formDataDenormalized,
                        [
                          'type' => 'ongea_activity_signup_form',
                        ]
                      )
                    );

                    $signupForm->save();
                    $signupFormId = $signupForm->id();

                }

                if ($signupFormId != null) {
                    $newEntity['field_ongea_online_sign_up'] = $signupFormId;
                } else {
                    $newEntity['field_ongea_online_sign_up'] = [];
                }

            }
        }
        $aoContentType = 'ongea_activity_organisation';
        $aoField = 'organisations';
        $aoNormalizer = new ActivityOrganisationNodeEntityNormalizer(
          $this->entityManager
        );
        if (isset($data[$aoField])) {

            $organisations = [];
            // create or find activity organisation

            foreach ($data[$aoField] as $aoOrg) {
                $normalizedAoData = $aoNormalizer->denormalize(
                  $aoOrg,
                  null
                );
                $aoWrapper = null;


                $ao = null;
                // ao exists?
                if (isset($normalizedAoData['nid'])) {
                    $aoId = $normalizedAoData['nid'];
                    /** @var NodeInterface $ao */
                    $aoWrapper = $this->wrapperManager->load($aoId);


                    if (!$aoWrapper->getEntity()) {
                        throw new NotFoundHttpException(
                          t(
                            'No @resource found.',
                            ['@id' => $aoId, '@data' => $data, '@resource' => $this->types['resource']]
                          )
                        );
                    }

                    if (!$this->nodeIsContentType(
                      $aoWrapper->getEntity(),
                      $aoContentType
                    )) {
                        throw new NotFoundHttpException(
                          t(
                            'No @resource found.',
                            ['@id' => $aoId, '@data' => $data, '@resource' => $this->types['resource']]
                          ) . ' '. t('Wrong content type.')
                        );
                    }
                } else {
                    // create ao
                    $aoWrapper = $this->wrapperManager->create($aoContentType);
                }
                if ($aoWrapper != null) {


                    $aoWrapper->update($normalizedAoData);

                    $aoWrapper->save();

                    $organisations[] = $aoWrapper->getId();
                }


            }

            $newEntity['field_ongea_ao_organisations'] = $organisations;

        }


        $activityWrapper = $this->wrapperManager->start($orginalEntity);


        $this->updateNodeTranslation($newEntity, $orginalEntity, [
            'title',
            'field_ongea_subtitle',
            'field_ongea_description',
            'field_ongea_eligible_reduction'
        ]);
        $activityWrapper->update($newEntity);


        // TODO Update target entities if required

        if (!$orginalEntity->validate()) {
            throw new BadRequestHttpException(t('Not valid.'));

        }

        $activityWrapper->save();

        //$orginalEntity->save();

        if (isset($newDependendents)) {
            // 'activities', 'activityId'. 'ongea_project', projectId


            foreach ($newDependendents as $newDependendentKey => $newDependendent) {

                if (is_array($newDependendent)) {
                    foreach ($newDependendent as $newDependentItem) {
                        $this->createDependent(
                          $newDependendentKey,
                          $newDependentItem['id'],
                          $this->getNodeType(),
                          $activityWrapper->getId()
                        );
                    }
                } else {
                    $this->createDependent(
                      $newDependendentKey,
                      $newDependendent['id'],
                      $this->getNodeType(),
                      $activityWrapper->getId()
                    );
                }

            }
        }
        $response = [
          'success' => 'patch ok',
        ];

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

        $this->checkIfInMyGroup($entity);
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

    function checkIfInMyGroup($orginalEntity) {

        if (\Drupal::currentUser()->id() == 1) {
            return TRUE;
        }

        $db = \Drupal::database();
        $query = $db->select('group_content_field_data', 'g')
                ->fields('g', array('entity_id'))
                ->condition('g.gid', $_SESSION['ongea']['selected_group'])
                ->condition('g.entity_id', $orginalEntity->id());
        $results = $query->execute()->fetchCol();
        if (empty($results)) {
            throw new AccessDeniedHttpException();
            return;
        }
    }

}