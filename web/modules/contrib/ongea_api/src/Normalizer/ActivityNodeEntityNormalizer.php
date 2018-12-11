<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

use Drupal\node\Entity\Node;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class ActivityNodeEntityNormalizer extends OngeaNodeEntityNormalizer
{

    protected $container;

    /**
     * ActivityNodeEntityNormalizer constructor.
     */
    public function __construct()
    {
        $this->container = \Drupal::getContainer();
        parent::__construct(\Drupal::entityManager());
    }

    public function getScopeFields()
    {
        $parentConfig = parent::getScopeFields();
        $dev_config = [
          'small' => [
            'id',
            'title',
            'subtitle',
            'dateFrom',
            'dateTo',
          ],
        ];

        return array_merge(
          $parentConfig,
          $dev_config
        );

    }

    public function getAPIReferences()
    {
        $dev_config = [
          'field_ongea_project' => [
            'type' => 'ongea_project',
            'single' => true,
            'fetch' => true,
            'normalizer' => 'ongea_api.project_node_entity',
            'scope' => 'small',
          ],
          'field_ongea_online_sign_up' => [
            'type' => 'ongea_activity_signup_form',
            'single' => true,
            'fetch' => true,
            'normalizer' => 'ongea_api.activity_form_node_entity',
            'scope' => 'small',
          ],
          'field_ongea_ao_organisations' => [
            'type' => 'ongea_activity_organisation',
            'single' => false,
            'fetch' => true,
            'normalizer' => 'ongea_api.activity_organisation_node_entity',
            'scope' => 'small',
          ],
          'field_ongea_activity_mobilities' => [
            'type' => 'ongea_mobility',
            'single' => false,
            'fetch' => true,
            'normalizer' => 'ongea_api.mobility_node_entity',
            'scope' => 'small',
          ],
          'field_ongea_activity_places' => [
            'type' => 'ongea_place',
            'single' => false,
            'fetch' => true,
            'normalizer' => 'ongea_api.place_node_entity',
            'scope' => 'small',
          ],
        ];

        return $dev_config;
    }

    public function getAPIFields()
    {


        $dev_config = [
          'field_ongea_activity_places' => 'places',
          'field_ongea_activity_mobilities' => 'mobilities',
          'field_ongea_org_rights' => 'organisationRights',
          'field_ongea_description' => 'description',
          'field_ongea_project' => 'project',
          'field_ongea_sending_org' => 'sendingOrganisations',
          'field_ongea_ao_organisations' => 'organisations',
          'field_ongea_part_fee_red_active' => 'participationFeeReducedActive',

        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }


    public function getContentType()
    {
        return 'ongea_activity';
    }


    /**
     * @param Node $entity
     * @param null $format
     * @param array $context
     *
     * @return array|\Symfony\Component\Serializer\Normalizer\scalar
     */
    public function normalize($entity, $format = null, array $context = [])
    {
        //  $fieldMap = $container->get('entity_reference_integrity.field_map');
        //  $normalizer = EntityReferenceIntegrityEntityHandler()
        $attributes = parent::normalize($entity, $format, $context);
        if (isset($attributes['signUpForm']) && $attributes['signUpForm'] == null) {
            $attributes['signUpForm'] = false;
        }
        $attributes['manage'] = empty($entity->readonly);
        $node = $entity->toArray();
        $lan = [];
        foreach ($node['field_ongea_working_languages'] as $lang) {
          $lan[] = $lang['value'];
        }
        $attributes['mainWorkingLanguage'] = $lan;
        if (empty($node['field_isEditedBy'][0]['value'])) {
          $attributes['isEditedBy'] = \Drupal::currentUser()->id();
        } else {
          $attributes['isEditedBy'] = $node['field_isEditedBy'][0]['value'];
        }

        // When looking through mobile, return only currentUsers mobilitie
        $path = \Drupal::service('path.current')->getPath();
        $path = explode('/', $path);
        $param = \Drupal::request()->query->all();
        if (!isset($param['web']) && !isset($path[4])) {
          foreach ($attributes['mobilities'] as $key => $mob) {
            if ($mob['participant']['userId'] == \Drupal::currentUser()->id()) {
              $db = \Drupal::database();
              $query = $db->select('node__field_ongea_mobility_stays', 'ms');
              $query->join('node__field_ongea_event', 'se', 'ms.field_ongea_mobility_stays_target_id = se.entity_id');
              $query->fields('se', array('field_ongea_event_target_id'))
                    ->condition('ms.entity_id', $mob['id']);
              $nids = $query->execute()->fetchCol();
              $tmpEvents = $attributes['events'];
              $tmp = [];
              foreach ($tmpEvents as $k => $e) {
                if (in_array($e['id'], $nids)) {
                  $key1 = str_replace('-', '', $e['startDate']);
                  $key1 .= str_replace(':', '', $e['startTime']);
                  $tmp[$key1] = $e;
                }
              }
              ksort($tmp);
              $tmp = array_values($tmp);
              
              $attributes['mobilities'] = [$attributes['mobilities'][$key]];
              $attributes['mobilities'][0]['events'] = $tmp;
              break;
            }
          }
          // Unset unnecesary stuff
          unset($attributes['trabels'], $attributes['signUpForm'], $attributes['showToSkills'],
            $attributes['showToPhone'], $attributes['showToMail'], $attributes['showToName'],
            $attributes['canEditStays'], $attributes['canEditTravels'], $attributes['isVisible'],
            $attributes['hasParticipantSelectProcedure'], $attributes['mainWorkingLanguage'], $attributes['longTermActivity'],
            $attributes['erasmusActivityType'], $attributes['erasmusActivityNumber'], $attributes['erasmusGrantAgreementNumber'],
            $attributes['erasmusIsFunded'], $attributes['eligibleReduction'], $attributes['participationFeeReducedCurrency'],
            $attributes['participationFeeReduced'], $attributes['participationFeeCurrency'], $attributes['participationFee'],
            $attributes['dateToIsProgramDay'], $attributes['dateFromIsProgramDay'],
            $attributes['project']['organisations'], $attributes['project']['funderLogos'], $attributes['project']['showToName'],
            $attributes['project']['logo'], $attributes['project']['id'], $attributes['project']['title'],
            $attributes['project']['subtitle'], $attributes['project']['description'], $attributes['project']['dateFrom'],
            $attributes['project']['dateTo'], $attributes['project']['fundingText'], $attributes['project']['isErasmusFunded'],
            $attributes['project']['gid'], $attributes['project']['manage'],
            $attributes['project']['grantAgreementNumber'], $attributes['project']['isVisible'], $attributes['project']['activities']
          );
        }

        $this->getNodeTranslations($attributes, $entity, [
          'title' => 'title',
          'field_ongea_subtitle' => 'subtitle',
          'field_ongea_description' => 'description',
          'field_ongea_eligible_reduction' => 'eligibleReduction',
        ]);
        

        return $attributes;

    }
}
