<?php

namespace Drupal\xls_views_data_export\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\xls_views_data_export\Plugin\views\display\XlsDataExport;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\file\Entity\File;

/**
 * Class XlsExportForm.
 *
 * @package Drupal\xls_views_data_export\Form
 */
class XlsExportForm extends FormBase {
  
  /**
   * Uploaded file entity.
   *
   * @var \Drupal\file\Entity\File
   */
  protected $file;

  /**
   * The allowed xls mime types.
   *
   * @var string[]
   */
  protected $xls_mime_types = array(
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'xls_export_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $view_id = NULL, $display_id = NULL, RouteMatchInterface $route_match = NULL) {
    $excel_file = $route_match->getParameter('_excel_file');
    $excel_file = File::load($excel_file);
    if($excel_file && in_array($excel_file->getMimeType(), $this->xls_mime_types)){
      $this->file = $excel_file;
    }
    $worksheet_name = $route_match->getParameter('_worksheet_name');
    // clean worksheet_name
    $worksheet_name = preg_replace('/[*\\/:?\[\]]+/', '', $worksheet_name);

    $override_sheet = (bool) $route_match->getParameter('_override_sheet');

    $form['export_external'] = array(
      '#type' => 'checkbox',
      '#title' => t('Export to existing Excel Workbook'),
      '#default_value' => TRUE,
      '#weight' => -1,
    );
    
    $validators = array(
      'file_validate_extensions' => array('xls xlsx'),
      'file_validate_size' => array(file_upload_max_size()),
    );
    if($excel_file == '-1' || is_null($this->file)){
      $form['excel_file'] = array(
        '#type' => 'file',
        '#title' => $this->t('Excel File'),
        '#description' => array(
          '#theme' => 'file_upload_help',
          '#description' => $this->t('An excel file'),
          '#upload_validators' => $validators,
        ),
        '#upload_validators' => $validators
      );
    } else {
      $form['excel_file'] = array(
        '#type' => 'entity_autocomplete',
        '#target_type' => 'file',
        '#default_value' => $this->file,
        '#disabled' => TRUE
      );
    }
    // @see PHPExcel_Worksheet::checkSheetTitle
    $form['worksheet_name'] = array(
      '#type' => 'machine_name',
      '#title' => $this->t('Worksheet Name'),
      '#description' => $this->t('Disallowed Characters: * \ / : ? [ ] <br> Maximum Characters: 31'),
      // @todo  set default value to file name from style plugin settings
      '#default_value' => $worksheet_name ?: 'Worksheet',
      '#maxlength' => 31,
      '#machine_name' => array(
        'source' => array(),
        'exists' => '\Drupal\xls_views_data_export\Form\XlsExportForm::worksheetExists',
        'replace_pattern' => '[*\\/:?\[\]]+',
        'label' => $this->t('Worksheet Name'),
        'error' => $this->t('Disallowed Characters: * \ / : ? [ ] <br> Maximum Characters: 31'),
        'standalone' => TRUE
      )
    );
    $form['override_sheet'] = array(
      '#type' => 'checkbox',
      '#title' => 'Override sheet if it already exists?',
      '#default_value' => $override_sheet,
    );
    $form['excel_file']['#states']['visible'][':input[name="export_external"]']['checked'] = TRUE;
    $form['worksheet_name']['#states']['visible'][':input[name="export_external"]']['checked'] = TRUE;
    $form['override_sheet']['#states']['visible'][':input[name="export_external"]']['checked'] = TRUE;
    $form['submit'] = array(
        '#type' => 'submit',
        '#value' => $this->t('Get Excel File'),
    );

    return $form;
  }

  /**
    * {@inheritdoc}
    */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
    $export_external = $form_state->getValue('export_external');

    if($export_external){
      if(!$this->file) {
        $this->file = file_save_upload('excel_file', $form['excel_file']['#upload_validators'], FALSE, 0);
        // Ensure we have the file uploaded.
        if (!$this->file) {
          $form_state->setErrorByName('excel_file', $this->t('Excel File not found.'));
        }
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $view_id = $form_state->getBuildInfo()['args'][0];
    $display_id = $form_state->getBuildInfo()['args'][1];
    $route_match = $form_state->getBuildInfo()['args'][2];
    $args = $this->getViewArgs($route_match);

    $export_external = $form_state->getValue('export_external');
    // should figure out what style plugin is being used ...  and settings
    // such that all the other types of serialization are not effected. 
    if($export_external){
      // nothing to do here but pass of as data export
      $args['_excel_file'] = $this->file;
      $args['_worksheet_name'] = trim($form_state->getValue('worksheet_name'));
      $args['_override_sheet'] = (bool) $form_state->getValue('override_sheet');
      // when setting the response, the form isn't rebuilt or anything. And since the file is downloaded (usually)
      // the form remains on the screen which is bad for UX. 
      // reloading the tab will tell you to leave but that is not helpful.
    }
    $form_state->setResponse(XlsDataExport::buildResponse($view_id, $display_id, $args));
    // need to somehow re-redirect to somewhere else.

  }

  /**
   * Get the view arguments from a route.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface|NULL $route_match
   *   The route match where the arguments are stored.
   *
   * @see Drupal\views\Routing\ViewPageController::handle
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

  /**
   * For machine name exists callback.
   *
   * For now say it always doesn't exist
   * @todo check the excel file worksheet list for existing names.
   * 
   * @param string $item
   *   The Excel Worksheet name.
   *
   * @return bool
   */
  public static function worksheetExists($worksheet_name){
    return FALSE;
  }

}
