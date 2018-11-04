<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 15.08.18
 * Time: 00:17
 */

namespace Drupal\ongea_api\EntityWrapper;


class PermissionProvider
{

    protected $userContext;

    protected $roles;

    protected $isParticipant;

    protected $isOrgAdmin;


    public function __construct()
    {
        $this->userContext = \Drupal::currentUser();

    }

    public function checkPermisson($entity)
    {

    }

    protected function hasRole($role)
    {
        $this->userContext->getAccount();
        $this->userContext->getRoles();
    }

    protected function isParticipant()
    {

    }


}