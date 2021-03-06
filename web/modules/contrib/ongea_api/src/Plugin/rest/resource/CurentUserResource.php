<?php

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\ongea_api\Normalizer\OrganisationNodeEntityNormalizer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Drupal\rest\ModifiedResourceResponse;

/**
 *
 * @RestResource(
 *   id = "current_user_resource",
 *   label = @Translation("Current User Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/currentuser",
 *     "create" = "/api/v2/currentuser"
 *   }
 *
 * )
 */
class CurentUserResource extends EntityResourceBase
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
          'resource' => 'organisations',
          'content' => 'ongea_organisation',
        ];

        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get($types['content']),
          $container->get('current_user'),
          $types,
          new OrganisationNodeEntityNormalizer(\Drupal::entityManager()),
          $container->get('request_stack')->getCurrentRequest()

        );
    } 


    /**
     * @param $id
     *
     * @return ModifiedResourceResponse
     * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
     * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
     */
    public function get($id='')
    {
        $user = \Drupal::currentUser();

        $grp_membership_service = \Drupal::service('group.membership_loader');
        $grps = $grp_membership_service->loadByUser($user);
        foreach($grps as $grp) {
          $group = $grp->getGroup();
          $gid = $_SESSION['ongea']['selected_group'];
          if($group->id() == $gid) {
            $role = $group->getMember($user)->getRoles();
          }
        }

        $out = ['id' => $user->id(), 'username' => $user->getUsername(), 'role' => $role];
        return new ModifiedResourceResponse($out, 200);
    }

}