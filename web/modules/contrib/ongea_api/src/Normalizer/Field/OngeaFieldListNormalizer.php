<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 04.08.18
 * Time: 00:34
 */

namespace Drupal\ongea_api\Normalizer\Field;


use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Field\FieldItemListInterface;

class OngeaFieldListNormalizer
{

    protected $container;

    protected $logger;

    /**
     * @var EntityTypeManagerInterface $em
     */
    protected $em;

    public function __construct($em)
    {
        $this->container = \Drupal::getContainer();
        $this->em = $em;

        $this->logger = $this->container->get('logger.factory')
          ->get('ongea.ongea_api.'.get_class($this));

    }

    /**
     * @param $list
     * @param \Drupal\ongea_api\Normalizer\OngeaFieldNormalizer $fieldNormalizer
     * @param array $options
     *
     * @return array
     */
    public function denormalize($list, $fieldNormalizer, $options = [])
    {
        $result = [];
        foreach ($list as $item) {
            $result[] = $fieldNormalizer->denormalize($item);
        }

        return $result;
    }

    /**
     * @param FieldItemListInterface $list
     * @param OngeaFieldNormalizer $fieldNormalizer
     * @param array $options
     */
    public function normalize($list, $fieldNormalizer)
    {
        // options

        $result = [];
        foreach ($list as $item) {
            $result[] = $fieldNormalizer->normalize($item);
        }

        return $result;
    }
}