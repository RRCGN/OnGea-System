import React from 'react'
import {translate} from "react-i18next";
import {Route} from 'react-router-dom';

import {routes, getPath} from '../../config/routes';
//import Paper from '@material-ui/core/Paper';

import TabsContainer from '../elements/Tabs/TabsContainer';
import { pageConfig } from '../../contexts/page-context';

import LoadingIndicator from '../elements/LoadingIndicator';
import { Prompt } from "react-router-dom";

 


class DetailView extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          data: {},
          isLoading: true,
          config: pageConfig,
          formIsDirty:false,
          doesFormReset: false
        };
      }


    componentWillMount() {
      this.unlisten = this.props.history.listen((location, action) => {
        this.setResetForm(true);
        this.setDirtyFormState(false);
      });
    }


    componentWillUnmount() {
       
        this.unlisten();
        this.setState({formIsDirty:false});
      }

    componentDidMount() {
     
      this.getData();

      }


      getData(){
          const api = this.props.contentType.api;


     
        //pageConfig.subtitle = 'hello2'
        //this.setState({config: {subtitle:'hello'}});
      
        if(this.props.match && this.props.match.params.id!==undefined){
          
        api
          .getSingle({id: this.props.match.params.id})
          .then((result) => {
            var data = result.body;
            this.props.changeSub(result.body.title);
            
            
            this.setState({data,isLoading:false});
          })
          .catch((error) => {
            console.error(error);
          });
        }else{
          if(this.props.changeSub)this.props.changeSub("New");
          this.setState({isLoading:false});
        }

      }

      resetData = () =>{
        this.getData();

      }

      
    
      updateStateAfterSuccess = (result) => {
        console.log('updateaftersucces',result.body);
        this.setState({data:result.body});
        if(typeof result.body.title !== "object"){
          this.props.changeSub(result.body.title);
        }else{
          this.props.changeSub('');
        }
      }

      setDirtyFormState (dirty) {
        
        this.setState({formIsDirty:dirty});
        console.log('formIs: ',dirty);
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
     <Prompt
          when={this.state.formIsDirty}
          message={location =>
            `Are you sure you want to leave? `
          }
        />
     {/*<PageContext.Consumer>
      {(context) => (
        <p>
          <button onClick={() => { context.changeSubtitle(this.state.data.title) }}>Change subtitle</button>
        </p>
      )}
    </PageContext.Consumer>*/}
         
        {/*<PageContext.Consumer>
            {(config) => <button onClick={config.changeSubtitle}>INC</button>}
        </PageContext.Consumer>*/}
        {/*<PageContext.Provider value={this.state.config}></PageContext.Provider>*/}

        {(isLoading) ? (<LoadingIndicator />) :(

        <TabsContainer>

          {routes[detailRoute]
            .map((r, i) => {
            
              var validationSchema = undefined;
              if(this.props.contentType.validationSchema){
                 validationSchema = this.props.contentType.validationSchema[r.id]; // r.id is e.g. 'basic' or 'funding' in config/routes.js and should match object in config/contentTypes->validationSchema
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
                            <r.component {...props} t={t} data={this.state.data} validation={validationSchema ? validationSchema : false} updateStateAfterSuccess={this.updateStateAfterSuccess} formIsDirty={this.state.formIsDirty} setDirtyFormState={this.setDirtyFormState.bind(this)} setResetForm={this.setResetForm.bind(this)} doesFormReset={this.state.doesFormReset} resetData={this.resetData} />
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