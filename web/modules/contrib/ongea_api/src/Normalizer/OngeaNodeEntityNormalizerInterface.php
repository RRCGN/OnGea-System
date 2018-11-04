<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 30.05.18
 * Time: 21:33
 */

namespace Drupal\ongea_api\Normalizer;


interface OngeaNodeEntityNormalizerInterface extends OngeaEntityNormalizerInterface
{

    public function getContentType();



    public function hydrate($data);

    /**
     * @return array
     */
    public function getDependentsTypes();

}