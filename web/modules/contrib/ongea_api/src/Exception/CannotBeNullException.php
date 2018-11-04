<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 29.08.18
 * Time: 21:57
 */
namespace Drupal\ongea_api\Exception;

use Drupal\Core\Entity\EntityStorageException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CannotBeNullException extends BadRequestHttpException
{

    /**
     * CannotBeNullException constructor.
     *
     * @param EntityStorageException $message
     * @param \Exception|null $previous
     * @param int $code
     */
    public function __construct(
      $message = null,
      \Exception $previous = null,
      $code = 0
    ) {
        $message = $message->getMessage();
        parent::__construct($message, $previous, $code);
    }


}