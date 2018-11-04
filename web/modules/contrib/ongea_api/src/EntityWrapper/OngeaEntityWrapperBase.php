<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 16.06.18
 * Time: 16:53
 */

namespace Drupal\ongea_api\EntityWrapper;


use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Config\ConfigException;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\Plugin\DataType\EntityAdapter;
use Drupal\Core\Entity\Plugin\DataType\EntityReference;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\node\Entity\Node;
use Psr\Log\LoggerInterface;


/**
 * Wraps an ActivityEntity
 */
class OngeaEntityWrapperBase
{

    protected static $configStatic = null;

    /**
     * @var Node
     */
    protected $entity;

    protected $dependents;

    protected $controller;

    protected $em;

    protected $config;

    protected $currentUser;


    /**
     * @var LoggerInterface $logger
     */
    protected $logger;

    protected $container;

    /**
     * OngeaBaseEntityWrapper constructor.
     */
    public function __construct($entity)
    {
        $this->container = \Drupal::getContainer();
        $this->em = \Drupal::entityTypeManager();
        $this->nodeManager = $this->em->getStorage('node');
        $this->wrapperManager = $this->container->get(
          'ongea_api.entity_wrapper_manager'
        );
        $this->controller = $this->nodeManager;
        $this->entity = $entity;
        $this->currentUser = \Drupal::currentUser();
        $configName = $this->getConfigName();

        $this->config = self::loadConfigStatic($configName);
        $this->logger = $this->container->get('logger.factory')
          ->get('ongea.ongea_api.entitywrapper '.get_class($entity));


    }

    public function getConfigName()
    {
        return null;
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

    public function getFilesConfig()
    {
        return $this->getConfig('files');

        //return $this->config->get('files');
    }

    public function getConfig($str = '')
    {

        $config = $this->config->get($str);

        if ($config == null) {
            if ($str == '' || $str == 'fields') {
                $this->logger->notice(
                  'config '.$str.' couldnt load.'.' bundle: '.$this->entity->bundle(
                  )
                );
            }
        }


        return $config;
    }

    public function getDependentsConfig()
    {

        return $this->getConfig('dependents');
    }

    public function getFieldsConfig()
    {

        return $this->getConfig('fields');
    }

    public function getReferenceConfig()
    {
        return $this->getConfig('references');
    }

    public function getTaxonomyConfig()
    {

        return $this->getConfig('taxonomy');
    }


    public function getId()
    {
        return $this->entity->id();
    }

    public function getEntity()
    {
        return $this->entity;
    }

    public function getFields()
    {

    }

    public function hasPermission()
    {

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
                  'getTargetEntity in entity wrapper base: entityAdapter is null, field: '.$field->getName(
                  )
                );

                return null;
            }

            return $entityAdapter->getValue();

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
    public function getTidByName($name = null, $vid = null)
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

    //    public function getDependents($bundle = null) {
    //        /** @var EntityReferenceDependencyManager $dependencyManager */
    //        $dependencyManager = $this->container->get('entity_reference_integrity.dependency_manager');
    //        $dependents = $dependencyManager->getDependentEntities($entity);
    //    }

    protected function loadConfig($configName)
    {
        //$this->logger->notice(
        //   'protected function loadConfig($configName) { not implemented' . $configName . ' class ' . get_class($this)
        //  );
    }
}