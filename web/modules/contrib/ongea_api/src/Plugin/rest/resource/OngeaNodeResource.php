<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\ongea_api\Normalizer\OngeaNodeEntityNormalizerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;


/**
 * Common base class for resource plugins.
 *
 * Note that this base class' implementation of the permissions() method
 * generates a permission for every method for a resource. If your resource
 * already has its own access control mechanism, you should opt out from this
 * default permissions() method by overriding it.
 *
 * @see \Drupal\rest\Annotation\RestResource
 * @see \Drupal\rest\Plugin\Type\ResourcePluginManager
 * @see \Drupal\rest\Plugin\ResourceInterface
 * @see plugin_api
 *
 * @ingroup third_party
 */
class OngeaNodeResource extends OngeaResourceBase
{

    /*
         * @var \Drupal\Core\Entity\EntityManagerInterface
         */
    protected $nodeManager;

    /**
     * Constructs a Drupal\rest\Plugin\ResourceBase object.
     *
     * @param array $configuration
     *   A configuration array containing information about the plugin instance.
     * @param string $plugin_id
     *   The plugin_id for the plugin instance.
     * @param mixed $plugin_definition
     *   The plugin implementation definition.
     * @param array $serializer_formats
     *   The available serialization formats.
     * @param \Psr\Log\LoggerInterface $logger
     *   A logger instance.
     * @param \Drupal\Core\Session\AccountProxyInterface $current_user
     *   A current user instance.
     *   The current request
     */
    public function __construct(
      array $configuration,
      $plugin_id,
      $plugin_definition,
      array $serializer_formats,
      LoggerInterface $logger,
      AccountProxyInterface $current_user,
      $types,
      OngeaNodeEntityNormalizerInterface $normalizer,
      Request $current_request
    ) {

        parent::__construct(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $serializer_formats,
          $logger,
          $current_user,
          $types,
          $normalizer,
          $current_request
        );
        $this->nodeManager = \Drupal::entityTypeManager()->getStorage('node');
    }


}
