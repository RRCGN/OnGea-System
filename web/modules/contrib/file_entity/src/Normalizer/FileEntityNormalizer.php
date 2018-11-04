<?php

namespace Drupal\file_entity\Normalizer;

use Drupal\Component\Utility\SafeMarkup;
use Drupal\hal\Normalizer\ContentEntityNormalizer;

/**
 * Normalizer for File entity.
 */
class FileEntityNormalizer extends ContentEntityNormalizer {

  /**
   * {@inheritdoc}
   */
  protected $supportedInterfaceOrClass = 'Drupal\file\FileInterface';

  /**
   * {@inheritdoc}
   */
  public function normalize($entity, $format = NULL, array $context = array()) {
    $data = parent::normalize($entity, $format, $context);
    if (!isset($context['included_fields']) || in_array('data', $context['included_fields'])) {
      // Save base64-encoded file contents to the "data" property.
      $file_data = base64_encode(file_get_contents($entity->getFileUri()));
      $data += array(
        'data' => array(array('value' => $file_data)),
      );
    }
    return $data;
  }

  /**
   * {@inheritdoc}
   */
  public function denormalize($data, $class, $format = NULL, array $context = array()) {
    // Avoid 'data' being treated as a field.
    $file_data = $data['data'][0]['value'];
    unset($data['data']);
     $filename = null;
     if (isset($data['filename']['value'])) {
         $filename = $data['filename']['value'];
     } else {
         if (isset($data['filename'][0]['value'])) {
             $filename = $data['filename'][0]['value'];
         }
     }
      $filename = null;
     if (isset($data['filename']['value'])) {
         $filename = $data['filename']['value'];
     } else {
         if (isset($data['filename'][0]['value'])) {
             $filename = $data['filename'][0]['value'];
         }
     }
     $filemime = null;
     if (isset($data['filemime']['value'])) {
         $filemime = $data['filemime']['value'];
     } else {
         if (isset($data['filemime'][0]['value'])) {
             $filemime = $data['filemime'][0]['value'];
         }
     }
     $suffix = null;
     switch ($filemime) {
         case 'image/png':
             $suffix = 'png';
             break;
         case 'image/jpg':
             $suffix = 'jpg';
             break;
         case 'image/jpeg':
             $suffix = 'jpg';
             break;
         case 'image/gif':
             $suffix = 'gif';
             break;
     }
        $date = new \DateTime("now");
     $date_dir = $date->format("Y-m");
     if(!isset($data['uri'])) {
         $data['uri'][0]['value'] = 'public://' . $date_dir . '/' . $filename; // . '.' . $suffix;
     } else if(!isset($data[0]['uri'])) {
         $data['uri'][0]['value'] = 'public://' . $date_dir . '/' . $filename; // . '.' . $suffix;
     }
     // Decode and save to file.
     $file_contents = base64_decode($file_data);
     $entity = parent::denormalize($data, $class, $format, $context);
     $dirname = drupal_dirname($entity->getFileUri());
     file_prepare_directory($dirname, FILE_CREATE_DIRECTORY);
     if ($uri = file_unmanaged_save_data($file_contents, $entity->getFileUri())) {
       $entity->setFileUri($uri);
     }
     else {
       throw new \RuntimeException(SafeMarkup::format('Failed to write @filename.', array('@filename' => $entity->getFilename())));
     }

      $entity->status = FILE_STATUS_PERMANENT;

     return $entity;
    }
}
