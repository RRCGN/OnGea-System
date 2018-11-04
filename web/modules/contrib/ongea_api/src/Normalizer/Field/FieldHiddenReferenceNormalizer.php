<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 04.08.18
 * Time: 00:01
 */

namespace Drupal\ongea_api\Normalizer\Field;


use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\Plugin\DataType\EntityAdapter;
use Drupal\Core\Entity\Plugin\DataType\EntityReference;
use Drupal\Core\Field\FieldItemInterface;

class FieldHiddenReferenceNormalizer extends OngeaFieldNormalizer
{


    public function normalize($field, $options = [])
    {

        if (isset($options['targetNormalizer'])) {
            $targetEntity = $this->getTargetEntity($field);

            /** @var OngeaNodeEntityNormalizer $targetNormalizer */
            $targetNormalizer = $options['targetNormalizer'];

            return $targetNormalizer->normalize($targetEntity);
        }

        return parent::normalize($field);
    }

    /**
     * @param FieldItemInterface $field
     *
     * @return null|EntityInterface
     * @throws \Drupal\Core\TypedData\Exception\MissingDataException
     */
    protected function getTargetEntity($field)
    {
        $debug = false;
        /** @var EntityReference $entityReference */
        if ($debug) {
            $this->logger->notice('before'.'target');
        }


        $entityReference = $field->get('entity');
        if ($entityReference) {
            /** @var EntityAdapter $entityAdapter */
            $entityAdapter = $entityReference->getTarget();

            return $entityAdapter->getValue();

        }

        return null;
    }
}

