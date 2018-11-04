<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 02.08.18
 * Time: 01:08
 */

namespace Drupal\ongea_api\EntityWrapper;


class ActivityOrganisationEntityWrapper extends OngeaEntityWrapper
{

    /**
     * ProjectEntityWrapper constructor.
     */
    public function __construct($entity)
    {
        parent::__construct($entity);
        $configName = $this->getConfigName();

        $this->loadConfig($configName);

    }

    public function getConfigName()
    {
        return 'ongea_api.ongea_activity_organisation.settings';
    }

    /**
     * @return string
     */
    public static function getContentType()
    {
        return 'ongea_activity_organisation';
    }
    // permissions


}