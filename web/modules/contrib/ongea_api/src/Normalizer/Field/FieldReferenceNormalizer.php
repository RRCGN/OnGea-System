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
use Drupal\ongea_api\Normalizer\OngeaNodeEntityNormalizer;

class FieldReferenceNormalizer extends OngeaFieldNormalizer
{


    /**
     * @param $data
     */
    public function denormalize($data, $options = [])
    {

        $result = [];
        if (isset($data['id'])) {
            $result = [
              'target_id' => $data['id'],
            ];
        } else {
            $result = [
                'target_id' => $data,
              ];
        }

        return $result;
    }

    /**
     * @param FieldItemInterface $field
     * @param array $options
     *
     * @return array|\Symfony\Component\Serializer\Normalizer\scalar
     */
    public function normalize($field, $options = [])
    {
        $value = $field->getValue();
        if (!isset($value['target_id']) || $value['target_id'] == 0) {
            // catch empty field array
            return null;
        }
        $scope = null;
        if (isset($options['scope'])) {
            if ($options['scope'] == 'only_id') {
                return ['id' => $value['target_id']];
            }
            if ($options['scope'] == 'small') {
                //$scope = $options['scope']; reference scopes
            }
        }
        if (isset($options['targetNormalizer'])) {
            $targetEntity = $this->getTargetEntity($field);

            if ($targetEntity == null) {
                return null;
            }
            /** @var OngeaNodeEntityNormalizer $targetNormalizer */
            $targetNormalizer = $options['targetNormalizer'];
            $context = $scope != null ? ['scope' => $scope] : [];

            return $targetNormalizer->normalize($targetEntity, null, $context);
        }


        return parent::normalize($field);
    }

    /**
     * @param FieldItemInterface $field
     *
     * @return null|EntityInterface
     * @throws \Drupal\Core\TypedData\Exception\MissingDataException
     */
    public function getTargetEntity($field)
    {
        /** @var EntityReference $entityReference */
        $entityReference = $field->get('entity');
        if ($entityReference) {
            /** @var EntityAdapter $entityAdapter */
            $entityAdapter = $entityReference->getTarget();
            if ($entityAdapter == null) {
                $this->logger->notice(
                  'getTargetEntity in ReferenceNormalizer: entityAdapter is null, field: '.$field->getName(
                  )
                );

                return null;
            }

            return $entityAdapter->getValue();

        }

        return null;
    }
}

