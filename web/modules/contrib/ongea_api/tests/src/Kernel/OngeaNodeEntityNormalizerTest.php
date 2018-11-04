<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 28.06.18
 * Time: 20:20
 */

namespace Drupal\Tests\ongea_api\Kernel;

use Drupal\Tests\token\Kernel\KernelTestBase;


/**
 * Tests the Ongea Node Entity normalizer.
 *
 * @see Drupal\ongea_api\Normalizer\OngeaNodeEntityNormalizer
 *
 * @group file_entity
 */
class OngeaNodeEntityNormalizerTest extends KernelTestBase
{

    /**
     * {@inheritdoc}
     */
    public static $modules = [
        //        'simpletest',
        //        'field',
        //        'file',
        //        'image',
        //        'file_entity',
        //        'node',
        //        'serialization',
        //        'text',
        //        'user',
        //        'rest',
        //        'hal',
        //        'system',
    ];

    /**
     * {@inheritdoc}
     */
    public function setUp()
    {
        parent::setUp();
        //        $this->installEntitySchema('node');
        //        $this->installEntitySchema('file');
        //        $this->installEntitySchema('user');
        //        $this->installSchema('file', array('file_usage'));
        //        $this->installSchema('file_entity', array('file_metadata'));
        //        // Set the file route to provide entity URI for serialization.
        //        $route_collection = new RouteCollection();
        //        $route_collection->add('entity.file.canonical', new Route('file/{file}'));
        //        $this->container->set('router.route_provider', new MockRouteProvider($route_collection));
    }
}