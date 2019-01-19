import * as Yup from 'yup';
import { withFormik } from 'formik';






  function convertEmptyArraysToNull(data) {
    
      var dataWithoutEmptyArrays = {};
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
         

            if(data[key] && data[key].constructor === Array && !data[key].length){
              dataWithoutEmptyArrays[key] = null;
            }else{
              dataWithoutEmptyArrays[key] = data[key];
            }
        }
      }

      return(dataWithoutEmptyArrays);
  }



export const formEnhancer = withFormik({

    enableReinitialize:true,
    validateOnChange:false,

    validationSchema: function(props){

      if(props.validation){
        return props.validation;
      }
      else{
        return Yup.object().shape({
                      
                      });
      }
    },
  
    mapPropsToValues: ({data}) => {
      
      const dataWithoutEmptyArrays = convertEmptyArraysToNull(data); 
      return({
          ...dataWithoutEmptyArrays,
        });
    },
    handleSubmit: (payload, { setSubmitting, setStatus, resetForm, props }) => {
      //console.log('propsI18n',props);
    const language = props.i18n && props.i18n.language ? props.i18n.language : 'en';
    const params={_format:'json', lan:language};

      function createDataSet(createPayload, api, isParentCall){
        
          api
            .create(params,createPayload)
            .then((result) => {

               if(!props.isSubForm){
                    if(props.setDirtyFormState) props.setDirtyFormState(false);
                    setStatus({success:true,snackbarMessage:props.t('snackbar_form_submit_success'),result:result});
                    const dataWithoutEmptyArrays = convertEmptyArraysToNull(result.body); 
                    resetForm(dataWithoutEmptyArrays);
                    
                }else if(props.isSubForm && props.parentContentType && !isParentCall){
                    //setStatus({success:true,snackbarMessage:'First stage of submit complete.'});
                    

                }else if(props.parentContentType && isParentCall){

                    setStatus({success:true,snackbarMessage:props.t('snackbar_form_submit_success'), result:result, wasParentCall:true});
                    
                }

                if(props.isSubForm && !isParentCall){
                    


                    if(!props.parentDataID){

                        createDataSet({[props.contentType.id]:{id:result.body.id}}, props.parentContentType.api, true);
                    }
                    else{
                      
                        updateDataSet(props.parentDataID, {id:props.parentDataID,[props.contentType.id]:{id:result.body.id}}, props.parentContentType.api, true);
                    } 
                }

            })
            .catch((error) => {

                setStatus({success:false,snackbarMessage:props.t('snackbar_database_connection_error')});
                console.error(error);
                resetForm(payload);
                
            });
        }

      function updateDataSet(updateID, updatePayload, api, isParentCall){
        api
        .update({id:updateID,...params},updatePayload)
        .then((result) => {
          
            if(!props.isSubForm){
                    if(props.setDirtyFormState) props.setDirtyFormState(false);
                    setStatus({success:true,snackbarMessage:props.t('snackbar_form_submit_success'),result:result});
                    const dataWithoutEmptyArrays = convertEmptyArraysToNull(result.body); 
                    resetForm(dataWithoutEmptyArrays);
                    
                }else if(props.isSubForm && props.parentContentType && !isParentCall){
                    //setStatus({success:true,snackbarMessage:'First stage of submit complete.'});

                    updateDataSet(props.parentDataID, {id:props.parentDataID}, props.parentContentType.api, true); //just get entire parent dataset to update state

                }else if(props.isSubForm && isParentCall){
                    if(props.setDirtyFormState) props.setDirtyFormState(false);
                    setStatus({success:true,snackbarMessage:props.t('snackbar_form_submit_success'),result:result,wasParentCall:true});
                    
                    const dataWithoutEmptyArrays = convertEmptyArraysToNull(result.body[props.contentType.id]); 
                    resetForm(dataWithoutEmptyArrays);
                    
                }
        })
        .catch((error) => {
            setStatus({success:false,snackbarMessage:props.t('snackbar_database_connection_error')});
            console.error(error);
            resetForm(payload);
            
        });
      }
        
     
       
        

        
        setSubmitting(true);

        if(payload.id===undefined){
            createDataSet(payload, props.contentType.api, false);
        }
        else{
            updateDataSet(payload.id, payload, props.contentType.api, false);
        }

        

    }
  });