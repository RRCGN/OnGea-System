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
import { Prompt } from "react-router-dom";
import {getCurrentUser} from '../libs/api';


//import { PageContext, pageConfig } from '../contexts/page-context';

const theme = createMuiTheme(MUI_THEME_STYLE);


class App extends React.Component {
  /*componentDidMount() {
    console.log('APP DID MOUNT', this.props);
  }*/
  
  
  constructor(props) {
        super(props);
    
        this.state = {
          user:null,
          dirty:{
            mainForms:false,
            referenceForms:false,
            referenceInReferenceForms:false
          }
          
          
        };
        
      }


      setDirtyFormState=(newDirty)=> {

        var {dirty} = this.state;
        
        if(newDirty.mainForms !== undefined){
          dirty.mainForms = newDirty.mainForms;
        }
        if(newDirty.referenceForms !== undefined){
          dirty.referenceForms = newDirty.referenceForms;
        }
        if(newDirty.referenceInReferenceForms !== undefined){
          dirty.referenceInReferenceForms = newDirty.referenceInReferenceForms;
        }

        //console.log('dirty.mainForms',dirty.mainForms);
        //console.log('dirty.referenceForms',dirty.referenceForms);
        //console.log('dirty.referenceInReferenceForms',dirty.referenceInReferenceForms);

        this.setState({dirty});

        
      }


  componentDidMount() {
      getCurrentUser().then((user)=>{
                      
                      this.setState({user});
                      
                      

                  });
  }  
  
  

  render() {
    const {t, i18n} = this.props;
    const {user} = this.state;
  
    i18n.on('languageChanged', function(lng) {
      
      Moment.globalLocale = lng;
    });
    
    return (
      <MuiThemeProvider theme={theme}>
      {/*<input type="text" onChange={this.handleChange} />*/}
        {user ? <div className="ongeaAct">
                  <div>
                    <div className="ongeaAct__menu-holder">
                    <StickyContainer>
          <Sticky>{({ style }) => <div style={style}>
                  <Router>
                    <div>
                        <MainMenu user={user} t={t}></MainMenu>
                        <Prompt
                               when={this.state.dirty.mainForms}
                               message={location =>
                                 this.props.t('warning_leave_without_saving')
                               }
                            /> 
                    </div>
                  </Router>
          </div>}</Sticky>
        </StickyContainer>
                     
                    </div>
                    <div className="ongeaAct__content-holder">
                      <LanguageSwitcher></LanguageSwitcher>
                      {/* children*/}
                     
                      <SnackbarProvider SnackbarProps={{ autoHideDuration: 4000 }}>
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
                              <r.component user={user} setDirtyFormState={this.setDirtyFormState} formIsDirty={this.state.dirty} {...props} />
                          </div>
                      )}/>
                            )}
                           
                           <Prompt
                               when={this.state.dirty.mainForms}
                               message={location =>
                                 this.props.t('warning_leave_without_saving')
                               }
                            /> 
                          </OngeaActContent>
        
                        </Router>
                      </SnackbarProvider>
                     
                    </div>
                  </div>
        
                 
                </div> : 'Please wait, while the app is loading.'}

        


      </MuiThemeProvider>
    )
  }
}
// extended main view with translate hoc
export default translate("translations")(App);