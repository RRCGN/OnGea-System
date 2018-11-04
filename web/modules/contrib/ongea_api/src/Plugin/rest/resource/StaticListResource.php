<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 31.05.18
 * Time: 20:33
 */

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 *
 * @RestResource(
 *   id = "static_lists_resource",
 *   label = @Translation("Ongea Static List Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/lists/{id}",
 *     "create" = "/api/v2/lists/{id}"
 *   }
 *
 * )
 */
class StaticListResource extends ResourceBase
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
      AccountProxyInterface $current_user
    ) {
        parent::__construct(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $serializer_formats,
          $logger
        );
        $this->currentUser = $current_user;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(
      ContainerInterface $container,
      array $configuration,
      $plugin_id,
      $plugin_definition
    ) {

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get('staticlist'),
          $container->get('current_user'),
          $container->get('request_stack')->getCurrentRequest()


        );
    }

    public function get($id)
    {
        if (!$id) {
            // throws
        }
        $result = null;
        $config = \Drupal::config('ongea_base.settings');
        print_r($config->get('lists.room_requirement'));
        print_r($config->get('lists.skills_and_interests'));
        print_r($config->get('lists.distanceband'));
        print_r($config->get('lists.participantrole'));
        print_r($config->get('lists.participantstatus'));
        print_r($config->get('lists.event_category'));
        print_r($config->get('lists.showmy'));
        print_r($config->get('lists.whocansee'));
        print_r($config->get('lists.signupformsetttings2'));
        print_r($config->get('lists.signupformfieldsetttings'));
        print_r($config->get('lists.organisation_rights'));
        die();
        switch ($id) {
            case 'foodoptions':
                $result = $config->get('lists.food_options');
                $result[0]['numkey'] = 16;//fe
                $result[1]['numkey'] = 17;//m
                $result[2]['numkey'] = 18;//other
                break;
            case 'roomrequirement':
                $result = $config->get('lists.room_requirement');
                break;
            case 'gender':
                $result = $config->get('lists.gender');
                $result[0]['numkey'] = 16;//fe
                $result[1]['numkey'] = 17;//m
                $result[2]['numkey'] = 18;//other
                break;
            case 'skillsandinterests':
                $result = $config->get('lists.skills_and_interests');
                break;
            case 'distanceband':
                $result = $config->get('lists.distanceband');
                break;
            case 'participantrole':
                $result = $config->get('lists.participantrole');
                break;
            case 'participantstatus':
                $result = $config->get('lists.participantstatus');
                break;
            case 'eventcategory':
                $result = $config->get('lists.event_category');
                break;
            case 'showmy':
                $result = $config->get('lists.showmy');
                break;
            case 'whocansee':
                $result = $config->get('lists.whocansee');
                break;
            case 'signupformsetttings2':
                $result = $config->get('lists.signupformsetttings2');
                break;
            case 'signupformfieldsetttings':
                $result = $config->get('lists.signupformfieldsetttings');
                break;
            case 'organisationrights':
                $result = $config->get('lists.organisation_rights');
                break;
            case 'languages':
                $result = \Drupal::languageManager()->getLanguages();
                break;
            default:
                $result = [
                  'foodoptions',
                  'roomrequirement',
                  'gender',
                  'skillsandinterests',
                  'distanceband',
                  'participantrole',
                  'participantstatus',
                  'eventcategory',
                  'showmy',
                  'whocansee',
                  'signupformsetttings2',
                  'signupformfieldsetttings',
                  'organisationrights',

                ];

        }


        return new ModifiedResourceResponse($this->normalize($result), 200);
    }

    protected function normalize($list)
    {
        $result = [];

        foreach ($list as $val) {
            if (isset($val['key']) && isset($val['label_default'])) {
                $result[] = [
                  'value' => $val['key'],
                  'label' => $val['label_default'],
                  'key' => $val['numkey']
                ];
            } else {
                $result[] = $val;
            }
        }

        return $result;
    }
}