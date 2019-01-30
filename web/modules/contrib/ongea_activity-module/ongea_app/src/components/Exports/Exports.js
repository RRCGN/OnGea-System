import React from 'react';
import DetailView from '../_Views/DetailView';
import { ContentTypes } from '../../config/content_types';







export default class Exports extends React.Component {
  

  	

	  static defaultProps = {
	    contentType: ContentTypes.Exports
	  }



	  

	/*componentDidMount(){
		if(this.props.match.params.parentId){
	    	this.getActivity(this.props.match.params.parentId);
		}
	    
  	}

  	getActivity = (id) => {
  		const activityApi = ContentTypes.Activities.api;
	    activityApi.getSingle({id: id}).then((result) => {
	      this.setState({activity: result.body, isLoading:false});
	    })
	    .catch((error) => {
	      console.error(error);
	    });
  	}*/


  render() {
    return (
      <DetailView {...this.props} render={() => (
        <div/>
      )} />
  );
  }
}


