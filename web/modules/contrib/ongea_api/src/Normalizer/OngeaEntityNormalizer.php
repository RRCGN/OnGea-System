<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 30.08.18
 * Time: 03:54
 */

namespace Drupal\ongea_api\Normalizer;


use Drupal\Core\Config\ConfigException;
use Drupal\Core\Entity\EntityManagerInterface;
use Drupal\serialization\Normalizer\ContentEntityNormalizer;
use Psr\Log\LoggerInterface;

class OngeaEntityNormalizer extends ContentEntityNormalizer implements OngeaEntityNormalizerInterface
{

    protected static $configStatic;

    protected $container;

    protected $debug = false;

    protected $apiSettings;

    protected $ownNormalizers = [];

    protected $wrapperManager;

    protected $config;

    protected $currentRequest;


    /**
     * The interface or class that this Normalizer supports.
     *
     * @var string
     */
    protected $supportedInterfaceOrClass = 'Drupal\Core\Entity\EntityInterface';
    /**
     * @var LoggerInterface
     */
    protected $logger;


    public function __construct(EntityManagerInterface $entity_manager)
    {
        $this->container = \Drupal::getContainer();
        $this->currentRequest = $this->container->get('request_stack')
          ->getCurrentRequest();

        parent::__construct($entity_manager);

        $this->apiSettings = \Drupal::config('ongea_api.settings');
        $this->wrapperManager = $this->container->get(
          'ongea_api.entity_wrapper_manager'
        ); //new OngeaEntityWrapperManager();

        $this->logger = $this->container->get('logger.factory')->get(
          'ongea.ongea_api.'
        );;


    }

    public static function loadConfigStatic($configName)
    {
        if ($configName == null) {
            throw new ConfigException(
              'config name is null. class: '.''.'entity: '
            );
        }
        $config = self::$configStatic;
        if ($config == null) {
            $config = [];
        }
        if (!isset($config[$configName])) {
            $loadedConfig = \Drupal::config($configName);

            if ($loadedConfig == null) {
                // throw
                throw new ConfigException(
                  'config '.$configName.' couldnt load'
                );
            }
            $config[$configName] = $loadedConfig;
            self::$configStatic = $config;
        }

        return $config[$configName];
    }

    public function normalize($entity, $format = null, array $context = [])
    {
        // TODO: Implement normalize() method.
    }

    public function denormalize(
      $data,
      $class,
      $format = null,
      array $context = []
    ) {
        // TODO: Implement denormalize() method.
    }
}