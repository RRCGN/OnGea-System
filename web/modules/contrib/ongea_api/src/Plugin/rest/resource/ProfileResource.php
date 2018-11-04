<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Core\Config\ConfigException;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 *
 * @RestResource(
 *   id = "ongea_profile_resource",
 *   label = @Translation("Ongea Profile  Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/profiles/{id}",
 *     "create" = "/api/v2/profiless{id}"
 *   }
 *
 * )
 */
class ProfileResource extends ResourceBase
{

    protected $settings;


    /**
     * @param $id
     *
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     */
    public function get($id)
    {
        if (!$id) {
            throw new BadRequestHttpException(t('Id not provided.'));
        }
        $container = \Drupal::getContainer();
        $em = \Drupal::entityTypeManager();

        $config = \Drupal::config(
          'ongea_api.ongea_profile.settings'
        );
        $configFields = $config->get('fields');
        if ($config == null || $configFields == null) {
            throw new ConfigException('config profile not found');
        }


        /** @var \Drupal\user\UserStorage $userStorage */
        $userStorage = $em->getStorage('user');
        $user = $userStorage->load($id);

        /** @var \Drupal\profile\ProfileStorage $profileStorage */
        $profileStorage = $em->getStorage('profile');
        $profile = $profileStorage->loadByUser($user, 'ongea_participant_profile');


        if (!$profile || $profile->bundle() != 'ongea_participant_profile') {
            throw new NotFoundHttpException('Profile not found.');
        }



        $normalizer = $container->get('ongea_api.entity_profile');
        return new ModifiedResourceResponse(
          $normalizer->normalize($profile), 200
        );
    }

    /**
     * @param $id
     * @param $data
     *
     * @return ModifiedResourceResponse
     * @throws InvalidPluginDefinitionException
     */
    public function put($id, $data)
    {
        return $this->patch($id, $data);
    }

    /**
     * @param $id
     * @param $data
     *
     * @return ModifiedResourceResponse
     * @throws InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     * @throws \Drupal\Core\Entity\EntityStorageException
     */
    public function patch($id, $data)
    {
        if (!$id) {
            throw new BadRequestHttpException(t('Id not provided.'));
        }
        if (!$data) {
            throw new BadRequestHttpException(t(
              'No profile content received.')
            );
        }

        $config = \Drupal::config(
          'ongea_api.ongea_activity_signup_form.settings'
        );
        $em = \Drupal::entityTypeManager();

        $config = \Drupal::config(
          'ongea_api.ongea_profile.settings'
        );
        $configFields = $config->get('fields');
        if ($config == null || $configFields == null) {
            throw new ConfigException('config profile not found');
        }
        /** @var \Drupal\user\UserStorage $userStorage */
        $userStorage = $em->getStorage('user');
        $user = $userStorage->load($id);

        /** @var \Drupal\profile\ProfileStorage $profileStorage */
        $profileStorage = $em->getStorage('profile');
        $profile = $profileStorage->loadByUser($user, 'ongea_participant_profile');

        if (!$profile || $profile->bundle() != 'ongea_participant_profile') {
            throw new NotFoundHttpException('Profile not found.');
        }

        // denormalize

        // update


        return new ModifiedResourceResponse(
          $data, 201
        );
    }


}