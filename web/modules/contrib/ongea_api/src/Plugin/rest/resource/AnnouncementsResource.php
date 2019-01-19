<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 31.05.18
 * Time: 20:33
 */

namespace Drupal\ongea_api\Plugin\rest\resource;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;

use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\ongea_api\Normalizer\AnnouncementNodeEntityNormalizer;
use Drupal\rest\ModifiedResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 *
 * @RestResource(
 *   id = "announcements_resource",
 *   label = @Translation("Ongea Announcement Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/announcements",
 *     "create" = "/api/v2/announcements"
 *   }
 *
 * )
 */
class AnnouncementsResource extends CollectionResourceBase
{

    /**
     * {@inheritdoc}
     */
    public static function create(
        ContainerInterface $container,
        array $configuration,
        $plugin_id,
        $plugin_definition
    ) {
        $types = [
            'resource' => 'announcements',
            'content' => 'ongea_announcement',
        ];

        /** @var \Drupal\ongea_api\Normalizer\OngeaNodeEntityNormalizerInterface $announcementNormalizer */

        $announcementNormalizer = new AnnouncementNodeEntityNormalizer(\Drupal::entityManager());
        return new static(
            $configuration,
            $plugin_id,
            $plugin_definition,
            $container->getParameter('serializer.formats'),
            $container->get('logger.factory')->get($types['content']),
            $container->get('current_user'),
            $types,
            $announcementNormalizer,
            //new ProjectNodeEntityNormalizer(\Drupal::entityManager()),
            $container->get('request_stack')->getCurrentRequest()

        );
    }

    /**
     * @return ModifiedResourceResponse
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     */
    public function get()
    {
        // get notifications

        // has access

        // user context
        $userId = $this->currentUser->id();

        $param = \Drupal::request()->query->all();
        if (!isset($param['web'])) {


            $db = \Drupal::database();
            $query = $db->select('node', 'n');
            $query->join('node__field_ongea_msg_receivers', 're', 're.entity_id = n.nid');
            $query->join('node__field_ongea_message', 'm', 'm.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_ua_has_read', 'hr', 'hr.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_msg_to_staff', 'ms', 'ms.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_msg_to_parts', 'mp', 'mp.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_msg_applicants', 'ma', 'ma.entity_id = n.nid');
            $query->leftJoin('node__field_field_ongea_msg_to_grouple', 'mg', 'mg.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_msg_sendtime', 'se', 'se.entity_id = n.nid');
            $query
                ->fields('re', array('entity_id', 'field_ongea_msg_receivers_target_id'))
                ->fields('hr', array('field_ongea_ua_has_read_value'))
                ->fields('ms', array('field_ongea_msg_to_staff_value'))
                ->fields('mp', array('field_ongea_msg_to_parts_value'))
                ->fields('ma', array('field_ongea_msg_applicants_value'))
                ->fields('mg', array('field_field_ongea_msg_to_grouple_value'))
                ->fields('m', array('field_ongea_message_value'))
                ->fields('se', array('field_ongea_msg_sendtime_value'))
                ->condition('n.type', 'ongea_announcement')
                ->condition('re.field_ongea_msg_receivers_target_id', $userId);
            $results = $query->execute()->fetchAll();

            $announcements = [];

            foreach ($results as $result) {
                $result->id = intval($result->entity_id);
                $result->field_ongea_ua_has_read_value = empty($result->field_ongea_ua_has_read_value) ? false : true;
                $result->field_ongea_msg_to_staff_value = empty($result->field_ongea_msg_to_staff_value) ? false : true;
                $result->field_ongea_msg_to_parts_value = empty($result->field_ongea_msg_to_parts_value) ? false : true;
                $result->field_ongea_msg_applicants_value = empty($result->field_ongea_msg_applicants_value) ? false : true;
                $result->field_field_ongea_msg_to_grouple_value = empty($result->field_field_ongea_msg_to_grouple_value) ? false : true;
                $result->field_ongea_msg_sendtime_value = $result->field_ongea_msg_sendtime_value;
                $result->message = $result->field_ongea_message_value;

                unset($result->nid);
                $announcements[] = (array) $result;

            }
            return new ModifiedResourceResponse($announcements, 200);
            /*
            //        $query = \Drupal::entityQuery('node')
            //          ->condition('type', 'ongea_announcement')
            //          ->condition('field_ongea_msg_receivers', $userId);
            //        $nids = $query->execute();
            //        $controller = \Drupal::entityManager()->getStorage('node');
            //        $nodes = array_values($controller->loadMultiple($nids));

            $queryUaAnnouncements = \Drupal::entityQuery('node')
            ->condition('type', 'ongea_user_announcements')
            ->condition('field_ongea_ua_has_read', false)
            ->condition('field_ongea_ua_user', $userId);
            $queryUaAnnouncementsNids = $queryUaAnnouncements->execute();


            try {
                $controller = \Drupal::entityTypeManager()->getStorage('node');
            } catch (InvalidPluginDefinitionException $e) {
            } catch (PluginNotFoundException $e) {
            }
            $nodes = array_values($controller->loadMultiple($queryUaAnnouncementsNids));

            $announcements = [];

            foreach ($nodes as $node) {
                $tmp = $node->toArray();
                $tmp->id = $tmp->nid;
                $tmp->message = $tmp->nid;
                $announcements[] = $tmp;
            }
            return new ModifiedResourceResponse($announcements, 200);*/
        }
        else {


            $db = \Drupal::database();
            $query = $db->select('node', 'n');
            $query->join('node_field_data', 'nf', 'nf.nid = n.nid');
            $query->join('node__field_ongea_message', 'm', 'm.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_ua_has_read', 'hr', 'hr.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_msg_to_staff', 'ms', 'ms.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_msg_to_parts', 'mp', 'mp.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_msg_applicants', 'ma', 'ma.entity_id = n.nid');
            $query->leftJoin('node__field_field_ongea_msg_to_grouple', 'mg', 'mg.entity_id = n.nid');
            $query->leftJoin('node__field_ongea_msg_sendtime', 'se', 'se.entity_id = n.nid');
            $query
                ->fields('nf', array('nid', 'uid'))
                ->fields('hr', array('field_ongea_ua_has_read_value'))
                ->fields('ms', array('field_ongea_msg_to_staff_value'))
                ->fields('mp', array('field_ongea_msg_to_parts_value'))
                ->fields('ma', array('field_ongea_msg_applicants_value'))
                ->fields('mg', array('field_field_ongea_msg_to_grouple_value'))
                ->fields('m', array('field_ongea_message_value'))
                ->fields('se', array('field_ongea_msg_sendtime_value'))
                ->condition('n.type', 'ongea_announcement')
                ->condition('nf.uid', $userId)
                ->condition('nf.type', 'ongea_announcement');
            $results = $query->execute()->fetchAll();

            $announcements = [];

            foreach ($results as $result) {
                $result->id = intval($result->nid);
                $result->field_ongea_ua_has_read_value = empty($result->field_ongea_ua_has_read_value) ? false : true;
                $result->field_ongea_msg_to_staff_value = empty($result->field_ongea_msg_to_staff_value) ? false : true;
                $result->field_ongea_msg_to_parts_value = empty($result->field_ongea_msg_to_parts_value) ? false : true;
                $result->field_ongea_msg_applicants_value = empty($result->field_ongea_msg_applicants_value) ? false : true;
                $result->field_field_ongea_msg_to_grouple_value = empty($result->field_field_ongea_msg_to_grouple_value) ? false : true;
                $result->field_ongea_msg_sendtime_value = $result->field_ongea_msg_sendtime_value;
                $result->message = $result->field_ongea_message_value;

                unset($result->nid);
                $announcements[] = (array) $result;

            }
            return new ModifiedResourceResponse($announcements, 200);
        }
    }

    /**
     * Responds to entity POST requests and saves the new entity.
     *
     * @return \Drupal\rest\ModifiedResourceResponse
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function post($data)
    {
        return parent::post($data);
    }

    
}