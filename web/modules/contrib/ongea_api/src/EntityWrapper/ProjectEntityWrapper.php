<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 01.08.18
 * Time: 23:21
 */

namespace Drupal\ongea_api\EntityWrapper;


class ProjectEntityWrapper extends OngeaEntityWrapper
{

    /**
     * ProjectEntityWrapper constructor.
     */
    public function __construct($entity)
    {
        parent::__construct($entity);
        $this->loadConfig($this->getConfigName());

    }

    public function getConfigName()
    {
        return 'ongea_api.ongea_project.settings';
    }

    /**
     * @return string
     */
    public static function getContentType()
    {
        return 'ongea_project';
    }

    // permissions

    public function hasAccess()
    {
        // participant
        print_r(5);
        die();

        $currentUser = \Drupal::currentUser();
        $currentUserRoles = $currentUser->getRoles();
        if (in_array("ongea_participant", $currentUserRoles)) {
            $this->isParticipant();
        }

        return true;
    }

    public function isParticipant()
    {
        foreach ($this->getActivities() as $activity) {
            $activityWrapper = ActivityEntityWrapper::start($activity);
            if ($activityWrapper->isParticipant()) {
                return true;
            }
        }

        return false;

    }


    // specific functions

    public function getActivities()
    {
        // TODO: use config
        $activitiesFieldName = 'field_ongea_project_activities';

        return $this->entity->get($activitiesFieldName);
    }

}