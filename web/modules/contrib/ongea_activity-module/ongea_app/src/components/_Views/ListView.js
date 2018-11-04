import React from 'react'
import {translate} from "react-i18next";
import Panel from '../elements/Panel';
import LoadingIndicator from '../elements/LoadingIndicator';
import DataTable from '../elements/Tables/DataTable';
//import api from '../../libs/api';

class ListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      isUpdating: false,
      errorMessage:''
     };
     this._isMounted=false;
  }

  getData(){
    let contentType = (this.props.referenceContentType)?this.props.referenceContentType:this.props.contentType;
    if(contentType.id){
          let requestParams = {_format:'json', scope:'small'};
          //if(this.props.match && this.props.match.params.parentId) requestParams.id = this.props.match.params.parentId;
          console.log(requestParams);
          
          contentType.api.get(requestParams)
            .then((result) => {
              if(this._isMounted){
              
              
              /*if(requestParams.id) {
                //TODO, should not be hardcoded -> result.body.mobilities something like result.body[VAR]
                this.setState({data:result.body.mobilities,isLoading:false,isUpdating:false});
              }
              else{
                this.setState({data:result.body,isLoading:false,isUpdating:false});
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

  render() {
    //this.getData();
    const {data,isLoading,isUpdating} = this.state; 
    const {columns,id,api,isEditable} = this.props.contentType;
    const {t, isDeletable} = this.props;
    const customIsEditable = this.props.isEditable;

    if(columns && data && data.length>0) {
      for(var c of columns){
        if(c.getData !== undefined){
          for(var row of data){
            row[c.name] = c.getData(row,this.props.t);
          }
        }
        
        c.title = t(c.title);
      }
    }
    
    return (
      <Panel>
          {!isLoading
          ? (
            <React.Fragment>
            <DataTable 
              contentTypeId={(this.props.referenceContentType)?this.props.referenceContentType.id:this.props.contentType.id}
              columns={columns}
              /*translatedColumnTitles={columns.map(function (obj) {
                return {name:obj.name,title:t(obj.title)};
              })}*/
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

export default translate('translations')(ListView);
