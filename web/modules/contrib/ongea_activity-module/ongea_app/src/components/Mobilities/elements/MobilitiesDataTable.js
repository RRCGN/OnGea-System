import React from 'react';
import DataTable from '../../elements/Tables/DataTable';
import LoadingIndicator from '../../elements/LoadingIndicator';
import { ContentTypes} from '../../../config/content_types';
import { withSnackbar } from '../../elements/SnackbarProvider'



class MobilitiesDataTable extends React.Component {
 

  constructor(props) {
    super(props);
    this.state = {
          isUpdating:false
      
            }

  }

  

  setFieldValue = (contentType,column,value,id) => {
    const {api} = ContentTypes.Mobilities;
     //console.log('SET FIELD VALUE',contentType,column,value,id);
     this.setState({ 
      isUpdating:true
    })
    const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
    const params={_format:'json', lan:language};
    var payload = {id:id};
    payload[column.name]=value;
    console.log('column',column);

     api
    .update({id:id, ...params},payload)
    .then((result) => {
      this.props.snackbar.showMessage('Successfully updated mobility','success');

      this.props.getData();
      this.setState({isUpdating:false});
    })
    .catch((error) => {
        this.props.snackbar.showMessage('Could not update mobility','error');
        this.setState({isUpdating:false});
    });
    //let formikReferenceIndex = this.props.values[contentType].findIndex(i=>i.id===id);
    //this.props.setFieldValue((contentType+'['+formikReferenceIndex+'].'+column).toString(),value);
  }

  

  render() {
    const {columns, readOnly, data, activityId, getData, t, setFieldValue, ...rest} = this.props;
    const {id, api, isEditable} = ContentTypes.Mobilities;
    
    const isUpdating = this.props.isUpdating || this.state.isUpdating;
    


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
         <DataTable 
              columns={columns}
              readOnly={readOnly}
              data={data}
              linkTo={'/'+id+'/'+activityId+'/:id'}
              delete={api.delete}
              afterDelete={getData}
              isEditable={isEditable}
              contentTypeId={id}
              setFieldValue={this.setFieldValue}
              {...rest}
             />
          {isUpdating && <LoadingIndicator overlay></LoadingIndicator>}
        </React.Fragment>
    );
  }
}

export default withSnackbar()(MobilitiesDataTable);


