<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 01.08.18
 * Time: 23:21
 */

namespace Drupal\ongea_api\EntityWrapper;


class MobilityEntityWrapper extends OngeaEntityWrapper
{

    const ONGEA_FIELD_PARTICIPANT = 'field_ongea_participant';

    const ONGEA_FIELD_PARTICIPANT_STATUS = 'field_ongea_participant_status';

    const ONGEA_API_PARTICIPANT_STATUS = 'participantStatus';

    const ONGEA_FIELD_PARTICIPANT_ROLE = 'field_ongea_participant_role';

    const ONGEA_API_PARTICIPANT_ROLE = 'participantRole';

    /**
     * @var \Drupal\ongea_api\EntityWrapper\ParticipantEntityWrapper
     */
    protected $participant;

    protected $participantStatus;

    protected $participantRole;

    /**
     * @return string
     */
    public static function getContentType()
    {
        return 'ongea_mobility';
    }

    public function preCreate($data)
    {
        if (!isset($data[$this::ONGEA_FIELD_PARTICIPANT_STATUS]) || $this::ONGEA_FIELD_PARTICIPANT_STATUS == null || $this::ONGEA_FIELD_PARTICIPANT_STATUS == false) {
            $this->entity->set(
              $this::ONGEA_FIELD_PARTICIPANT_STATUS,
              $this->getTidByName('applicant', 'ongea_participantstatus')

            );
        }
        if (!isset($data[$this::ONGEA_FIELD_PARTICIPANT_ROLE]) || $this::ONGEA_FIELD_PARTICIPANT_ROLE == null || $this::ONGEA_FIELD_PARTICIPANT_ROLE == false) {
            $this->entity->set(
              $this::ONGEA_FIELD_PARTICIPANT_ROLE,
              $this->getTidByName('team_member', 'ongea_participantrole')
            );
        }
    }

    public function getConfigName()
    {
        return 'ongea_api.ongea_mobility.settings';
    }

    /**
     * @return string
     */
    public function getParticipantStatus()
    {
        //print_r('getPartStatus');
        if (!isset($this->participantStatus)) {
            $this->participantStatus = $this->entity->get(
              $this::ONGEA_FIELD_PARTICIPANT_STATUS
            )->getString();
        }

        return $this->participantStatus;
    }

    public function getParticipantRole()
    {
        if (!isset($this->participantRole)) {
            $this->participantRole = $this->entity->get(
              $this::ONGEA_FIELD_PARTICIPANT_ROLE
            )->getString();
        }

        return $this->participantRole;
    }

    // permissions

    public function hasAccess()
    {
        // participant
        $currentUser = \Drupal::currentUser();
        $currentUserRoles = $currentUser->getRoles();
        if (in_array("ongea_participant", $currentUserRoles)) {
            $this->isParticipant();
        }

        return true;
    }

    public function isParticipant()
    {
        foreach ($this->getParticipant() as $participant) {
            /** @var ParticipantEntityWrapper $participantWrapper */
            $participantWrapper = $this->wrapperManager->start($participant);
            if ($participantWrapper->isParticipant()) {
                return true;
            }
        }

        return false;

    }

    /**
     * @param $fieldName
     *
     * @throws \Drupal\Core\TypedData\Exception\MissingDataException
     */
    public function getReferenceOne($fieldName) {
        return $this->entity->get($fieldName)->first();
    }

    public function getReferenceEntity($field) {
        return $this->getTargetEntity($field);
    }

    // specific functions

    /**
     * @return \Drupal\ongea_api\EntityWrapper\ParticipantEntityWrapper
     * @throws \Drupal\Core\TypedData\Exception\MissingDataException
     */
    public function getParticipant()
    {

        /*
        //print_r('getParticipant');
        if (!isset($this->participant)) {

            $participantList = new OngeaEntityListWrapper(
              $this->entity->get($this::ONGEA_FIELD_PARTICIPANT)
            );
            $this->participant = $participantList->first();
        }*/
        $fieldList = $this->entity->get($this::ONGEA_FIELD_PARTICIPANT);
        if ($fieldList->count() > 0) {
            $field = $fieldList->first();
            $entity = $this->getTargetEntity($field);

            return new ParticipantEntityWrapper($entity);
        }
        return null;


    }
}