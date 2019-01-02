<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 01.08.18
 * Time: 23:21
 */

namespace Drupal\ongea_api\EntityWrapper;


use Drupal\Core\Entity\EntityStorageException;
use Drupal\ongea_api\Exception\EntityNotValidException;
use Drupal\user\Entity\User;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ParticipantEntityWrapper extends OngeaEntityWrapper
{

    const ONGEA_FIELD_PARTICIPANT_USER = 'field_ongea_participant_user';

    const ONGEA_FIELD_PARTICIPANT_MAIL = 'field_ongea_mail_address';

    const ONGEA_FIELD_PARTICIPANT_FIRSTNAME = 'field_ongea_first_name';

    const ONGEA_FIELD_PARTICIPANT_LASTNAME = 'field_ongea_last_name';


    protected $validationArr = [
      'NOTNULL' => [
        'field_ongea_first_name',
        'field_ongea_last_name',
        //'field_ongea_mail_address',
      ],
    ];

    protected $user;
    protected $node_title;

    /**
     * @return string
     */
    public static function getContentType()
    {
        return 'ongea_participant';
    }

    public function getConfigName()
    {
        return 'ongea_api.ongea_participant.settings';
    }
    public function validate()
    {
        foreach ($this->validationArr['NOTNULL'] as $fieldNameToValidate) {
            if ($this->entity->{$fieldNameToValidate}->getString(
              ) == null || $this->entity->{$fieldNameToValidate}->getString(
              ) == false) {
                throw new EntityNotValidException(
                  t('Field @fieldNameToValidate cannot be null.', ['@fieldNameToValidate' => $fieldNameToValidate])
                );
            }
        }

        return true;
    }

    // permissions

    public function hasAccess()
    {
        // participant
        $currentUserRoles = $this->currentUser->getRoles();
        if (in_array("ongea_participant", $currentUserRoles)) {
            $this->isParticipant();
        }

        return true;
    }

    public function isParticipant()
    {
        if ($this->getUser()->id() === $this->currentUser->id()) {
            return true;
        }

        return false;

    }

    public function getUser()
    {
        //print_r('getUser');
        if (!isset($this->user)) {
            $this->user = $this->entity->get(
              $this::ONGEA_FIELD_PARTICIPANT_USER
            )->first();
        }

        return $this->user;
    }

    /**
     * @param $data
     *
     * @return mixed|void
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function preCreate($data)
    {

        if (isset($data['userId'])) {
            $this->node_title = $data['title'];
            $user = $this->em->getStorage('user')
              ->load($data['userId']);
            if ($user) {
                // TODO: addUserAsParticipant mail
                // permissions to add
                $this->entity->{$this::ONGEA_FIELD_PARTICIPANT_USER} = $user->id();
            }
            // get profile data
        } else {
            if (isset($data[$this::ONGEA_FIELD_PARTICIPANT_MAIL])) {
                // search user by mail
                $users = $this->em->getStorage('user')->loadByProperties([
                    'mail' => $data[$this::ONGEA_FIELD_PARTICIPANT_MAIL],
                ]);
                if ($users) {
                    $user = reset($users);
                    // TODO: addUserAsParticipant mail
                    // permissions to add
                    $this->entity->{$this::ONGEA_FIELD_PARTICIPANT_USER} = $user->id();


                    // profile to participant
                } else {
                    $user = User::create();
                    $user->setUsername($data[$this::ONGEA_FIELD_PARTICIPANT_MAIL]);
                    $user->setEmail($data[$this::ONGEA_FIELD_PARTICIPANT_MAIL]);
                    //$user->setPassword(...); if required set rand
                    $user->enforceIsNew();
                    try {
                        $user->save();
                    } catch (EntityStorageException $e) {
                        throw new BadRequestHttpException($e);
                    }
                    $user->addRole('participant');
                    $user->activate();
                    $user->save();
                    $data = json_decode(file_get_contents('php://input'), true);
                    if (!empty($data['notifyParticipant'])) {
                        _user_mail_notify('register_no_approval_required', $user);
                    }
                    $gender['female'] = 16;
                    $gender['male'] = 17;
                    $gender['differently'] = 18;

                    $food = ['almost_everything' => 1,
                    'meat_fish_no_pork' => 2,
                    'meat_fish_no_beef' => 3,
                    'meat_no_pork_no_fish' => 4,
                    'meat_no_fish' => 5,
                    'meat_no_milk' => 6,
                    'meat_no_milky_sauce_no_pork' => 7,
                    'chicken_and_fish_no_other_meat' => 8,
                    'chicken_no_other_meat_fish' => 9,
                    'pescetarian' => 10,
                    'vegetarian' => 11,
                    'vegan' => 12];
                    
                    $profileStorage = $this->em->getStorage('profile');
                    //slika, emphone
                    $profile = $profileStorage->create([
                        'type' => 'ongea_participant_profile',
                        'uid' => $user->id(),
                        'field_ongea_mail_address' => $data[$this::ONGEA_FIELD_PARTICIPANT_MAIL],
                        'field_ongea_profile_country' => isset($data['country']) ? $data['country'] : '',
                        'field_ongea_profile_emphone' => isset($data['emergencyContactPhone']) ? $data['emergencyContactPhone'] : '',
                        'field_ongea_profile_expireson' => isset($data['expiresOn']) ? $data['expiresOn'] : '',
                        'field_ongea_profile_issuedon' => isset($data['issuedOn']) ? $data['issuedOn'] : '',
                        'field_ongea_profile_exampleof' => isset($data['linkToExample']) ? $data['linkToExample'] : '',
                        'field_ongea_profile_nationality' => isset($data['nationality']) ? $data['nationality'] : '',
                        'field_ongea_profile_phone' => isset($data['phone']) ? $data['phone'] : '',        
                        'field_ongea_first_name' => isset($data['firstname']) ? $data['firstname'] : '',
                        'field_ongea_last_name' => isset($data['lastname']) ? $data['lastname'] : '',
                        'field_ongea_profile_about' => isset($data['aboutme']) ? $data['aboutme'] : '',
                        'field_ongea_profile_birthdate' => isset($data['birthDate']) ? $data['birthDate'] : '',
                        'field_ongea_profile_emergcon' => isset($data['emergencyContact']) ? $data['emergencyContact'] : '',
                        'field_ongea_profile_foodoptions' => isset($data['iEat']) ? $food[$data['iEat']] : NULL,
                        'field_ongea_profile_foodreq' => isset($data['foodRequirements']) ? $data['foodRequirements'] : '',
                        'field_ongea_profile_gender' => isset($data['gender']) ? $gender[$data['gender']] : NULL,
                        'field_ongea_profile_nickname' => isset($data['nickname']) ? $data['nickname'] : '',
                        'field_ongea_profile_passid' => isset($data['passId']) ? $data['passId'] : '',
                        'field_ongea_profile_postcode' => isset($data['postcode']) ? $data['postcode'] : '',
                        'field_ongea_profile_profilepic' => isset($data['profilePicture']) ? [
                            'target_id' => $data['profilePicture'][0]->id,
                            'alt' => $data['profilePicture'][0]->alt,
                            'title' => $data['profilePicture'][0]->title
                          ] : '',
                        'field_ongea_profile_region' => isset($data['region']) ? $data['region'] : '',
                        'field_ongea_profile_skills' => isset($data['skillsAndInterests']) ? $data['skillsAndInterests'] : NULL,
                        'field_ongea_profile_skillsdetail' => isset($data['skillsAndInterestsDetails']) ? $data['skillsAndInterestsDetails'] : '',
                        'field_ongea_profile_skillsrelate' => isset($data['expieriencesRelated']) ? $data['expieriencesRelated'] : '',
                        'field_ongea_profile_street' => isset($data['street']) ? $data['street'] : '',
                        'field_ongea_profile_town' => isset($data['town']) ? $data['town'] : ''        
                    ]);
                    $profile->save();

                    $this->entity->{$this::ONGEA_FIELD_PARTICIPANT_USER} = $user->id();
                }
            }
        }


    }


    // specific functions

    public
    function postCreate()
    {
        if(isset($this->node_title)) {
            $this->entity->setTitle($this->node_title);
        }
        else {
            $this->entity->setTitle("Participant " . $this->entity->field_ongea_participant_user->target_id);
        }      
    }


    public
    function getUserId()
    {
        $user = $this->getUser();
        if ($user == null) return 0; // deprecated fix for no participant user
        return $this->getUser()->getString();
    }
}