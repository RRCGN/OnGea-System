<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 05.08.18
 * Time: 17:31
 */

namespace Drupal\ongea_api\Normalizer\Field;


use Drupal\languagefield\Plugin\Field\FieldType\LanguageItem;

class FieldLanguageNormalizer extends FieldValueNormalizer
{

    protected $languageManager;

    protected $languages;

    public function __construct($em)
    {

        parent::__construct($em);

        $this->languageManager = \Drupal::languageManager();
        $this->languages = $this->languageManager->getLanguages();
    }

    public function denormalize($field, $options = [])
    {
        if (is_array($field)) {
            if (isset($field['value'])) {
                $field = $field['value'];
            }

        }
        if (is_string($field)) {
            $langcode = $this->langCodeGuesser($field);
            return $langcode;

        }
        return $field;
        //return parent::denormalize($field, $options);
    }

    public function langCodeGuesser($langName)
    {
        // Sometimes langName is actually a langCode
        if (strlen($langName) == 2) {
            return $langName;
        }
        $languages = $this->languages;

        $langName = strtolower($langName);
        foreach ($languages as $key => $value) {
            if (strtolower($value->getName()) === $langName) {
                return $key;
            }
        }

        return null;
    }

    /**
     * @param LanguageItem $field
     * @param array $options
     *
     * @return array|mixed
     */
    public function normalize($field, $options = [])
    {
        $options = array_merge($options, ['attributeName' => 'value']);

        $languageName = $this->languageManager->getLanguageName(
          $field->getString()
        );

        if ($languageName == null) {
            $languageName = $this->languageManager->getDefaultLanguage()
              ->getName();
        }

        return $languageName;

        //return parent::normalize($field, $options);
    }

}