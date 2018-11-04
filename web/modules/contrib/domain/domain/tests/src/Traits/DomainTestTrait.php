<?php

namespace Drupal\Tests\domain\Traits;

use Drupal\domain\DomainInterface;

/**
 * Contains helper classes for tests to set up various configuration.
 */
trait DomainTestTrait {

  /**
   * Generates a list of domains for testing.
   *
   * In my environment, I use the example.com hostname as a base. Then I name
   * hostnames one.* two.* up to ten. Note that we always use *_example_com
   * for the machine_name (entity id) value, though the hostname can vary
   * based on the system. This naming allows us to load test schema files.
   *
   * The script may also add test1, test2, test3 up to any number to test a
   * large number of domains.
   *
   * @param int $count
   *   The number of domains to create.
   * @param string|NULL $base_hostname
   *   The root domain to use for domain creation (e.g. example.com).
   * @param array $list
   *   An optional list of subdomains to apply instead of the default set.
   */
  public function domainCreateTestDomains($count = 1, $base_hostname = NULL, $list = array()) {
    $original_domains = \Drupal::service('entity_type.manager')->getStorage('domain')->loadMultiple(NULL, TRUE);
    if (empty($base_hostname)) {
      $base_hostname = $this->base_hostname;
    }
    // Note: these domains are rigged to work on my test server.
    // For proper testing, yours should be set up similarly, but you can pass a
    // $list array to change the default.
    if (empty($list)) {
      $list = array('', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten');
    }
    for ($i = 0; $i < $count; $i++) {
      if ($i === 0) {
        $hostname = $base_hostname;
        $machine_name = 'example.com';
        $name = 'Example';
      }
      elseif (!empty($list[$i])) {
        $hostname = $list[$i] . '.' . $base_hostname;
        $machine_name = $list[$i] . '.example.com';
        $name = 'Test ' . ucfirst($list[$i]);
      }
      // These domains are not setup and are just for UX testing.
      else {
        $hostname = 'test' . $i . '.' . $base_hostname;
        $machine_name = 'test' . $i . '.example.com';
        $name = 'Test ' . $i;
      }
      // Create a new domain programmatically.
      $values = array(
        'hostname' => $hostname,
        'name' => $name,
        'id' => \Drupal::service('entity_type.manager')->getStorage('domain')->createMachineName($machine_name),
      );
      $domain = \Drupal::entityTypeManager()->getStorage('domain')->create($values);
      $domain->save();
    }
    $domains = \Drupal::service('entity_type.manager')->getStorage('domain')->loadMultiple(NULL, TRUE);
  }

  /**
   * Adds a test domain to an entity.
   *
   * @param string $entity_type
   *   The entity type being acted upon.
   * @param int $entity_id
   *   The entity id.
   * @param array $ids
   *   An array of ids to add.
   * @param string $field
   *   The name of the domain field used to attach to the entity.
   */
  public function addDomainsToEntity($entity_type, $entity_id, $ids, $field) {
    if ($entity = \Drupal::entityTypeManager()->getStorage($entity_type)->load($entity_id)) {
      $entity->set($field, $ids);
      $entity->save();
    }
  }

  /**
   * Returns an uncached list of all domains.
   *
   * @return array
   *   An array of domain entities.
   */
  public function getDomains() {
    \Drupal::service('entity_type.manager')->getStorage('domain')->resetCache();
    return \Drupal::service('entity_type.manager')->getStorage('domain')->loadMultiple();
  }

  /**
   * Returns an uncached list of all domains, sorted by weight.
   *
   * @return array
   *   An array of domain entities.
   */
  public function getDomainsSorted() {
    \Drupal::service('entity_type.manager')->getStorage('domain')->resetCache();
    return \Drupal::service('entity_type.manager')->getStorage('domain')->loadMultipleSorted();
  }

  /**
   * Converts a domain hostname to a trusted host pattern.
   *
   * @param $hostname
   *   A hostname string.
   *
   * @return
   *   A regex-safe hostname, without delimiters.
   */
  public function prepareTrustedHostname($hostname) {
    $hostname = strtolower(preg_replace('/:\d+$/', '', trim($hostname)));
    return preg_quote($hostname);
  }

  /**
   * Set the base hostname for this test.
   */
  public function setBaseHostname() {
    $this->base_hostname = \Drupal::service('entity_type.manager')->getStorage('domain')->createHostname();
  }

  /**
   * Reusable test function for checking initial / empty table status.
   */
  public function domainTableIsEmpty() {
    $domains = \Drupal::service('entity_type.manager')->getStorage('domain')->loadMultiple(NULL, TRUE);
    $this->assertTrue(empty($domains), 'No domains have been created.');
    $default_id = \Drupal::service('entity_type.manager')->getStorage('domain')->loadDefaultId();
    $this->assertTrue(empty($default_id), 'No default domain has been set.');
  }

  /**
   * Creates domain record for use with POST request tests.
   */
  public function domainPostValues() {
    $edit = array();
    $domain = \Drupal::service('entity_type.manager')->getStorage('domain')->create();
    $required = \Drupal::service('domain.validator')->getRequiredFields();
    foreach ($required as $key) {
      $edit[$key] = $domain->get($key);
    }
    // URL validation has issues on Travis, so only do it when requested.
    $edit['validate_url'] = 0;
    $edit['id'] = \Drupal::service('entity_type.manager')->getStorage('domain')->createMachineName($edit['hostname']);
    return $edit;
  }

}
