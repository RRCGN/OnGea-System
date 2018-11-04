<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 04.08.18
 * Time: 00:34
 */

namespace Drupal\ongea_api\Normalizer\Field;


use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\EntityReferenceItem;

class FieldReferenceListNormalizer extends OngeaFieldListNormalizer
{

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
        if (is_array($list)) {
            foreach ($list as $item) {
                $result[] = $fieldNormalizer->denormalize($item, $options);
            }
        }

        return $result;
    }

    /**
     * @param FieldItemListInterface $list
     * @param OngeaFieldNormalizer $fieldNormalizer
     * @param array $options
     */
    public function normalize($list, $fieldNormalizer, $options = [])
    {
        $debug = false;
        // options
        if ($debug) {
            $this->logger->notice('end'.'listnorm');
        }

        $result = [];
        /** @var EntityReferenceItem $item */
        foreach ($list as $item) {
            $result[] = $fieldNormalizer->normalize($item, $options);
        }

        return $result;
    }
}