<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 30.05.18
 * Time: 00:52
 */

namespace Drupal\ongea_api\Plugin\rest\resource;


use Drupal\Core\Session\AccountProxyInterface;
use Drupal\node\Entity\Node;
use Drupal\ongea_api\Exception\NoPostDataReceived;
use Drupal\ongea_api\Normalizer\OngeaNodeEntityNormalizerInterface;
use Drupal\rest\ModifiedResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CollectionResourceBase extends OngeaNodeResource
{

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
        $this->currentUser = $current_user;
        $this->types = $types;
        $this->entityManager = \Drupal::entityManager();
        //$this->currentRequest = $current_request;


    }


    /**
     * @return ModifiedResourceResponse
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     */
    public function get()
    {
        $count = null;
        if (isset($this->currentRequest)) {
            $request = $this->currentRequest;
            $count = $request->query->get('count');

            $start = $request->query->get('start');
            $length = $request->query->get('length');
        }

        $nids = [];

        if (in_array($this->getNodeType(), ['ongea_announcement'])) {
            if ($this->hasGroupRole(['org_admin', 'activitie_admin', 'sender'])) {
                $db = \Drupal::database();
                $query = $db->select('group_content_field_data', 'gc');
                $query->join('node', 'n', 'n.nid = gc.entity_id');
                $query->fields('gc', array('entity_id'))
                    ->condition('n.type', 'ongea_participant')
                    ->condition('gc.gid', $_SESSION['ongea']['selected_group']);
                if ($count != null && $count != false) {
                $query = $query->range(0, $count);
                }
                $nids = $query->execute()->fetchCol();
            }
        }
        else {

            if ($this->hasGroupRole(['org_admin', 'activitie_admin'])) {
                // only return nodes in my selected group
                $db = \Drupal::database();
                $query = $db->select('node', 'n');
                $query->join('group_content_field_data', 'gc', 'gc.entity_id = n.nid');
                $query
                    ->fields('n', array('nid'))
                    ->condition('n.type', $this->getNodeType())
                    ->condition('gc.gid', $_SESSION['ongea']['selected_group'])
                    ->condition('gc.type',  "%" . $db->escapeLike('group_content_type') . "%", 'LIKE');
                if ($count != null && $count != false) {
                    $query = $query->range(0, $count);
                }
                $nids = $query->execute()->fetchCol();
            }
    
        }

        

        //->range(0, 10);

        /*// DEBUG
        if (sizeof($nids) == 0) {
            \Drupal::logger('ongea_api')->notice('nothing in get ' . $this->getNodeType());
        }*/
        $controller = $this->nodeManager;
        $nodes = array_values($controller->loadMultiple($nids));



        // user has permissions?
        $response = new ModifiedResourceResponse($nodes, 200);

        return $response;
    }


    /**
     * Responds to entity POST requests and saves the new entity.
     *
     * @return \Drupal\rest\ModifiedResourceResponse
     */
    public function post($data)
    {

        if ($data == null || (is_array($data) && sizeof($data) == 0)) {
            throw new NoPostDataReceived();
        }


        if (isset($data['id'])) {
            throw new BadRequestHttpException(
              t("Can't create a entity with an id.")
            );

        }
        $hasDependents = false;


        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        if (!$this->hasGroupRole(['org_admin', 'activitie_admin', 'sender'])) {
            throw new AccessDeniedHttpException(t('Content access denied.'));
        }

        /** @var Node $entity */
        $normalizedData = $this->normalizer->denormalize($data, null);

        if (isset($normalizedData['ongea_dependents'])) {
            $newDependendents = $normalizedData['ongea_dependents'];
            unset($normalizedData['ongea_dependents']);
        }

        $wrapper = $this->wrapperManager->create(
          $this->types['content'],
          $normalizedData
        );
        //$entity = $this->normalizer->hydrate($normalizedData);
        $entity = $wrapper->getEntity();

        if (!$entity->validate()) {
            throw new BadRequestHttpException(t('Not valid.'));
        }

        if ($entity->bundle() == 'ongea_participant') {
            $this->addNodeTranslations($entity, ['field_ongea_about_me']);
        }
        $wrapper->save();
        //$entity->save();

        // create dependents
        if (isset($newDependendents)) {
            // 'activities', 'activityId'. 'ongea_project', projectId

            $wrapper->setDependents($newDependendents);
        }

        return new ModifiedResourceResponse($entity, 201); // 3. arg = headers

    }


    /**
     * @param $data
     *
     * @return ModifiedResourceResponse
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function put($data)
    {
        // TODO: update multiple resources

        //return new ModifiedResourceResponse($data, 201, $data); // 3. arg = headers
        throw new BadRequestHttpException(t('Method not provided.'));

    }

    public function delete($data)
    {
        // TODO: delete multiple resources
        //return new ModifiedResourceResponse($data, 201, $data);
        throw new BadRequestHttpException(t('Method not provided.'));
    }
}
