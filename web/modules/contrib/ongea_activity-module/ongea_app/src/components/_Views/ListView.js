import React from 'react'

import Panel from '../elements/Panel';
import LoadingIndicator from '../elements/LoadingIndicator';
import DataTable from '../elements/Tables/DataTable';
import {getParams} from '../../libs/api';
import {getCurrentUser} from '../../libs/api';
//import { apiOptions } from '../config/config';

class ListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      isUpdating: false,
      errorMessage:'',
     };
     this._isMounted=false;
  }


  /*getDataFetch(){
    let contentType = (this.props.referenceContentType)?this.props.referenceContentType:this.props.contentType;
    if(contentType.id && contentType.id==='activities')
    {
    getFetchData('https://ongea.getcues.com/api/v2/activities?_format=json&lan=en&scope=small&web=true')
      .then(result => {
        console.log('fetch', result);
          this.setState({data:result,isLoading:false,isUpdating:false});
      }) // JSON-string from `response.json()` call
      .catch(error => console.error(error));
    }else{
      this.getData();
    }



    function getFetchData(url = ``, data = {}) {
      var csrfToken;
        return axios.get('https://ongea.getcues.com'+'/rest/session/token').then(response => {
  
        csrfToken = response.data;

        return fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                'X-CSRF-Token': csrfToken,
                'Authorization' : 'Basic aGFuczpoYW5z', 
                'gid': '19'
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer" // no-referrer, *client
            
        })
        .then(response => response.json());


      }).catch(error => {
        console.log(error);
      });
      // Default options are marked with *
         // parses response to JSON
    }


  }*/



  getData(){
    let contentType = (this.props.referenceContentType)?this.props.referenceContentType:this.props.contentType;
    //const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
    if(contentType.id){
          //let requestParams = {_format:'json', scope:'small', lan:language};
          
          
          const requestParams = getParams('listView', contentType, this.props);
          
          contentType.api.get(requestParams)
            .then((result) => {
              if(this._isMounted){
              
              

              
              
              /*if(result.body.length>0){
                if(result.body[0].new !== true){
                  
                  this.props.setContentViewReadOnly(true);
                }
              }*/
              
              this.setState({data:result.body,isLoading:false,isUpdating:false});
              }
            })
            .catch((error) => {
              if(this._isMounted){
              this.setState({errorMessage:error,isLoading:false,isUpdating:false});}
            });
    } 
  }

  shouldComponentUpdate(nextProps, nextState) {
    

    
    if(nextProps.t && nextProps.t !== this.props.t){

      return true;
    }

    if(nextProps.match && nextProps.match.isExact && (this.props.location.pathname !== nextProps.location.pathname)){
      this.setState({isUpdating:true});
      this.getData();
      return false;
    }

    
    return (nextState!==this.state);

  }



  componentDidMount() {
    this._isMounted=true;


    if(this.props.setContentViewReadOnly){
      let contentType = (this.props.referenceContentType)?this.props.referenceContentType:this.props.contentType;
      this.props.setContentViewReadOnly(true);
      getCurrentUser().then((user)=>{
                  
                  const roles = user.roles;
                  
                  if(!roles.org_admin && roles.act_admin){
                        
                      if(contentType.id === 'organisations' || contentType.id === 'projects'){

                        this.props.setContentViewReadOnly(true);
                      }
                      else{
                        
                        this.props.setContentViewReadOnly(false);
                      }
                  }
                  else if(!roles.org_admin && !roles.act_admin && roles.sender){
                      if(contentType.id === 'organisations' || contentType.id === 'projects' || contentType.id === 'activities'){
                        this.props.setContentViewReadOnly(true);
                      }
                      else{
                        this.props.setContentViewReadOnly(false);
                      }
                  }
                  else{

                      this.props.setContentViewReadOnly(false);
                  }

              });
      }

    this.getData();
  }
  componentWillUnmount() {
    this._isMounted=false;
   }


   

  render() {
    const {data,isLoading,isUpdating} = this.state; 
    const {columns,id,api,isEditable} = this.props.contentType;
    var isDeletable = this.props.contentType.isDeletable;
    const {t} = this.props;
    const customIsEditable = this.props.isEditable;

    const customIsDeletable = this.props.isDeletable;
     isDeletable = customIsDeletable !== undefined ? customIsDeletable : isDeletable;
     

    const translatedColumns = JSON.parse(JSON.stringify(columns));
    if(columns && data && data.length>0) {
      for(var i=0; i<columns.length;i++){
        const c = columns[i];
        if(c.getData !== undefined){
          for(var row of data){
            row[c.name] = c.getData(row,this.props.t);
          }
        }
        translatedColumns[i].title = t(c.title);
      }
    }
    
    return (
      <Panel>
          {!isLoading
          ? (
            <React.Fragment>
            <DataTable 
              contentTypeId={(this.props.referenceContentType)?this.props.referenceContentType.id:this.props.contentType.id}
              columns={translatedColumns}
              data={data}
              linkTo={'/'+id+((this.props.match && this.props.match.params.parentId)?'/'+this.props.match.params.parentId+'/:id':'/:id')}
              delete={api.delete}
              isDeletable={isDeletable ===false ? false : true}
              isEditable={isEditable ===false || customIsEditable === false? false : true}
              /*isReference={isReference}*/

             />
             {isUpdating && <LoadingIndicator overlay></LoadingIndicator>}
             </React.Fragment>
           )
           : (
             <LoadingIndicator></LoadingIndicator>
           )}

      </Panel>
    )
  }
}

export default (ListView);
