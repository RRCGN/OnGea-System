<?php

namespace Drupal\Tests\domain\Functional;

use Drupal\Tests\domain\Functional\DomainTestBase;

/**
 * Tests domain record HTTP response.
 *
 * @group domain
 */
class DomainGetResponseTest extends DomainTestBase {

  /**
   * Tests that a domain response is proper.
   */
  public function testDomainResponse() {
    // No domains should exist.
    $this->domainTableIsEmpty();

    // Create a new domain programmatically.
    $this->domainCreateTestDomains();

    // Check the created domain based on it's known id value.
    $key = 'example_com';
    /** @var \Drupal\domain\Entity\Domain $domain */
    $domain = \Drupal::service('entity_type.manager')->getStorage('domain')->load($key);

    // Our testing server should be able to access the test PNG file.
    $this->assertTrue($domain->getResponse() == 200, 'Server returned a 200 response.');

    // Now create a bad domain.
    $values = array(
      'hostname' => 'foo.bar',
      'id' => 'foo_bar',
      'name' => 'Foo',
    );
    $domain = \Drupal::service('entity_type.manager')->getStorage('domain')->create($values);

    $domain->save();
    $this->assertTrue($domain->getResponse() == 500, 'Server test returned a 500 response.');
  }

}
