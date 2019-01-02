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
        switch ($id) {
            case 'foodoptions':
                $result = $config->get('lists.food_options');
                $result[0]['numkey'] = 1;//almost everything
                $result[1]['numkey'] = 2;//meat_fish_no_pork
                $result[2]['numkey'] = 3;//meat_fish_no_beef
                $result[3]['numkey'] = 4;//meat_no_pork_no_fish
                $result[4]['numkey'] = 5;//meat_no_fish
                $result[5]['numkey'] = 6;//meat_no_milk
                $result[6]['numkey'] = 7;//meat_no_milky_sauce_no_pork
                $result[7]['numkey'] = 8;//chicken_and_fish_no_other_meat
                $result[8]['numkey'] = 9;//chicken_no_other_meat_fish
                $result[9]['numkey'] = 10;//pescetarian
                $result[10]['numkey'] = 11;//vegetarian
                $result[11]['numkey'] = 12;//vegan
                break;
            case 'roomrequirement':
                $result = $config->get('lists.room_requirement');
                $result[0]['numkey'] = 'any'; //55
                $result[1]['numkey'] = 'Single'; //56
                $result[2]['numkey'] = 'Double'; //57
                break;
            case 'gender':
                $result = $config->get('lists.gender');
                $result[0]['numkey'] = 16;//fe
                $result[1]['numkey'] = 17;//m
                $result[2]['numkey'] = 18;//other
                break;
            case 'skillsandinterests':
                //$result = $config->get('lists.skills_and_interests');
                $query = \Drupal::entityQuery('taxonomy_term');
                $query->condition('vid', "ongea_skills_and_interests");
                $tids = $query->execute();
                $terms = \Drupal\taxonomy\Entity\Term::loadMultiple($tids);
                $result = [];
                foreach ($terms as $term) {
                    $name = $term->get('name')->getString();
                    $label = $term->get('name')->getString();
                    $tid = $term->get('field_ongea_term_key')->getString();
                    $result[] = ['value' => $tid, 'label' => $label, 'key' => $tid];

                }                
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
                if ($val['label_default'] == 'overnight_stay') {
                    $val['key'] = 'overnight_stay';
                    $val['label_default'] = 'Overnight stay';
                }
                $result[] = [
                  'value' => $val['key'],
                  'label' => $val['label_default'],
                  'key' => isset($val['numkey']) ? $val['numkey'] : NULL,
                ];
            } else {
                $result[] = $val;
            }
        }

        return $result;
    }
}