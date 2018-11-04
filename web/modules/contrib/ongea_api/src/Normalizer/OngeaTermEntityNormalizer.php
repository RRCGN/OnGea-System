<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 08.06.18
 * Time: 23:21
 */

namespace Drupal\ongea_api\Normalizer;


use Drupal\serialization\Normalizer\ContentEntityNormalizer;
use Drupal\taxonomy\TermInterface;

class OngeaTermEntityNormalizer extends ContentEntityNormalizer
{

    /**
     * The interface or class that this Normalizer supports.
     *
     * @var string
     */
    protected $supportedInterfaceOrClass = 'Drupal\taxonomy\TermInterface';

    /**
     * {@inheritdoc}
     */
    public function supportsNormalization($data, $format = null)
    {
        // If we aren't dealing with an object or the format is not supported return
        // now.
        if (!is_object($data) || !$this->checkFormat($format)) {
            return false;
        }
        // This custom normalizer should be supported for "Activity" nodes.
        if ($data instanceof TermInterface) {
            return true;
        }

        // Otherwise, this normalizer does not support the $data object.
        return false;
    }

    /**
     * @param array $data
     * @param null $format
     * @param array $context
     *
     * @return array|\Symfony\Component\Serializer\Normalizer\scalar
     */
    public function denormalize(
      $data,
      $class,
      $format = null,
      array $context = []
    ) {
        return $data;
    }

    /**
     * @param Node $entity
     * @param null $format
     * @param array $context
     *
     * @return array|\Symfony\Component\Serializer\Normalizer\scalar
     */
    public function normalize($entity, $format = null, array $context = [])
    {
        $attributes = parent::normalize($entity, $format, $context);

        return $attributes;
    }

}