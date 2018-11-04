<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 17.08.18
 * Time: 01:28
 */

namespace Drupa\ongea_api\Controller;


use Drupal\node\Entity\Node;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ActivityController extends NodeController implements ControllerInterface
{

    const CONTENT_TYPE_NAME = 'ongea_activity';

    const DEPENDENT_API_NORM_NAME = 'ongea_dependents';

    const SIGNUPFORM_API_NORM_NAME = 'signUpForm';


    /**
     * @param $data
     *
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function create($data)
    {
        if (isset($data[$this::DEPENDENT_API_NORM_NAME])) {
            $newDependendents = $data[$this::DEPENDENT_API_NORM_NAME];
            unset($data[$this::DEPENDENT_API_NORM_NAME]);
        }
        $hasSignupForm = false;
        if (isset($data[$this::SIGNUPFORM_API_NORM_NAME])) {
            $signupFormData = $data[$this::SIGNUPFORM_API_NORM_NAME];
            if ($signupFormData != false && is_array($signupFormData)) {
                $hasSignupForm = true;
            }

            unset($data[$this::SIGNUPFORM_API_NORM_NAME]);
        }

        $controller = $this->entityTypeManager->getStorage('node');

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
                            'No '.$this->types['resource'].' found',
                            ['@id' => $aoOrg['aoid'], '@data' => $data]
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
          $this::CONTENT_TYPE_NAME,
          $normalizedData
        );
        $entity = $wrapper->getEntity();

        if (!$entity->validate()) {
            throw new BadRequestHttpException(t('not valid'));
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
    }
}