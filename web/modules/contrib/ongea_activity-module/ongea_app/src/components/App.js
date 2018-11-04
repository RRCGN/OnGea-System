import React from 'react'
import OngeaActContent from './OngeaActContent'
import {HashRouter as Router, Route} from "react-router-dom";
import {MUI_THEME_STYLE} from '../config/theme'
import MainMenu from './Menu/MainMenu'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import { translate } from "react-i18next";
import LanguageSwitcher from './elements/LanguageSwitcher';
//import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
import {routes} from '../config/routes';
import { SnackbarProvider } from './elements/SnackbarProvider'
import { StickyContainer, Sticky } from 'react-sticky';


//import { PageContext, pageConfig } from '../contexts/page-context';

const theme = createMuiTheme(MUI_THEME_STYLE);


class App extends React.Component {
  /*componentDidMount() {
    console.log('APP DID MOUNT', this.props);
  }*/
  
  



  

  render() {
    const {t, i18n} = this.props;
  
    i18n.on('languageChanged', function(lng) {
      Moment.globalLocale = lng;
    });
    
    return (
      <MuiThemeProvider theme={theme}>
      {/*<input type="text" onChange={this.handleChange} />*/}
        <div className="ongeaAct">
          <div>
            <div className="ongeaAct__menu-holder">
            <StickyContainer>
  <Sticky>{({ style }) => <div style={style}>
  <Router>
                <MainMenu t={t}></MainMenu>
              </Router>
  </div>}</Sticky>
</StickyContainer>
             
            </div>
            <div className="ongeaAct__content-holder">
              <LanguageSwitcher></LanguageSwitcher>
              {/* children*/}
             
              <SnackbarProvider SnackbarProps={{ autoHideDuration: 2000 }}>
                <Router>
                  <OngeaActContent>
                  {routes
                    .mainMenu
                    .map((r, i) => 
                    <Route
                    key={'route-' + i} 
                    exact={r.exact} 
                    path={r.path}
                render={(props) => (
                  <div>
                <r.component {...props} /></div>
              )}/>
                    )}
                  </OngeaActContent>
                </Router>
              </SnackbarProvider>
             
            </div>
          </div>

          <div></div>
        </div>

        


      </MuiThemeProvider>
    )
  }
}
// extended main view with translate hoc
export default translate("translations")(App);