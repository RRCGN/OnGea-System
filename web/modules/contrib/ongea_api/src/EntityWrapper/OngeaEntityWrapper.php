<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 05.07.18
 * Time: 00:22
 */

namespace Drupal\ongea_api\EntityWrapper;


use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\entity_reference_integrity\EntityReferenceDependencyManager;
use Drupal\node\Entity\Node;
use Drupal\ongea_api\Exception\CannotBeNullException;

class OngeaEntityWrapper extends OngeaEntityWrapperBase implements OngeaEntityWrapperInterface
{

    public static function defaults()
    {
        return null;
    }

    public function getConfigName()
    {
        return 'ongea_api.'.$this::getContentType().'.settings';
    }

    public static function getContentType()
    {
        return null;
    }

    public function getReferencedFiles()
    {
        return [];
    }

    /**
     * @param string $fieldName
     *
     * @return mixed
     * @throws \Drupal\Core\TypedData\Exception\MissingDataException
     */
    public function getFIeldFirstValue($fieldName)
    {
        $fieldList = $this->getField($fieldName);
        if ($fieldList->count() === 0) {
            return null;
        }
        $field = $fieldList->first();

        return $field->getString();
    }

    /**
     * @param string $fieldName
     *
     * @return \Drupal\Core\Field\FieldItemListInterface
     */
    public function getField($fieldName)
    {
        return $this->entity->get($fieldName);
    }

    public function hasReferences($referenceField = null)
    {
        // TODO: Implement hasReferences() method.
    }

    /**
     * @param $fieldName
     *
     * @return \Drupal\Core\Field\EntityReferenceFieldItemListInterface
     */
    public function getReference($fieldName)
    {
        //is reference
        $reference = $this->entity->{$fieldName};

        return $reference;
    }

    /**
     * @param $fieldName
     * @param $data
     */
    public function setReference($fieldName, $data)
    {
        //is reference
        $this->entity->{$fieldName} = $data;
    }

    /**
     * @param $fieldName
     * @param $data
     */
    public function addReference($fieldName, $data)
    {
        //is reference
        $this->entity->{$fieldName}[] = $data;
    }

    public function getReferences($referenceField = null)
    {
        //is reference
        return $this->entity->get($referenceField);
    }

    public function getFiles($referenceField = null)
    {

    }

    public function hasDependents($dependentType)
    {
        // TODO: Implement hasDependents() method.
    }

    /**
     * @param $dependentType
     *
     * @return array
     */
    public function getDependents($dependentType)
    {

        /** @var EntityReferenceDependencyManager $dependencyManager */
        $dependencyManager = $this->container->get(
          'entity_reference_integrity.dependency_manager'
        );

        $entities = [];
        if (!$dependencyManager->hasDependents($this->entity)) {
            return $entities;
        }

        $dependents = $dependencyManager->getDependentEntities($this->entity);


        foreach ($dependents as $dependent) {
            /** @var EntityInterface $subDependent */
            foreach ($dependent as $subDependent) {
                if ($subDependent->bundle() === $dependentType) {
                    $entities[$dependentType][]['id'] = (int)$subDependent->id(
                    );
                }
            }

        }

        return $entities;
    }

    public function preCreate($data)
    {
        // TODO: Implement preCreate($data) method.
    }

    public function preSave()
    {
        // TODO: Implement preSave() method.
    }

    public function isContentType($contentType)
    {
        return $this->entity->bundle() == $contentType;
    }

    /**
     * @return int
     */
    public function save()
    {
        try {
            return $this->entity->save();
        } catch (EntityStorageException $e) {

            throw new CannotBeNullException($e);
        }

    }

    public function update($attributes)
    {
        foreach ($attributes as $key => $val) {
            if ($this->hasField($key)) {
                $this->setField($key, $val);
            }
        }
        // TODO: Implement update() method.
    }

    public function hasField($fieldName)
    {
        return $this->entity->hasField($fieldName);

    }

    public function setField($field, $data)
    {
        $this->entity->set($field, $data);
    }


    public function validate()
    {
        // TODO: Implement
    }

    /**
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function delete()
    {
        return $this->entity->delete();
    }

    public function getFieldConfig()
    {
        // TODO: Implement getFieldConfig() method.
    }

    //    public function createDependent($depApiType, $depId, $type, $id) {
    //        //dirty Hack
    //
    //        if (isset($depTable[$type]) && isset($depTable[$type][$depApiType])) {
    //
    //            $field = $depTable[$type][$depApiType]['field'];
    //            $single = $depTable[$type][$depApiType]['single'];
    //            $depType = $depTable[$type][$depApiType]['type'];
    //
    //
    //
    //
    //
    //            if ($single == true) {
    //                $fieldData = $entity->{$field};
    //
    //                if ( sizeof($fieldData) > 0) {
    //                    if($fieldData->first()
    //                        ->getValue() != $id) {
    //
    //                    }
    //                }
    //            }
    //            $entity->set($field, $id);
    //            $entity->save();
    //
    //            if(!$entity->validate()) {
    //                print_r('not valid');
    //            };
    //
    //            return $entity;
    //
    //        }
    //        return null;
    //    }

    /**
     * @param $newDependents
     *
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     */
    public function setDependents($newDependents)
    {
        $controller = $this->em->getStorage('node');
        foreach ($newDependents as $key => $val) {
            //            $val = [
            //              'id' => $fieldData['id'],
            //              'type' => $config['type'],
            //              'field' => $config['field'],
            //            ];

            if (isset($val['id'])) {
                $depId = $val['id'];
                $field = $val['field'];
                /** @var Node $entity */
                $entity = $controller->load($depId);
                if ($val['single'] == true) {
                    $entity->set($val['field'], $this->getId());
                } else {
                    //$entityDeps = $entity->get($field);
                }
                $entity->save();
            }


        }
    }

    public function postCreate()
    {
        // TODO: Implement postCreate() method.
    }
}