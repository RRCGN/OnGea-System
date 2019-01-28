<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 19.07.18
 * Time: 17:11
 */

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Core\Config\ConfigException;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\node\Entity\Node;
use Drupal\ongea_api\EntityWrapper\OngeaEntityWrapperManager;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\user\Entity\User;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 *
 * @RestResource(
 *   id = "ongea_signup_form_resource",
 *   label = @Translation("Ongea Signup Form Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/signup/{id}",
 *     "create" = "/api/v2/signup/{id}"
 *   }
 *
 * )
 */
class SignupResource extends ResourceBase
{

    protected $settings;


    /**
     * @param $id
     *
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     */
    public function get($id)
    {
        if (!$id) {
            throw new BadRequestHttpException(t('Id not provided.'));
        }
        $em = \Drupal::entityTypeManager();

        // load user or anonymous user

        // load activity

        $config = \Drupal::config(
          'ongea_api.ongea_activity_signup_form.settings'
        );
        $configFields = $config->get('fields');
        if ($config == null || $configFields == null) {
            throw new ConfigException('config signupform not found');
        }
        /** @var Node $activity */
        $activity = $em->getStorage('node')->load($id);

        if (!$activity || $activity->bundle() != 'ongea_activity') {
            throw new NotFoundHttpException('Activity not found.');
        }
        // load signup form
        $signupFormFieldList = $activity->get('field_ongea_online_sign_up')
          ->getValue();

        if (isset($signupFormFieldList[0]) && isset($signupFormFieldList[0]['target_id'])) {
            /** @var \Drupal\node\NodeInterface $signupForm */
            $signupForm = $em->getStorage('node')->load(
              $signupFormFieldList[0]['target_id']
            );
            // build the form
            $who = $signupForm->get('field_ongea_who_can_see_and_fill')->entity->name->value;
            $isActive = $signupForm->get('field_ongea_signup_isactive')->value;
            $form = [];

            $dataFields['signupNickname'] = ['groupLabel' => 'basic_information', 'label' => (string) $this->t('Artist name / nick name'), 'order' => 'A_3', 'type' => 'string'];
            $dataFields['signupGender'] = ['groupLabel' => 'basic_information', 'label' => (string) $this->t('Gender'), 'order' => 'A_4', 'type' => 'ongea_gender'];
            $dataFields['signupBirthday'] = ['groupLabel' => 'basic_information', 'label' => (string) $this->t('Birth date'), 'order' => 'A_5', 'type' => 'date'];
            $dataFields['signupStreet'] = ['groupLabel' => 'address', 'label' => (string) $this->t('Street address'), 'order' => 'B_1', 'type' => 'string'];
            $dataFields['signupPostcode'] = ['groupLabel' => 'address', 'label' => (string) $this->t('Postal code'), 'order' => 'B_2', 'type' => 'string'];
            $dataFields['signupTown'] = ['groupLabel' => 'address', 'label' => (string) $this->t('City'), 'order' => 'B_3', 'type' => 'string'];
            $dataFields['signupRegion'] = ['groupLabel' => 'address', 'label' => (string) $this->t('Region'), 'order' => 'B_4', 'type' => 'string'];
            $dataFields['signupCountry'] = ['groupLabel' => 'address', 'label' => (string) $this->t('Country'), 'order' => 'B_5', 'type' => 'ongea_country'];
            $dataFields['signupPhone'] = ['groupLabel' => 'contact_data', 'label' => (string) $this->t('Phone'), 'order' => 'C_1', 'type' => 'phone'];
            $dataFields['signupWebsite'] = ['groupLabel' => 'contact_data', 'label' => (string) $this->t('Website'), 'order' => 'C_3', 'type' => 'url'];
            $dataFields['signupEmergencyContact'] = ['groupLabel' => 'emergency_contact', 'label' => (string) $this->t('Emergency contact name'), 'order' => 'D_1', 'type' => 'string'];
            $dataFields['signupEmergencyPhone'] = ['groupLabel' => 'emergency_contact', 'label' => (string) $this->t('Emergency contact phone number (mobile)'), 'order' => 'D_2', 'type' => 'phone'];
            $dataFields['signupPassId'] = ['groupLabel' => 'passport_data', 'label' => (string) $this->t('ID document number'), 'order' => 'E_1', 'type' => 'string'];
            $dataFields['signupIsPassport'] = ['groupLabel' => 'passport_data', 'label' => (string) $this->t('ID document is a passport'), 'order' => 'E_2', 'type' => 'boolean'];
            $dataFields['signupIssuedOn'] = ['groupLabel' => 'passport_data', 'label' => (string) $this->t('Issued on'), 'order' => 'E_3', 'type' => 'date-m'];
            $dataFields['signupExpiresOn'] = ['groupLabel' => 'passport_data', 'label' => (string) $this->t('Expires on'), 'order' => 'E_4', 'type' => 'date-m'];
            $dataFields['signupNationality'] = ['groupLabel' => 'passport_data', 'label' => (string) $this->t('Nationality'), 'order' => 'E_5', 'type' => 'ongea_country'];
            $dataFields['signupAboutme'] = ['groupLabel' => 'about_me', 'label' => (string) $this->t('about_me'), 'order' => 'F_1', 'type' => 'text'];
            $dataFields['signupProfilePic'] = ['groupLabel' => 'about_me', 'label' => (string) $this->t('Profile picture'), 'order' => 'F_2', 'type' => 'file-p'];
            $dataFields['signupSkills'] = ['groupLabel' => 'skills_and_interests', 'label' => (string) $this->t('Skills and interests'), 'order' => 'G_1', 'type' => 'ongea_skills'];
            $dataFields['signupSkillsDetails'] = ['groupLabel' => 'skills_and_interests', 'label' => (string) $this->t('Skills and interests details'), 'order' => 'G_2', 'type' => 'text'];
            $dataFields['signupSkillsRelated'] = ['groupLabel' => 'skills_and_interests', 'label' => (string) $this->t('Skills and interests for this activity'), 'order' => 'G_3', 'type' => 'ongea_skills'];
            $dataFields['signupExampleOf'] = ['groupLabel' => 'skills_and_interests', 'label' => (string) $this->t('Link to example of own practice related to these skills and interests'), 'order' => 'G_4', 'type' => 'url'];
            $dataFields['signupFoodOptions'] = ['groupLabel' => 'requirements', 'label' => (string) $this->t('I eat'), 'order' => 'H_1', 'type' => 'ongea_ieat'];
            $dataFields['signupFoodRequirements'] = ['groupLabel' => 'requirements', 'label' => (string) $this->t('Additional food requirements'), 'order' => 'H_2', 'type' => 'text'];
            $dataFields['signupMedicalrequirements'] = ['groupLabel' => 'requirements', 'label' => (string) $this->t('Medical and other specific requirements'), 'order' => 'H_3', 'type' => 'text'];
            $dataFields['signupRoomRequirements'] = ['groupLabel' => 'requirements', 'label' => (string) $this->t('Room requirements'), 'order' => 'H_4', 'type' => 'ongea_room'];
            $dataFields['signupSpecialaccomodation'] = ['groupLabel' => 'requirements', 'label' => (string) $this->t('Special accommodation requirements'), 'order' => 'H_5', 'type' => 'text'];
            $dataFields['signupCanShare'] = ['groupLabel' => 'requirements', 'label' => (string) $this->t('Can share with'), 'order' => 'H_6', 'type' => 'string'];
            $dataFields['signupHearAbout'] = ['groupLabel' => 'motivation', 'label' => (string) $this->t('How did you hear about this activity?'), 'order' => 'L_1', 'type' => 'text'];
            $dataFields['signupMotiviation'] = ['groupLabel' => 'motivation', 'label' => (string) $this->t('What is your motivation to participate in this activity?'), 'order' => 'L_2', 'type' => 'text'];
            

            $configFields['field_ongea_signup_skills']['friendlyName'] = 'signupSkills';
            $configFields['field_ongea_signup_lastname']['friendlyName'] = 'signupFamilyName';
            $configFields['field_ongea_signup_mail']['friendlyName'] = 'signupEmail';
            $configFields['field_ongea_signup_canshare']['mobilityField'] = 'field_ongea_can_share_with';

            foreach ($configFields as $key => $val) {


                if (isset($val['inform']) && $val['inform'] === true) {

                    $itemSetting = $signupForm->get($key)->getValue(
                    )[0]['value'];

                    if ($itemSetting != 'off') {

                        // build item
                        $aa = print_r($dataFields['signupNickname']['order'],1);
                        $form[$val['friendlyName']] = [
                          'type' => $dataFields[$val['friendlyName']]['type'],
                          'value' => isset($val['default']) ? $val['default'] : '',
                          'setting' => $itemSetting,
                          'order' => $dataFields[$val['friendlyName']]['order'],
                          'groupLabel' => $dataFields[$val['friendlyName']]['groupLabel'],
                          'label' => $dataFields[$val['friendlyName']]['label'],
                        ];
                    }

                }
            }
            //loggedIn
            $form['loggedIn'] = \Drupal::currentUser()->id() > 0 ? TRUE : FALSE;
            $form['whoCanSee'] = $who;
            $form['signupIsActive'] = $isActive == 1 ? TRUE : FALSE;
            if (isset($form['loggedIn'])) {
                $currentUser = \Drupal::currentUser();
                $profileStorage = $em->getStorage('profile');
                $profile = $profileStorage->loadByUser($currentUser, 'ongea_participant_profile');
                $container = \Drupal::getContainer();
                $normalizer = $container->get('ongea_api.entity_profile');
                $form['user'] = getType($profile) == 'boolean' ? [] : $normalizer->normalize($profile);

                // For this activity, get my mobility if it exists
                $db = \Drupal::database();
                $query = $db->select('node__field_ongea_activity_mobilities', 'm');
                $query->distinct();
                $query->join('node__field_ongea_participant', 'p', 'm.field_ongea_activity_mobilities_target_id = p.entity_id');        
                $query->join('node__field_ongea_participant_user', 'u', 'p.field_ongea_participant_target_id = u.entity_id');
                $query->fields('m', array('field_ongea_activity_mobilities_target_id'))
                    ->condition('u.field_ongea_participant_user_target_id', $currentUser->id())
                    ->condition('m.entity_id', $activity->id());
                $results = $query->execute()->fetchColumn();
                $form['mobility'] = [];
                if (!empty($results)) {
                    $mobility = $em->getStorage('node')->load($results);
                    $form['mobility'] = $mobility;
                }

            }
            return new ModifiedResourceResponse(
              $form, 200
            );
        }
        $result = 'no signup form found';

        return new ModifiedResourceResponse(
          $result, 200
        );

    }

    /**
     * @param $id
     * @param $data
     *
     * @return ModifiedResourceResponse
     * @throws InvalidPluginDefinitionException
     */
    public function put($id, $data)
    {
        return $this->patch($id, $data);
    }

    /**
     * @param $id
     * @param $data
     *
     * @return ModifiedResourceResponse
     * @throws InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function patch($id, $data)
    {
        $config = \Drupal::config(
          'ongea_api.ongea_activity_signup_form.settings'
        );
        $configFields = $config->get('fields');
        if ($config == null || $configFields == null) {
            throw new ConfigException(t('Config signupform not found'));
        }
        // is activity id

        $em = \Drupal::entityTypeManager();
        $signupForm = null;
        // load activity

        /** @var Node $activity */
        $node_storage = $em->getStorage('node');
        $activity = $node_storage->load($id);
        if (!$activity || $activity->bundle() != 'ongea_activity') {
            throw new NotFoundHttpException(t('Activity not found.'));
        }

        // user
        $currentUser = \Drupal::currentUser();

        $isAnonymous = $currentUser->isAnonymous();

        // activity has signup form

        // anonymous can register?

        $profileStorage = $em->getStorage('profile');
        $notAnonymous = FALSE;

        if ($isAnonymous || $currentUser->getAccountName() == 'api') {
            if (!isset($data['signupEmail'])) {
                throw new BadRequestHttpException(t('Anonymous user and no email.'));
            }
            $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
            $user = User::create();
            $user->setUsername($data['signupEmail']);
            $user->setEmail($data['signupEmail']);
            $user->enforceIsNew();
            $user->set("langcode", $language);
                try {
                    $user->save();
                } catch (EntityStorageException $e) {
                    //watchdog_exception('aa', $e);
                    //$e->getMessage()
                    throw new BadRequestHttpException(t('User account with that email already exists.'));
                }
            $user->addRole('participant');
            $user->activate();
            $user->save();
            _user_mail_notify('register_no_approval_required', $user);

            $profile = $profileStorage->create(
              ['type' => 'ongea_participant_profile', 'uid' => $user->id(), 'field_ongea_mail_address' => $data['signupEmail']]
            );

            $currentUser = $user;
        } else {
            $notAnonymous = TRUE;
            /** @var \Drupal\profile\ProfileStorage $profileStorage */
            $db = \Drupal::database();
            $query = $db->select('profile', 'p');
            $query->fields('p', array('profile_id'))
            ->condition('p.uid', $currentUser->id());
            $results = $query->execute()->fetchCol();
            $profile = $profileStorage->load($results[0]);
        }
        $uid = $currentUser->id();
        $activitySignupFormField = $activity->get('field_ongea_online_sign_up');

        $signupFormFieldList = $activitySignupFormField->getValue();

        if (isset($signupFormFieldList[0]) && isset($signupFormFieldList[0]['target_id'])) {
            $wrapperManager = new OngeaEntityWrapperManager($em);

            /** @var \Drupal\node\NodeInterface $signupForm */
            $signupForm = $node_storage->load($signupFormFieldList[0]['target_id']);

            if (!$signupForm) {
                throw new NotFoundHttpException(t('Signupform not found.'));
            }
            $node = $signupForm->toArray();
            $messages = [];
            if (empty($data['edit'])) {
                $createParticipant = FALSE;
                if (isset($node['field_ongea_who_can_see_and_fill'][0]['target_id'])) {
                    $createParticipant = $node['field_ongea_who_can_see_and_fill'][0]['target_id'];
                }
                $createParticipant = $createParticipant == 40 ? TRUE : FALSE;
                // If no participant, mobility is for Unknown Unknown, so untill this is sorted out:
                $createParticipant = TRUE;
                $attr = [
                    'field_ongea_first_name' => $data['signupFirstName'],
                    'field_ongea_last_name' => $data['signupFamilyName'],
                    'field_ongea_mail_address' => $data['signupEmail']
                ];
                $mobility = $wrapperManager->create('ongea_mobility', $attr);
                if ($createParticipant) {
                    $participant = '';
                    $db = \Drupal::database();
                    $query = $db->select('node__field_ongea_participant_user', 'pu');
                    $query->fields('pu', array('entity_id'));
                    if ($notAnonymous) {
                        // Fetch participant id based on uid
                        $query->condition('pu.field_ongea_participant_user_target_id', $uid);
                    } else {
                        $query->join('users_field_data', 'ud', 'ud.uid = pu.field_ongea_participant_user_target_id');
                        $query->condition('ud.mail', $data['signupEmail']);

                        $db = \Drupal::database();
                        $query = $db->select('node__field_ongea_mail_address', 'ma');
                        $query->fields('ma', array('entity_id'))
                        ->condition('ma.field_ongea_mail_address_value', $data['signupEmail']);
                        $results_participant = $query->execute()->fetchCol();
 
                    }
                    $results = $query->execute()->fetchCol();

                    if (!empty($results_participant)) {
                        $participant = \Drupal::entityTypeManager()->getStorage('node')->load($results_participant[0]);
                        $participant = $wrapperManager->start($participant);
                    }
                    else {
                        $attr['userId'] = $uid;
                    }
                    
                    if (empty($participant)) {
                        $attr['title'] = 'Participant ' . $uid;
                        $participant = $wrapperManager->create('ongea_participant', $attr);
                    }
                    $participant->setField('field_ongea_participant_user', $uid);
                }
            }
            else {
                $db = \Drupal::database();
                $query = $db->select('node__field_ongea_activity_mobilities', 'am');
                $query->join('node__field_ongea_participant', 'p', 'am.field_ongea_activity_mobilities_target_id = p.entity_id');
                $query->join('node__field_ongea_participant_user', 'pu', 'p.field_ongea_participant_target_id = pu.entity_id');
                $query->fields('am', array('field_ongea_activity_mobilities_target_id'));
                $query->condition('am.entity_id', $id);
                $query->condition('pu.field_ongea_participant_user_target_id', $currentUser->id());
                $result_mobility = $query->execute()->fetchAssoc();

                $mobility_id = $result_mobility['field_ongea_activity_mobilities_target_id'];
                $mobility = $node_storage->load($mobility_id);
                $participant_id = $mobility->get('field_ongea_participant')->target_id;
                $mobility = $wrapperManager->start($mobility);
                $participant = $node_storage->load($participant_id);
                $participant = $wrapperManager->start($participant);
                
            }
            // validate signup form
            // 3 errors in config, now corrected, but already installed
            $configFields['field_ongea_signup_aboutme']['profileField'] = 'field_ongea_profile_about';
            $configFields['field_ongea_signup_street']['profileField'] = 'field_ongea_profile_street';
            $configFields['field_ongea_signup_skills']['profileField'] = 'field_ongea_profile_skills';
            $configFields['field_ongea_signup_skills']['participantField'] = 'field_ongea_rt_skills';
            $configFields['field_ongea_signup_nickname']['profileField'] = 'field_ongea_profile_nickname';
            $configFields['field_ongea_signup_skillsdetails']['profileField'] = 'field_ongea_profile_skillsdetail';
            $configFields['field_ongea_signup_skillsrelated']['participantField'] = 'field_ongea_experiences_related';
            $configFields['field_ongea_signup_skills']['friendlyName'] = 'signupSkills';
            $configFields['field_ongea_signup_lastname']['friendlyName'] = 'signupFamilyName';
            $configFields['field_ongea_signup_mail']['friendlyName'] = 'signupEmail';
            $configFields['field_ongea_signup_canshare']['mobilityField'] = 'field_ongea_can_share_with';

            foreach ($configFields as $key => $val) {
                if (isset($val['inform']) && $val['inform'] === true && $signupForm->hasField($key)) {
                    $fieldItemSetting = $signupForm->get($key)->getValue();
                    if (!isset($fieldItemSetting[0])) {
                    }
                    $itemSetting = $fieldItemSetting[0]['value'];

                    if ($itemSetting != 'off' || in_array($key, ['field_ongea_signup_firstname', 'field_ongea_signup_lastname', 'field_ongea_mail_address'])) {

                        // cast items -> refactor
                        if (isset($data[$val['friendlyName']])) {
                            $type = isset($val['type']) ? $val['type'] : 'string';
                            $rawItem = $data[$val['friendlyName']];
                            $castItem = null;
                            switch ($type) {
                                case 'string':
                                    $castItem = (string)$rawItem;
                                    break;
                                case 'array':
                                    $castItem = (array)$rawItem;
                                    break;
                                default:
                                    $castItem = $rawItem;
                                    break;

                            }

                            if (isset($val['mobilityField'])) {
                                $mobility->setField($val['mobilityField'], $castItem);
                            }
                            if (isset($val['participantField'])) {
                                //throw new BadRequestHttpException('2');
                                $participant->setField($val['participantField'], $castItem);
                                
                            }
                            if (isset($val['profileField'])) {
                                $profile->set($val['profileField'], $castItem);
                            }
                        }
                    }
                }
            }
            $have_app_pr = $activity->field_ongea_have_a_applicants_pr->value;
            $have_app_pr = $have_app_pr == NULL || $have_app_pr == 'no, every applicant should be listed as participant right away';
            $mobility->setField('field_ongea_participant_status', $have_app_pr ? 31 : 30);
            if (empty($data['edit'])) {
                $profile->save();
                $gid = ongea_activity_org2group($data['sendingOrganisation']);
                $groups = [\Drupal\group\Entity\Group::load($gid)];
                if ($createParticipant) {
                    $participant->setField('field_ongea_show_my_profile', 1);
                    $participant->save();
                    if($gid != null) {
                        $groups[0]->addContent($participant->getEntity(), 'group_node:' . $participant->getEntity()->bundle());
                    }
                    $mobility->setField('field_ongea_participant', $participant->getId());
                }
                $mobility->setReference('field_ongea_sending_organisation', [$data['sendingOrganisation']]);
                $mobility->setField('field_ongea_sending_org_id', $data['sendingOrganisation']);
                if (isset($data['complete'])) {
                    $mobility->setField('field_completed', 1);
                }
                $mobility->setField('field_ongea_datefrom', $activity->field_ongea_datefrom->value);
                $mobility->setField('field_ongea_dateto', $activity->field_ongea_dateto->value);
                $mobility->setField('field_arrival', $activity->field_ongea_datefrom->value);
                $mobility->setField('field_departure', $activity->field_ongea_dateto->value);
                $mobility->save();
                if($gid != null) {
                    $groups[0]->addContent($mobility->getEntity(), 'group_node:' . $mobility->getEntity()->bundle());
                }

                $current_path = \Drupal::service('path.current')->getPath();
                $path_args = explode('/', $current_path);                
                $db = \Drupal::database();
                $query = $db->select('group_content_field_data', 'g');
                $query->fields('g', array('gid'))
                      ->condition('g.entity_id', $id)
                      ->condition('g.type', "%" . $db->escapeLike('group_content_type') . "%", 'LIKE');
                $results = $query->execute()->fetchField();
                // If this is executed when the user registering for the 2nd activity is logged in
                // $result is 19 (first group) and an exception is thrown.
                if ($results != $gid && $isAnonymous) {
                    if($gid != null) {print $gid.'|'.$results.'|';
                        $groups[1] = \Drupal\group\Entity\Group::load($results);
                        $groups[1]->addContent($mobility->getEntity(), 'group_node:' . $mobility->getEntity()->bundle());
                    }
                } 
                
                $activity->{'field_ongea_activity_mobilities'}[] = $mobility->getId();
                $activity->save();
            } else {
                $profile->save();
                if (isset($data['complete'])) {
                    $mobility->setField('field_completed', 1);
                }
                $mobility->save();
            }

            return new ModifiedResourceResponse($mobility->getEntity(), 201);
        } else {
            // error no signup form
        }


        return new ModifiedResourceResponse(
          $signupForm, 201
        ); // 3. arg = headers

    }

    protected function validateForm($formData)
    {
        $messages = [];
        foreach ($formData as $formItemKey => $formItemVal) {

        }
    }
}