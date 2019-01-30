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
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Provides a block with a simple text.
 *
 * @Block(
 *   id = "incomplete_signup_block",
 *   admin_label = @Translation("Incomplete Signups"),
 * )
 */
class IncompleteSignupBlock extends BlockBase
{
    /**
     * {@inheritdoc}
     */
    public function build()
    {
        $currentUser = \Drupal::service('current_user');

        $db = \Drupal::database();
        $query = $db->select('node__field_ongea_activity_mobilities', 'm');
        $query->distinct();
        $query->join('node_field_data', 'n', 'm.entity_id = n.nid');
        $query->join('node__field_ongea_participant', 'p', 'm.field_ongea_activity_mobilities_target_id = p.entity_id');        
        $query->join('node__field_ongea_participant_user', 'u', 'p.field_ongea_participant_target_id = u.entity_id');
        $query->join('node__field_ongea_online_sign_up', 's', 's.entity_id = m.entity_id');
        $query->join('node__field_ongea_signup_isactive', 'a', 'a.entity_id = s.field_ongea_online_sign_up_target_id');
        $query->leftJoin('node__field_completed', 'c', 'm.field_ongea_activity_mobilities_target_id = c.entity_id');
        $query->fields('m', array('entity_id'))
              ->fields('n', array('title'))
              ->fields('c', array('field_completed_value'))
              ->condition('u.field_ongea_participant_user_target_id', $currentUser->id())
              ->condition('a.field_ongea_signup_isactive_value', 1);
        $results = $query->execute()->fetchAll();
        $out = [];

        foreach ($results as $result) {
            if (empty($result->field_completed_value)) {
                $url = \Drupal\Core\Url::fromRoute('entity.node.canonical', ['node' => $result->entity_id]);
                //$url = $url->toString();
                $internal_link = Link::fromTextAndUrl($result->title, $url)->toString();

                $out[] = '<li>' . $internal_link . '</li>';
            }
        }
        return [
            '#markup' => empty($out) ? '' : '<ul>' . implode('', $out) . '</ul>',
            '#cache' => array('max-age' => 0)
        ];
    }
    
    public function getCacheMaxAge() {
        return 0;
    }

    /**
     * {@inheritdoc}
     */
    protected function blockAccess(AccountInterface $account) {
        return AccessResult::allowedIfHasPermission($account, 'access content');
    }
}