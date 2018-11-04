<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 17.06.18
 * Time: 18:52
 */

namespace Drupal\ongea_api\Normalizer;


use Drupal\Core\Entity\EntityManagerInterface;
use Drupal\file\Entity\File;
use Drupal\serialization\Normalizer\ContentEntityNormalizer;

class SimpleFileEntityNormalizer extends ContentEntityNormalizer
{

    protected $entityManager;

    public function __construct(EntityManagerInterface $entity_manager)
    {
        parent::__construct($entity_manager);

    }

    public function getLoadFields()
    {
        return [
          'filename',
          'fid',
        ];
    }

    public function normalize($entity, $format = null, array $context = [])
    {
        $result = [];


        $apiFields = $this->getAPIFields();

        $entityArray = $entity->toArray();
        foreach ($apiFields as $key => $val) {

            if (isset($entity->{$key})) {
                if (isset($entityArray[$key]) && isset($entityArray[$key][0]) && isset($entityArray[$key][0]['value'])) {
                    $result[$val] = $entityArray[$key][0]['value'];
                } else {
                    $result[$val] = $entityArray[$key];
                }
            }


        }
        if (isset($result['id']) && isset($result['target_id'])) {
            unset($result['target_id']);
        }
        if (isset($result['filename'])) {

            $file = File::load($entity->id());
            $uri = $file->getFileUri();

            //print_r(file_create_url($uri));
            //$stream_wrapper_manager = \Drupal::service('stream_wrapper_manager')->getViaUri($uri);
            $result['path'] = file_create_url($uri);

            //$result['path'] = $fil;
        }

        // file fields
        return $result;
    }

    public function getAPIFields()
    {

        $dev_config = [
          'filename' => 'filename',
          'fid' => 'id',
          'target_type' => 'type',
        ];

        return $dev_config;
    }
}