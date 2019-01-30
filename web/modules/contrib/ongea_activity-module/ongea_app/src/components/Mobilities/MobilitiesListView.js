import React from 'react';
import { ContentTypes,extendReferenceContentType } from '../../config/content_types';
import {translate} from "react-i18next";
import Panel from '../elements/Panel';
import LoadingIndicator from '../elements/LoadingIndicator';
import Grid  from '@material-ui/core/Grid';
import { ReferenceSelect } from '../elements/FormElements/FormElements';
import MobilitiesDataTable from './elements/MobilitiesDataTable';
import Button  from '@material-ui/core/Button';
import {getParams} from '../../libs/api';

import { withSnackbar } from '../elements/SnackbarProvider'

class MobilitiesListView extends React.Component {
 
 



  static defaultProps = {
    contentType: ContentTypes.Mobilities,
    referenceContentType: extendReferenceContentType(ContentTypes.Profiles,ContentTypes.MobilitiesParticipant)//extendReferenceContentType(ContentTypes.Organisations,ContentTypes.ActivityOrganisations)
  
  }
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      activityData: null,
      referenceData: [],
      referencesToAdd: [],
      isLoading: true,
      referenceIsLoading: true,
      isUpdating: false,
      errorMessage:'',
      readOnly:false
     };
     this._isMounted=false;
  }

  getData(){
    
    let contentType = this.props.contentType;
    
    if(contentType.id){
    
    
    


    var requestParams = getParams('getSingleForForms', contentType, this.props);
    
    if(this.props.match && this.props.match.params.parentId) 
      requestParams = {id: this.props.match.params.parentId, ...requestParams};

    ContentTypes.Activities.api.getSingle(requestParams)
      .then((result) => {
        if(this._isMounted){
          const sub = result.body.title;
          this.props.changeSub(sub);
          var readOnly = false;//(typeof result.body.manage === "undefined" || result.body.manage === true) ? false : true;
         
          if(readOnly === true){
            this.props.setContentViewReadOnly(true);
          }
          this.setState({activityData:result.body,readOnly,data:result.body.mobilities.filter(it=>it!==null),isLoading:false,isUpdating:false});
        }
      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoading:false,isUpdating:false});}
      });
    } 

    let referenceContentType = this.props.referenceContentType;

    const params = getParams('listView', referenceContentType, this.props);
    

    referenceContentType.api.get(params)
      .then((result) => {
        if(this._isMounted){
        this.setState({referenceData:result.body,referenceIsLoading:false});}

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,referenceIsLoading:false});}
      });

  }

  shouldComponentUpdate(nextProps, nextState) {
    
    if(nextProps.match && nextProps.match.isExact && (this.props.location.pathname !== nextProps.location.pathname)){
      this.setState({isUpdating:true});
      this.getData();
      return false;
    }
    
    return (nextState!==this.state);
  }

  componentDidMount() {
    this._isMounted=true;
    this.getData();
  }
  componentWillUnmount() {
    this._isMounted=false;
   }

   

  addMobility = referenceId => {
    this.setState({ 
      isUpdating:true
    })
    var participantStatus = 'approved';
    if(this.state.activityData && this.state.activityData.hasParticipantSelectProcedure === true){
      participantStatus = 'applicant';
    }
    
    let newMobility = {
      participant: { id: referenceId},
      participantStatus: participantStatus,
      participantRole: "participant",
      activityId: this.props.match.params.parentId,
      dateFrom:(this.state.activityData && this.state.activityData.dateFrom) || '',
      dateTo:(this.state.activityData && this.state.activityData.dateTo) || '',
      arrivalDate:(this.state.activityData && this.state.activityData.dateFrom) || '',
      arrivalTime: '00:00',
      departureDate:(this.state.activityData && this.state.activityData.dateTo) || '',
      departureTime:'23:59'
    };
    
    const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
    const params={_format:'json', lan:language};
    
    
    return this.props.contentType.api
    .create(params,newMobility)
    .then((result) => {
      this.props.snackbar.showMessage(this.props.t('snackbar_added_mobility'),'success');
      
      this.setState({ 
        
        isUpdating:false
      });
      
    })
    .catch((error) => {
        this.props.snackbar.showMessage(this.props.t('snackbar_error_add_mobility'),'error');
    });
  };

  async addMobilities() {

    this.setState({ 
      isUpdating:true
    })

    var referencesToAdd = this.state.referencesToAdd;
    
      referencesToAdd = referencesToAdd.split(",");
    


    for (var referenceId of referencesToAdd) {
      await this.addMobility(referenceId);
    }
    this.getData();
    this.setState({referencesToAdd:[],isUpdating:false});
  };
  
  handleChangeAddReference = name => value => {
    
    this.setState({
      [name]: value,
    });
  };



  getOptions = () => {

    const {referenceData,data} = this.state;
    
    var options;

    options = referenceData.filter((profile)=> {

              if(data){
                 return(
                  data
                    .map((it)=>{
                      return (it && it.participant.id);

                    })
                    .indexOf(profile.id) === -1);
                }else{
                  return false;
                } 
            });

    options = options.map((i) => {return ({value:i.id,label:i.firstname+" "+i.lastname})});
    
    return(options);
  };



  render() {
    const {data,isLoading,isUpdating,referencesToAdd,referenceIsLoading,activityData} = this.state; 
    const {columns} = this.props.contentType;
    const {t} = this.props;
    const readOnly = this.state.readOnly;
    

   

    return (
      <React.Fragment>
       <Panel>
       {!isLoading ? 
    
          
          
            
              <MobilitiesDataTable 
                columns={columns}
                t={t}
                isUpdating = {isUpdating}
                readOnly={readOnly}
                data={data}
                activityId={this.props.match && this.props.match.params.parentId}
                getData={this.getData.bind(this)}
                isEditable={true}
              />

            
      
         
         : (
           <LoadingIndicator></LoadingIndicator>
         )
      }
      </Panel>
     
          {!readOnly && <Grid container spacing={24} alignItems={'stretch'}>
            <Grid item xs={12} sm={6}>
              <Panel label={t("add_from_profiles")}>
              {referenceIsLoading}
              <ReferenceSelect
            id="referencesToAdd"
            multiSelect={true} 
            label={t('choose_profile')}
            onChange={this.handleChangeAddReference('referencesToAdd')}
            options={this.getOptions()} 

            value={referencesToAdd}
            />
            
              <Button className="fullWidth" disabled={(referencesToAdd.length===0)} variant="contained" color="primary" onClick={this.addMobilities.bind(this)}>{t('add_profiles',{count:referencesToAdd.length})}</Button>
             
              </Panel>
            </Grid>
            <Grid item xs={12} sm={6}>
              {/*<Panel label={t("add_new_mobility")}>
                              <Link to={match.params.parentId+'/new'}>
                                <Button className="fullWidth" variant="contained" color="primary">{t('new_mobility')}</Button>
                              </Link>
                            </Panel>*/}
            </Grid>
          </Grid>}


          <br /><br />
      {<Panel label={t("overview_approved_applicant")}>
              {!isLoading
                  ? (
                <React.Fragment>
                  {(activityData && activityData.organisations && data) &&
                    <div className="ongeaAct__list">
                      <div className="ongeaAct__list__header">
                        <div>{t('organisation')}</div>
                        <div>{t('all_participants')}{ ' ('+data.length+')'}</div>
                        <div>{t('participant')}
                          {' ('+data.filter((it)=>{
                                return (it.participantRole==="participant");
                              }).length+')'}
                        </div>
                        <div>{t('group leader')}
                           {' ('+data.filter((it)=>{
                                return (it.participantRole==="group_leader");
                              }).length+')'}
                        </div>
                        <div>{t('team member')}
                          {' ('+data.filter((it)=>{
                                return (it.participantRole==="team_member");
                              }).length+')'}
                        </div>
                      </div>
                      <div className="ongeaAct__list__items">
                      {activityData
                          .organisations
                          .map((organisation, i) => 
                          <div className="ongeaAct__list__item" key={organisation+i}>
                              <div>{organisation.title}</div>
                              
                              <div><span>{ data.filter((it)=>{
                                                              return (it.sendingOrganisation && it.participantStatus==="approved" && parseInt(it.sendingOrganisation.id,10)===parseInt(organisation.id,10));
                                                            }).length }</span>{' / '}
                              {
                                data.filter((it)=>{
                                                              return (it.sendingOrganisation && it.participantStatus==="applicant" && parseInt(it.sendingOrganisation.id,10)===parseInt(organisation.id,10));
                                                            }).length} 
                              </div>


                              <div><span>{ data.filter((it)=>{
                                                              return (it.sendingOrganisation && it.participantStatus==="approved" && it.participantRole==="participant" && parseInt(it.sendingOrganisation.id,10)===parseInt(organisation.id,10));
                                                            }).length }</span>{' / '}
                              {
                                data.filter((it)=>{
                                                              return (it.sendingOrganisation && it.participantStatus==="applicant" && it.participantRole==="participant" && parseInt(it.sendingOrganisation.id,10)===parseInt(organisation.id,10));
                                                            }).length} 
                              </div>

                              <div><span>{ data.filter((it)=>{
                                                              return (it.sendingOrganisation && it.participantStatus==="approved" && it.participantRole==="group_leader" && parseInt(it.sendingOrganisation.id,10)===parseInt(organisation.id,10));
                                                            }).length }</span>{' / '}
                              {
                                data.filter((it)=>{
                                                              return (it.sendingOrganisation && it.participantStatus==="applicant" && it.participantRole==="group_leader" && parseInt(it.sendingOrganisation.id,10)===parseInt(organisation.id,10));
                                                            }).length} 
                              </div>

                              <div><span>{ data.filter((it)=>{
                                                              return (it.sendingOrganisation && it.participantStatus==="approved" && it.participantRole==="team_member" && parseInt(it.sendingOrganisation.id,10)===parseInt(organisation.id,10));
                                                            }).length }</span>{' / '}
                              {
                                data.filter((it)=>{
                                                              return (it.sendingOrganisation && it.participantStatus==="applicant" && it.participantRole==="team_member" && parseInt(it.sendingOrganisation.id,10)===parseInt(organisation.id,10));
                                                            }).length} 
                              </div>
                            </div>
                          
                          )}</div>
                    </div>
                  }
                </React.Fragment>
                )
                : (
                  <LoadingIndicator></LoadingIndicator>
                )
              }
            </Panel>}
      </React.Fragment>
  );
  }
}


export default withSnackbar()(translate('translations')(MobilitiesListView));
