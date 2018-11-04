<?php

namespace Drupal\Tests\ongea_organisation\Functional;

use Drupal\Tests\BrowserTestBase;
use Drupal\Tests\ongea_base\Functional\BasicTestCaseBase;

/**
 * Test basic functionality of ongea_organisation
 *
 * @group ongea
 */
class BasicTestCase extends BasicTestCaseBase {



    /**
     * {@inheritdoc}
     */
    public static $modules = [
        'ongea_base',


        // Modules for core functionality.
        'link',
        'datetime',
        'options',
        'content_translation',
        'menu_ui',
        'auto_entitylabel',



        // This custom module.
        'ongea_organisation',
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
     */
    public function testTheSiteStillWorks() {
        // Load the front page.
        $this->drupalGet('<front>');

        // Confirm that the site didn't throw a server error or something else.
        $this->assertSession()->statusCodeEquals(200);

        // Confirm that the front page contains the standard text.
        //$this->assertText($this->t('Welcome to Drupal'));
    }

}