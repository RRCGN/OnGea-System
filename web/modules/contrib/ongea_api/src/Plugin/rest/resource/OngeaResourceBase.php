<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\node\Entity\Node;
use Drupal\ongea_api\EntityWrapper\OngeaEntityWrapperManager;
use Drupal\ongea_api\Normalizer\OngeaNodeEntityNormalizerInterface;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
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
class OngeaResourceBase extends ResourceBase
{

    /**
     * A current user instance.
     *
     * @var \Drupal\Core\Session\AccountProxyInterface
     */
    protected $currentUser;

    /*
     * @var \Drupal\Core\Entity\EntityManagerInterface
     */
    protected $entityManager;


    protected $wrapperManager;

    protected $types;

    // save normalizer for post events

    /**
     * @var OngeaNodeEntityNormalizerInterface
     */
    protected $normalizer;

    /**
     *
     * @var \Symfony\Component\HttpFoundation\Request
     */
    protected $currentRequest;

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
          $logger
        );
        $this->currentUser = $current_user;
        $this->types = $types;

        $this->normalizer = $normalizer;
        $this->entityManager = \Drupal::entityManager();
        $this->currentRequest = $current_request;
        $this->nodeManager = \Drupal::entityTypeManager()->getStorage('node');
        $this->wrapperManager = new OngeaEntityWrapperManager();
        if (isset($_SERVER['HTTP_GID'])) {
            $_SESSION['ongea']['selected_group'] = $_SERVER['HTTP_GID'];
          } 
    }


    /**
     * @param \Drupal\node\NodeInterface $node
     * @param string $contentType
     *
     * @return boolean
     */
    public function nodeIsContentType($node, $contentType)
    {

        if ($node->bundle() == $contentType) {
            return true;
        }

        return false;
    }

    /**
     * Implements ResourceInterface::permissions().
     *
     * Every plugin operation method gets its own user permission. Example:
     * "restful delete entity:node" with the title "Access DELETE on Node
     * resource".
     */
    public function permissions()
    {
        $permissions = [];

        // no permissions
        $definition = $this->getPluginDefinition();
        foreach ($this->availableMethods() as $method) {
            $lowered_method = strtolower($method);
            $permissions["restful $lowered_method $this->pluginId"] = [
              'title' => $this->t(
                'Access @method on %label resource',
                ['@method' => $method, '%label' => $definition['label']]
              ),
            ];
        }

        return $permissions;
    }

    /**
     * DEPRECATED
     *
     */
    public function getAllData($wrapper)
    {
        $nodes = $this->getAll();

        $response = [
          $wrapper => array_values($nodes),
        ];

        return new ModifiedResourceResponse($response);
    }


    /**
     * DEPRECATED
     *
     * @return \Drupal\Core\Entity\EntityInterface[]
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     */
    protected function getAll()
    {

        $query = \Drupal::entityQuery('node')
          ->condition('type', $this->getNodeType());
        $nids = $query->execute();
        $controller = $this->entityManager->getStorage('node');

        return $controller->loadMultiple($nids);

    }

    /**
     * @return string
     */
    protected function getNodeType()
    {
        return $this->types['content'];
    }


    /**
     * Checks if the current user has any of the roles in the array.
     * 
     * @param $roles  Array of groupe role names, eg. ['members', 'ongea_org', 'activitie_admin']
     * @param $entity  A content entity object. If empty, use SESSION
     */
    public function hasGroupRole($roles = [], $entity = NULL) {
        if (empty($roles)) {
            return FALSE;
        }
        $account = \Drupal::currentUser();
        if ($account->id() == 1) {
            return TRUE;
        }
        $groups = [];
        if (isset($entity)) {
            $rel = \Drupal\group\Entity\GroupContent::loadByEntity($entity);
            foreach ($rel as $key => $val) {
                $groups[] = $val->getGroup();
            }
        } elseif (isset($_SESSION['ongea']['selected_group'])) {
            $groups[] = \Drupal\group\Entity\Group::load($_SESSION['ongea']['selected_group']);
        }
        $roles_out = [];
        foreach ($groups as $group) {
            if (isset($group)) {
                $member = $group->getMember($account);
                if (isset($member) && gettype($member) == 'object') {
                    $groupRoles = $member->getRoles();
                    foreach ($roles as $role) {
                        if (isset($groupRoles['ongea_org_group-' . $role])) {
                            $roles_out[] = $role;
                        }
                    }
                }
            }
        }
        return empty($roles_out) ? FALSE : TRUE;
    }

    /**
     * @param $depApiType
     * @param $depId
     * @param $type
     * @param $id
     *
     * @return \Drupal\node\Entity\Node|null
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     * @throws \Drupal\Core\TypedData\Exception\MissingDataException
     */
    public function createDependent($depApiType, $depId, $type, $id)
    {
        //dirty Hack
        $depTable = [
          'ongea_project' => [
            'ongea_activity' => [
              'type' => 'ongea_activity',
              'field' => 'field_ongea_project',
              'single' => true,
            ],
          ],
        ];

        if (isset($depTable[$type]) && isset($depTable[$type][$depApiType])) {

            $field = $depTable[$type][$depApiType]['field'];
            $single = $depTable[$type][$depApiType]['single'];
            $depType = $depTable[$type][$depApiType]['type'];

            $controller = $this->entityManager->getStorage('node');

            /** @var Node $entity */
            $entity = $controller->load($depId);
            $entityDeps = $entity->get($field);


            if ($single == true) {
                $fieldData = $entity->{$field};

                if (sizeof($fieldData) > 0) {
                    if ($fieldData->first()
                        ->getValue() != $id) {

                    }
                }
            }
            $entity->set($field, $id);
            $entity->save();

            if (!$entity->validate()) {
                print_r('not valid');
            };

            return $entity;

        }

        return null;
    }

    public function addNodeTranslations($entity, $fields = []) {
        $param = \Drupal::request()->query->all();
        $lan = $entity->get('langcode')->value;
        $curLanguage = isset($param['lan']) ? $param['lan'] : 'en';
        $languages = array_keys(\Drupal::languageManager()->getLanguages());
        foreach ($languages as $language) {
            if ($language != $lan) {
                $node_de = $entity->addTranslation($language);
                $node_de->set('title', $entity->get('title')->value);
                if ($curLanguage == $language) {
                    foreach ($fields as $field) {
                        $node_de->set($field, $entity->get($field)->value);
                        if ($field != 'title') {
                            $entity->set($field, NULL);
                        }
                    }
                }
                $node_de->save();
            }
        }
        $entity->save();
    }

    public function updateNodeTranslation(&$newEntity, $entity, $fields = []) {
        $param = \Drupal::request()->query->all();
        $lan = $entity->get('langcode')->value;
        $curLanguage = isset($param['lan']) ? $param['lan'] : 'en';
        $languages = array_keys(\Drupal::languageManager()->getLanguages());
        foreach ($languages as $language) {
            if (!$entity->hasTranslation($language)) {
                $translated_entity = $entity->addTranslation($language);
                $translated_entity->set('title', $entity->get('title')->value);
                $translated_entity->save();
            }
            if ($language != $lan && $language == $curLanguage && $entity->hasTranslation($language)) {
                $translated_entity = $entity->getTranslation($language);
                foreach ($fields as $field) {
                    $translated_entity->set($field, $newEntity[$field]);
                    unset($newEntity[$field]);
                }
                $translated_entity->save();
            }
        }
    }


}
