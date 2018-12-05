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

                    $profileStorage = $this->em->getStorage('profile');
                    $profile = $profileStorage->create([
                        'type' => 'ongea_participant_profile',
                        'uid' => $user->id(),
                        'field_ongea_mail_address' => $data[$this::ONGEA_FIELD_PARTICIPANT_MAIL],
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

    }


    public
    function getUserId()
    {
        $user = $this->getUser();
        if ($user == null) return 0; // deprecated fix for no participant user
        return $this->getUser()->getString();
    }
}