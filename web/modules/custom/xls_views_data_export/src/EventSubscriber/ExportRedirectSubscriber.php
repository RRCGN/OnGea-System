<?php

namespace Drupal\xls_views_data_export\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\Event;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Drupal\Core\Routing\RouteMatchInterface;

use Drupal\xls_views_data_export\Plugin\views\display\XlsDataExport;
use Drupal\file\Entity\File;

/**
 * Class ExportRedirectSubscriber.
 *
 * @package Drupal\xls_views_data_export
 */
class ExportRedirectSubscriber implements EventSubscriberInterface {

  /**
    * The current route match object.
    *
    * @var \Drupal\commerce\Routing\RouteMatchInterface
    */
  protected $routeMatch;

  /**
   * The allowed xls mime types.
   *
   * @var string[]
   */
  protected $xls_content_types;

  /**
   * Constructs an ExportRedirectSubscriber.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface $current_route_match
   *   The current route match object
   */
  public function __construct(RouteMatchInterface $current_route_match) {
    $this->routeMatch = $current_route_match;
    $this->xls_content_types = array(
      'xls',
      'xlsx'
    );
  }

  /**
   * {@inheritdoc}
   */
  static function getSubscribedEvents() {
    // this priority is to kind of ensure that it happens 
    //after the route match was setup and the formats where 
    // added into requests etc. 
    $events[KernelEvents::REQUEST][] = array('exportRedirect', -64);
    return $events;
  }

  /**
   * Redirects export if all the necessary route parameters
   * so that they get the current response. 
   *
   * @param Symfony\Component\HttpKernel\Event\GetResponseEvent $event
   */
  public function exportRedirect(GetResponseEvent $event) {
    $response = $event->getResponse();
    $request =  $event->getRequest();
    // figure out if this a xls form route
    $view_id = $this->routeMatch->getParameter('view_id');
    $display_id = $this->routeMatch->getParameter('display_id');
    if( isset($view_id) && isset($display_id) && $this->routeMatch->getRouteName() == "view.$view_id.$display_id.export" ){
      $args = $this->getViewArgs($this->routeMatch);
      $excel_file = $this->routeMatch->getParameter('_excel_file');
      $excel_file = File::load($excel_file);
      if($excel_file && in_array($request->getFormat($excel_file->getMimeType()), $this->xls_content_types)){
        $file = $excel_file;
      }
      $worksheet_name = $this->routeMatch->getParameter('_worksheet_name');
      $override_sheet = (bool) $this->routeMatch->getParameter('_override_sheet');
      // clean worksheet_name
      $worksheet_name = trim(preg_replace('/[*\\/:?\[\]]+/', '', $worksheet_name));
      if(!empty($worksheet_name) && !empty($file)){
        $args['_excel_file'] = $file;
        $args['_worksheet_name'] = $worksheet_name;
        $args['_override_sheet'] = $override_sheet;
        $event->setResponse(XlsDataExport::buildResponse($view_id, $display_id, $args));
      }
    }
  }

  /**
   * Get the view arguments from a route.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface|NULL $route_match
   *   The route match where the arguments are stored.
   *
   * @see Drupal\xls_views_data_export\Form\XlsExportForm::getViewArgs
   */
  protected function getViewArgs(RouteMatchInterface $route_match = NULL){
    if(!isset($route_match)){
      return array();
    } else {
      $route = $route_match->getRouteObject();
      $map = $route->hasOption('_view_argument_map') ? $route->getOption('_view_argument_map') : [];
      $args = array();
      
      foreach ($map as $attribute => $parameter_name) {
        // Allow parameters be pulled from the request.
        // The map stores the actual name of the parameter in the request. Views
        // which override existing controller, use for example 'node' instead of
        // arg_nid as name.
        if (isset($map[$attribute])) {
          $attribute = $map[$attribute];
        }
        if ($arg = $route_match->getRawParameter($attribute)) {
        }
        else {
          $arg = $route_match->getParameter($attribute);
        }

        if (isset($arg)) {
          $args[] = $arg;
        }
      }
      return $args;
    }
  } 

}
