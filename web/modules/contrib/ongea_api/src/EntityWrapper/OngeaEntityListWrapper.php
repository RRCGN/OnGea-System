<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 09.08.18
 * Time: 18:23
 */

namespace Drupal\ongea_api\EntityWrapper;


class OngeaEntityListWrapper
{

    protected $entities;

    protected $wrapperManager;


    /**
     * OngeaEntityListWrapper constructor.
     *
     * @param \Drupal\Core\Field\EntityReferenceFieldItemListInterface $list
     */
    public function __construct($list)
    {
        $this->wrapperManager = new OngeaEntityWrapperManager(
          \Drupal::entityTypeManager()
        );
        $entities = [];
        /** @var \Drupal\Core\Entity\EntityInterface $item */
        foreach ($list->referencedEntities() as $item) {
            $entities[] = $this->wrapperManager->start($item);
        }
        $this->entities = $entities;
    }

    /**
     * @return \Drupal\ongea_api\EntityWrapper\OngeaEntityWrapperInterface
     */
    public function first()
    {
        return $this->entities[0];
    }

    /**
     * @return \Drupal\ongea_api\EntityWrapper\OngeaEntityWrapperInterface[]
     */
    public function getEntities()
    {
        return $this->entities;
    }


}