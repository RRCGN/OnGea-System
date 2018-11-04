<?php
/**
 * Created by PhpStorm.
 * User: lassenielsen
 * Date: 13.02.18
 * Time: 23:50
 */

namespace Drupal\ongea_api\Normalizer;

use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Config\ConfigException;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityManagerInterface;
use Drupal\Core\Field\FieldItemList;
use Drupal\entity_reference_integrity\EntityReferenceDependencyManager;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\ongea_api\EntityWrapper\OngeaEntityWrapperInterface;
use Drupal\ongea_api\EntityWrapper\OngeaEntityWrapperManager;
use Drupal\serialization\Normalizer\ContentEntityNormalizer;
use Psr\Log\LoggerInterface;


/**
 * Converts the Drupal entity object structures to a normalized array.
 */
class OngeaNodeEntityNormalizer extends OngeaEntityNormalizer implements OngeaNodeEntityNormalizerInterface
{


    /**
     * The interface or class that this Normalizer supports.
     *
     * @var string
     */
    protected $supportedInterfaceOrClass = 'Drupal\node\NodeInterface';


    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct($em);
        $this->config = self::loadConfigStatic(
          'ongea_api.'.$this->getContentType().'.settings'
        );

    }

    public function getContentType()
    {
        return false;
    }



    /**
     * {@inheritdoc}
     */
    public function supportsNormalization($data, $format = null)
    {
        // If we aren't dealing with an object or the format is not supported return
        // now.
        if (!is_object($data) || !$this->checkFormat($format)) {
            return false;
        }
        // This custom normalizer should be supported for "Activity" nodes.
        if ($data instanceof NodeInterface && $data->getType(
          ) == $this->getContentType()) {
            return true;
        }

        // Otherwise, this normalizer does not support the $data object.
        return false;
    }

    /**
     * DEPRECATED
     */
    public function getFieldConfig()
    {
        $default_config = \Drupal::config('ongea_activity.settings');

        return [
          'ongea_entities' => $default_config->get('api.entities'),
          'ongea_activity_fields' => $default_config->get('api.fields'),
          'ongea_activity_refs' => $default_config->get('api.reference'),
        ];
    }

    /**
     * DEPRECATED
     */
    function hydrate($data)
    {

        $node = array_merge(
          $data,
          [
            'type' => $this->getContentType(),
          ]
        );
        $node = Node::create(
          $node
        );

        return $node;
    }

    /**
     * @param array $data
     * @param null $format
     * @param array $context
     *
     * @return array|\Symfony\Component\Serializer\Normalizer\scalar
     */
    public function denormalize(
      $data,
      $class,
      $format = null,
      array $context = []
    ) {
        $debug = false;
        if ($debug) {
            $this->logger->notice('begin denormalize');
        }

        $result = [];
        $references = [];
        //set result type to entity content type
        $result['type'] = $this->getContentType();

        $resultNew = $result;
        if ($debug) {
            $this->logger->notice('set content type');
        }


        //$result = array_merge($result, $this->denomalizeDependents($data));
        if ($debug) {
            $this->logger->notice('get dependents');
        }

        // load references from config
        $apiReferences = $this->getAPIReferences();

        // load fields from config
        $apiFields = array_flip($this->getAPIFields());
        // iterate through sending data
        foreach ($data as $key => $attribute) {
            if ($attribute != null) {
            }

            if (!isset($apiFields[$key])) {
                // wrong field name

            } else {
                // set attribute to result with drupal id
                $field = $apiFields[$key];
                $result[$field] = $attribute;

                // is a reference?

                if (true == false) {
                    if (array_key_exists($field, $apiReferences)) {


                        // is reference -> delete result data
                        $referenceData = $result[$field];
                        if ($referenceData != null) {
                            // is a single reference -> TODO: refactor
                            if ($apiReferences[$field]['single']) {

                                /** @var NodeInterface $reference */
                                if (isset($referenceData['id'])) {

                                    if (isset($referenceData['alt'])) {
                                        $result[$field]['alt'] = $referenceData['alt'];
                                    }
                                    if (isset($referenceData['title'])) {
                                        $result[$field]['title'] = $referenceData['title'];
                                    }
                                    $result[$field]['target_id'] = $referenceData['id'];
                                }

                            } else {
                                $refIds = [];
                                foreach ($referenceData as $singleRef) {
                                    if (isset($singleRef['id'])) {

                                        $newSingleRef = [];
                                        if (isset($singleRef['alt'])) {
                                            $newSingleRef['alt'] = $singleRef['alt'];
                                        }
                                        if (isset($singleRef['title'])) {
                                            $newSingleRef['title'] = $singleRef['title'];
                                        }
                                        $newSingleRef['target_id'] = $singleRef['id'];
                                        $refIds[] = $newSingleRef;
                                    }
                                }

                                $result[$field] = array_values($refIds);
                            }
                        } else {
                            $result[$field] = null;
                        }


                    }
                }

            }
        }

        $resultNew = array_merge(
          $result,
          $resultNew,
          $this->denormalizeFields($data),
          $this->denormalizeFiles($data),
          $this->denormalizeTaxonomy($data),
          $this->denormalizeReferences($data),
          $this->denormalizeComplexFields($data),
          $this->denormalizeDependents($data)
        );

        return $resultNew;
    }

    public function getAPIReferences()
    {
        $dev_config = [];
        $settingsConfig = $this->getAPI('api_references');
        if (!$settingsConfig) {
            $settingsConfig = [];
        }

        return array_merge(
          $settingsConfig,
          $dev_config
        );
    }

    public function getAPI($name)
    {
        $apiDefaultConfig = $this->apiSettings->get($name.'.ongea_default');

        $apiFieldConfig = $this->apiSettings->get(
          $name.'.'.$this->getContentType()
        );
        if (!$apiDefaultConfig) {
            $apiDefaultConfig = [];
        }
        if (!$apiFieldConfig) {
            $apiFieldConfig = [];
        }
        $result = array_merge($apiDefaultConfig, $apiFieldConfig);

        return $result;
    }

    public function getAPIFields()
    {
        return $this->getAPI('api_fields');
    }

    public function denormalizeFields($data)
    {
        $config = $this->getConfig('fields');
        // This is necessary just on old instalations, because the old mapping is in the config
        if (isset($config['field_ongea_signup_skills'])) {
            $config['field_ongea_signup_skills']['friendlyName'] = 'signupSkills';
        }
        $debug = false;

        if ($debug) {
            $this->logger->notice('go for it fields');
        }

        $result = [];

        if ($config == null) {
            return $result;
        }

        foreach ($config as $key => $val) {
            if (isset($val['friendlyName']) && isset($data[$val['friendlyName']])) {

                $fieldData = $data[$val['friendlyName']];
                if ($debug) {

                    $this->logger->notice($key);
                }
                $fieldItemNormalizer = $this->getOwnNormalizer(
                  isset($val['normalizer']) ? $val['normalizer'] : 'ongea_api.normalizer_field_value'
                );

                if (isset($val['single']) && $val['single'] == false) {
                    $fieldItemListNormalizer = $this->getOwnNormalizer(
                      'ongea_api.normalizer_field_item_list'
                    );

                    $result[$key] = $fieldItemListNormalizer->denormalize(
                      $fieldData,
                      $fieldItemNormalizer
                    );
                } else {
                    $oprions = '';
                    // special case for mobilities field datetime
                    strpos(\Drupal::service('path.current')->getPath(), 'mobilities') !== FALSE ? $oprions = 'Full Date' : '';
                    $result[$key] = $fieldItemNormalizer->denormalize(
                      $fieldData,
                      $oprions
                    );
                }
            }

        }

        return $result;
    }

    /**
     * @param string $str
     *
     * @return mixed
     */
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

    protected function getOwnNormalizer($normalizerKey)
    {
        if (!$this->hasOwnNormalizer($normalizerKey)) {
            $this->setOwnNormalizer($normalizerKey);
        }

        return $this->ownNormalizers[$normalizerKey];
    }

    protected function hasOwnNormalizer($normalizerKey)
    {
        return isset($this->ownNormalizers[$normalizerKey]);
    }

    protected function setOwnNormalizer($normalizerKey)
    {
        $this->ownNormalizers[$normalizerKey] = $this->container->get(
          $normalizerKey
        );
    }

    public function denormalizeFiles($data)
    {
        $config = $this->getConfig('files');
        $debug = false;

        if ($debug) {
            $this->logger->notice('go for it files');

        }

        $result = [];

        if ($config == null) {
            return $result;
        }
        foreach ($config as $key => $val) {

            if (isset($val['friendlyName']) && isset($data[$val['friendlyName']])) {

                $fieldData = $data[$val['friendlyName']];
                if ($debug) {

                    $this->logger->notice($key);
                }


                $fieldItemNormalizer = $this->getOwnNormalizer(
                  'ongea_api.normalizer_field_reference_file'
                );
                if (isset($val['single']) && $val['single'] == false) {
                    $fieldItemListNormalizer = $this->getOwnNormalizer(
                      'ongea_api.normalizer_field_reference_list'
                    );

                    $result[$key] = $fieldItemListNormalizer->denormalize(
                      $fieldData,
                      $fieldItemNormalizer
                    );
                } else {


                    $result[$key] = $fieldItemNormalizer->denormalize(
                      isset($fieldData[0]) ? $fieldData[0] : $fieldData
                    );

                }


            }

        }

        return $result;
    }

    public function denormalizeTaxonomy($data)
    {
        $config = $this->getConfig('taxonomy');
        $debug = false;

        if ($debug) {
            $this->logger->notice('go for it taxonomy');
        }

        $result = [];

        if ($config == null) {
            return $result;
        }

        foreach ($config as $key => $val) {
            if (isset($val['friendlyName']) && isset($data[$val['friendlyName']])) {
                $options = [];
                if ($val['target']) {
                    $options['vid'] = $val['target'];
                }
                $fieldData = $data[$val['friendlyName']];
                if ($debug) {

                    $this->logger->notice($key);
                }
                $fieldItemNormalizer = $this->getOwnNormalizer(
                  'ongea_api.normalizer_field_ref_tax'
                );
                if (isset($val['single']) && $val['single'] == false) {
                    $fieldItemListNormalizer = $this->getOwnNormalizer(
                      'ongea_api.normalizer_field_reference_list'
                    );

                    $result[$key] = $fieldItemListNormalizer->denormalize(
                      $fieldData,
                      $fieldItemNormalizer,
                      $options
                    );
                } else {
                    $result[$key] = $fieldItemNormalizer->denormalize(
                      $fieldData,
                      $options
                    );
                }
            }

        }

        return $result;
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function denormalizeReferences($data)
    {
        $config = $this->getConfig('references');
        $debug = false;

        if ($debug) {
            $this->logger->notice('go for it references');
        }

        $result = [];

        if ($config == null) {
            return $result;
        }
        foreach ($config as $key => $val) {
            if (isset($val['fetch']) && $val['fetch'] == false) {
                continue;
            }
            if (isset($val['friendlyName']) && isset($data[$val['friendlyName']])) {

                $fieldData = $data[$val['friendlyName']];
                if ($debug) {

                    $this->logger->notice($key);
                }
                $fieldItemNormalizerStr = isset($val['merge']) ? 'ongea_api.normalizer_field_reference_merge' : 'ongea_api.normalizer_field_reference';
                $fieldItemNormalizer = $this->getOwnNormalizer(
                  $fieldItemNormalizerStr
                );
                $options = [];


                if (isset($val['normalizer'])) {
                    $targetNormalizer = $this->getOwnNormalizer(
                      $val['normalizer']
                    );
                    $options['targetNormalizer'] = $targetNormalizer;
                }
                if (isset($val['single']) && $val['single'] == false) {
                    $fieldItemListNormalizer = $this->getOwnNormalizer(
                      'ongea_api.normalizer_field_reference_list'
                    );
                    $result[$key] = $fieldItemListNormalizer->denormalize(
                      $fieldData,
                      $fieldItemNormalizer,
                      $options
                    );
                } else {
                    $result[$key] = $fieldItemNormalizer->denormalize(
                      $fieldData,
                      $options
                    );
                }
            }

        }
        return $result;
    }

    protected function denormalizeComplexFields($data)
    {

        $debug = false;
        if ($debug) {
            $this->logger->notice('normalizeComplexFields');
        }
        $result = [];

        $config = $this->getConfig('complex');

        if ($config == null) {
            return $result;
        }
        foreach ($config as $complexConfigItem) {

            //friendlyName: departureTime
            //field: field_ongea_departure_datetime
            $field = $complexConfigItem['field'];

            
            if (isset($complexConfigItem['denormalizer']) && isset($complexConfigItem['fieldFriendlyName']) && isset($data[$complexConfigItem['fieldFriendlyName']])) {
                $fieldData = $data[$complexConfigItem['fieldFriendlyName']];
                //normalizer: ongea_api.normalizer_field_time
                $fieldItemNormalizer = $this->getOwnNormalizer(
                  $complexConfigItem['denormalizer']
                );

                if (isset($complexConfigItem['single']) && $complexConfigItem['single'] == false) {

                    // TODO: IMPLEMENT
                    // use own list
                    /* $fieldItemListNormalizer = $this->getOwnNormalizer(
                       'ongea_api.normalizer_field_list'
                     );

                     $result[$field] = $fieldItemListNormalizer->denormalize(
                       $fieldData,
                       $fieldItemNormalizer
                     );*/
                } else {


                    // only for datetime
                    if (isset($data[$complexConfigItem['friendlyName']])) {
                        $fieldData = $fieldData.'T'.$data[$complexConfigItem['friendlyName']];

                    }

                    $result[$field] = $fieldItemNormalizer->denormalize(
                      $fieldData
                    );

                }
            }


        }

        return $result;
    }

    protected function denormalizeDependents($data)
    {
        $config = $this->getConfig('dependents');

        $debug = false;

        if ($debug) {
            $this->logger->notice('go for it dependents');
        }

        $result = [];


        if ($config == null) {
            return $result;
        }
        foreach ($config as $key => $val) {
            if (isset($data[$key])) {

                $fieldData = $data[$key];
                if ($debug) {

                    $this->logger->notice($key);
                }
                // itterate over $data[$key]

                foreach ($data[$key] as $dependentData) {
                    if (isset($dependentData['id'])) {
                        $result[] = [
                          'id' => $dependentData['id'],
                          'type' => $val['type'],
                          'field' => $val['field'],
                          'single' => isset($val['single']) && $val['single'] == false ? false : true,
                        ];
                    }


                }
            }
        }

        $result['ongea_dependents'] = $result;

        return $result;
    }

    /**
     * @param FieldItemList $field
     * @param null $format
     * @param array $context
     */
    public function normalizeComplexField(
      $field,
      $format = null,
      array $context = []
    ) {

        // TODO: refactor
        $attributes = [];
        $result = [];
        if (isset($context['ongea_complex'])) {
            foreach ($context['ongea_complex'] as $key => $complexField) {
                if ($key == 'ongea_date_time_split') {
                    $attributes = $this->complexFieldDateTimeSplit(
                      $field,
                      $complexField
                    );
                }
            }

        }

        return $attributes;
    }

    public function complexFieldDateTimeSplit($field, $complexOptions)
    {
        $attributes = [];
        $startAndEndDate = $this->datetimeToDateAndTime($field->first()->date);
        foreach ($complexOptions['resultFields'] as $resultFieldKey => $resultField) {
            if (isset($startAndEndDate[$resultFieldKey])) {
                $attributes[$resultField] = $startAndEndDate[$resultFieldKey];
            }
        }

        return $attributes;
    }

    /**
     * @param DrupalDateTime $datetime
     */
    public function datetimeToDateAndTime($datetime)
    {
        return [
          'date' => $datetime->format('Y-m-d'),
          'time' => $datetime->format('H:i'),
        ];
    }

    /**
     * @param $attributes
     *
     * @return array
     *
     * removes single value attributes
     */
    public function normalizeSingleValues($attributes)
    {
        foreach ($attributes as $key => $attribute) {
            $attributes[$key] = $this->isSingleValue(
              $attribute
            ) ? $attribute[0]['value'] : $attribute;
        };

        return $attributes;
    }

    protected function isSingleValue($attribute)
    {

        if (isset($attribute[0])
          && sizeof($attribute) === 1
          && sizeof($attribute[0]) === 1
          && isset($attribute[0]['value'])) {
            return true;
        }

        return false;
    }

    /**
     * @param Node $entity
     * @param null $format
     * @param array $context
     *
     * @return array|\Symfony\Component\Serializer\Normalizer\scalar
     */
    public
    function normalize(
      $entity,
      $format = null,
      array $context = []
    ) {

        // debug
        $debug = false;
        if ($debug) {
            $this->logger->notice('go for it');
        }
        //print 'aa'.$entity->get('langcode')->value;die();
        /*print $entity->hasTranslation($langcode) ? 1 : 2;die();
        $translated_entity = $entity->getTranslation('de');
$translated_title = $translated_entity->getTitle();


print_r($entity->toArray());die();*/
        // get wrapper manager
        // TODO: get service
        $wrapperManager = new OngeaEntityWrapperManager();
        $wrapper = $wrapperManager->start($entity);
        if ($wrapper == null) {

            throw new ConfigException(
              'normalize '.$entity->bundle().' files no wrapper'
            );
        }

        $result = [];

        $options = [];

        $scopeConfig = $wrapper->getConfig('scope');
        if ($scopeConfig != null) {
            $options['scopeConfig'] = $scopeConfig;

        }
        if (isset($context['scope'])) {
            $options['scope'] = $context['scope'];
        }

        // result merge
        $result = array_merge(
          $result,
          $this->normalizeOngeaReferences($wrapper, $options),
          $this->normalizeFiles($wrapper, $options),
          $this->normalizeTaxonomy($wrapper, $options),
          $this->normalizeFields($wrapper, $options),
          $this->normalizeComplexFields($wrapper, $options)
        );


        $result = $this->normalizeToScope($result, $options);

        // getDependents
        $result = array_merge($result, $this->normalizeDependents($entity));
        if (isset($_SESSION['ongea']['selected_group'])) {
            $result['gid'] = $_SESSION['ongea']['selected_group'];
        }

        $node = $entity->toArray();

        if ($entity->bundle() == 'ongea_project' || $entity->bundle() == 'ongea_organisation') {
            $result['manage'] = !empty($entity->manage);
        }
        if (isset($node['field_ongea_country'][0]['value'])) {
          $result['country'] = $node['field_ongea_country'][0]['value'];
        }
        if ($entity->bundle() == 'ongea_stay') {
            $result['reducedPrice'] = !empty($result['reducedPrice']);
        }
        
        /*
        if (isset($result['departureExistingPlace'])) {
            unset($result['departureExistingPlace']);
            if (isset($result['arrivalExistingPlace'])) {
                unset($result['arrivalExistingPlace']);
            }
            if (isset($result['departureCustomLocation'])) {
                $result['departureLocation'] = $result['departureCustomLocation'];
                unset($result['departureCustomLocation']);
            }
            if (isset($result['arrivalCustomLocation'])) {
                $result['arrivalLocation'] = $result['arrivalCustomLocation'];
                unset($result['arrivalCustomLocation']);
            }
        }*/
        return $result;
    }

    /**
     * @param OngeaEntityWrapperInterface $wrapper
     *
     * @return array
     */
    public
    function normalizeOngeaReferences(
      $wrapper,
      $options = []
    ) {
        $debug = false;
        if ($debug) {
            $this->logger->notice('normalizeOngeaFiles');
        }

        $config = $wrapper->getReferenceConfig();


        return $this->normalizeReferences($wrapper, $config, $options);
    }

    /**
     * @param array $config
     * @param OngeaEntityWrapperInterface $wrapper
     *
     * @return array
     */
    public
    function normalizeReferences(
      $wrapper,
      $config,
      $options = [],
      $normalizer = [
        'field' => 'ongea_api.normalizer_field_reference',
        'list' => 'ongea_api.normalizer_field_reference_list',
      ]
    ) {
        $debug = false;
        if ($debug) {
            $this->logger->notice('normalizeReferences');
        }

        $result = [];
        if ($config == null) {
            return $result;
        }
        $currentScope = $this->getCurrentScope($options);
        foreach ($config as $key => $val) {
            $fieldIsInScope = $this->isFieldInScope($key, $currentScope);
            if ($fieldIsInScope && $wrapper->hasField($key)) {
                $fieldList = $wrapper->getField($key);


                if (isset($val['fieldNormalizer'])) {
                    $normalizer['field'] = $val['fieldNormalizer'];
                }
                $fieldItemNormalizer = $this->getOwnNormalizer(
                  $normalizer['field']
                );
                $refOptions = [];

                // get config options
                if (isset($val['scope'])) {
                    $refOptions['scope'] = $val['scope'];
                }


                if (isset($val['normalizer'])) {
                    $targetNormalizer = $this->getOwnNormalizer(
                      $val['normalizer']
                    );
                    $refOptions['targetNormalizer'] = $targetNormalizer;
                }
                $newKey = isset($val['friendlyName']) ? $val['friendlyName'] : $key;

                /** @var FieldReferenceListNormalizer $fieldItemListNormalizer */
                $fieldItemListNormalizer = $this->getOwnNormalizer(
                  $normalizer['list']
                );
                //$listResult = $fieldItemListNormalizer->normalize($fieldList, $fieldItemNormalizer, $options);

                $result[$newKey] = $this->normalizeList(
                  $fieldList,
                  $fieldItemListNormalizer,
                  $fieldItemNormalizer,
                  $val,
                  $refOptions
                );

            }
        }


        return $result;
    }

    protected function getCurrentScope($options)
    {
        if (isset($options['scopeConfig'])) {
            $scopeConfig = $options['scopeConfig'];
            $requestScope = $this->currentRequest->query->get('scope');
            $scope = null;
            if (isset($options['scope']) && isset($scopeConfig[$options['scope']])) {
                $scope = $scopeConfig[$options['scope']];
            }
            if ($requestScope != null && isset($scopeConfig[$requestScope])) {
                $scope = $scopeConfig[$requestScope];
            }

            return $scope;
        }

        return null;

    }

    protected function isFieldInScope($fieldName, $currentScope)
    {

        if ($currentScope != null) {
            if (in_array($fieldName, $currentScope)) {
                return true;
            }

            return false;
        }

        return true;
    }

    /**
     * @param $fieldList
     * @param $fieldItemListNormalizer
     * @param $fieldItemNormalizer
     * @param $val
     * @param $options
     *
     * @return array
     */
    public
    function normalizeList(
      $fieldList,
      $fieldItemListNormalizer,
      $fieldItemNormalizer,
      $val,
      $options
    ) {
        $listResult = $fieldItemListNormalizer->normalize(
          $fieldList,
          $fieldItemNormalizer,
          $options
        );

        if (isset($listResult[0])) {
            return $this->normalizeSingle($listResult, $val);

        } else {
            // if no result return single array
            return [];
        }
    }

    public
    function normalizeSingle(
      $listResult,
      $fieldConfig
    ) {
        if (isset($fieldConfig['single']) && $fieldConfig['single'] == false) {
            // no change
            return $listResult;
        } else {
            return $listResult[0];
        }
    }

    /**
     * @param $attributes
     * @param $entity
     * @param $format
     * @param OngeaEntityWrapperInterface $wrapper
     *
     * @return array
     */
    protected
    function normalizeFiles(
      $wrapper,
      $options = []
    ) {
        $debug = false;
        if ($debug) {
            $this->logger->notice('normalizeFiles');
        }

        $config = $wrapper->getFilesConfig();

        //$filesConfig = $config['files'];
        return $this->normalizeReferences(
          $wrapper,
          $config,
          $options,
          [
            'field' => 'ongea_api.normalizer_field_reference_file',
            'list' => 'ongea_api.normalizer_field_reference_list',
          ]
        );
    }

    /**
     * @param OngeaEntityWrapperInterface $wrapper
     */
    public
    function normalizeTaxonomy(
      $wrapper,
      $options = []
    ) {
        $config = $wrapper->getConfig('taxonomy');

        $debug = false;
        if ($debug) {
            $this->logger->notice('go for it tex');
        }

        $result = [];

        if ($config == null) {
            return $result;
        }
        foreach ($config as $key => $val) {
            if ($wrapper->hasField($key)) {
                if ($debug) {
                    $this->logger->notice($key);
                }


                $fieldList = $wrapper->getField($key);
                $fieldItemNormalizer = $this->getOwnNormalizer(
                  'ongea_api.normalizer_field_ref_tax'
                );
                $fieldItemListNormalizer = $this->getOwnNormalizer(
                  'ongea_api.normalizer_field_reference_list'
                );
                $newKey = isset($val['friendlyName']) ? $val['friendlyName'] : $key;
                $options = [];
                $result[$newKey] = $this->normalizeList(
                  $fieldList,
                  $fieldItemListNormalizer,
                  $fieldItemNormalizer,
                  $val,
                  $options
                );


            }
        }


        return $result;

    }

    /**
     * @param OngeaEntityWrapperInterface $wrapper
     */
    public
    function normalizeFields(
      $wrapper,
      $options = []
    ) {
        $config = $wrapper->getConfig('fields');
        // This is necessary just on old instalations, because the old mapping is in the config
        if (isset($config['field_ongea_signup_skills'])) {
            $config['field_ongea_signup_skills']['friendlyName'] = 'signupSkills';
        }
        $debug = false;

        if ($debug) {
            $this->logger->notice('go for it fields');
        }

        $result = [];

        if ($config == null) {
            return $result;
        }
        $currentScope = $this->getCurrentScope($options);

        foreach ($config as $key => $val) {
            $fieldIsInScope = $this->isFieldInScope($key, $currentScope);
            if ($fieldIsInScope && $wrapper->hasField($key)) {
                if ($debug) {
                    $this->logger->notice($key);
                }

                /** @var \Drupal\Core\Field\FieldItemListInterface $fieldList */
                $fieldList = $wrapper->getField($key);

                /** @var \Drupal\ongea_api\Normalizer\OngeaFieldNormalizerInterface $fieldItemNormalizer */
                $fieldItemNormalizer = $this->getOwnNormalizer(
                  'ongea_api.normalizer_field_value'
                );
                if (isset($val['scope'])) {
                    $options['scope'] = $val['scope'];
                }
                if (isset($val['normalizer'])) {
                    $fieldItemNormalizer = $this->getOwnNormalizer(
                      $val['normalizer']
                    );
                }
                $fieldItemListNormalizer = $this->getOwnNormalizer(
                  'ongea_api.normalizer_field_item_list'
                );

                $listResult = $fieldItemListNormalizer->normalize(
                  $fieldList,
                  $fieldItemNormalizer
                );

                if (isset($listResult[0])) {
                    $result[$val['friendlyName']] = $this->normalizeSingle(
                      $listResult,
                      $val
                    );
                    if ($result[$val['friendlyName']] === "0") {
                        $result[$val['friendlyName']] = FALSE;
                    }
                } else {
                    // if no result return single array
                    $result[$val['friendlyName']] = null;
                }
            }
        }

        return $result;
    }

    /**
     * @param OngeaEntityWrapperInterface $wrapper
     */
    public function normalizeComplexFields($wrapper, $options = [])
    {
        $debug = false;
        if ($debug) {
            $this->logger->notice('normalizeComplexFields');
        }
        $result = [];

        $config = $wrapper->getConfig('complex');

        if ($config == null) {
            return $result;
        }
        foreach ($config as $complexConfigItem) {

            // split/clone a field

            //friendlyName: departureTime
            //field: field_ongea_departure_datetime
            $field = $complexConfigItem['field'];

            //normalizer: ongea_api.normalizer_field_time

            if ($wrapper->hasField($field)) {


                if ($debug) {
                    $this->logger->notice($field);
                }
                //$attribute = $wrapper->getField($key)->getValue(); //
                $fieldList = $wrapper->getField($field);


                $fieldItemListNormalizer = $this->getOwnNormalizer(
                  'ongea_api.normalizer_field_item_list'
                );
                $fieldItemNormalizer = $this->getOwnNormalizer(
                  'ongea_api.normalizer_field_value'
                );
                if (isset($complexConfigItem['normalizer'])) {
                    $fieldItemNormalizer = $this->getOwnNormalizer(
                      $complexConfigItem['normalizer']
                    );
                }
                $listResult = $fieldItemListNormalizer->normalize(
                  $fieldList,
                  $fieldItemNormalizer
                );

                if (isset($listResult[0])) {
                    $result[$complexConfigItem['friendlyName']] = $this->normalizeSingle(
                      $listResult,
                      $complexConfigItem
                    );
                } else {
                    // if no result return single array
                    $result[$complexConfigItem['friendlyName']] = null;
                }

            }


        }

        return $result;
    }

    protected
    function normalizeToScope(
      $attributes,
      $context
    ) {
        $scope = $this->getScope($context);
        if (isset($scope)) {
            $scopeName = $scope;
            $scopes = $this->getScopeFields();

            if (isset($scopes[$scopeName])) {
                $resultScope = [];
                foreach ($scopes[$scopeName] as $scope) {
                    if (isset ($attributes[$scope])) {
                        $resultScope[$scope] = $attributes[$scope];
                    } else {
                        $resultScope[$scope] = null;
                    }

                }

                $attributes = $resultScope;
            }
        }

        return $attributes;
    }

    protected
    function getScope(
      $context
    ) {
        $scope = null;

        if (isset($context['request'])) {
            $request = $context['request'];
            $scope = $request->query->get('scope') ? $request->query->get(
              'scope'
            ) : null;

            //$resource = $request->get('_rest_resource_config');
            //$pluginId = $resource->get('plugin_id');

            $needle = 'collection_resource';
            //if (substr_compare($pluginId, $needle, -strlen($needle)) === 0) {
            //  $scope = 'small';
            //}
        }

        return $scope;
    }

    public function getScopeFields()
    {

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
        //     $this->getAPI('api_scopes'),
          $dev_config
        );

    }

    public
    function normalizeDependents(
      $entity
    ) {
        $dependents = $this->getDependents(
          $entity,
          $this->getContentType()
        );
        if (is_array($dependents)) {
            return $dependents;
        }

        return [];
    }

    public function getDependents($entity, $contentType)
    {

        $entities = [];
        //$fieldMap = $this->container->get('entity_reference_integrity.field_map');

        $dependentTypes = $this->getDependentsTypes();
        if ($dependentTypes === null) {
            return $entities;
        }
        foreach ($dependentTypes as $key => $dependentType) {
            $entities[$dependentType] = [];
        }
        /** @var EntityReferenceDependencyManager $dependencyManager */
        $dependencyManager = $this->container->get(
          'entity_reference_integrity.dependency_manager'
        );


        if (!$dependencyManager->hasDependents($entity)) {
            return $entities;
        }
        $dependents = $dependencyManager->getDependentEntities($entity);

        foreach ($dependents as $dependent) {
            /** @var EntityInterface $subDependent */
            foreach ($dependent as $subDependent) {
                foreach ($dependentTypes as $key => $dependentType) {
                    if ($subDependent->bundle() === $key) {
                        $entities[$dependentType][]['id'] = (int)$subDependent->id(
                        );
                    }
                }
            }
        }


        return $entities;
    }

    /**
     * @return array
     */
    public function getDependentsTypes()
    {
        return [];
    }

    protected function getTargetEntity($field)
    {
        $entity = $field->get('entity');
        if ($entity) {
            $target = $entity->getTarget();
            if ($target) {
                return $target->getValue();
            }
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
    protected function getTidByName($name = null, $vid = null)
    {
        $properties = [];
        if (!empty($name)) {
            $properties['name'] = $name;
        }
        if (!empty($vid)) {
            $properties['vid'] = $vid;
        }
        try {
            $terms = $this->entityManager->getStorage('taxonomy_term')
              ->loadByProperties($properties);
        } catch (InvalidPluginDefinitionException $e) {
            // term couldnt load
        } catch (PluginNotFoundException $e) {
        }
        $term = reset($terms);

        return !empty($term) ? $term->id() : 0;
    }

}
