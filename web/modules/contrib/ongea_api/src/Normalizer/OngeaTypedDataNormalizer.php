<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 01.08.18
 * Time: 23:31
 */

namespace Drupal\ongea_api\Normalizer;

use Drupal\serialization\Normalizer\TypedDataNormalizer;

class OngeaTypedDataNormalizer extends TypedDataNormalizer
{

    /**
     * {@inheritdoc}
     */
    public function supportsNormalization($data, $format = null)
    {

        // If we aren't dealing with an object or the format is not supported return
        // now.
        if (!is_object($data) || !$this
            ->checkFormat($format)) {
            return false;
        }
        $supported = (array)$this->supportedInterfaceOrClass;

        return (bool)array_filter(
          $supported,
          function ($name) use ($data) {
              return $data instanceof $name;
          }
        );
    }
}