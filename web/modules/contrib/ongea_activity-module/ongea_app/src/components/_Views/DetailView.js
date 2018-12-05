import React from 'react'
import {translate} from "react-i18next";
import {Route} from 'react-router-dom';
import { ContentTypes } from '../../config/content_types';

import {routes, getPath} from '../../config/routes';
//import Paper from '@material-ui/core/Paper';

import TabsContainer from '../elements/Tabs/TabsContainer';
import { pageConfig } from '../../contexts/page-context';

import LoadingIndicator from '../elements/LoadingIndicator';
import { Prompt } from "react-router-dom";
import {getParams} from '../../libs/api';
import api from '../../libs/api';
 


class DetailView extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          data: {},
          isLoading: true,
          config: pageConfig,
          doesFormReset: false,
          readOnly:true
        };
        this._isMounted = false;
      }


    componentWillMount() {
      this.unlisten = this.props.history.listen((location, action) => {
        this.setResetForm(true);
       this.props.setDirtyFormState(false);
      });
    }


    componentWillUnmount() {
        this._isMounted=false;
        this.unlisten();
        this.props.setDirtyFormState(false);
        console.log('UNMOUNT');
        if(this.props.contentType.id === 'activities'){
          this.resetActivityOpen(this.state.data.id);
        }
      }

    componentDidMount() {
       this._isMounted=true;
      this.getData();

      }

    
      setMobilitiesSub=(result)=>{
        var sub='';
          sub = result.body.participant && (result.body.participant.firstname+' '+result.body.participant.lastname);
          this.getActivityName(this.props.match.params.parentId).then((title)=>{
            
            sub = title+' - '+(result.body.participant && (result.body.participant.firstname+' '+result.body.participant.lastname));
            this.props.changeSub(sub);
          });
         this.props.changeSub(sub);
      }

      
      getData(onReset){
          const api = this.props.contentType.api;

          
        
      
        if(this.props.match && this.props.match.params.id!==undefined){
          
          
          
          const params = getParams('getSingleForForms', this.props.contentType, this.props);
        api
          .getSingle({id: this.props.match.params.id, ...params})
          .then((result) => {
            if(this._isMounted){
                  var data = result.body;
                  console.log(this.props);
                  
                  if(this.props.contentType.id === 'mobilities'){
                     this.setMobilitiesSub(result);
                   
                   
                  }else{
                   const sub = result.body.title;
                   this.props.changeSub(sub);
                  }
                   

                  var readOnly = (typeof result.body.manage === "undefined" || result.body.manage === true) ? false : true;
                 
                  this.checkIfAlreadyOpen(data).then((isOpen)=>{

                      if(isOpen) readOnly = true;

                      this.setState({data,isLoading:false, readOnly});
                      if(onReset){
                        onReset();
                      }

                  });
            
           } 
          })
          .catch((error) => {
            console.error(error);
          });
        }else{
          if(this.props.changeSub)this.props.changeSub("New");
          this.setState({isLoading:false, readOnly:false});
        }

      }

      resetData = (onReset) =>{

        this.getData(onReset);

      }



      getActivityName = (activityId) => {

        const api = ContentTypes.Activities.api;
        var params = getParams('getSingleForForms', ContentTypes.Activities, this.props);

        params.scope = 'small';

        return api.getSingle({id:activityId, ...params})
          .then((result)=>{

            return result.body.title;
          })
          .catch((error)=>{
            console.error(error);
        });

      }

      
      checkIfAlreadyOpen= async (data)=>{


        if(data.isEditedBy){
          const currentUser = await api.getCurrentUser();
          console.log('currentUser',currentUser.body);
          console.log('isEditedBy',data.isEditedBy);
          if(currentUser && currentUser.body && data.isEditedBy === currentUser.body.id){
            return false;
          }else{
            console.error('Someone is already editing this.');
          }
        }
        //return true;
        return false;

      }

      resetActivityOpen = (activityId) => {
        const api = ContentTypes.Activities.api;
        const params = {_format:'json',lan:'en'};
        console.log('activity',activityId);
        api.update({id:activityId, ...params},{id:activityId, isEditedBy:"0"})
          .then((result)=>{
            console.log('Reset activity open successful.');
          })
          .catch((error)=>{console.error(error);});
      }

    
      updateStateAfterSuccess = (result) => {
        console.log('updateaftersucces',result.body);
        this.setState({data:result.body});

        console.log('props',this.props);
        console.log('result',this.result);

        if(typeof result.body.title !== "object"){
          if(this.props.contentType.id==='mobilities'){
              this.setMobilitiesSub(result);
          }else{
              this.props.changeSub(result.body.title);
          }
          
        }else{
          this.props.changeSub('');
        }
      }

     
    

      setResetForm(doesFormReset){
        this.setState({doesFormReset:doesFormReset});
        
      }
     

      

  render() {
    const {t, match} = this.props;
    const {isLoading} = this.state;
   
    const detailRoute = this.props.contentType.id+'Detail';
    //const {title, route} = this.props.contentType;
    return (
      <React.Fragment>
     
     

        {(isLoading) ? (<LoadingIndicator />) :(

        <TabsContainer>

          {routes[detailRoute]
            .map((r, i) => {
            
              var validationSchema = undefined;
              if(this.props.contentType.validationSchema){
                 validationSchema = this.props.contentType.validationSchema(this.props); // r.id is e.g. 'basic' or 'funding' in config/routes.js and should match object in config/contentTypes->validationSchema
                 
              }

                
             // console.log('rr',((!match.params.id && i===0) || match.params.id) ? true : false);

              
              return(
                      
                        <div
                          disabled={ (match.params.id === undefined && i!==0)}
                          key={'route-' + i}
                          path={getPath(r.path,match.params.id,match.params.parentId)}
                          label={t(r.label)}>
                          <Route path={r.path} render={(props) => (
                            <span>
                            <r.component {...props} t={t} data={this.state.data} validation={validationSchema ? validationSchema[r.id] : false} updateStateAfterSuccess={this.updateStateAfterSuccess} formIsDirty={this.props.formIsDirty} setDirtyFormState={this.props.setDirtyFormState} setResetForm={this.setResetForm.bind(this)} doesFormReset={this.state.doesFormReset} resetData={this.resetData} readOnly={this.state.readOnly}/>
                            </span>
                            )}/>
                        </div>);

            })}
              

        </TabsContainer>
        )}

      </React.Fragment>
    );
  }
}

//export const Content = translate('translations')(Content);
export default translate('translations')(DetailView);