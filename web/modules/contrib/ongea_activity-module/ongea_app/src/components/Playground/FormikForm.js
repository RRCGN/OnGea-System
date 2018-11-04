import React from 'react';

import Panel from '../elements/Panel';
import Grid from '@material-ui/core/Grid';
import {TextInput, TextInputSelect, SelectInput, DateInput, TimeInput, ResetAndSave, SwitchInput, RadioInput} from '../elements/FormElements/FormElements';
import { formEnhancer } from '../../libs/utils/formEnhancer';
import  DisplayFormState  from '../elements/FormElements/DisplayFormState';
import FileUpload from '../elements/FormElements/FileUpload';
import FormRowLayout from '../elements/FormElements/FormRowLayout';
import { withSnackbar } from '../elements/SnackbarProvider';







function FormControls(props) {
  return (
    <FormRowLayout alignItems="right" fullWidth>
    <ResetAndSave 
        {...props}
      />
  </FormRowLayout>
  );
}


export class MyForm extends React.Component{ 

    componentWillReceiveProps(newProps){
      const {status, setStatus} = newProps;
      const snackbarMessage = "Form submitted successfully."

      if(status && status.success && status !== this.props.status){
       this.props.snackbar.showMessage(snackbarMessage,'success');
       setStatus({success:false})
      }else if(status && !status.success){
        this.props.snackbar.showMessage(status.errorMessage,'error');
      }

    }
  
    
  
    


render(){

const {
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting,
    setFieldValue,
    t
  } = this.props;



  
  return (
    
       <div>
        <Panel label="Form with Validation">
        <form onSubmit={handleSubmit} context={{1:'hello'}}>

    <FormRowLayout infoLabel='Lorem IpsumLorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum em Ipsum Lorem Ipsum Lorem Ip sum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum em Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum L Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'>
      <TextInput
        id="firstName"
        type="text"
        label="First Name"
        placeholder="John"
        error={touched.firstName && errors.firstName}
        value={values.firstName}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormRowLayout>

    <FormRowLayout>
      <TextInput
        id="lastName"
        type="text"
        label="Last Name"
        placeholder="Doe"
        error={touched.lastName && errors.lastName}
        value={values.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormRowLayout>
      
    <FormRowLayout>
      <TextInput
        id="email"
        type='email'
        label="Email"
        placeholder="Enter your email"
        error={touched.email && errors.email}
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormRowLayout>

    <FormRowLayout>
      <TextInputSelect
        id="currency"
        type='text'
        label="Currency"
        placeholder="choose a currency"
        error={touched.currency && errors.currency}
        value={values.currency}
        onChange={handleChange}
        onBlur={handleBlur}
        options={['euro', 'dollar', 'kronen']}
      />
    </FormRowLayout>

    <FormRowLayout>
      <SelectInput
        id="gender"
        type='text'
        label="Gender"
        error={touched.gender && errors.gender}
        value={values.gender}
        onChange={handleChange}
        onBlur={handleBlur}
        options={{1:'male',2:'female', 3:'other'}}
      />
    </FormRowLayout>

    <FormRowLayout>
      <SwitchInput
        id="isVisible"
        label="is visible?"
        error={touched.isVisible && errors.isVisible}
        value={values.isVisible}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormRowLayout>

     <FormRowLayout>
      <RadioInput
        id="genderRadio"
        label="Gender"
        error={touched.genderRadio && errors.genderRadio}
        value={values.genderRadio}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormRowLayout>


      
      <FormRowLayout>
        <Grid container spacing={24}>
         <Grid item xs={12} sm={6}>
            <DateInput
              id="startDate"
              label="Start date"
              error={touched.startDate && errors.startDate}
              value={values.startDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
              <DateInput
                id="endDate"
                label="End date"
                error={touched.endDate && errors.endDate}
                value={values.endDate}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              
            </Grid>
          </Grid>
        </FormRowLayout>
        <FormRowLayout>
          <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
              <TimeInput
                  id="startTime"
                  label="Start time"
                  error={touched.startTime && errors.startTime}
                  value={values.startTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
          </Grid>
          <Grid item xs={12} sm={6}>
              <TimeInput
                id="endTime"
                label="End time"
                error={touched.endTime && errors.endTime}
                value={values.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
          </Grid>
        </FormRowLayout>
        

      <br />

      <FormRowLayout infoLabel="Lorem Ipsum">
        <FileUpload label="File upload" reportFiles={this.reportFiles} snackbar={this.props.snackbar} setFieldValue={setFieldValue}/>
      </FormRowLayout>



       <FormControls t={t}
             handleReset={handleReset}
             isSubmitting={isSubmitting}
             dirty={dirty}></FormControls>

      {/*<MainSnackbar snackbar={snackbar} snackbarMessage={snackbarMessage}/>*/}


      
    </form>
    </Panel>
        
       
            <Panel label="Form output">
              <DisplayFormState 
                {...this.props} />
            </Panel>
        
    </div>
    
  );
}
}

export const FormikForm = withSnackbar()(formEnhancer(MyForm));


