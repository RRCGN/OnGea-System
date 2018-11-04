<?php

namespace Drupal\switch_page_theme\Form;

use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\domain\DomainLoader;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Configuration page for Switch page theme settings.
 */
class SwitchPageThemeSettingForm extends ConfigFormBase {

  /**
   * The module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * The Domain loader.
   *
   * @var \Drupal\domain\DomainLoader
   */
  protected $domainLoader;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * {@inheritdoc}
   */
  public function __construct(ModuleHandlerInterface $module_handler, DomainLoader $domain_loader = NULL, LanguageManagerInterface $language_manager = NULL) {
    $this->moduleHandler = $module_handler;
    if ($domain_loader) {
      $this->domainLoader = $domain_loader;
    }
    if ($language_manager) {
      $this->languageManager = $language_manager;
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $domainServices = NULL;
    $languageServices = NULL;
    if ($container->has('domain.loader')) {
      $domainServices = $container->get('domain.loader');
    }
    if ($container->has('language_manager')) {
      $languageServices = $container->get('language_manager');
    }
    return new static(
      $container->get('module_handler'),
      $domainServices,
      $languageServices
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'switch_page_theme_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'switch_page_theme.settings',
    ];
  }

  /**
   * {@inheritdoc}
   *
   * Implements admin settings form.
   *
   * @param array $form
   *   From render array.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   Current state of form.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildForm($form, $form_state);
    // Fetch configurations if saved.
    $config = $this->config('switch_page_theme.settings');

    // Instructions.
    $availableSettings = $this->t('Roles');
    if ($this->moduleHandler->moduleExists('domain')) {
      $availableSettings .= '/' . $this->t('Domains');
    }
    if ($this->languageManager->isMultilingual() || $this->moduleHandler->moduleExists('language')) {
      $availableSettings .= '/' . $this->t('Languages');
    }
    $form['desc'] = [
      '#type' => 'markup',
      '#markup' => $this->t('<b>Enabled:</b> Rule will work only if checkbox is checked.<br><b>Pages:</b> Enter one path per line. The "*" character is a wildcard. Example paths are "/node/1" for an individual piece of content or "/node/*" for every piece of content. "@front" is the front page.<br><b>@availableSettings:</b> Select none to allow all.<br><br>Theme with highest weight will be applied on the page.', ['@availableSettings' => $availableSettings, '@front' => '<front>']),
    ];

    // Create headers for table.
    $header = [
      $this->t('Enabled'),
      $this->t('pages'),
      $this->t('Themes'),
      $this->t('Roles'),
    ];
    if ($this->moduleHandler->moduleExists('domain')) {
      $header[] = $this->t('Domain');
    }
    if ($this->languageManager->isMultilingual() || $this->moduleHandler->moduleExists('language')) {
      $header[] = $this->t('Language');
    }
    array_push($header, $this->t('Operation'), $this->t('Weight'));

    // Multi value table form.
    $form['spt_table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#empty' => $this->t('There are no items yet. Add an item.', []),
      '#prefix' => '<div id="spt-fieldset-wrapper">',
      '#suffix' => '</div>',
      '#tabledrag' => [
        [
          'action' => 'order',
          'relationship' => 'sibling',
          'group' => 'spt_table-order-weight',
        ],
      ],
    ];

    // Available themes.
    $themes = system_list('theme');
    $themeNames[''] = '--Select--';
    foreach ($themes as $key => $value) {
      $themeNames[$key] = $value->info['name'];
    }

    // Set table values on Add/Remove or on page load.
    $spt_table = $form_state->get('spt_table');
    if (empty($spt_table)) {
      // Set data from configuration on page load.
      // Set empty element if no configurations are set.
      if (NULL !== $config->get('spt_table')) {
        $spt_table = $config->get('spt_table');
        $form_state->set('spt_table', $spt_table);
      }
      else {
        $spt_table = [''];
        $form_state->set('spt_table', $spt_table);
      }
    }

    // Create row for table.
    foreach ($spt_table as $i => $value) {
      $form['spt_table'][$i]['#attributes']['class'][] = 'draggable';
      $form['spt_table'][$i]['status'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Status'),
        '#title_display' => 'invisible',
        '#default_value' => isset($value['status']) ? $value['status'] : [],
      ];

      $form['spt_table'][$i]['pages'] = [
        '#type' => 'textarea',
        '#title' => $this->t('Pages'),
        '#title_display' => 'invisible',
        '#required' => TRUE,
        '#cols' => '5',
        '#rows' => '5',
        '#default_value' => isset($value['pages']) ? $value['pages'] : [],
      ];

      $form['spt_table'][$i]['theme'] = [
        '#type' => 'select',
        '#title' => $this->t('Theme'),
        '#title_display' => 'invisible',
        '#options' => $themeNames,
        '#required' => TRUE,
        '#default_value' => isset($value['theme']) ? $value['theme'] : [],
      ];

      $form['spt_table'][$i]['roles'] = [
        '#type' => 'checkboxes',
        '#title' => $this->t('Roles'),
        '#title_display' => 'invisible',
        '#options' => user_role_names(),
        '#default_value' => isset($value['roles']) ? $value['roles'] : [],
      ];

      // Add Domains if domain module is available.
      if ($this->moduleHandler->moduleExists('domain')) {
        foreach ($this->domainLoader->loadMultiple() as $domain_key => $domain) {
          $domainNames[$domain_key] = $domain->getHostname();
        }

        $form['spt_table'][$i]['domain'] = [
          '#type' => 'checkboxes',
          '#title' => $this->t('Domain'),
          '#title_display' => 'invisible',
          '#options' => $domainNames,
          '#default_value' => isset($value['domain']) ? $value['domain'] : [],
        ];
      }

      // Add Language if site is multilingual.
      if ($this->languageManager->isMultilingual() || $this->moduleHandler->moduleExists('language')) {
        foreach ($this->languageManager->getLanguages() as $langkey => $langvalue) {
          $langNames[$langkey] = $langvalue->getName();
        }
        $form['spt_table'][$i]['language'] = [
          '#type' => 'checkboxes',
          '#title' => $this->t('Language'),
          '#title_display' => 'invisible',
          '#options' => $langNames,
          '#default_value' => isset($value['language']) ? $value['language'] : [],
        ];
      }

      $form['spt_table'][$i]['remove'] = [
        '#type' => 'submit',
        '#value' => $this->t('Remove'),
        '#name' => "remove-" . $i,
        '#submit' => ['::removeElement'],
        '#limit_validation_errors' => [],
        '#ajax' => [
          'callback' => '::removeCallback',
          'wrapper' => 'spt-fieldset-wrapper',
        ],
        '#index_position' => $i,
      ];

      // TableDrag: Weight column element.
      $form['spt_table'][$i]['weight'] = [
        '#type' => 'weight',
        '#title_display' => 'invisible',
        '#default_value' => isset($value['weight']) ? $value['weight'] : [],
        '#attributes' => ['class' => ['spt_table-order-weight']],
      ];
    }

    $form['add_name'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add one more'),
      '#submit' => ['::addOne'],
      '#ajax' => [
        'callback' => '::addmoreCallback',
        'wrapper' => 'spt-fieldset-wrapper',
      ],
    ];

    $form_state->setCached(FALSE);

    return parent::buildForm($form, $form_state);
  }

  /**
   * Callback for ajax-enabled add buttons.
   *
   * Selects and returns the fieldset with the names in it.
   */
  public function addmoreCallback(array &$form, FormStateInterface $form_state) {
    return $form['spt_table'];
  }

  /**
   * Submit handler for the "Add one more" button.
   *
   * Add a blank element in table and causes a rebuild.
   */
  public function addOne(array &$form, FormStateInterface $form_state) {
    $spt_table = $form_state->get('spt_table');
    array_push($spt_table, "");
    $form_state->set('spt_table', $spt_table);
    $form_state->setRebuild();
  }

  /**
   * Callback for ajax-enabled remove buttons.
   *
   * Selects and returns the fieldset with the names in it.
   */
  public function removeCallback(array &$form, FormStateInterface $form_state) {
    return $form['spt_table'];
  }

  /**
   * Submit handler for the "Remove" button(s).
   *
   * Remove the element from table and causes a form rebuild.
   */
  public function removeElement(array &$form, FormStateInterface $form_state) {
    // Get table.
    $spt_table = $form_state->get('spt_table');
    // Get element to remove.
    $remove = key($form_state->getValue('spt_table'));
    // Remove element.
    unset($spt_table[$remove]);
    // Set an empty element if no elements are left.
    if (empty($spt_table)) {
      array_push($spt_table, "");
    }
    $form_state->set('spt_table', $spt_table);
    $form_state->setRebuild();
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Retrieve the configuration.
    $this->config('switch_page_theme.settings')
      // Set the submitted configuration setting.
      ->set('spt_table', $form_state->getValue('spt_table'))
      ->save();
    parent::submitForm($form, $form_state);
  }

}
