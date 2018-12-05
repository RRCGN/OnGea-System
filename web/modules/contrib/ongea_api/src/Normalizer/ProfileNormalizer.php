<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 30.08.18
 * Time: 04:20
 */

namespace Drupal\ongea_api\Normalizer;


class ProfileNormalizer extends OngeaEntityNormalizer
{

    /**
     * @param \Drupal\profile\Entity\Profile $profile
     * @param null $format
     * @param array $context
     *
     * @return array|bool|float|int|string
     */
    public function normalize($profile, $format = null, array $context = [])
    {
        $food = [
            'almost everything',
            'meat_fish_no_pork',
            'meat_fish_no_beef',
            'meat_no_pork_no_fish',
            'meat_no_fish',
            'meat_no_milk',
            'meat_no_milky_sauce_no_pork',
            'chicken_and_fish_no_other_meat',
            'chicken_no_other_meat_fish',
            'pescetarian',
            'vegetarian',
            'vegan',
        ];
        
        $gender = [
            16 => 'female',
            17 => 'male',
            18 => 'differently',
        ];

        $node = $profile->toArray();
        $node['field_ongea_profile_gender'][0]['value'] = $gender[$node['field_ongea_profile_gender'][0]['target_id']];
        $node['field_ongea_profile_foodoptions'][0]['value'] = $gender[$node['field_ongea_profile_foodoptions'][0]['target_id']];
        //$node['field_ongea_profile_canshare'][0]['value']
        return $node;
    }
}