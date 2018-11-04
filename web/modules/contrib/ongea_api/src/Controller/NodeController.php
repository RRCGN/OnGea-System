<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 17.08.18
 * Time: 01:46
 */

namespace Drupa\ongea_api\Controller;


class NodeController extends BaseController
{

    public function __construct()
    {
        parent::__construct();

        $this->storage = $this->entityTypeManager->getStorage('node');
    }


}