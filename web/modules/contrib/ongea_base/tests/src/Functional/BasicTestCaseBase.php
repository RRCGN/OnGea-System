<?php

namespace Drupal\Tests\ongea_base\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Test basic functionality of ongea_base
 *
 * @group ongea
 */
class BasicTestCaseBase extends BrowserTestBase {


    /**
     * Shadow t() system call.
     *
     * @param string $string
     *   A string containing the English text to translate.
     *
     * @return string
     */
    protected function t($string) {
        return $string;
    }

    /**
     * {@inheritdoc}
     */
    public static $modules = [
        'node',
        'views',
        'path',
        'taxonomy',
    ];

    /**
     * {@inheritdoc}
     */
    protected function setUp() {
        // Make sure to complete the normal setup steps first.
        parent::setUp();

        // Set the front page to "node".
        \Drupal::configFactory()
            ->getEditable('system.site')
            ->set('page.front', '/node')
            ->save(TRUE);
    }
}