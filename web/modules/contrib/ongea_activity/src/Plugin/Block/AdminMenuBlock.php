<?php
/**
 * @file
 * Contains \Drupal\ongea_activity\Plugin\Block\AdminMenuBlock;
 */
namespace Drupal\ongea_activity\Plugin\Block;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\ongea_activity\Controller\AdminMenuController;

/**
 * Provides a block with a simple text.
 *
 * @Block(
 *   id = "admin_menu_block",
 *   admin_label = @Translation("Admin menu"),
 * )
 */
class AdminMenuBlock extends BlockBase
{
    /**
     * {@inheritdoc}
     */
    public function build()
    {
        $ac = new AdminMenuController();
        $data = $ac->getData();

        // Set template array;
        $template = [
            '#theme' => 'admin_menu_block',
            '#data' => $data
        ];

        // Render this template and show it.
        $rendered = \Drupal::service('renderer')->render($template);
        return ['#markup' => $rendered];
    }

    /**
     * {@inheritdoc}
     */
    protected function blockAccess(AccountInterface $account) {
        return AccessResult::allowedIfHasPermission($account, 'access content');
    }
}