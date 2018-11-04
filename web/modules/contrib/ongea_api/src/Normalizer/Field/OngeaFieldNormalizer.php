<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 03.08.18
 * Time: 23:31
 */

namespace Drupal\ongea_api\Normalizer\Field;


use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Field\FieldItemInterface;

class OngeaFieldNormalizer implements OngeaFieldNormalizerInterface
{

    protected $container;

    /**
     * @var \Psr\Log\LoggerInterface $logger
     */
    protected $logger;

    /**
     * @var EntityTypeManagerInterface $em ;
     */
    protected $em;

    public function __construct($em)
    {
        $this->container = \Drupal::getContainer();
        $this->em = $em;

        $this->logger = $this->container->get('logger.factory')
          ->get('ongea.ongea_api.'.get_class($this));

    }


    /**
     * @param $data
     */
    public function denormalize($data, $options = [])
    {

        return $data;
    }

    /**
     * @param FieldItemInterface $field
     *
     * @return array
     */
    public function normalize($field, $options = [])
    {
        return $field->getValue();
    }
}