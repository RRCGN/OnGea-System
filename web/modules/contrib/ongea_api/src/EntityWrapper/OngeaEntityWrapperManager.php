<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 02.08.18
 * Time: 17:50
 */

namespace Drupal\ongea_api\EntityWrapper;


use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Config\ConfigException;
use Drupal\Core\Entity\EntityInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class OngeaEntityWrapperManager
{

    /**
     * @var \Drupal\node\NodeStorage
     */
    protected $nodeManager;

    public function __construct($em = null)
    {
        if ($em == null) {
            $em = \Drupal::entityTypeManager();
        }
        try {
            $this->nodeManager = $em->getStorage('node');
        } catch (InvalidPluginDefinitionException $e) {
            \Drupal::logger('ongea_api')->error($e->getMessage());
        } catch (PluginNotFoundException $e) {
            \Drupal::logger('ongea_api')->error($e->getMessage());

        }
    }


    /**
     * @param $entity
     *
     * @return OngeaEntityWrapperInterface
     */
    public function start($entity)
    {
        return $this->startFromEntity($entity);
    }

    /**
     * @param EntityInterface $entity
     *
     * @return OngeaEntityWrapperInterface|null
     */
    protected function startFromEntity($entity)
    {

        $bundleName = $entity->bundle();

        $wrapper = $this->createWrapper($bundleName, $entity);
        if ($wrapper == null) {
            throw new ConfigException(t("Wrapper @bundleName couldn't be found.", ['@bundleName' => $bundleName]));

        }

        return $wrapper;
    }

    protected function createWrapper($contentType, $entity)
    {
        $wrapper = null;
        switch ($contentType) {
            case 'ongea_announcement':
                $wrapper = new AnnouncementEntityWrapper($entity);
                break;
            case 'ongea_activity':
                $wrapper = new ActivityEntityWrapper($entity);
                break;
            case 'ongea_channel':
                $wrapper = new ChannelEntityWrapper($entity);
                break;
            case 'ongea_activity_signup_form':
                $wrapper = new ActivityFormEntityWrapper($entity);
                break;
            case 'ongea_activity_organisation':
                $wrapper = new ActivityOrganisationEntityWrapper($entity);
                break;
            case 'ongea_event_days':
                $wrapper = new EventDaysEntityWrapper($entity);
                break;
            case 'ongea_event':
                $wrapper = new EventEntityWrapper($entity);
                break;
            case 'ongea_mobility':
                $wrapper = new MobilityEntityWrapper($entity);
                break;
            case 'ongea_organisation':
                $wrapper = new OrganisationEntityWrapper($entity);
                break;
            case 'ongea_participant':
                $wrapper = new ParticipantEntityWrapper($entity);
                break;
            case 'ongea_place':
                $wrapper = new PlaceEntityWrapper($entity);
                break;
            case 'ongea_project':
                $wrapper = new ProjectEntityWrapper($entity);
                break;
            case 'ongea_stay':
                $wrapper = new StayEntityWrapper($entity);
                break;
            case 'ongea_travel':
                $wrapper = new TravelEntityWrapper($entity);
                break;
        }

        return $wrapper;
    }

    /**
     * @param $type
     * @param array $attributes
     *
     * @return OngeaEntityWrapperInterface
     */
    public function create($type, $attributes = [])
    {

        $entity = $this->nodeManager->create(
          array_merge($attributes, ['type' => $type])
        );

        $wrapper = $this->startFromEntity($entity);
        $wrapper->preCreate($attributes);

        $wrapper->validate();
        $wrapper->postCreate();
        return $wrapper;

    }

    public function getDefaults($contentType)
    {

    }

    public function load($id, $contentType = null)
    {

        $entity = $this->nodeManager->load($id);
        if (!$entity) {
            throw new NotFoundHttpException(
              t('Wrapper Loader: No entity found', ['@id' => $id])
            );
        }
        if ($contentType != null && $contentType != $entity->bundle()) {
            throw new BadRequestHttpException(
              t('No @contentType with this id could be found.', ['@contentType' => $contentType])
            );
        }

        return $this->startFromEntity($entity);
    }
}