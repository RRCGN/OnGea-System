<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 04.08.18
 * Time: 00:41
 */

namespace Drupal\ongea_api\Normalizer\Field;


use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\taxonomy\Entity\Term;

class FieldReferenceTermNormalizer extends FieldReferenceNormalizer
{

    /**
     * @param $data
     * @param array $options
     *
     * @return array|int|mixed|null
     */
    public function denormalize($data, $options = [])
    {

        $name = null;
        // is name?
        if (is_string($data)) {
            $name = $data;


        } else {
            if (is_array($data)) {
                $name = $data['value'];
            }
        }
        if ($name != null && isset($options['vid'])) {
            return $this->getTidByName($name, $options['vid']);
        }

        return null;
    }

    /**
     * Utility: find term by name and vid.
     *
     * @param null $name
     *  Term name
     * @param null $vid
     *  Term vid
     *
     * @return int
     *  Term id or 0 if none.
     */
    protected function getTidByName($name = null, $vid = null)
    {

        $properties = [];
        if (!empty($name)) {
            $properties['name'] = $name;
        }
        if (!empty($vid)) {
            $properties['vid'] = $vid;
        }
        try {
            $terms = $this->em->getStorage('taxonomy_term')
              ->loadByProperties($properties);
        } catch (InvalidPluginDefinitionException $e) {
            $this->logger->notice(
              'InvalidPluginDefinitionException '.$e->getMessage()
            );
        } catch (PluginNotFoundException $e) {
            $this->logger->notice('PluginNotFoundException '.$e->getMessage());
        }
        $term = reset($terms);

        return !empty($term) ? $term->id() : 0;
    }

    /**
     * @param \Drupal\Core\Field\FieldItemInterface $field
     * @param array $options
     *
     * @return array|mixed|null|string|\Symfony\Component\Serializer\Normalizer\scalar
     */
    public function normalize($field, $options = [])
    {
        //return parent::normalize($field);
        $value = $field->getValue();

        if ($field->getName() == 'field_ongea_ao_permission') {
        }
        if (!isset($value['target_id']) || $value['target_id'] == 0) {
            // catch empty field array
            return null;
        }

        /** @var Term $termEntity */
        $termEntity = $this->getTargetEntity($field);

        return $termEntity->getName();
    }
}