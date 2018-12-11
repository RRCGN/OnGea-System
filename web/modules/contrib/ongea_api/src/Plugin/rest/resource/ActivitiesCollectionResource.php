<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\node\Entity\Node;
use Drupal\ongea_api\Normalizer\ActivityNodeEntityNormalizer;
use Drupal\rest\ModifiedResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 *
 * @RestResource(
 *   id = "activities_collection_resource",
 *   label = @Translation("Ongea Activities Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/activities",
 *     "https://www.drupal.org/link-relations/create" = "/api/v2/activities"
 *   }
 *
 * )
 */
class ActivitiesCollectionResource extends CollectionResourceBase
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


        $param = \Drupal::request()->query->all();
        if (isset($param['web'])) {
            $nids = [];
            $diff = [];
            // If in the selected group the user has the role of org or act
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
                $nids += $query->execute()->fetchCol();
            }
            if ($this->hasGroupRole(['sender'])) {
                $org_id = ongea_activity_group2org();
                $db = \Drupal::database();
                $query = $db->select('node__field_ongea_ao_organisation', 'o');
                $query->join('node__field_ongea_ao_organisations', 'a', 'o.entity_id = a.field_ongea_ao_organisations_target_id');
                $query
                    ->fields('a', array('entity_id'))
                    ->condition('o.field_ongea_ao_organisation_target_id', $org_id);
                if ($count != null && $count != false) {
                    $query = $query->range(0, $count);
                }
                $nids2 = $query->execute()->fetchCol();
                $diff = array_diff($nids2, $nids);
                $nids = array_merge($nids, $nids2);
    
            }
            $nids = array_unique($nids);
    
            $controller = $this->nodeManager;
            $nodes = $controller->loadMultiple($nids);
            foreach ($diff as $i) {
                $nodes[$i]->readonly = TRUE;
            }
            $nodes = array_values($nodes);
        }
        else {
            $nodes = [];
            $currentUser = \Drupal::service('current_user');

            $db = \Drupal::database();
            $query = $db->select('node__field_ongea_activity_mobilities', 'm');
            $query->distinct();
            $query->join('node__field_ongea_participant', 'p', 'm.field_ongea_activity_mobilities_target_id = p.entity_id');
            $query->join('node__field_ongea_participant_user', 'u', 'p.field_ongea_participant_target_id = u.entity_id');
            $query->join('node__field_ongea_participant_status', 's', 's.entity_id = m.field_ongea_activity_mobilities_target_id');
            $query->fields('m', array('entity_id'))
                  ->condition('u.field_ongea_participant_user_target_id', $currentUser->id())
                  ->condition('s.field_ongea_participant_status_target_id', 31); //approved in taxonomy ongea_participantstatus
            $results = $query->execute()->fetchCol();

            foreach ($results as $id) {
                //\Drupal\ongea_api\Plugin\rest\resource::get($activityId);

                $wrapper = $this->wrapperManager->load($id);
                $entity = $wrapper->getEntity();
                $entity_access = $entity->access('view', null, true);
                if (!$entity_access->isAllowed()) {
                    throw new AccessDeniedHttpException('Content access denied.');
                }
                if (!$entity) {
                    throw new NotFoundHttpException(
                    t('No @resource found.', ['@id' => $id, '@resource' => $this->types['resource']])
                    );
                }

                if ($entity->getType() != $this->getNodeType()) {
                    throw new BadRequestHttpException(t('Wrong datatype.'));
                }
                
                $nodes[] = $entity;
            }

        }
        $response = new ModifiedResourceResponse($nodes, 200);

        return $response;
    }


    /**
     * Responds to entity POST requests and saves the new entity.
     *
     * @return \Drupal\rest\ModifiedResourceResponse
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function post($data)
    {
        $debug = 0;
        if ($data === null) {
            throw new BadRequestHttpException(t('No data received.'));
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
        $hasSignupForm = false;
        if (isset($data['signUpForm'])) {
            $signupFormData = $data['signUpForm'];
            if ($signupFormData != false && is_array($signupFormData)) {
                $hasSignupForm = true;
            }

            unset($data['signUpForm']);
        }

        $controller = $this->entityManager->getStorage('node');

        if (isset($data['organisations'])) {
            $organisations = [];
            // create or find activity organisation
            foreach ($data['organisations'] as $aoOrg) {

                $ao = null;
                // ao exists?
                if (isset($aoOrg['aoid'])) {


                    /** @var Node $orginalEntity */
                    $ao = $controller->load($aoOrg['aoid']);

                    if (!$ao) {
                        throw new NotFoundHttpException(
                          t(
                            'No @resource found.',
                            ['@id' => $aoOrg['aoid'], '@data' => $data, '@resource' => $this->types['resource']]
                          )
                        );
                    }
                } else {
                    // create ao

                    $ao = Node::create(
                      [
                        'type' => 'ongea_activity_organisation',
                      ]
                    );

                }
                if ($ao != null) {
                    if (isset($aoOrg['isHost'])) {
                        $ao->set(
                          'field_ongea_is_host_organisation',
                          $aoOrg['isHost']
                        );
                    }

                    if (isset($aoOrg['organisationRights'])) {
                        $ao->set(
                          'field_field_ongea_ao_permission',
                          $aoOrg['organisationRights']
                        ); // term get term
                    }

                    if (isset($aoOrg['id'])) {
                        $ao->set('field_ongea_ao_organisation', $aoOrg['id']);
                    }

                    $ao->save();
                    $organisations[] = $ao->id();
                }


            }

            $normalizedData['field_ongea_ao_organisations'] = $organisations;

        }


        $wrapper = $this->wrapperManager->create(
          $this->types['content'],
          $normalizedData
        );
        $entity = $wrapper->getEntity();

        if (!$entity->validate()) {
            throw new BadRequestHttpException(t('Not valid.'));
        }

        //$entity->save();

        // create dependents
        if (isset($newDependendents)) {
            // 'activities', 'activityId'. 'ongea_project', projectId

            $wrapper->setDependents($newDependendents);
        }


        if ($debug) {
            $this->logger->notice('organisations');
        }
        if ($debug) {
            $this->logger->notice('after hydrate');
        }


        // is signupform set
        if ($hasSignupForm) {

            if ($debug) {
                $this->logger->notice('begin $hasSignupForm');
            }

            if ($signupFormData == false) {
                $normalizedData['field_ongea_online_sign_up'] = [];
                // empty signup form
            } else {
                $signupFormId = null;
                $container = \Drupal::getContainer();;

                $formNormalizer = $container->get(
                  'ongea_api.activity_form_node_entity'
                );
                $formDataDenormalized = $formNormalizer->denormalize(
                  $signupFormData,
                  null
                );

                //signupform exists load existing and update

                if (isset($signupFormData['id'])) {
                    $signupFormId = $signupFormData['id'];

                    /** @var \Drupal\node\Entity\Node $signupForm */
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

                    $wrapper->setField(
                      'field_ongea_online_sign_up',
                      $signupFormId
                    );
                } else {
                    $entity->setField('field_ongea_online_sign_up', []);
                }

            }
        }

        $wrapper->save();


        /** DEPENDENTS REFACTOR TO WRAPPER */
        // create dependents

        if (isset($newDependendents)) {
            // 'activities', 'activityId'. 'ongea_project', projectId


            foreach ($newDependendents as $newDependendentKey => $newDependendent) {

                if (is_array($newDependendent)) {
                    foreach ($newDependendent as $newDependentItem) {
                        $this->createDependent(
                          $newDependendentKey,
                          $newDependentItem['id'],
                          $this->getNodeType(),
                          $entity->id()
                        );
                    }
                } else {
                    $this->createDependent(
                      $newDependendentKey,
                      $newDependendent['id'],
                      $this->getNodeType(),
                      $entity->id()
                    );
                }

            }
        }

        /** DEPENDENTS END */

        return new ModifiedResourceResponse($entity, 201); // 3. arg = headers

    }

    protected function postFieldableReference(&$data)
    {
        if (isset($data['organisations'])) {
            $organisations = [];
            // create or find activity organisation
            foreach ($data['organisations'] as $aoOrg) {

                $ao = null;
                // ao exists?
                if (isset($aoOrg['aoid'])) {


                    /** @var Node $orginalEntity */
                    $ao = $controller->load($aoOrg['aoid']);

                    if (!$ao) {
                        throw new NotFoundHttpException(
                          t(
                            'No @resource found.',
                            ['@id' => $aoOrg['aoid'], '@data' => $data, '@resource' => $this->types['resource']]
                          )
                        );
                    }
                } else {
                    // create ao

                    $ao = Node::create(
                      [
                        'type' => 'ongea_activity_organisation',
                      ]
                    );

                }
                if ($ao != null) {
                    if (isset($aoOrg['isHost'])) {
                        $ao->set(
                          'field_ongea_is_host_organisation',
                          $aoOrg['isHost']
                        );
                    }

                    if (isset($aoOrg['organisationRights'])) {
                        $ao->set(
                          'field_field_ongea_ao_permission',
                          $aoOrg['organisationRights']
                        ); // term get term
                    }

                    if (isset($aoOrg['id'])) {
                        $ao->set('field_ongea_ao_organisation', $aoOrg['id']);
                    }

                    $ao->save();
                    $organisations[] = $ao->id();
                }


            }

            $normalizedData['field_ongea_ao_organisations'] = $organisations;

        }
    }


}