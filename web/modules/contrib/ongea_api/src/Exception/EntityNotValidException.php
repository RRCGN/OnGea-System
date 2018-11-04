<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 29.08.18
 * Time: 23:26
 */

namespace Drupal\ongea_api\Exception;


use Drupal\Core\Entity\EntityStorageException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class EntityNotValidException extends BadRequestHttpException
{
    /**
     * CannotBeNullException constructor.
     *
     * @param \Exception|null $previous
     * @param int $code
     */
    public function __construct(
      $message = null,
      \Exception $previous = null,
      $code = 0
    ) {
        parent::__construct($message, $previous, $code);
    }
}