import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ContentTypes } from '../../../config/content_types';
import {getParams} from '../../../libs/api';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import {SelectInput} from '../../elements/FormElements/FormElements';

 
  


export default class AssignEventsForm extends React.Component{

constructor(props) {
    super(props);

    this.state = {
        isLoading:true,
        activitySelectOptions: null,
        selectedActivity:null
          }

    this._isMounted = false;
}
 


 componentDidMount() {
     
    this._isMounted=true;
    this.getActivities();

  }
  

  componentWillUnmount() {
    this._isMounted=false;
   }
  
  getActivities=()=>{
  var api = ContentTypes.Activities.api;

    var data = [];


    const params = getParams('listView', ContentTypes.Activities, this.props);

    api.get(params)
      .then((result) => {
        if(this._isMounted){
        result
          .body
          .map((set) => {
            //console.log(set);
            data.push({
              value: set.id,
              label: (set.title)
            });

            return true;
          });

        this.setState({
          activitySelectOptions: data,
          isLoading:false
        });
      }

      })
      .catch((error) => {
        console.error(error);

      });
  }


handleChangeSelect = (e) => {

    this.setState({selectedActivity:e.target.value});
    

}


  render(){
    const {t,handleSubmit, isLoadingAction, setProgress} = this.props;
    const {activitySelectOptions, isLoading} = this.state;
    
    return( <div>

         <FormRowLayout infoLabel=''>
                              <SelectInput
                                id="activity"
                                type="text"
                                disabled={isLoadingAction || isLoading}
                                label={this.props.t("choose_activity")}
                                
                                value={this.state.selectedActivity}
                                onChange={this.handleChangeSelect}
                                onBlur={()=>{}}
                                
                                options={activitySelectOptions?activitySelectOptions:[]}
                              />
                              {(isLoadingAction || isLoading) && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
         </FormRowLayout>

        
        <div className='buttonWrapper'>
            <Button
                variant="contained"
                disabled={!this.state.selectedActivity || isLoadingAction}
                color="primary"
                onClick={()=>{
                    handleSubmit(this.state.selectedActivity, setProgress);
                }}
                >
                {t('clean_up_stays')}
              </Button>
              {isLoadingAction && <CircularProgress size={24} className='buttonProgress'/>}
        </div>
        
  
     </div> );

  }
}