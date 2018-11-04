import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function projectsReducer(state = initialState.projects, action) {  
  switch(action.type) {
    case types.LOAD_PROJECTS_SUCCESS:
      return action.projects
    default: 
      return state;
  }
}