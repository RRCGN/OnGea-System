import api from '../libs/api';
import * as types from './actionTypes';  

export function loadProjects() {  
  return function(dispatch) {
    return api.getProjects().then(projects => {
      dispatch(loadProjectsSuccess(projects.body));
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadProjectsSuccess(projects) {  
    return {type: types.LOAD_PROJECTS_SUCCESS, projects};
  }




export function deleteProject(id) {  
  return function(dispatch) {
    return api.getProjects().then(projects => {
      dispatch(loadProjectsSuccess(projects.body));
    }).catch(error => {
      dispatch(deleteProjectFailure(error));
    });
  };
}

export function deleteProjectSuccess(projects) {  
  return {type: types.DELETE_PROJECT_SUCCESS, projects};
}
export function deleteProjectFailure(error) {  
    return {type: types.DELETE_PROJECT_FAILURE, error};
  }