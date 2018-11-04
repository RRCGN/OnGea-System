<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 09.08.18
 * Time: 19:52
 */

namespace Drupal\ongea_api\Normalizer\Field;


interface OngeaFieldNormalizerInterface
{

    public function normalize($entity, $options = []);

    public function denormalize($data, $options = []);

}