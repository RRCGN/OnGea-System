import {combineReducers} from 'redux';
import projectsReducer from './projectsReducer';
//import {routerReducer} from 'react-router-redux'
import {reducer as beesReducer} from 'redux-bees';
//import {update as count} from './count';
//import * as reducers from '.../reducers' 


const rootReducer = combineReducers({
  projects: projectsReducer,
  //routing: routerReducer,
  bees: beesReducer
})

export default rootReducer;