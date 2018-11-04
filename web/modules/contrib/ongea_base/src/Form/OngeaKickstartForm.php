<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 13.07.18
 * Time: 23:29
 */

namespace Drupal\ongea_base\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class OngeaKickstartForm extends FormBase
{
    /**
     * {@inheritdoc}
     */
    public function getFormId()
    {
        return 'ongea_kickstart_form';
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state)
    {
        $form['hosting_organisation'] = array(
            '#type' => 'textfield',
            '#title' => t('Hosting Organisation:'),
            '#required' => TRUE,
        );
        $form['hosting_organisation_mail'] = array(
            '#type' => 'email',
            # default -> system mail
            '#title' => t('Email ID:'),
            '#required' => TRUE,
        );

        $form['actions']['#type'] = 'actions';
        $form['actions']['submit'] = array(
            '#type' => 'submit',
            '#value' => $this->t('Save'),
            '#button_type' => 'primary',
        );
        return $form;
    }


    /**
     * {@inheritdoc}
     */
    public function validateForm(array &$form, FormStateInterface $form_state) {
        if (strlen($form_state->getValue('hosting_organisation')) < 1) {
            $form_state->setErrorByName('candidate_number', $this->t('Host Organisation Name is too short.'));
        }
    }


    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state) {
        // drupal_set_message($this->t('@can_name ,Your application is being submitted!', array('@can_name' => $form_state->getValue('candidate_name'))));
        foreach ($form_state->getValues() as $key => $value) {
            drupal_set_message($key . ': ' . $value);
        }
    }
}