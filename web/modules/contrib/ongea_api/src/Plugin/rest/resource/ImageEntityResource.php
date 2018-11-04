<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 12.06.18
 * Time: 21:36
 */

namespace Drupal\ongea_api\Plugin\rest\resource;


use Drupal\rest\Plugin\ResourceBase;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 *
 * @RestResource(
 *   id = "ongea_image_resource",
 *   label = @Translation("Ongea Image Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/image",
 *     "create" = "/api/v2/image"
 *   }
 *
 * )
 */
class ImageEntityResource extends ResourceBase
{

    public function post($data)
    {
        if ($data === null) {
            throw new BadRequestHttpException(t('No data received.'));
        }

        print_r($data);
        die();
    }
}