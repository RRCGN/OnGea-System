<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 02.08.18
 * Time: 01:08
 */

namespace Drupal\ongea_api\EntityWrapper;


use Drupal\Core\Field\EntityReferenceFieldItemListInterface;
use Drupal\group\Entity\Group;

class ActivityEntityWrapper extends OngeaEntityWrapper
{

    const ONGEA_FIELD_DATE_FROM = 'field_ongea_datefrom';

    const FIELD_NAME_MOBILTITIES = 'field_ongea_activity_mobilities';

    const ONGEA_GROUP_ACTIVITY = 'ongea_activity_group';
    const ONGEA_GROUP_ACTIVITY_ACTIVITIES = 'field_ongea_group_activity';

    /**
     * @var \Drupal\ongea_api\EntityWrapper\OngeaEntityListWrapper
     */
    protected $mobilities;

    /**
     * @return array|null
     * @throws \Exception
     */
    public static function defaults()
    {
        return [
          self::ONGEA_FIELD_DATE_FROM => new \DateTimeImmutable('now'),
        ];
    }

    /**
     * @return string
     */
    public static function getContentType()
    {
        return 'ongea_activity';
    }

    public function preCreate($data)
    {
        // TODO: implement preCreate($data)
    }

    /**
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function postCreate()
    {
        /*$activityGroup = Group::create(
          [
            'type' => $this::ONGEA_GROUP_ACTIVITY,
            $this::ONGEA_GROUP_ACTIVITY_ACTIVITIES => $this->entity->id(),
          ]
        );
        $activityGroup->save();
        // create a group for the activity
        */
    }

    // specific functions

    /**
     * @throws \Drupal\Core\TypedData\Exception\MissingDataException
     */
    public function getParticipants()
    {
        $participants = [];
        $mobilities = $this->getMobilities();

        /** @var \Drupal\Core\Field\FieldItemInterface $mobility */
        foreach ($mobilities as $mobility) {
            $participants[] = $this->getTargetEntity(
              $mobility->get('field_ongea_mobility_participant')->first()
            );
        }
    }

    /**
     * @return \Drupal\ongea_api\EntityWrapper\OngeaEntityListWrapper
     */
    public function getMobilities()
    {
        //print_r('getMobilities');
        // TODO: use config
        if (!isset($this->mobilities)) {
            $this->mobilities = new OngeaEntityListWrapper(
              $this->entity->get($this::FIELD_NAME_MOBILTITIES)
            );
        }

        return $this->mobilities;
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
        foreach ($this->getMobilities() as $mobility) {
            /** @var MobilityEntityWrapper $mobilityWrapper */
            $mobilityWrapper = MobilityEntityWrapper::start($mobility);
            if ($mobilityWrapper->isParticipant()) {
                return true;
            }
        }

        return true;

    }

    /**
     * @return \Drupal\Core\Entity\EntityInterface[]
     */
    public function getMobiltityEntities()
    {

        /** @var EntityReferenceFieldItemListInterface $fieldReferenceItemList */
        $fieldReferenceItemList = $this->entity->get(
          $this::FIELD_NAME_MOBILTITIES
        );

        return $fieldReferenceItemList->referencedEntities();
    }

    /**
     * @param $mobility
     */
    public function addMobility($mobility)
    {
        $this->entity->{$this::FIELD_NAME_MOBILTITIES}[] = $mobility;
    }

    public function addMobilities($mobilities)
    {

    }

}