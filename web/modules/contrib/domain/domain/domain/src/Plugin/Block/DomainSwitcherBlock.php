<?php

namespace Drupal\domain\Plugin\Block;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Session\AccountInterface;

/**
 * Provides a block that links to all domains.
 *
 * @Block(
 *   id = "domain_switcher_block",
 *   admin_label = @Translation("Domain switcher (for admins and testing)")
 * )
 */
class DomainSwitcherBlock extends DomainBlockBase {

  /**
   * Overrides \Drupal\block\BlockBase::access().
   */
  public function access(AccountInterface $account, $return_as_object = FALSE) {
    $access = AccessResult::allowedIfHasPermissions($account, array('administer domains', 'use domain switcher block'), 'OR');
    return $return_as_object ? $access : $access->isAllowed();
  }

  /**
   * Build the output.
   */
  public function build() {
    /** @var \Drupal\domain\DomainInterface $active_domain */
    $active_domain = \Drupal::service('domain.negotiator')->getActiveDomain();
    $items = array();
    /** @var \Drupal\domain\DomainInterface $domain */
    foreach (\Drupal::service('entity_type.manager')->getStorage('domain')->loadMultipleSorted() as $domain) {
      $string = $domain->getLink();
      if (!$domain->status()) {
        $string .= '*';
      }
      if ($domain->id() == $active_domain->id()) {
        $string = '<em>' . $string . '</em>';
      }
      $items[] = array('#markup' => $string);
    }
    return array(
      '#theme' => 'item_list',
      '#items' => $items,
    );
  }

}
