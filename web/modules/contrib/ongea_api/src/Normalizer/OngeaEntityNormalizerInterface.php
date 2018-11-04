<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 30.08.18
 * Time: 03:54
 */

namespace Drupal\ongea_api\Normalizer;


interface OngeaEntityNormalizerInterface
{
    public function normalize($entity, $format = null, array $context = []);

    public function denormalize(
      $data,
      $class,
      $format = null,
      array $context = []
    );
}