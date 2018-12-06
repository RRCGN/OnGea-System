import React from 'react';
import { ContentTypes,extendReferenceContentType } from '../../config/content_types';
import DataTable from '../elements/Tables/DataTable';
import {translate} from "react-i18next";
import Panel from '../elements/Panel';
import LoadingIndicator from '../elements/LoadingIndicator';
import Grid  from '@material-ui/core/Grid';
import { ReferenceSelect } from '../elements/FormElements/FormElements';
import { Link } from 'react-router-dom';
import Button  from '@material-ui/core/Button';

import { withSnackbar } from '../elements/SnackbarProvider'

class MobilitiesListView extends React.Component {
 
  //TODO REMOVE FILE AND USE _Views/ListView instead



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
    //let contentType= ContentTypes.Mobilities;
    const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
    if(contentType.id){
    
    let requestParams = {_format:'json', lan:language};
    if(this.props.match && this.props.match.params.parentId) 
      requestParams = {id: this.props.match.params.parentId, ...requestParams};

    ContentTypes.Activities.api.getSingle(requestParams)
      .then((result) => {
        if(this._isMounted){
          //const readOnly = (result.body.manage === true) ? false : true;
          this.setState({activityData:result.body,data:result.body.mobilities.filter(it=>it!==null),isLoading:false,isUpdating:false});
        }
      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoading:false,isUpdating:false});}
      });
    } 

    let referenceContentType = this.props.referenceContentType;

    referenceContentType.api.get({_format:'json',scope:'small', lan:language})
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

   setFieldValue = (contentType,column,value,id) => {
     //console.log('SET FIELD VALUE',contentType,column,value,id);
     /*this.setState({ 
      isUpdating:true
    })*/
    const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
    const params={_format:'json', lan:language};
    var payload = {id:id};
    payload[column.name]=value;
    console.log('column',column);

     this.props.contentType.api
    .update({id:id, ...params},payload)
    .then((result) => {
      this.props.snackbar.showMessage('Successfully updated mobility','success');

      this.getData();
    })
    .catch((error) => {
        this.props.snackbar.showMessage('Could not update mobility','error');
    });
    //let formikReferenceIndex = this.props.values[contentType].findIndex(i=>i.id===id);
    //this.props.setFieldValue((contentType+'['+formikReferenceIndex+'].'+column).toString(),value);
  }

  addMobility = referenceId => {
    this.setState({ 
      isUpdating:true
    })
    //let newRefItem = this.state.data.find(it=>it.id===parseInt(referenceId,10));
    //console.log('newRefITem',newRefItem);
    let newMobility = {
      participant: { id: referenceId},
      participantStatus: "applicant",
      participantRole: "participant",
      activityId: this.props.match.params.parentId
    };
    console.log(newMobility);
    const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
    const params={_format:'json', lan:language};
    
    //JSON.stringify(newMobility)
    return this.props.contentType.api
    .create(params,newMobility)
    .then((result) => {
      this.props.snackbar.showMessage('Successfully added new mobility','success');
      /*var _data = this.state.data;
      console.log("BEFORE",_data);
      _data.push(result.body);
      console.log("AFTER",_data);
      this.setState({ 
        data: _data,
        isUpdating:false
      })*/
      //this.setState({referencesToAdd:[]});
      //this.getData();
    })
    .catch((error) => {
        this.props.snackbar.showMessage('Could not add new mobility','error');
    });
  };

  async addMobilities() {

    this.setState({ 
      isUpdating:true
    })

    var referencesToAdd = this.state.referencesToAdd;
    if(referencesToAdd === "all"){
      referencesToAdd = this.getOptions().map((option)=>{
        if(option.value !== "all"){
          return(option.value);
        }
        return undefined;
      });
    }else{
      referencesToAdd = referencesToAdd.split(",");
    }


    for (var referenceId of referencesToAdd) {
      await this.addMobility(referenceId);
    }
    this.getData();
    this.setState({referencesToAdd:[],isUpdating:false});
  };
  
  handleChangeAddReference = name => value => {
    console.log(name,value);
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
    options.unshift({label:'-- add all --', value:'all'});
    return(options);
  };



  render() {
    const {data,isLoading,isUpdating,referencesToAdd,referenceIsLoading,activityData} = this.state; 
    const {columns,id,api,isEditable} = this.props.contentType;
    const {t,match} = this.props;
    const readOnly = this.state.readOnly;


    if(columns && data && data.length>0) {
      for(var c of columns){
        if(c.getData !== undefined){
          for(var row of data){
            if(row)row[c.name] = c.getData(row,this.props.t);
          }
        }
        c.title = t(c.title)
      }
    }


    return (
      <React.Fragment>
       <Panel>
       {!isLoading
          ? (
        <React.Fragment>
          
          
            {/*<ListView {...this.props} data={this.state.data}></ListView>*/}
            <DataTable 
              columns={columns}
              readOnly={readOnly}
              data={data}
              linkTo={'/'+id+((this.props.match && this.props.match.params.parentId)?'/'+this.props.match.params.parentId+'/:id':'/:id')}
              delete={api.delete}
              afterDelete={this.getData.bind(this )}
              isEditable={isEditable}
              contentTypeId={id}
              setFieldValue={this.setFieldValue}
             />
             {isUpdating && <LoadingIndicator overlay></LoadingIndicator>}
        </React.Fragment>
         )
         : (
           <LoadingIndicator></LoadingIndicator>
         )
      }
      </Panel>
     
          {!readOnly && <Grid container spacing={24} alignItems={'stretch'}>
            <Grid item xs={12} sm={6}>
              <Panel label="Add by participant">
              {referenceIsLoading}
              <ReferenceSelect
            id="referencesToAdd"
            multiSelect={true} 
            label={t('Choose')+" "+t(this.props.referenceContentType.title)}
            onChange={this.handleChangeAddReference('referencesToAdd')}
            options={this.getOptions()} 

            value={referencesToAdd}
            />
            
              <Button className="fullWidth" disabled={(referencesToAdd.length===0)} variant="contained" color="primary" onClick={this.addMobilities.bind(this)}>{t('Add')+" "+t(this.props.referenceContentType.title,{count:referencesToAdd.length})}</Button>
             
              </Panel>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Panel label="Add new">
                <Link to={match.params.parentId+'/new'}>
                  <Button className="fullWidth" variant="contained" color="primary">{t('new_mobility')}</Button>
                </Link>
              </Panel>
            </Grid>
          </Grid>}


          <br /><br />
      <Panel label="Overview - work in progress">
        {!isLoading
            ? (
          <React.Fragment>
            {(activityData && activityData.organisations && data) &&
              <div className="ongeaAct__list">
                <div className="ongeaAct__list__header">
                  <div>Organisation</div>
                  <div>{t('all')}</div>
                  <div>{t('participant')}</div>
                  <div>{t('group_leader')}</div>
                  <div>{t('team_member')}</div>
                </div>
                <div className="ongeaAct__list__items">
                {activityData
                    .organisations
                    .map((organisation, i) => 
                    <div className="ongeaAct__list__item" key={organisation+i}>
                        <div>{organisation.title}</div>
                        <div><span>{ data.filter(it=>it.sendingOrganisation && it.participantStatus==="approved" && it.sendingOrganisation.id===organisation.id).length }</span> / { data.length}</div>
                        <div>coming soon</div>
                        <div>coming soon</div>
                        <div>coming soon</div>
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
      </Panel>
      </React.Fragment>
  );
  }
}


export default withSnackbar()(translate('translations')(MobilitiesListView));
