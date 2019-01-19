<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 02.08.18
 * Time: 01:08
 */

namespace Drupal\ongea_api\EntityWrapper;


use Drupal\Core\Entity\EntityStorageException;

class AnnouncementEntityWrapper extends OngeaEntityWrapper
{

    const ONGEA_TYPE_ACTIVITY = 'ongea_activity';

    const ONGEA_FIELD_SENT_TO_PARTICIPANTS = 'field_ongea_msg_to_parts';

    const ONGEA_FIELD_SENT_TO_APPLICANTS = 'field_ongea_msg_applicants';

    const ONGEA_FIELD_SENT_TO_GROUP_LEADER = 'field_field_ongea_msg_to_grouple';

    const ONGEA_FIELD_SENT_TO_STAFF = 'field_ongea_msg_to_staff';

    const ONGEA_FIELD_MSG_RECEIVERS = 'field_ongea_msg_receivers';

    const ONGEA_FIELD_MSG_SENDER = 'field_ongea_msg_sender';

    const ONGEA_FIELD_MESSAGE = 'field_ongea_message';

    const ONGEA_FIELD_MSG_SENDTIME = 'field_ongea_msg_sendtime';

    const ONGEA_FIELD_MSG_SEND_IN_ACTIVITY = 'field_ongea_send_in_activity';

    /**
     * @return string
     */
    public static function getContentType()
    {
        return 'ongea_announcement';
    }

    public function getConfigName()
    {
        return 'ongea_api.ongea_announcement.settings';
    }

    public function preCreate($data)
    {

        parent::preCreate($data); // TODO: Change the autogenerated stub
    }

    /**
     * @throws \Drupal\Core\TypedData\Exception\MissingDataException
     */
    public function postCreate()
    {
        //print_r('postCreate');
        /** @var \Drupal\ongea_api\EntityWrapper\OngeaEntityWrapperManager $wrapperManager */
        $wrapperManager = $this->container->get(
          'ongea_api.entity_wrapper_manager'
        );

        /** @var \Drupal\node\NodeInterface $announcement */
        $announcement = $this->entity;

        // set sendtime
        $announcement->set(
          $this::ONGEA_FIELD_MSG_SENDTIME,
          $announcement->getCreatedTime()
        );

        // set sender
        $sender = \Drupal::currentUser();


        $sendInActivity = $announcement->get(
          $this::ONGEA_FIELD_MSG_SEND_IN_ACTIVITY
        );


        // get activity to send in.
        // TODO: send in mult
        $hasSendInActivity = false;
        if ($sendInActivity->count() > 0) {
            $hasSendInActivity = true;
            // only one activity to send in
            $activityFieldToSendIn = $sendInActivity->first();
            //print_r($activityFieldToSendIn->getString());


            /** @var \Drupal\ongea_api\EntityWrapper\ActivityEntityWrapper $activityToSendIn */
            $activityToSendInId = $activityFieldToSendIn->getValue(
            )['target_id'];

            $activityToSendIn = $wrapperManager->load(
              $activityToSendInId,
              'ongea_activity'
            );


        }


        $receivers = [];
        if ($hasSendInActivity) {


            $sendToParticipants = $this->entity->get(
              $this::ONGEA_FIELD_SENT_TO_PARTICIPANTS
            )->getString();
            $sendToApplicants = $this->entity->get(
              $this::ONGEA_FIELD_SENT_TO_APPLICANTS
            )->getString();
            $sendToGroupLeader = $this->entity->get(
              $this::ONGEA_FIELD_SENT_TO_GROUP_LEADER
            )->getString();
            $sendToStaff = $this->entity->get($this::ONGEA_FIELD_SENT_TO_STAFF)
              ->getString();

            $mobilities = $activityToSendIn->getMobilities();

            // go through mobilities


            /** @var \Drupal\ongea_api\EntityWrapper\MobilityEntityWrapper $mobility */
            foreach ($mobilities->getEntities() as $mobility) {
                $participantStatus = $mobility->getParticipantStatus();
                $participantRole = $mobility->getParticipantRole();
                $particpant = $mobility->getParticipant();
                if ($particpant) {
                    $mobilityUserId = $particpant->getUserId();
                    $receivers[] = $mobilityUserId;
                    if ($sendToParticipants && $participantRole == 27) {
                        $receivers[] = $mobilityUserId;
                    } else {
                        if ($sendToApplicants && $participantStatus == 30) {
                            $receivers[] = $mobilityUserId;
                        }
                    }

                    if ($sendToGroupLeader && $participantRole == 28) {
                        $receivers[] = $mobilityUserId;
                    } else {
                        if ($sendToStaff && $participantRole == 66) {
                            $receivers[] = $mobilityUserId;
                        }
                    }
                }
            }
            $receivers = array_unique($receivers);
            try {
                $announcement->save();
            } catch (EntityStorageException $e) {
                $this->logger->notice('announcement storage');

            }

            // TODO: admins
            //$participants = $activityToSendIn->getParticipants();

            foreach ($receivers as $receiver) {
                // create new announcement user

                $uaAnRaw = [
                  'type' => 'ongea_user_announcements',
                    'title' => $announcement->id() . ' ' . $receiver,
                  'field_ongea_ua_announcement' => $announcement->id(),
                  'field_ongea_ua_has_read' => false,
                  'field_ongea_ua_user' => $receiver,
                ];
                /** @var \Drupal\node\NodeInterface $uaAnnouncement */
                $uaAnnouncement = $this->nodeManager->create(
                  $uaAnRaw
                );
                

                try {
                    $uaAnnouncement->save();
                } catch (EntityStorageException $e) {
                    $this->logger->notice('ua storage' . $announcement->id() .' ' . $receiver);
                }

            }

        }
        $announcement->set($this::ONGEA_FIELD_MSG_SENDER, $sender->id());
        $announcement->set($this::ONGEA_FIELD_MSG_RECEIVERS, $receivers);
        try {
            $announcement->save();
        } catch (EntityStorageException $e) {
            $this->logger->notice('announcement storage');

        }

    }


}