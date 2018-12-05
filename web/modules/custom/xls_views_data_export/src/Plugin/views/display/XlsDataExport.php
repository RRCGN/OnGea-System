<?php

namespace Drupal\xls_views_data_export\Plugin\views\display;

use Drupal\Component\Utility\Html;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\rest\Plugin\views\style\Serializer;

use Drupal\views_data_export\Plugin\views\display\DataExport;
use Symfony\Component\Routing\RouteCollection;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Cache\CacheableResponse;
use Symfony\Component\Routing\Route;
use Symfony\Component\HttpFoundation\Request;

use Drupal\file\Entity\File;
use Drupal\view\Entity\Views;
use PHPExcel_IOFactory;
use PHPExcel;
use PHPExcel_Worksheet;

/**
 * An extension of data_export display plugin
 * to provide a form on render that gets information
 * relevant to altering an existing file.
 */
class XlsDataExport extends DataExport {
  /**
   * The display plugin that this class is applicable for.
   *
   * @var string
   */
  const DISPLAY_PLUGIN = 'data_export';

  /**
   * {@inheritdoc}
   */
  public function collectRoutes(RouteCollection $collection) {
      parent::collectRoutes($collection);

      // @todo get the route $route_name.export route to be recognized in the system as the views route name. 
      // maybe using             $this->setOption('route_name', 'view.$view_id.$display_id.export');
      $view_id = $this->view->storage->id();
      $display_id = $this->display['id'];
      // only make export route if view option Allow export is true
      if ($route = $collection->get("view.$view_id.$display_id")) {
        if ($this->getContentType() === 'xls') {
          $export_route = $this->getExportRoute($view_id, $display_id);
          if( $this->getOption('flip_path') ){
            $export_route->setPath($route->getPath().'/{_excel_file}/{_worksheet_name}/{_override_sheet}');
            $route->setPath($route->getPath() . '/result');
            
            $collection->remove("view.$view_id.$display_id");
            $collection->add("view.$view_id.$display_id.result", $route);

          }
          // keep the route called export so it is handled properly
          $collection->add("view.$view_id.$display_id.export", $export_route);
          
        }
      }
      
      
  }

  /**
   * Generates a route entry for a given view and display.
   *
   * @param string $view_id
   *   The ID of the view.
   * @param string $display_id
   *   The current display ID.
   *
   * @return \Symfony\Component\Routing\Route
   *   The route for the view.
   *
   * @todo streamline export route creation
   */
  protected function getExportRoute($view_id, $display_id) {
    $defaults = [
      '_form' => 'Drupal\xls_views_data_export\Form\XlsExportForm',
      '_title' => "Choose Export Location",
      'view_id' => $view_id,
      'display_id' => $display_id,
      '_excel_file' => $this->getOption('default_fid') ?: -1,
      '_worksheet_name' => $this->getOption('default_worksheet_name') ?: '',
      '_override_sheet' => $this->getOption('default_override_sheet') ?: FALSE
    ];

    // @todo How do we apply argument validation?
    $bits = explode('/', $this->getOption('path'));
    // @todo Figure out validation/argument loading.
    // Replace % with %views_arg for menu autoloading and add to the
    // page arguments so the argument actually comes through.
    $arg_counter = 0;
    $argument_ids = array_keys((array) $this->getOption('arguments'));
    $total_arguments = count($argument_ids);

    $argument_map = [];

    // Replace arguments in the views UI (defined via %) with parameters in
    // routes (defined via {}). As a name for the parameter use arg_$key, so
    // it can be pulled in the views controller from the request.
    foreach ($bits as $pos => $bit) {
      if ($bit == '%') {
        // Generate the name of the parameter using the key of the argument
        // handler.
        $arg_id = 'arg_' . $arg_counter++;
        $bits[$pos] = '{' . $arg_id . '}';
        $argument_map[$arg_id] = $arg_id;
      }
      elseif (strpos($bit, '%') === 0) {
        // Use the name defined in the path.
        $parameter_name = substr($bit, 1);
        $arg_id = 'arg_' . $arg_counter++;
        $argument_map[$arg_id] = $parameter_name;
        $bits[$pos] = '{' . $parameter_name . '}';
      }
    }

    // Add missing arguments not defined in the path, but added as handler.
    while (($total_arguments - $arg_counter) > 0) {
      $arg_id = 'arg_' . $arg_counter++;
      $bit = '{' . $arg_id . '}';
      // In contrast to the previous loop add the defaults here, as % was not
      // specified, which means the argument is optional.
      $defaults[$arg_id] = NULL;
      $argument_map[$arg_id] = $arg_id;
      $bits[] = $bit;
    }
    // add export path modification and parameters
    $bits[] = 'export';
    $bits[] = '{_excel_file}';
    $bits[] = '{_worksheet_name}';
    $bits[] = '{_override_sheet}';

    // If this is to be a default tab, create the route for the parent path.
    if ($this->isDefaultTabPath()) {
      $bit = array_pop($bits);
      if (empty($bits)) {
        $bits[] = $bit;
      }
    }
    $route_path = '/' . implode('/', $bits);

    $route = new Route($route_path, $defaults);

    // Add access check parameters to the route.
    $access_plugin = $this->getPlugin('access');
    if (!isset($access_plugin)) {
      // @todo Do we want to support a default plugin in getPlugin itself?
      $access_plugin = Views::pluginManager('access')->createInstance('none');
    }
    $access_plugin->alterRouteDefinition($route);
    
    $route->setRequirement('_excel_file', '\d+');
    // the below clause would prevent illegal worksheet names from being used as a parameter
    // $route->setRequirement('_worksheet_name', '^[^*\\/:?\[\] ]*[^*\\/:?\[\]]{0,30}$');
    
    // Set the argument map, in order to support named parameters.
    $route->setOption('_view_argument_map', $argument_map);
    $route->setOption('_view_display_plugin_id', $this->getPluginId());
    $route->setOption('_view_display_plugin_class', get_called_class());
    $route->setOption('_view_display_show_admin_links', $this->getOption('show_admin_links'));

    return $route;
  }

  /**
   * {@inheritdoc}
   */
  public static function buildResponse($view_id, $display_id, array $args = []) {
      // remove personal arguments before building the original views.
      $original = isset($args['_excel_file'])?$args['_excel_file']:NULL;
      $worksheet = isset($args['_worksheet_name'])?$args['_worksheet_name']:NULL;
      $override_sheet = isset($args['_override_sheet'])?$args['_override_sheet']:NULL;
      unset($args['_excel_file'], $args['_worksheet_name'], $args['_override_sheet']);
      
      $original_response = parent::buildResponse($view_id, $display_id, $args);
      $build = static::buildBasicRenderable($view_id, $display_id, $args);
      // load up the display id and view id and check if the contennt type
      if((new Request)->getFormat($original_response->headers->get('Content-type')) === 'xls'){
        
        // Setup an empty response so headers can be added as needed during views
        // rendering and processing.
        $response = new CacheableResponse('', 200);
        $build['#response'] = $response;

        /** @var \Drupal\Core\Render\RendererInterface $renderer */
        $renderer = \Drupal::service('renderer');
        $file_system = \Drupal::service('file_system');

        $serialized = $renderer->renderRoot($build);

        // only do it if the serialized_file is gucci
        if($original && $worksheet){
          try {
          // get the actual output file.
          // combines the file with the original output file
            $original = $file_system->realpath($original->getFileUri());
            $original = PHPExcel_IOFactory::load($original);
            
            // based on file_unmanaged_save_data().
            $file_destination = $file_system->tempnam('temporary://', 'xls_views_export');
            $file_destination = $file_system->realpath($file_destination);
            file_put_contents($file_destination, $serialized);
                        // There is an expectation here that there is only one sheet in this xls view
            $xls_view = PHPExcel_IOFactory::load($file_destination);

            $result_sheet = $xls_view->getActiveSheet();
            // move or overide in new worksheet
            // @todo get setting to ovveride
            static::setUpExternal($original, $result_sheet, $worksheet, $override_sheet);
            $result_sheet = $original->addExternalSheet($result_sheet);

            $original->setActiveSheetIndex($original->getIndex($result_sheet));
            
            $writer = PHPExcel_IOFactory::createWriter($original, 'Excel2007');
            ob_start();
            $writer->save('php://output');
            $output = ob_get_clean();

            $response->setContent($output);
            $cache_metadata = CacheableMetadata::createFromRenderArray($build);
            $response->addCacheableDependency($cache_metadata);
            $response->headers = $original_response->headers;
            return $response;
          } catch(\Exception $e) {
            // default back to the original file if something messes up.
            \Drupal::logger('xls_views_data_export')->error('Could not export as a sheet on given excel file because: ' . $e->getMessage() . ' ' . $e->getTraceAsString());
          }
        }
      }
      return $original_response;
  }

  /**
   * Adds an external worksheet to a workbook
   *
   * @param \PHPExcel &$workbook
   *   The workbook the worksheet will go into
   * @param \PHPExcel_Worksheet &$worksheet
   *   The worksheet.
   * @param string $worksheet_name
   *   The worksheet name.
   * @param bool $override
   *   Whether to override existing file.
   *   Defaults to FALSE
   */
  protected static function setUpExternal(PHPExcel &$workbook, PHPExcel_Worksheet &$worksheet, $worksheet_name, $override = FALSE){
    // do it the normal way if the sheet doesn't exist or override is set to FALSE. 
    if($override && $workbook->sheetNameExists($worksheet_name) ){
      $overriden = $workbook->getSheetByName($worksheet_name);
      $worksheet->setTitle($overriden->getTitle());
      $worksheet->setCodeName($overriden->getCodeName());
      
      // delete overriden sheet
      $workbook->removeSheetByIndex($workbook->getIndex($overriden));
    } else {
      $code_name = "";
      static::ensureValidWorksheetNames($workbook, $worksheet_name, $code_name);
      $worksheet->setTitle($worksheet_name);
      $worksheet->setCodeName($code_name);
    }
  }

  /**
   * Provides a sheet name that will be valid in the given workbook
   *
   * @param \PHPExcel $workbook
   *   The workbook the sheet name wants to be used for.
   * @param string &$sheet_name
   *   The desired sheet name.
   * @param string &$code_name
   *   The desired code name.
   *
   * @return string
   *    A sheet name that as generated by Excel will be similar
   *    but valid even if there is another one of the same name.
   */
  protected static function ensureValidWorksheetNames(PHPExcel $workbook, &$sheet_name, &$code_name){
    $sheet = $workbook->createSheet();
    $sheet->setTitle($sheet_name);
    $sheet->setCodeName($sheet->getTitle());

    $sheet_name = $sheet->getTitle();
    $code_name = $sheet->getCodeName();
    
    $workbook->removeSheetByIndex($workbook->getIndex($sheet));

    return $sheet_name;
  }

  /**
   * {@inheritdoc}
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);

    switch ($form_state->get('section')) {
      case 'path':
        $form['#title'] .= $this->t('The menu path or URL of this view');
        $form['path']['#description'] .= $this->t('. Navigate to the above path plus /export/%excel_file/%worksheet_name to provide extra information just before downloading. excel_file and worksheet_name are optional url parameters');

        // get a file_id (as route parameters)
        // default file id
        $form['flip_path'] = array(
          '#type' => 'checkbox',
          '#title' =>  $this->t('Switch the Export Route'),
          '#description' => $this->t('Make the Export route the normal route (with the same route parameters). The old result route will be kept at the set path plus /result'),
          '#default_value' => $this->getOption('flip_path') ?: FALSE
        );
        // should do checks if the file id is valid. 
        $form['default_fid'] = array(
          '#type' => 'entity_autocomplete',
          '#target_type' => 'file',
          '#title' =>  $this->t('Default File ID'),
          '#description' => $this->t('The Default file id to use if one isn\'t provided. Leave blank to upload a file each time.'),
          '#default_value' => File::load($this->getOption('default_fid'))
        );
        // get a worksheet name (as route parameters)
        // default worksheet name
        $form['default_worksheet_name'] = array(
          '#type' => 'machine_name',
          '#title' => $this->t('Default Worksheet Name'),
          '#description' => $this->t('Disallowed Characters: * \ / : ? [ ] <br> Maximum Characters: 31'),
          '#required' => FALSE,
          '#default_value' =>$this->getOption('default_worksheet_name') ?: 'Worksheet',
          '#maxlength' => 31,
          '#machine_name' => array(
            'source' => array(),
            'exists' => '\Drupal\xls_views_data_export\Form\XlsExportForm::worksheetExists',
            'replace_pattern' => '[*\\/:?\[\]]+',
            'label' => $this->t('Default Worksheet Name'),
            'error' => $this->t('Disallowed Characters: * \ / : ? [ ] <br> Maximum Characters: 31'),
            'standalone' => TRUE
          )
        );
        $form['default_override_sheet'] = array(
          '#type' => 'checkbox',
          '#title' => $this->t('Override Worksheet if it exists in workbook by default?'),
          '#default_value' => $this->getOption('default_override_sheet') ?: FALSE,
        );
        break;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function validateOptionsForm(&$form, FormStateInterface $form_state){
    parent::validateOptionsForm($form, $form_state);
      $xls_mime_types = array(
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      if ($form_state->get('section') == 'path') {
        $fid = $form_state->getValue('default_fid');
        if ($file = File::load($fid)) {
          if(!in_array($file->getMimeType(), $xls_mime_types)){
            $form_state->setErrorByName('default_fid', 'This file entity must point to an xls or xlsx file');
          }
        }
      }
  }
  /**
   * {@inheritdoc}
   */
  public function submitOptionsForm(&$form, FormStateInterface $form_state) {
    parent::submitOptionsForm($form, $form_state);
    $section = $form_state->get('section');
    switch ($section) {
      case 'path':
        $this->setOption('default_fid', $form_state->getValue('default_fid'));
        $this->setOption('default_worksheet_name', $form_state->getValue('default_worksheet_name'));
        $this->setOption('default_override_sheet', (bool) $form_state->getValue('default_override_sheet'));
        $this->setOption('flip_path', (bool) $form_state->getValue('flip_path'));
        break;
    }
  }
}
