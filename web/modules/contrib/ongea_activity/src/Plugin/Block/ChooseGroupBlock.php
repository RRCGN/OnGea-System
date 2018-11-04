<?php
/**
 * @file
 * Contains \Drupal\ongea_activity\Plugin\Block\ChooseGroupBlock.
 */
namespace Drupal\ongea_activity\Plugin\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;
/**
 * Provides a 'choose_group' block.
 *
 * @Block(
 *   id = "choose_group_block",
 *   admin_label = @Translation("Choose organization"),
 *   category = @Translation("Forms")
 * )
 */
class ChooseGroupBlock extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {

    $form = \Drupal::formBuilder()->getForm('Drupal\ongea_activity\Form\ChooseGroupForm');
    return $form;
  }
}