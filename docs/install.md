# OnGea
## Installation

### Download

#### CLI

cd /path/to/working_dir  
git clone git@gitlab.com:OnGea/ongea.git  
cd ongea  
composer update  

#### Manual
- Ongea zip herunteladen und entpacken
- Auf den Server hochladen
- Webserver auf ongea/web routen
- Im Browser die Domain aufrufen
- Die Sprache auswählen
- Die Datenbank Zugangsdaten eingeben
- einen Kaffee trinken
- Die Seitendaten eingeben
- /activities aufrufen


### Webserver

set ongea/web as web root

### Drupal
go to the website 
select a language 
resolve problems
install


### Troubleshooting
An AJAX HTTP error occurred.
HTTP Result Code: 500
Debugging information follows.
Path: /core/install.php?rewrite=ok&profile=ongea&langcode=en&continue=1&id=1&op=do_nojs&op=do
StatusText: Internal Server Error
ResponseText: 

__

see php_error.log

- PHP Fatal error:  Maximum execution time of 30 seconds exceeded  
change php max_execution_time to +100