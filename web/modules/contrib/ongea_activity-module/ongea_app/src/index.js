/*import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'*/


//import 'react-toastify/scss/main.scss';
import './styles/main.css';
import './styles/phoneNumberInput.css';
import { rootElem } from './config/config';
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
//import { syncHistoryWithStore } from 'react-router-redux'

import App from './components/App';


import configureStore from './store/configureStore';
//import {loadProjects} from './actions/projectActions';
import {I18nextProvider} from "react-i18next";
import i18n from "./translations/i18n";

import registerServiceWorker from './registerServiceWorker';

//const history = syncHistoryWithStore(hashHistory, store)

/*const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" preserveScrollTop={false} />
  </DockMonitor>
)*/

/*function withProps(Component, props) {
  return function(matchProps) {
    return <Component {...props} {...matchProps} />
  }
}*/


const store = configureStore();
//store.dispatch(loadProjects());

ReactDOM.render(
  <Provider store={store}>
  <I18nextProvider i18n={i18n}>
    <App></App>
  </I18nextProvider>
</Provider>, rootElem)
registerServiceWorker();