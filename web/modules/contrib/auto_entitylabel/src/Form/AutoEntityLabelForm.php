<?php

namespace Drupal\auto_entitylabel\Form;

use Drupal\auto_entitylabel\AutoEntityLabelManager;
use Drupal\Core\Config\ConfigFactory;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class AutoEntityLabelForm.
 *
 * @property \Drupal\Core\Config\ConfigFactoryInterface config_factory
 * @property \Drupal\Core\Entity\EntityTypeManagerInterface entity_manager
 * @property String entityType
 * @property String entityBundle
 * @property \Drupal\auto_entitylabel\AutoEntityLabelManager
 *   auto_entity_label_manager
 * @package Drupal\auto_entitylabel\Controller
 */
class AutoEntityLabelForm extends ConfigFormBase {

  /**
   * The config factory.
   *
   * Subclasses should use the self::config() method, which may be overridden to
   * address specific needs when loading config, rather than this property
   * directly. See \Drupal\Core\Form\ConfigFormBase::config() for an example of
   * this.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  protected $entityManager;

  // @codingStandardsIgnoreLine
  protected $route_match;

  /**
   * Module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  private $moduleHandler;

  /**
   * User.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  private $user;

  /**
   * The entity type machine name.
   *
   * @var string
   */
  protected $entityType;

  /**
   * The bundle machine name.
   *
   * @var string
   */
  protected $entityBundle;

  /**
   * The entity provider machine name.
   *
   * @var string
   */
  protected $entityTypeProvider;

  /**
   * AutoEntityLabelController constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   Config Factory.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_manager
   *   Entity Manager.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   Route Match.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $moduleHandler
   *   Module Handler.
   * @param \Drupal\Core\Session\AccountInterface $user
   *   Account Interface.
   */
  public function __construct(ConfigFactoryInterface $config_factory, EntityTypeManagerInterface $entity_manager, RouteMatchInterface $route_match, ModuleHandlerInterface $moduleHandler, AccountInterface $user) {
    parent::__construct($config_factory);
    $this->entityManager = $entity_manager;
    $this->route_match = $route_match;
    $route_options = $this->route_match->getRouteObject()->getOptions();
    $array_keys = array_keys($route_options['parameters']);
    $this->entityType = array_shift($array_keys);
    $entity_type = $this->route_match->getParameter($this->entityType);
    $this->entityBundle = $entity_type->id();
    $this->entityTypeProvider = $entity_type->getEntityType()->getProvider();
    $this->moduleHandler = $moduleHandler;
    $this->user = $user;
  }

  /**
   * Gets the configuration names that will be editable.
   *
   * @return array
   *   An array of configuration object names that are editable if called in
   *   conjunction with the trait's config() method.
   */
  protected function getEditableConfigNames() {
    return [
      'auto_entitylabel.settings',
    ];
  }

  /**
   * Returns a unique string identifying the form.
   *
   * @return string
   *   The unique string identifying the form.
   */
  public function getFormId() {
    return 'auto_entitylabel_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static (
      $container->get('config.factory'),
      $container->get('entity.manager'),
      $container->get('current_route_match'),
      $container->get('module_handler'),
      $container->get('current_user')
    );
  }

  /**
   * Get the config name for this entity & bundle.
   *
   * @return string
   *   The compiled config name.
   */
  protected function getConfigName() {
    return 'auto_entitylabel.settings.' . $this->entityTypeProvider . '.' . $this->entityBundle;
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config($this->getConfigName());
    /*
     * @todo
     *  Find a generic way of determining if the label is rendered on the
     *  entity form. If not, don't show 'auto_entitylabel_optional' option.
     */
    $options = [
      AutoEntityLabelManager::DISABLED => $this->t('Disabled'),
      AutoEntityLabelManager::ENABLED => $this->t('Automatically generate the label and hide the label field'),
      AutoEntityLabelManager::OPTIONAL => $this->t('Automatically generate the label if the label field is left empty'),
      AutoEntityLabelManager::PREFILLED => $this->t('Automatically prefill the label'),
    ];

    $form['auto_entitylabel'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Automatic label generation for @type', ['@type' => $this->entityBundle]),
      '#weight' => 0,
    ];

    $form['auto_entitylabel']['status'] = [
      '#type' => 'radios',
      '#default_value' => $config->get('status') ?: 0,
      '#options' => $options,
    ];

    $form['auto_entitylabel']['pattern'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Pattern for the label'),
      '#description' => $this->t('Leave blank for using the per default generated label. Otherwise this string will be used as label. Use the syntax [token] if you want to insert a replacement pattern.'),
      '#default_value' => $config->get('pattern') ?: '',
      '#attributes' => ['class' => ['pattern-label']],
    ];

    // Don't allow editing of the pattern if PHP is used, but the users lacks
    // permission for PHP.
    if ($config->get('php') && !$this->user->hasPermission('use PHP for auto entity labels')) {
      $form['auto_entitylabel']['pattern']['#disabled'] = TRUE;
      $form['auto_entitylabel']['pattern']['#description'] = $this->t('You are not allowed the configure the pattern for the label, because you do not have the %permission permission.', ['%permission' => $this->t('Use PHP for automatic entity label patterns')]);
    }

    // Display the list of available placeholders if token module is installed.
    if ($this->moduleHandler->moduleExists('token')) {
      $token_info = $this->moduleHandler->invoke($this->entityTypeProvider, 'token_info');
      $token_types = isset($token_info['types']) ? array_keys($token_info['types']) : [];
      $form['auto_entitylabel']['token_help'] = [
        '#theme' => 'token_tree_link',
        '#token_types' => $token_types,
        '#dialog' => TRUE,
      ];
    }
    else {
      $form['auto_entitylabel']['pattern']['#description'] .= ' ' . $this->t('To get a list of available tokens install <a href=":drupal-token" target="blank">Token</a> module.', [':drupal-token' => 'https://www.drupal.org/project/token']);
    }

    $form['auto_entitylabel']['php'] = [
      '#access' => $this->user->hasPermission('use PHP for auto entity labels'),
      '#type' => 'checkbox',
      '#title' => $this->t('Evaluate PHP in pattern.'),
      '#description' => $this->t('Put PHP code above that returns your string, but make sure you surround code in <code>&lt;?php</code> and <code>?&gt;</code>. Note that <code>$entity</code> and <code>$language</code> are available and can be used by your code.'),
      '#default_value' => $config->get('php'),
    ];

    $form['auto_entitylabel']['escape'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Escape special characters.'),
      '#description' => $this->t('Check this to escape all special characters.'),
      '#default_value' => $config->get('escape'),
    ];

    $form['#attached']['library'][] = 'auto_entitylabel/auto_entitylabel.admin';

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->configFactory->getEditable($this->getConfigName());
    $form_state->cleanValues();
    foreach (['status', 'pattern', 'php', 'escape'] as $key) {
      $config->set($key, $form_state->getValue($key));
    }

    /** @var \Drupal\Core\Config\Entity\ConfigEntityStorage $storage */
    $storage = $this->entityManager->getStorage($this->entityType);
    /** @var \Drupal\Core\Config\Entity\ConfigEntityType $entity_type */
    $entity_type = $storage->getEntityType();
    $prefix = $entity_type->getConfigPrefix();

    $config->set('dependencies', ['config' => [$prefix . '.' . $this->entityBundle]]);
    $config->save();
    parent::submitForm($form, $form_state);
  }

}
