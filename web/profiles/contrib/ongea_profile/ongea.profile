<?php

/**
 * @file
 * Enables modules and site configuration for a ongea site installation.
 */

use Drupal\contact\Entity\ContactForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_FORM_ID_alter() for install_configure_form().
 *
 * Allows the profile to alter the site configuration form.
 */
function ongea_form_install_configure_form_alter(&$form, FormStateInterface $form_state)
{
    //$form['#submit'][] = 'ongea_form_install_configure_submit';
    $form['site_information']['site_name']['#attributes']['value'] = t('Ongea');
}


function ongea_install_tasks_alter(&$tasks, $install_state)
{
    $tasks['install_select_profile']['function'] = '_ongea_profile_selection';
}

// local callback function
function _ongea_profile_selection(&$install_state)
{
    $install_state['parameters']['profile'] = 'ongea';
}