#!/bin/bash

php vendor/bin/phpunit -c web/phpunit.xml.dist web/modules/contrib/ongea_base/tests/src/Functional/BasicTestCase.php --debug
php vendor/bin/phpunit -c web/phpunit.xml.dist web/modules/contrib/ongea_organisation/tests/src/Functional/BasicTestCase.php --debug
php vendor/bin/phpunit -c web/phpunit.xml.dist web/modules/contrib/ongea_activity/tests/src/Functional/BasicTestCase.php --debug
php vendor/bin/phpunit -c web/phpunit.xml.dist web/modules/contrib/ongea_api/tests/src/Functional/BasicTestCase.php --debug
#php vendor/bin/phpunit -c web/phpunit.xml.dist web/modules/contrib/ongea_activity_api/tests/src/Functional/BasicTestCase.php

