# Ongea 
## Distribution

## Requirements
You need a working web server as it is provided in XAMPP , including:
– Apache HTTP Server
– MySQL/ MariaDB Database
– PHP (version 7.1.10 or above)

OnGea needs quite a lot of resources. Make sure your web server is configured as follows:
– at least 2,5 gigabytes of free disk space
– PHP Version 7.1.10 or above, with
– image library
– OpenSSL
– JSON
– cURL
– mbstring
– OPcache
– PHP FastCGI 

The following settings need to be made in the file php.ini:
– max_execution_time = 100
– memory_limit = 128
– post_max_size = 64m
– upload_max_filesize = 64m


## Installation
Download the repository via Git Checkout with SSH. Use the following syntax:
– cd /path/to/working_dir
– git clone https://github.com/RRCGN/OnGea-System ongea
– cd ongea/

You will find a database in a compressed file called “ongea.sql.gz”. You have to import it into your MySQL or MariaDB database server. It is easiest to do this via phpMyAdmin. Select your database, look for the import button, pick the compressed database and import it with UTF-8 collation and SQL syntax format.
Put the database credentials into the following file:
ongea/web/sites/default/settings.php

You will need to write the domain were you will host this installation into the file “.env.production”, that you should find here: 
ongea/web/modules/contrib/ongea_activity-module/ongea_app/.env.production
Adjust the line containing “REACT_APP_BASEPATH” to:
REACT_APP_BASEPATH=https://your.domain.com/
(where of course “https://your.domain.com/” should be replaced with your actual domain name).


## Go Live
Mount the webroot of your domain to the following directory and you are ready to go:
ongea/web


## More Information
For more information, go to https://ongea.eu - there you can also download the OnGea manual.
