import { createStore, applyMiddleware,compose } from 'redux'
import rootReducer from '../reducers/rootReducer'; 
import thunk from 'redux-thunk';
import {middleware as beesMiddleware} from 'redux-bees';

export default function configureStore() {  

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunk,beesMiddleware())
  ));
  return store;
  /*createStore(
    rootReducer,
    applyMiddleware(thunk),
    applyMiddleware(beesMiddleware()),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );*/
}