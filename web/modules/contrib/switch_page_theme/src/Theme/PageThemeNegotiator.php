<?php

namespace Drupal\switch_page_theme\Theme;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Path\CurrentPathStack;
use Drupal\Core\Path\AliasManagerInterface;
use Drupal\Core\Path\PathMatcherInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Theme\ThemeNegotiatorInterface;
use Drupal\domain\DomainNegotiatorInterface;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Sets the selected theme on specified pages.
 */
class PageThemeNegotiator implements ThemeNegotiatorInterface {

  /**
   * Protected configFactory variable.
   *
   * @var Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * Protected currentPath variable.
   *
   * @var Drupal\Core\Path\CurrentPathStack
   */
  protected $currentPath;

  /**
   * Protected pathAlias variable.
   *
   * @var Drupal\Core\Path\AliasManagerInterface
   */
  protected $pathAlias;

  /**
   * Protected pathMatcher variable.
   *
   * @var Drupal\Core\Path\PathMatcherInterface
   */
  protected $pathMatcher;

  /**
   * The proxy to the current user.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $account;

  /**
   * The module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * The Domain negotiator.
   *
   * @var \Drupal\domain\DomainNegotiatorInterface
   */
  protected $negotiator;

  /**
   * Request stack.
   *
   * @var \Symfony\Component\HttpFoundation\RequestStack
   */
  public $request;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * {@inheritdoc}
   */
  public function __construct(ConfigFactoryInterface $config_factory, CurrentPathStack $currentPath, AliasManagerInterface $pathAlias, PathMatcherInterface $pathMatcher, AccountProxyInterface $account, ModuleHandlerInterface $module_handler, RequestStack $request, DomainNegotiatorInterface $negotiator = NULL, LanguageManagerInterface $language_manager = NULL) {
    $this->configFactory = $config_factory;
    $this->currentPath = $currentPath;
    $this->pathAlias = $pathAlias;
    $this->pathMatcher = $pathMatcher;
    $this->account = $account;
    $this->moduleHandler = $module_handler;
    $this->request = $request;
    if ($negotiator) {
      $this->negotiator = $negotiator;
    }
    if ($language_manager) {
      $this->languageManager = $language_manager;
    }
  }

  /**
   * Select specified pages for specified role and apply theme.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The current route match object.
   *
   * @return bool
   *   TRUE if this negotiator should be used or FALSE to let other negotiators
   *   decide.
   */
  public function applies(RouteMatchInterface $route_match) {
    global $theme;
    $applies = FALSE;

    // Get multiple configurations saved for different pages.
    $spt_table = $this->configFactory->get('switch_page_theme.settings')->get('spt_table');

    if (!$spt_table) {
      // Configuration has not been set yet.
      return FALSE;
    }

    foreach ($spt_table as $value) {
      $condition = FALSE;
      // Check if rule is enabled.
      if ($value['status'] == 1) {
        // Check condition for basic rules.
        $condition = ($this->request->getCurrentRequest()->attributes->get("_route") != "system.403" && ($this->pathMatcher->matchPath($this->currentPath->getPath(), $value["pages"]) || $this->pathMatcher->matchPath($this->pathAlias->getAliasByPath($this->currentPath->getPath()), $value["pages"])) && (!array_filter($value["roles"]) || !empty(array_intersect($value["roles"], $this->account->getRoles()))));

        // Check if domain module is enabled.
        if ($this->moduleHandler->moduleExists('domain') && !empty($this->negotiator->getActiveDomain())) {
          // Check condition for domain.
          $condition = ($condition && (!array_filter($value["domain"]) || !empty(array_intersect($value["domain"], [$this->negotiator->getActiveDomain()->id()]))));
        }

        // Check if site is multilingual.
        if ($this->languageManager->isMultilingual() || $this->moduleHandler->moduleExists('language')) {
          // Check condition for language.
          $condition = ($condition && (!array_filter($value["language"]) || !empty(array_intersect($value["language"], [$this->languageManager->getCurrentLanguage()->getId()]))));
        }

        // Check if all conditions match.
        if ($condition) {
          $applies = TRUE;
          // Set the theme to apply on page into global variable.
          $theme = $value['theme'];
        }
      }
    }
    // Use the theme.
    return $applies;
  }

  /**
   * Determine the active theme for the request.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The current route match object.
   *
   * @return string|null
   *   The name of the theme, or NULL if other negotiators, like the configured
   *   default one, should be used instead.
   */
  public function determineActiveTheme(RouteMatchInterface $route_match) {
    // Get theme to apply on page.
    global $theme;
    // Return the actual theme name.
    return $theme;
  }

}
