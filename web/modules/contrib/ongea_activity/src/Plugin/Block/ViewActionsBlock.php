<?php
/**
 * @file
 * Contains \Drupal\ongea_activity\Plugin\Block\AdminMenuBlock;
 */
namespace Drupal\ongea_activity\Plugin\Block;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Provides a block with a simple text.
 *
 * @Block(
 *   id = "ongea_view_actions_block",
 *   admin_label = @Translation("View actions block"),
 * )
 */
class ViewActionsBlock extends BlockBase
{
    /**
     * {@inheritdoc}
     */
    public function build()
    {
        $attr = [
            'attributes' => [
                'class' => ['button', 'button-action', 'button--primary', 'button--small'],
                'data-drupal-link-system-path' => 'group/' . $_SESSION['ongea']['selected_group'] . '/node/create',
            ],
        ];

        $url = \Drupal\Core\Url::fromUserInput('/group/' . $_SESSION['ongea']['selected_group'] . '/content/create/group_node%3Anews', $attr);
        //$url->setOptions($attr);
        //$url = $url->toString();
        $internal_link = Link::fromTextAndUrl(t('Create news'), $url)->toString();

        return ['#markup' => '<ul class="action-links"><li>' . $internal_link . '</li></ul>'];
    }

    /**
     * {@inheritdoc}
     */
    protected function blockAccess(AccountInterface $account) {
        return AccessResult::allowedIfHasPermission($account, 'access content');
    }
}