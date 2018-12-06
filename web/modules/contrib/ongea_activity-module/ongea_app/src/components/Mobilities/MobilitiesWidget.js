import React from 'react';
import { ContentTypes } from '../../config/content_types';
import {translate} from "react-i18next";
import FormRowLayout from '../elements/FormElements/FormRowLayout';
import {SelectInput, SwitchInput} from '../elements/FormElements/FormElements';
import CircularProgress from '@material-ui/core/CircularProgress';
import Panel from '../elements/Panel';
import Paper from '@material-ui/core/Paper';
import MobilitiesDataTable from './elements/MobilitiesDataTable';
import LoadingIndicator from '../elements/LoadingIndicator';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import {getParams} from '../../libs/api';

class MobilitiesWidget extends React.Component {
 

  constructor(props) {
    super(props);
    this.state = {
          selectedActivity:null,
          mobilities:[],
          filteredMobilities:null,
          activitySelectOptions: null,
          isLoading:true,
          isUpdating:false,
          isFiltered:false,
          filter:3
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

  getActivity = (activityId) => {
    this.setState({isUpdating:true});
      var api = ContentTypes.Activities.api;

    //const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
   // var params = {_format:'json', lan:language};
    

    const params = getParams('getSingleForForms', ContentTypes.Activities, this.props);

    api.getSingle({id:activityId,...params})
      .then((result) => {
        if(this._isMounted){
        
        const data = this.getOnlyApplicants(result.body.mobilities);

        this.setState({mobilities: data, isUpdating:false, isLoading:false});
      }

      })
      .catch((error) => {
        console.error(error);

      });

  }

setFilter = (event) => {
  var pastDays = this.state.filter * 24 * 3600 * 1000;

  if(event.target.type === 'checkbox'){
    if(event.target.checked === false){
      this.setState({filteredMobilities:null});
      return true;
    }
  }else{
    pastDays = event.target.value * 24 * 3600 * 1000;

  }

  const {mobilities} = this.state;
  var filteredMobilities = [];
  
  filteredMobilities = mobilities.filter((it)=>{
    const now = moment().unix()*1000;
   
      
      return it.created*1000 >= now-pastDays;
     
  });
  
  
  this.setState({filteredMobilities});
}

getOnlyApplicants = (data) => {
  
  data = data.filter((it)=>(it.participantStatus === 'applicant'));
  return data;
}

  
getActivities=()=>{
  var api = ContentTypes.Activities.api;

    //const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
    //var params = {_format:'json', scope:'small', lan:language};
    



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

removeRoleSelect = (columns) => {
  
  var roleColumn = columns.find((it)=>(it.name === 'participantRole'));

  if(roleColumn){
    delete roleColumn.reference;
    delete roleColumn.referenceType;
  }

  return columns;
}



handleChangeSelect = (e) => {

    this.setState({selectedActivity:e.target.value});
    this.getActivity(e.target.value);

}
  

  render() {

    
    const {t} = this.props;
    const {activitySelectOptions, mobilities,filteredMobilities, selectedActivity, isLoading, isUpdating} = this.state;
    
    var {columns} = ContentTypes.Mobilities;
    const readOnly = false;


  columns = this.removeRoleSelect(columns);

    return (
      <div>
      <h3>Mobilities</h3>
      <Paper>
      
          <Panel>
                      <FormRowLayout infoLabel=''>
                              <SelectInput
                                id="activity"
                                type="text"
                                disabled={isLoading}
                                label={this.props.t("Choose activity")}
                                
                                value={this.state.selectedActivity}
                                onChange={this.handleChangeSelect}
                                onBlur={()=>{}}
                                
                                options={activitySelectOptions?activitySelectOptions:[]}
                              />
                              {isLoading && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                       </FormRowLayout>
                       {this.state.selectedActivity && <FormRowLayout>
                         <Grid container spacing={0} alignItems='baseline'>
                            <Grid item xs={12} sm={7}>
                             <SwitchInput
                               id="isFiltered"
                               disabled={!this.state.selectedActivity || isUpdating}
                               label={"Only show mobilities created in the past"}
                               value={this.state.isFiltered}
                               onChange={(e)=>{
                                
                                this.setFilter(e);
                                this.setState({isFiltered:e.target.checked});
                              }}
                               onBlur={()=>{}}
                             />
                           </Grid>
                           <Grid item xs={12} sm={3}>
                             <SelectInput
                                 id="activity"
                                 type="text"
                                 disabled={!this.state.isFiltered || isUpdating}
                                 label={''}
                                 value={this.state.filter}
                                 onChange={(e)=>{
                                  this.setFilter(e);
                                  this.setState({filter:e.target.value});
                                  }}
                                 onBlur={()=>{}}
                                 
                                 options={[{value:1,label:'1 day'},{value:3,label:'3 days'},{value:7,label:'7 days'}]}
                               />
                             </Grid>
                             </Grid>
                         </FormRowLayout>}
                     </Panel>
                     </Paper>
                     <Paper>
                     <Panel>
                 {!isLoading && !isUpdating
                    ? 
                  
                    
                    
                      
                        <MobilitiesDataTable 
                          columns={columns}
                          t={t}
                          isDeletable={false}
                          isUpdating = {isUpdating}
                          readOnly={readOnly}
                          data={filteredMobilities || mobilities}
                          activityId={selectedActivity}
                          getData={()=>this.getActivities(selectedActivity)}
                        />
          
                       
                  
                   
                   : (
                     <LoadingIndicator></LoadingIndicator>
                   )
                }
                </Panel>
                 </Paper>
                 </div>
  );
  }
}

export default translate('translations')(MobilitiesWidget);


