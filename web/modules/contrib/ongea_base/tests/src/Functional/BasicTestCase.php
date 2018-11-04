<?php

namespace Drupal\Tests\ongea_base\Functional;



/**
 * Test basic functionality of ongea_base
 *
 * @group ongea_base
 */
class BasicTestCase extends BasicTestCaseBase {
    

    /**
     * {@inheritdoc}
     */
    public static $modules = [
        // Modules for core functionality.
        'node',
        'views',
        'path',
        'taxonomy',

        // This custom module.
        'ongea_base',
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

    /**
     * Make sure the site still works. For now just check the front page.
     *
     * @throws \Behat\Mink\Exception\ExpectationException
     */
    public function testTheSiteStillWorks() {
        // Load the front page.
        $this->drupalGet('<front>');

        // Confirm that the site didn't throw a server error or something else.
        $this->assertSession()->statusCodeEquals(200);

        // Confirm that the front page contains the standard text.
        $this->assertText($this->t('Welcome to Drupal'));
    }

}