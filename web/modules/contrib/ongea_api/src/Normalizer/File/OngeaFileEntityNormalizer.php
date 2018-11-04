<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 28.08.18
 * Time: 23:08
 */

namespace Drupal\ongea_api\Normalizer\File;

use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\file_entity\Normalizer\FileEntityNormalizer;

/**
 * Normalizer for File entity.
 */
class OngeaFileEntityNormalizer extends FileEntityNormalizer
{

    /**
     * {@inheritdoc}
     */
    protected $supportedInterfaceOrClass = 'Drupal\file\FileInterface';


    
    /**
     * {@inheritdoc}
     */
    public function normalize($entity, $format = null, array $context = [])
    {
        $data = parent::normalize($entity, $format, $context);

        if (isset($data['fid'][0]['value'])) {
            $data['id'] = $data['fid'][0]['value'];
        }

        if (isset($data['uri'][0]['url'])) {
            $data['filename'] = $data['uri'][0]['url'];
        }
        if (isset($data['filemime'][0]['value'])) {
            $data['filemime'] = $data['filemime'][0]['value'];
        }


        return $data;
    }

    /**
     * {@inheritdoc}
     */
    public function denormalize(
      $data,
      $class,
      $format = null,
      array $context = []
    ) {
        
        
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
        $date = new DrupalDateTime("now");
        $date_dir = $date->format("Y-m");


        // data to normalizer

        if (!isset($data['uri'])) {
            $data['uri'][0]['value'] = 'public://'.$date_dir.'/'.$filename; // . '.' . $suffix;
        } else {
            if (!isset($data[0]['uri'])) {
                $data['uri'][0]['value'] = 'public://'.$date_dir.'/'.$filename; // . '.' . $suffix;
            }
        }


        if (!isset($data['data'][0])) {
            $data['data'][0]['value'] = $data['data']['value'];
        }
        //print_r($data);
        // Decode and save to file.

        return parent::denormalize($data, $class, $format, $context);


    }
}
