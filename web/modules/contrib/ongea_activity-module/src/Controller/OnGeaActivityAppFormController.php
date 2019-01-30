<?php

namespace Drupal\ongea_activity_app\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Session\AccountInterface;

/**
 * Class OnGeaActivityAppFormController.
 *
 * @package Drupal\ongea_activity_app\Controller
 */
class OnGeaActivityAppFormController extends ControllerBase {

  /**
   * Form.
   *
   * @return string
   *   Return Hello string.
   */
  public function form() {
    // If given in the url, set the chosen group if the user is part of that group
  //   if (isset($_GET['gid'])) {
  //     $groups = ongea_activity_get_user_groups(\Drupal::currentUser());
  //     if (!empty($groups)) {
  //       $gids = [];
  //       $processed = FALSE;
  //       foreach ($groups as $gr) {
  //         if ($_GET['gid'] == $gr->id()) {
  //           $_SESSION['ongea']['selected_group'] = $_GET['gid'];
  //           $url = \Drupal\Core\Url::fromRoute('<current>');
  //           return $this->redirect($url->getRouteName());
  //         }
  //       }
  //       if (!$processed) {
  //         $url = \Drupal\Core\Url::fromRoute('<current>');
  //         return $this->redirect($url->getRouteName());
  //       }
  //     }
  // }
  
      // = \Drupal::service('path.current')->getPath()
    //$current_path = \Drupal::request()->getRequestUri();
    $host = \Drupal::request()->getSchemeAndHttpHost();
    $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $languages = \Drupal::languageManager()->getLanguages();

    // TODO: Get available languages form channel
    $availableLanguges = array_keys($languages);
    //$markup = $host;
    $markup = '<div data-lang="'.$language.'"  data-languages="'.join(',', $availableLanguges).'" data-basepath="'.$host.'" id="ongea_activity_app"></div>';
    return [
        '#markup' => $markup,
        '#attached' => [
            'library' =>  [
                'ongea_activity_app/ongea.app'
            ], 
        ],
    ];
  }
  
  /**
   * Checks access for a specific request.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   Run access checks for this account.
   */
  public function access(AccountInterface $account) {
    // Check permissions and combine that with any custom access checking needed. Pass forward
    // parameters from the route and/or request as needed.
    // return AccessResult::allowedIf($account->hasPermission('do example things') && $this->someOtherCustomCondition());
    return AccessResult::allowedIf($this->isMemberOfAnyGroup(['org_admin', 'activitie_admin', 'sender']));
  }
  public function accessContent(AccountInterface $account) {
    // Check permissions and combine that with any custom access checking needed. Pass forward
    // parameters from the route and/or request as needed.
    // return AccessResult::allowedIf($account->hasPermission('do example things') && $this->someOtherCustomCondition());
    return AccessResult::allowedIf($this->isMemberOfAnyGroup(['org_admin', 'activitie_admin', 'editor', 'contributor']));
  }

  public function isMemberOfAnyGroup($roles) {
    $hasGroupRole = \Drupal\ongea_api\Plugin\rest\resource\OngeaResourceBase::hasGroupRole($roles);
    return $hasGroupRole;
  }

}
