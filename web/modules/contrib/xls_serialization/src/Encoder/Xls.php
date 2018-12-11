<?php

namespace Drupal\xls_serialization\Encoder;

use Drupal\Component\Serialization\Exception\InvalidDataTypeException;
use Drupal\Component\Utility\Html;
use Symfony\Component\Serializer\Encoder\EncoderInterface;

/**
 * Adds XLS encoder support for the Serialization API.
 */
class Xls implements EncoderInterface {

  /**
   * The format that this encoder supports.
   *
   * @var string
   */
  protected static $format = 'xls';

  /**
   * Format to write XLS files as.
   *
   * @var string
   */
  protected $xlsFormat = 'Excel2007';

  /**
   * Constructs an XLS encoder.
   *
   * @param string $xls_format
   *   The XLS format to use.
   */
  public function __construct($xls_format = 'Excel2007') {
    $this->xlsFormat = $xls_format;
  }

  /**
   * {@inheritdoc}
   */
  public function encode($data, $format, array $context = []) {
    switch (gettype($data)) {
      case 'array':
        // Nothing to do.
        break;

      case 'object':
        $data = (array) $data;

      default:
        $data = [$data];
        break;
    }

    try {
      // Instantiate a new excel object.
      $xls = new \PHPExcel();
      $xls->setActiveSheetIndex();
      $sheet = $xls->getActiveSheet();

      // Set headers.
      $this->setHeaders($sheet, $data, $context);

      // Set the data.
      $this->setData($sheet, $data);

      // Set the width of every column with data in it to AutoSize.
      $this->setColumnsAutoSize($sheet);

      if (!empty($context)) {
        if (!empty($context['views_style_plugin']->options['xls_settings'])) {
          $this->setSettings($context['views_style_plugin']->options['xls_settings']);
        }

        // Set any metadata passed in via the context.
        if (!empty($context['views_style_plugin']->options['xls_settings']['metadata'])) {
          $this->setMetaData($xls->getProperties(), $context['views_style_plugin']->options['xls_settings']['metadata']);
        }

        // Set the worksheet title based on the view title within the context.
        if (!empty($context['views_style_plugin']->view) && !empty($context['views_style_plugin']->view->getTitle())) {
          $sheet->setTitle($context['views_style_plugin']->view->getTitle());
        }
      }
      $writer = \PHPExcel_IOFactory::createWriter($xls, $this->xlsFormat);

      // @todo utilize a temporary file perhaps?
      // @todo This should also support batch processing.
      // @see http://stackoverflow.com/questions/9469779/how-do-i-write-my-excel-spreadsheet-into-a-variable-using-phpexcel
      ob_start();
      $writer->save('php://output');
      return ob_get_clean();
    }
    catch (\Exception $e) {
      throw new InvalidDataTypeException($e->getMessage(), $e->getCode(), $e);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function supportsEncoding($format) {
    return $format === static::$format;
  }

  /**
   * Set sheet headers.
   *
   * @param \PHPExcel_Worksheet $sheet
   *   The worksheet to set headers for.
   * @param array $data
   *   The data array.
   * @param array $context
   *   The context options array.
   */
  protected function setHeaders(\PHPExcel_Worksheet $sheet, array $data, array $context) {
    // Extract headers from the data.
    $headers = $this->extractHeaders($data, $context);
    foreach ($headers as $column => $header) {
      $sheet->setCellValueByColumnAndRow($column, 1, $this->formatValue($header));
    }
  }

  /**
   * Set any available metadata.
   *
   * @param \PHPExcel_DocumentProperties $document_properties
   *   The document properties object.
   * @param array $metadata
   *   An associative array of metadata to set on the document. The array can
   *   contain any of the following keys (with corresponding values).
   *   - 'creator': The document creator.
   *   - 'last_modified_by': The name of the person to last modify.
   *   - 'created': The time the document was created.
   *   - 'modified': The time the document was modified.
   *   - 'title': The document title.
   *   - 'description': The document description.
   *   - 'subject': The document subject.
   *   - 'keywords': Any keywords for the document.
   *   - 'category': The document category.
   *   - 'manager': The document manager.
   *   - 'company': The company that created the document.
   *   - 'custom_properties': An associative array of property name mapping to
   *     property value. If the value is an array, the first item should be the
   *     value, and the second item the property type:
   *     - 'i': integer
   *     - 'f': floating point
   *     - 's': string (default)
   *     - 'd': 'date/time'
   *     - 'b': boolean.
   */
  protected function setMetaData(\PHPExcel_DocumentProperties $document_properties, array $metadata) {
    if (isset($metadata['creator'])) {
      $document_properties->setCreator($metadata['creator']);
    }
    if (isset($metadata['last_modified_by'])) {
      $document_properties->setLastModifiedBy($metadata['last_modified_by']);
    }
    if (isset($metadata['created'])) {
      $document_properties->setCreated($metadata['created']);
    }
    if (isset($metadata['modified'])) {
      $document_properties->setModified($metadata['modified']);
    }
    if (isset($metadata['title'])) {
      $document_properties->setTitle($metadata['title']);
    }
    if (isset($metadata['description'])) {
      $document_properties->setDescription($metadata['description']);
    }
    if (isset($metadata['subject'])) {
      $document_properties->setSubject($metadata['subject']);
    }
    if (isset($metadata['keywords'])) {
      $document_properties->setKeywords($metadata['keywords']);
    }
    if (isset($metadata['category'])) {
      $document_properties->setCategory($metadata['category']);
    }
    if (isset($metadata['manager'])) {
      $document_properties->setManager($metadata['manager']);
    }
    if (isset($metadata['company'])) {
      $document_properties->setCompany($metadata['company']);
    }

    if (isset($metadata['custom_properties'])) {
      foreach ($metadata['custom_properties'] as $name => $value) {
        $type = 's';
        if (is_array($value)) {
          $type = array_pop($value);
          $value = reset($value);
        }
        $document_properties->setCustomProperty($name, $value, $type);
      }
    }
  }

  /**
   * Set sheet data.
   *
   * @param \PHPExcel_Worksheet $sheet
   *   The worksheet to put the data in.
   * @param array $data
   *   The data to be put in the worksheet.
   */
  protected function setData(\PHPExcel_Worksheet $sheet, array $data) {
    foreach ($data as $i => $row) {
      $column = 0;
      foreach ($row as $value) {
        // For some reason columns are 0-indexed, while rows are 1-indexed.
        // Since headers have been added, rows are offset here by 2.
        $sheet->setCellValueByColumnAndRow($column, $i + 2, $this->formatValue($value));
        $column++;
      }
    }
  }

  /**
   * Formats a single value for a given XLS cell.
   *
   * @param string $value
   *   The raw value to be formatted.
   *
   * @return string
   *   The formatted value.
   */
  protected function formatValue($value) {
    // @todo Make these filters configurable.
    $value = Html::decodeEntities($value);
    $value = strip_tags($value);
    $value = trim($value);

    return $value;
  }

  /**
   * Extract the headers from the data array.
   *
   * @param array $data
   *   The data array.
   * @param array $context
   *   The context options array.
   *
   * @return string[]
   *   An array of headers to be used.
   */
  protected function extractHeaders(array $data, array $context) {
    $headers = [];
    if ($first_row = reset($data)) {
      if (!empty($context)) {
        /** @var \Drupal\views\ViewExecutable $view */
        $view = $context['views_style_plugin']->view;
        $fields = $view->field;
        foreach ($first_row as $key => $value) {
          $headers[] = !empty($fields[$key]->options['label']) ? $fields[$key]->options['label'] : $key;
        }
      }
      else {
        $headers = array_keys($first_row);
      }
    }

    return $headers;
  }

  /**
   * Set XLS settings from the Views settings array.
   *
   * @param array $settings
   *   An array of XLS settings.
   */
  protected function setSettings(array $settings) {
    $this->xlsFormat = $settings['xls_format'];
  }

  /**
   * Set width of all columns with data in them in sheet to AutoSize.
   *
   * @param \PHPExcel_Worksheet $sheet
   *   The worksheet to set the column width to AutoSize for.
   */
  protected function setColumnsAutoSize(\PHPExcel_Worksheet $sheet) {
    foreach ($sheet->getColumnIterator() as $column) {
      $column_index = $column->getColumnIndex();
      $sheet->getColumnDimension($column_index)->setAutoSize(TRUE);
    }
  }

}
