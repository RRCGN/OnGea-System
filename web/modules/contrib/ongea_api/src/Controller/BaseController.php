<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 17.08.18
 * Time: 01:31
 */

namespace Drupa\ongea_api\Controller;


class BaseController
{

    /**
     * @var Symfony\Component\DependencyInjection\ContainerInterface
     */
    protected $container;

    /**
     * @var \Psr\Log\LoggerInterface
     */
    protected $logger;

    /**
     * @var \Drupal\Core\Entity\EntityTypeManagerInterface
     */
    protected $entityTypeManager;

    /**
     * @var \Drupal\ongea_api\EntityWrapper\OngeaEntityWrapperManager
     */
    protected $wrapperManager;

    protected $storage;

    public function __construct()
    {
        $this->container = \Drupal::getContainer();
        $this->entityTypeManager = $this->container->get('entity_type.manager');
        $this->wrapperManager = $this->container->get(
          'ongea_api.entity_wrapper_manager'
        );
        $this->logger = $this->container->get('logger.factory')->get(
          get_class($this)
        );

    }


}