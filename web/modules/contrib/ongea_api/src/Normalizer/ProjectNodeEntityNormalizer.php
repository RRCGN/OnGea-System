<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 08.02.18
 * Time: 01:48
 */

namespace Drupal\ongea_api\Normalizer;

use Drupal\Core\Entity\EntityManagerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

use Drupal\Core\Cache\CacheBackendInterface;

/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class ProjectNodeEntityNormalizer extends OngeaNodeEntityNormalizer implements DenormalizerInterface
{

    protected $configEntities;

    public function __construct(EntityManagerInterface $entity_manager)
    {
        parent::__construct($entity_manager);
        //$this->configEntities = $this->getApiEntities();

    }


    public function getApiEntities()
    {


        $dev_config = [
          'files' => [
            'field_ongea_project_funder_logos' => [
              'friendlyName' => 'funderLogos',
              'type' => 'image',
              'single' => 'false',
              'fetch' => 'true',
              'normalizer' => 'ongea_api.simple_file_entity',
            ],
            'field_ongea_project_image' => [
              'friendlyName' => 'image',
              'type' => 'image',
              'single' => 'false',
              'normalizer' => 'ongea_api.simple_file_entity',
            ],
            'field_ongea_project_logo' => [
              'friendlyName' => 'logo',
              'type' => 'image',
              'single' => 'false',
              'normalizer' => 'ongea_api.simple_file_entity',
            ],
          ],
        ];
        $settingsConfig = $this->getAPI('api_entities');

        if (!$settingsConfig) {
            $settingsConfig = [];
        }

        return array_merge(
          $settingsConfig,
          $dev_config
        );
    }

    public function getContentType()
    {
        return 'ongea_project';
    }


    /**
     * @return array
     */
    public function getDependentsTypes()
    {
        return [
          'ongea_activity' => 'activities',
        ];
    }

    public function getAPIFields()
    {

        $dev_config = [//'field_ongea_activities' => 'activities'
        ];

        return array_merge(
          parent::getAPIFields(),
          $dev_config
        );
    }

    public function getAPIReferences()
    {
        $dev_config = [
          'field_ongea_project_orgs' => [
            'type' => 'ongea_organisation',
            'single' => false,
            'fetch' => true,
            'normalizer' => 'ongea_api.organisation_node_entity',
            'scope' => 'small',
          ],
          'field_ongea_project_funder_logos' => [
            'type' => 'image',
            'single' => false,
            'fetch' => true,
            'scope' => 'small',
          ],
          'field_ongea_project_image' => [
            'type' => 'image',
            'single' => false,
            'fetch' => true,
            'scope' => 'small',
          ],
          'field_ongea_project_logo' => [
            'type' => 'image',
            'single' => false,
            'fetch' => true,
            'scope' => 'small',
          ],
        ];

        return array_merge(
          parent::getAPIReferences(),
          $dev_config
        );
    }


    protected function normalizeReferenceOne()
    {

    }

    protected function normalizeReferenceN()
    {

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
      $unique = $format . (isset($_GET['scope']) ? $_GET['scope'] : '');
      /*
      \Drupal\Core\Cache\Cache::invalidateTags(array('node:5', 'my_tag'));
      \Drupal\Core\Entity\EntityInterface::getCacheTags();
      \Drupal\Core\Entity\EntityTypeInterface::getListCacheTags();
      */
      if ($cache = \Drupal::cache()->get('ongea_project' . $entity->id() . $unique)) {
        $attributes = $cache->data;
      } else {
        $attributes = parent::normalize($entity, $format, $context);
        $tags[] = 'node:' . $entity->id();
        foreach ($entity->get('field_ongea_project_orgs') as $orgs) {
          $tags[] = 'node:' . $orgs->entity->id();
        }
        \Drupal::cache()->set('ongea_project' . $entity->id() . $unique, $attributes, CacheBackendInterface::CACHE_PERMANENT, $tags);
      }
      $attributes['manage'] = empty($entity->readonly);


      return $attributes;

    }

    //    /**
    //     * @param array $attributes
    //     * @param Node $entity
    //     * @return array
    //     */
    //    public function normalizeReferences($attributes, $entity, $format)
    //    {
    //
    //        $apiReferences = $this->getAPIReferences();
    //        $singleOutput = [
    //            'field_ongea_project',
    //            'field_ongea_ao_organisation',
    //            'field_ongea_online_sign_up',
    //            'field_ongea_event_place',
    //            'field_ongea_participant',
    //            'field_ongea_sending_organisation',
    //            'field_ongea_event',
    //            'field_ongea_arrival_place',
    //        ];
    //
    //        // foreach config files
    //
    //
    //        foreach ($attributes as $key => $attribute) {
    //
    //            if (isset($apiReferences[$key]['normalizer'])) {
    //
    //                if (isset($apiReferences) && array_key_exists($key, $apiReferences)) {
    //
    //                    if ($apiReferences[$key]['fetch'] === true) {
    //
    //                        $field = $entity->get($key);
    //
    //                        if (sizeof($field) === 1 && in_array($key, $singleOutput)) {
    //
    //                            $targetEntity = $this->getTargetEntity($field[0]);
    //
    //                            if ($targetEntity) {
    //                                /** @var OngeaNodeEntityNormalizerInterface $normalizer */
    //                                $normalizer = $this->container->get($apiReferences[$key]['normalizer']);
    //                                $targetAttributes = $normalizer->normalize($targetEntity, $format, array('scope' => $apiReferences[$key]['scope']));
    //                                $attributes[$key] = $targetAttributes;
    //                                // normalize targetEntity
    //                            }
    //
    //
    //                        } else if (sizeof($field) > 0) {
    //                            $resultRes = [];
    //                            $targetEntities = $field->referencedEntities();
    //                            $normalizer = $this->container->get($apiReferences[$key]['normalizer']);
    //                            foreach ($targetEntities as $targetEntity) {
    //                                if (isset($apiReferences[$key]['scope'])) {
    //                                    $resultRes[] = $normalizer->normalize($targetEntity, $format, array('scope' => $apiReferences[$key]['scope']));
    //                                } else {
    //                                    $resultRes[] = $normalizer->normalize($targetEntity, $format);
    //
    //                                }
    //
    //                            }
    //
    //                            $attributes[$key] = $resultRes;
    //                        } else if (sizeof($field) == 0 && in_array($key, $singleOutput)) {
    //                            $attributes[$key] = null;
    //                        }
    //                        //$this->getTargetEntity($field);
    //
    //
    //                    }
    //                }
    //
    //            }
    //        }
    //
    //        $referencesConfig = $this->configEntities['references'];
    //        $config = $this->getApiEntities();
    //
    //        $filesConfig = $config['files'];
    //        $dependents = $this->configEntities['dependents'];
    //        //$attributesFiles = $this->normalizeFiles($attributes, $entity, $format);
    //        //$attributes = array_merge($attributes, $attributesFiles);
    //
    //        return $attributes;
    //    }


}