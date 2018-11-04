<?php
/**
 * @file
 * Contains Drupal\ongea_activity\Controller\AdminMenuController;
 */
namespace Drupal\ongea_activity\Controller;

use Drupal\ongea_api\Plugin\rest\resource\OngeaResourceBase;

class AdminMenuController
{
    protected $userService;
    protected $data;
    public $langcode;
    public $basePath;

    public function __construct()
    {
        // Get user service.
        $this->userService = \Drupal::service('current_user');

        // Get language manager service.
        $this->languageManager = \Drupal::service('language_manager');

        // Get base path
        $this->basePath = \Drupal::request()->getSchemeAndHttpHost();

        // Set data array.
        $this->data = $this->baseData();
    }

    /**
     * Return array with data for admin menu block.
     * 
     * - Last 4 items (users, create_article, create_basic_page, taxonomy) can see admins and superAdmin; 
     * - active_tool_admin cannot see super admin, but can see first 3 group members (org_admin, activiti_admin and sender); 
     * - Group members can see superAdmin and org_admin only;
     * 
     * @return array $data;
     */
    public function getData() : array 
    {
        // Get base data array.
        $data = $this->data;

        // Get id of the current user.
        $uid = $this->userService->id();

        // Remove "Active tool admin" link for super admin.
        if ($uid == 1) {
            unset($data['active_tool_admin']); 
        } else {
            // Check the group role of the current user, and remove menu items by role.
            switch (true) {
                case OngeaResourceBase::hasGroupRole(['org_admin']):
                    break;

                case OngeaResourceBase::hasGroupRole(['activitie_admin']):
                    unset(
                        $data['group_members']
                    );
                    break;

                case OngeaResourceBase::hasGroupRole(['sender']):
                    unset(
                        $data['group_members'],
                        $data['users'],
                        $data['create_article'],
                        $data['create_basic_page'],
                        $data['taxonomy']
                    );
                    break;

                case OngeaResourceBase::hasGroupRole(['editor']):
                    unset(
                        $data['group_members'],
                        $data['active_tool_admin'],
                        $data['users'],
                        $data['create_article'],
                        $data['create_basic_page'],
                        $data['taxonomy']
                    );
                    break;

                case OngeaResourceBase::hasGroupRole(['contributor']):
                    unset(
                        $data['group_members'],
                        $data['active_tool_admin'],
                        $data['users'],
                        $data['create_article'],
                        $data['create_basic_page'],
                        $data['taxonomy']
                    );
                    break;

                default:
                $data = [];
            }
        }

        return $data;
    }

    /**
     * Base menu array.
     * @return array $data;
     */
    protected function baseData() : array
    {
        // Set path
        $langcode = $this->languageManager->getCurrentLanguage()->getId();
        $path = $this->basePath.'/'.$langcode;

        // Set menu items.
        $data = [
            'active_tool_admin' => [
                'path' => 'ongea_activity_app.app_controller_form',
                'url' => "$path/activities",
                'title' => t('Activitie tool admin')
            ],
            'group_content' => [
                'path' => '',
                'url' => "$path/manage-content",
                'title' => t('Group content')
            ],
            'group_members' => [
                'path' => '',
                'url' => "$path/manage-members",
                'title' => t('Group members')
            ],
            'users' => [
                'path' => 'entity.user.collection',
                'url' => "$path/admin/people",
                'title' => t('Users')
            ],
            'create_article' => [
                'path' => '',
                'url' => "$path/node/add/article",
                'title' => t('Create Article')
            ],
            'create_basic_page' => [
                'url' => "$path/node/add/page",
                'title' => t('Create Basic page')
            ],
            'taxonomy' => [
                'path' => 'entity.taxonomy_vocabulary.collection',
                'url' => "$path/admin/structure/taxonomy",
                'title' => t('Taxonomy')
            ]
        ];
        
        return $data;
    }

}