import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { translate } from "react-i18next";
import { config } from '../../config/config';

class LanguageSwitcher extends React.Component {
 
    state = {
       
        language: (this.props.i18n.language!==undefined)?this.props.i18n.language.substring(0,2):'en'
      };
      
      changeLanguage = event => {
        this.props.i18n.changeLanguage(event.target.value);
        this.setState({ [event.target.name]: event.target.value });
      };

    render() {
      const {t} = this.props;
        return (
            <div className="ongeaAct__languageSwitcher">
           {config.languages.length>0 && 
            <FormControl>
          <InputLabel htmlFor="language-switch">{t("language")}</InputLabel>
          <Select
            value={this.state.language}
            onChange={this.changeLanguage}
            inputProps={{
              name: 'language',
              id: 'language-switch',
            }}
          >
            {config.languages
              .map((language) => <MenuItem key={language} value={language}>{t('lang-'+language)}</MenuItem>)}
          </Select>
        </FormControl>
           }
          </div>
        );
    }
}
export default translate("translations")(LanguageSwitcher);