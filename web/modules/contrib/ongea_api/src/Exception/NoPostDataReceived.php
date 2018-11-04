<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 29.08.18
 * Time: 22:56
 */

namespace Drupal\ongea_api\Exception;


use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class NoPostDataReceived extends BadRequestHttpException
{
    /**
     * extends constructor.
     *
     * @param string $message
     * @param \Exception|null $previous
     * @param int $code
     */
    public function __construct(
      $message = 'no data received',
      \Exception $previous = null,
      $code = 400
    ) {
        parent::__construct($message, $previous, $code);
    }
}