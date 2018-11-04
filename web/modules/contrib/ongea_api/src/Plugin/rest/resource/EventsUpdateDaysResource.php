<?php
/**
 * Created by PhpStorm.
 * User: unewochialat
 * Date: 17.06.18
 * Time: 20:13
 */

namespace Drupal\ongea_api\Plugin\rest\resource;

use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;

/**
 *
 * @RestResource(
 *   id = "events_update_entity_resource",
 *   label = @Translation("Ongea Event Update Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v2/events/updateDays",
 *     "create" = "/api/v2/events/updateDays"
 *   }
 *
 * )
 */
class EventsUpdateDaysResource extends ResourceBase
{

    public function post($data)
    {

        // update events

        return new ModifiedResourceResponse($data, 200);
    }
}