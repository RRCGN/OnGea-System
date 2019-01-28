<?php

namespace Drupal\ongea_registration_form\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Session\AccountInterface;

/**
 * Class OnGeaRegistrationFormController.
 *
 * @package Drupal\ongea_registration_form\Controller
 */
class OnGeaRegistrationFormController extends ControllerBase {

  /**
   * Form.
   *
   * @return string
   *   Return Hello string.
   */
  public function form($nid = '') {
      // = \Drupal::service('path.current')->getPath()
    //$current_path = \Drupal::request()->getRequestUri();
    $host = \Drupal::request()->getSchemeAndHttpHost();
    $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    if (empty($nid)) {
      $node = \Drupal::routeMatch()->getParameter('node');
      if (isset($node)) {
        $nid = $node->id();
      }
    }

    // Fetch completed activities for this user
    $currentUser = \Drupal::currentUser();
    if (!$currentUser->isAnonymous()) {
      $db = \Drupal::database();
      $query = $db->select('node__field_ongea_activity_mobilities', 'm');
      $query->distinct();
      $query->join('node_field_data', 'n', 'm.entity_id = n.nid');
      $query->join('node__field_ongea_participant', 'p', 'm.field_ongea_activity_mobilities_target_id = p.entity_id');        
      $query->join('node__field_ongea_participant_user', 'u', 'p.field_ongea_participant_target_id = u.entity_id');
      $query->leftJoin('node__field_completed', 'c', 'm.field_ongea_activity_mobilities_target_id = c.entity_id');
      $query->fields('c', array('field_completed_value'))
            ->condition('m.entity_id', $nid)
            ->condition('u.field_ongea_participant_user_target_id', $currentUser->id());
      $result = $query->execute()->fetchField();
    }

    if ($currentUser->id() == 0) {
      $edit = 'false';
    }
    else {
      if($result['field_completed_value'] == 0) {
        $edit = 'true';
      }
      else {
        $edit = 'false';
      }
    }
 
    //$edit = empty($result) ? 'false' : 'true';
    //$markup = $host;
    $markup = '<div data-sendingorganisation=""
     data-activityid="' . $nid . '"
     data-basepath="'.$host.'"
     data-langpath="'.$host.'/modules/contrib/ongea_activity-module/ongea_app/build/locales/"
     data-lang="'.$language.'"
     data-edit="' . $edit . '"
     id="ongea_activity_signupform"></div>';
    return [
        '#markup' => $markup,
        '#attached' => [
            'library' =>  [
                'ongea_registration_form/ongea.regform'
            ],
        ],
    ];
  }
  /**
   * Form.
   *
   * @return string
   *   Return Hello string.
   * 
   * @$nid Activity id
   */
  public function editForm($nid) {
    $currentUser = \Drupal::currentUser();
    if ($currentUser->id() === 0) {
      return [];
    }
      // = \Drupal::service('path.current')->getPath()
    //$current_path = \Drupal::request()->getRequestUri();
    $host = \Drupal::request()->getSchemeAndHttpHost();
    $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    //$markup = $host;
    $markup = '<div data-edit="true"
     data-sendingorganisation=""
     data-activityid="' . $nid . '"
     data-basepath="'.$host.'"
     data-langpath="'.$host.'/modules/contrib/ongea_activity-module/ongea_app/build/locales/"
     data-lang="'.$language.'"
     data-edit="true"
     id="ongea_activity_signupform"></div>';
    return [
        '#markup' => $markup,
        '#attached' => [
            'library' =>  [
                'ongea_registration_form/ongea.regform'
            ],
        ],
    ];
  }

  /**
   * Form.
   *
   * @return string
   *   Return Hello string.
   */
  public function check($email = '') {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Allow-Headers: Authorization, X-Restful-Minor-Version, X-Csrf-Token, X-Access-Token, X-USER-SESSION-TOKEN,accept, content-type, Cookie');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, PUT, DELETE');


    $db = \Drupal::database();
    $query = $db->select('users_field_data', 'd')
        ->fields('d', array('mail'))
        ->condition('d.mail', $email);
    $mails = $query->execute()->fetchCol();
    $out = ['user' => empty($mails) ? FALSE : TRUE];
    print json_encode($out);
    die();
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
