import React from 'react'
import {translate} from "react-i18next";
import {Route} from 'react-router-dom';
import { ContentTypes } from '../../config/content_types';

import {routes, getPath} from '../../config/routes';
//import Paper from '@material-ui/core/Paper';

import TabsContainer from '../elements/Tabs/TabsContainer';
import { pageConfig } from '../../contexts/page-context';

import LoadingIndicator from '../elements/LoadingIndicator';
import {getParams} from '../../libs/api';
import { withSnackbar } from '../elements/SnackbarProvider';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
 


class DetailView extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          data: {},
          isLoading: true,
          config: pageConfig,
          doesFormReset: false,
          readOnly:true,
          openPrompt:false,
          formerLanguage:null,
          dontPrompt:false
        };
        this._isMounted = false;
      }


    componentWillMount() {
      this.unlisten = this.props.history.listen((location, action) => {
        this.setResetForm(true);
       this.props.setDirtyFormState({mainForms:false});
      });





    }


    componentWillReceiveProps(newProps) {

      //load new Data on language change


      if(newProps.lng && newProps.lng !== this.props.lng){
        
        if(this.props.lng){
          this.setState({formerLanguage:this.props.lng});
        }

        if(!this.state.dontPrompt){
          this.checkResetFormOnLanguageChange(false);
        }else{
          this.setState({dontPrompt:false});
        }

        
      }

    }

    componentWillUnmount() {
        this._isMounted=false;
        this.unlisten();
        this.props.setDirtyFormState({mainForms:false});
        if(this.props.contentType.id === 'activities' && this.state.data && this.state.data.id){
          this.resetActivityOpen(this.state.data.id);
        }
      }

    componentDidMount() {
       this._isMounted=true;
      this.getData();

      }


      checkResetFormOnLanguageChange = (forceReset) => {

          if(!forceReset && this.props.formIsDirty.mainForms===true){
            this.setState({openPrompt:true});
          }else{
            this.resetData();
            if(this.state.openPrompt){
              this.setState({openPrompt:false});
            }

          }
      }

      cancelLanguageChange = () => {
        const formerLanguage = this.state.formerLanguage;

          this.setState({openPrompt:false, dontPrompt:true},()=>{
              if(formerLanguage){
                this.props.i18n.changeLanguage(formerLanguage);
              }
          });
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

                  
                  
                  if(this.props.contentType.id === 'mobilities'){
                     this.setMobilitiesSub(result);
                   
                   
                  }else{
                   const sub = result.body.title;
                   this.props.changeSub(sub);
                  }
                    

                  var readOnly =( this.props.contentType.id === 'mobilities' || (typeof result.body.manage === "undefined" || result.body.manage === true)) ? false : true;
                 
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
          if(this.props.changeSub)this.props.changeSub('new');
          this.setState({isLoading:false, readOnly:false});
        }

      }

      resetData = (onReset) =>{

        this.setState({isLoading:true});
        this.getData(()=>{
                  if(this.props.setDirtyFormState){
                    this.props.setDirtyFormState({mainForms:false});
                  }
                  if(onReset){
                    onReset();
                  }
                });

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
        if(data.isEditedBy && data.isEditedBy !== '0'){
          const currentUser = this.props.user;
          
          if(currentUser && data.isEditedBy === currentUser.id){
            return false;
          }else{
            this
              .props
              .snackbar
              .showMessage(this.props.t('warning_parallel_editing',{user:'User '+data.isEditedBy, item:this.props.contentType.title}), 'warning');
            console.error('Someone is already editing this.');
            return true;
          }
        }
        return false;
        

      }

      resetActivityOpen = (activityId) => {

        const api = ContentTypes.Activities.api;
        const params = {_format:'json',lan:'en'};
        api.update({id:activityId, ...params},{id:activityId, isEditedBy:'0'})
          .then((result)=>{
            console.log('Reset activity open successful.');
          })
          .catch((error)=>{console.error(error);});
      }

    
      updateStateAfterSuccess = (result) => {
        this.setState({data:result.body});

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

    const {t, match, user} = this.props;
    const {isLoading, data} = this.state;
    
    const detailRoute = this.props.contentType.id+'Detail';
    //const {title, route} = this.props.contentType;
    return (
      <React.Fragment>
     
     

        {(isLoading || !user) ? (<LoadingIndicator />) :(

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
                            <r.component {...props} t={t} data={data} user={user} validation={validationSchema ? validationSchema[r.id] : false} updateStateAfterSuccess={this.updateStateAfterSuccess} formIsDirty={this.props.formIsDirty} setDirtyFormState={this.props.setDirtyFormState} setResetForm={this.setResetForm.bind(this)} doesFormReset={this.state.doesFormReset} resetData={this.resetData} readOnly={this.state.readOnly}/>
                            </span>
                            )}/>
                        </div>);

            })}
              

        </TabsContainer>
        )}


         <Dialog
          open={this.state.openPrompt}
          onClose={this.cancelLanguageChange}
          >
          <DialogTitle><p><span style={{textTransform:'uppercase'}}>{t('unsubmitted_form')}</span></p> 
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
             {t('form_warning_language_change')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button  onClick={this.cancelLanguageChange} color="primary">{t("cancel")}</Button>
            <Button  onClick={()=>this.checkResetFormOnLanguageChange(true)} color="secondary">{t("yes")}</Button>
          </DialogActions>
        </Dialog>


      </React.Fragment>
    );
  }
}

//export const Content = translate('translations')(Content);
export default withSnackbar()(translate('translations')(DetailView));