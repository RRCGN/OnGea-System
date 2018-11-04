<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 27.02.18
 * Time: 09:42
 */

namespace Drupal\ongea_api\Normalizer\File;

use Drupal\file_entity\Normalizer\FileEntityNormalizer;

class PersistentFileEntityNormalizer extends FileEntityNormalizer
{


    public function denormalize(
      $data,
      $class,
      $format = null,
      array $context = []
    ) {
        // Avoid 'data' being treated as a field.
        echo 1;
        die();
        // check values

        $file_data = $data['data'][0]['value'];
        unset($data['data']);
        // Decode and save to file.
        $file_contents = base64_decode($file_data);
        $entity = parent::denormalize($data, $class, $format, $context);
        $dirname = drupal_dirname($entity->getFileUri());
        file_prepare_directory($dirname, FILE_CREATE_DIRECTORY);
        if ($uri = file_unmanaged_save_data(
          $file_contents,
          $entity->getFileUri()
        )) {
            $entity->setFileUri($uri);
        } else {
            throw new \RuntimeException(
              SafeMarkup::format(
                'Failed to write @filename.',
                ['@filename' => $entity->getFilename()]
              )
            );
        }
        $entity->status = FILE_STATUS_PERMANENT;

        return $entity;
    }
}