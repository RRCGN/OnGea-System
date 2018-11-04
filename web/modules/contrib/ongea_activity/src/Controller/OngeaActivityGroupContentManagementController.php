<?php

namespace Drupal\ongea_activity\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Class OnGeaActivityAppFormController.
 *
 * @package Drupal\ongea_activity_app\Controller
 */
class OngeaActivityGroupContentManagementController extends ControllerBase {

  /**
   *
   * @return string
   *   Return Hello string.
   */
  public function view() {
    if (isset($_SESSION['ongea']['selected_group'])) {
      return new RedirectResponse('group/' . $_SESSION['ongea']['selected_group'] . '/nodes');
      // for eg. Url::fromUserInput(\Drupal::destination()->get())->setAbsolute()->toString();    }
    }
  }
  /**
   *
   * @return string
   *   Return Hello string.
   */
  public function members() {
    if (isset($_SESSION['ongea']['selected_group'])) {
      return new RedirectResponse('group/' . $_SESSION['ongea']['selected_group'] . '/members');
      // for eg. Url::fromUserInput(\Drupal::destination()->get())->setAbsolute()->toString();    }
    }
  }

}
