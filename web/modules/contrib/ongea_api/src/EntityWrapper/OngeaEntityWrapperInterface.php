<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 02.08.18
 * Time: 13:50
 */

namespace Drupal\ongea_api\EntityWrapper;


interface OngeaEntityWrapperInterface
{


    public static function getContentType();

    public function getId();

    public function preCreate($data);

    public function preSave();

    public function postCreate();

    /**
     * @return \Drupal\Core\Entity\EntityInterface
     */
    public function getEntity();

    public function getConfig($str = '');

    public function hasField($field);

    public function getField($field);

    public function setField($field, $data);

    public function getFieldConfig();

    public function getFilesConfig();

    public function getDependentsConfig();

    public function setDependents($newDependents);

    public function getReferenceConfig();

    public function isContentType($contentType);

    public function validate();

    /**
     * * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function save();

    public function update($attributes);

    public function delete();
}