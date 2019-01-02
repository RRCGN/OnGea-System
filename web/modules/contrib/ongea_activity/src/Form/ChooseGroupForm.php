<?php
/**
 * @file
 * Contains \Drupal\ongea_activity\Form\ChooseGroupForm.
 */
namespace Drupal\ongea_activity\Form;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
class ChooseGroupForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'choose_group_form';
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    
    $current_user = \Drupal::currentUser();
    $groups = ongea_activity_get_user_groups($current_user);
    if (!empty($groups)) {

      $options = $gids = [];
      $gids = [];
      foreach ($groups as $gr) {
        $gids[] = $gr->id();
      }
      
      $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $db = \Drupal::database();
      $query = $db->select('group_content_field_data', 'g');
      $query->join('node_field_data', 'n', 'n.nid = g.entity_id');
      $query->distinct()
            ->fields('g', array('gid'))
            ->fields('n', array('title'))
            ->condition('g.gid', $gids, 'IN')
            ->condition('n.type', 'ongea_organisation')
            ->condition('n.langcode', $language)
            ->condition('g.type', "%" . $db->escapeLike('group_content_type') . "%", 'LIKE');
      $results = $query->execute()->fetchAll();

      foreach ($results as $result) {
          $options[$result->gid] = $result->title;
      }
      if (empty($_SESSION['ongea']['selected_group']) || !in_array($_SESSION['ongea']['selected_group'], $gids)) {
          $_SESSION['ongea']['selected_group'] = $groups[0]->id();
      }
      $form['group_name'] = array(
        '#type' => 'select',
        '#title' => $this->t('Choose organization:'),
        '#options' => $options,
        '#default_value' => $_SESSION['ongea']['selected_group'],
        '#attributes' => ['onChange' => 'document.getElementById("choose-group-form").submit()'],
        '#required' => TRUE,
      );
      $form['actions']['#type'] = 'actions';
      $form['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => 'Submit',
        '#attributes' => ['class' => ['hidden']],
        '#button_type' => 'primary',
      );
    } else {
      unset($_SESSION['ongea']['selected_group']);
    }
    return $form;
  }
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $_SESSION['ongea']['selected_group'] = $form_state->getValue('group_name');
    $_SESSION['ongea']['manually_selected_group'] = TRUE;
  }
}