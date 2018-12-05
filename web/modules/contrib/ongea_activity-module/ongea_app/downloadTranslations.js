
/*
1.) Follow instructions on 
https://github.com/bassarisse/google-spreadsheet-to-json#about-authentication 
and for detailed info
https://github.com/theoephraim/node-google-spreadsheet
to authenticate to Google Drive api

2.) Grant access for each sheet for the user in drive. User example:
 ongea-api-worker@ongea-drive-api.iam.gserviceaccount.com

3.) To run the script and download Translations from Google Drive Sheets
 run:$ node downloadTranslations
*/

// file system module to perform file operations
const fs = require('fs');
var gsjson = require('google-spreadsheet-to-json');
var _ = require('lodash');
var colors = require('colors/safe');

const serviceAccountAuth = './Ongea-Drive-Api-de624c1e28f6.json';

var languages = [
  {
    langCode: 'en',
    sheetSchema: '13yCrwZJeL0TiOadyEilO1bEifQJ22oWr1glwsnlCy-k'
  }, {
    langCode: 'de',
    sheetSchema: '1Ymhh-kwMCPj9LjJ-6Obc2QTMRwtOVr1GGywoFQvb9mw'
  }, {
    langCode: 'it',
    sheetSchema: '1aQiV8IzB24-7CG-5hDf5xNkXCdu3M39KiA5SNuMywNY'
  }, {
    langCode: 'es',
    sheetSchema: '1ZX3d_EgnTEEX0ixrdwrjxSYn2HIUCIgWsjJlelSsyN8'
  },
  {
    langCode: 'lt',
    sheetSchema: '17TYEJFYav37bWLRgMXMLGMap-1tIABt6FwvXdFG5bas'
  },
   {
    langCode: 'nl',
    sheetSchema: '1Nr3j1Lj2nqfWj_ll4GbZh4rAzi0zhbZUBeqzeuuEaOI'
  },
   {
    langCode: 'ro',
    sheetSchema: '1nnJnzkalz3Wo27kawIt9UskskSzpwn-GdmHZLjOCplU'
  },
   {
    langCode: 'hu',
    sheetSchema: '1iT6MUUZLw1I0D7nYR0-SiuveelC2ghx75uDwGJDaRTs'
  }
  , {
    langCode: 'fr',
    sheetSchema: '1M2VoLanudsZyLhKq325Y7xrkoFmccOXZjsTdBMtKa7Q'
  }
  , {
    langCode: 'el',
    sheetSchema: '1c-jOFIIsNijwqAQtl66i1NPCaeBdvowxOIJTXgLjt5A'
  }, {
    langCode: 'ca',
    sheetSchema: '1aj0iNBZXhok-XQcnhRLnVLKbNl_NUZqoPUyMNnNEacA'
  }
];

var schemaGlobalTranslations = '1W9vTtlfm66k4x5IPLbUFauO3Uga0EKEE1_kuTiV_PGQ';




gsjson({spreadsheetId: schemaGlobalTranslations, credentials: require(serviceAccountAuth)}).then(function (schemaGlobal) {
  let cleanObj = {};
  _.forEach(schemaGlobal, function (item) {
    cleanObj[''+item.key.trim()] = ''+item.text.trim();
});
  
_.forEach(languages, function (language) {
  let countItemsSheet = 0;
  let countEmptyRowSheet = 0;
  let dir = "./public/locales/" + language.langCode + "/";
  if (!fs.existsSync(dir)){
    console.log("Create Folder "+dir+" for translation " + language.langCode);
    fs.mkdirSync(dir);
}

    
    
    console.log("Getting Schema Translations for " + language.langCode);

    const worksheets = ['User Interface Texts', 'Data fields','Lists', 'Countries', 'Languages'];
    gsjson({spreadsheetId: language.sheetSchema,worksheet: worksheets, credentials: require(serviceAccountAuth)}).then(function (schema) {
        console.log("Spreadsheet for "+language.langCode+" has "+schema.length+" worksheets");
        
        for(let i=0;i<schema.length;i++){
          console.log("Worksheet '"+worksheets[i]+"' for "+language.langCode+" has "+schema[i].length+" items");
          countItemsSheet += schema[i].length;
      _.forEach(schema[i], function (item) {
        let key='key';
        
        let value='yourTranslation'
        let description='';
         switch(i){
           case 1: {
             key='englishFieldLabelText';
             value='fieldLabelText–YourTranslation';
             description='fieldDescriptionText–YourTranslation';
            break;
           }
           case 2: {
            key='englishText';
            break;
          }
          case 3: {
            key='isoCode';
            break;
          }
          case 4: {
            key='isoCode';
            break;
          }
         }
         if((item[key] === undefined))countEmptyRowSheet++;
         cleanObj[(item[key] !== undefined)? item[key]
         .trim()
       : 'NO---KEY'] = (item[value] !== undefined && item[value].length > 0)
     ? item[value]
       .trim()
     : "NO--TRANSLATION";

        
        if(description.length>0 && item[key] !== undefined && item[description] !== undefined ){
            cleanObj[item[key].trim()+"__description"] = item[description].trim();
            }


        });
      }


    console.log(colors.red(Object.keys(cleanObj).length+" translations of "+ countItemsSheet +" will be saved for " + language.langCode));

    

        //let jsonContent = JSON.stringify(cleanObj).split("{{").join("{").split("}}").join("}");

         let jsonContent = JSON.stringify(cleanObj);


    fs.writeFile(dir+"translations.json", jsonContent, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log(colors.green("Translation file has been saved for " + language.langCode));
    });

    })
      .catch(function (err) {
        console.log(err.message);
        console.log(err.stack);
      });
});

  
});
