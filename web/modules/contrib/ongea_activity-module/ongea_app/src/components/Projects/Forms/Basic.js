import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import Grid from '@material-ui/core/Grid';
import {TextInput, SwitchInput, DateInput} from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import FileUpload from '../../elements/FormElements/FileUpload';


 



export class BasicForm extends React.Component {
   constructor(props) {
    super(props);

    this.state = {
      data: this.props.data
                      
     };
  }

  static defaultProps = {
    contentType: ContentTypes.Project
  }
  
  componentDidMount() {

    if(this.props.match.params.id === "new"){
      this.setInitialValues();

    }

  }

  setInitialValues = () => {

        
              var data = {
                  title:null,
                  subtitle:null,
                  description:null,
                  dateFrom:null,
                  dateTo:null,
                  logo:null,
                  image:null,
                  isErasmusFunded:false,
                  grantAgreementNumber:null,


              };
              
              this.setState({data});
      }

    render() {
       const {data, ...props} = this.props;
console.log(this.state.data);
       return (
           <EditView data={this.state.data} {...props} render={(props) => (

            <div>
                     <Panel label={props.t("basic_information")+' & '+props.t("erasmus_plus")}>
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            required
                            id="title"
                            type="text"
                            label={props.t("Project title")}
                            error={props.touched.title && props.errors.title}
                            value={props.values.title}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="subtitle"
                            type="text"
                            label={props.t("Project subtitle")}
                            error={props.touched.subtitle && props.errors.subtitle}
                            value={props.values.subtitle}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout>
                              <TextInput
                                id="description"
                                type="text"
                                label={props.t("Project description")}
                                multiline
                                error={props.touched.description && props.errors.description}
                                value={props.values.description}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>
                      </Panel>
                       <Panel>
                       

                        <FormRowLayout>
                                  <Grid container spacing={24}>
                                   <Grid item xs={12} sm={6}>
                                      <DateInput
                                        required
                                        id="dateFrom"
                                        label={props.t("Start date")}
                                        error={props.touched.dateFrom && props.errors.dateFrom}
                                        value={props.values.dateFrom}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DateInput
                                          id="dateTo"
                                          label={props.t("End date")}
                                          error={props.touched.dateTo && props.errors.dateTo}
                                          value={props.values.dateTo}
                                          onChange={props.handleChange}
                                          onBlur={props.handleBlur}
                                        />
                                        
                                      </Grid>
                                    </Grid>
                                </FormRowLayout>
                          </Panel>
                          <Panel>
                          

                          <FormRowLayout infoLabel="" infoLabelFullHeight={true}>
                            <FileUpload 
                              id="logo"
                              label={props.t("Project logo")} 
                              snackbar={props.snackbar} 
                              accept={'image/jpeg, image/png, image/gif'}
                              text='Try dropping some files here, or click to select files to upload. Only .jpg,
                                        .png and .gif type files will be accepted.'
                              countLimit={1}
                              value={props.values.logo}
                              setFieldValue={props.setFieldValue}
                              filesAreImages={true}
                              />
                          </FormRowLayout>
                        </Panel>
                        <Panel>
                            <FormRowLayout infoLabel={props.t("Project image__description")} infoLabelFullHeight={true}>
                            <FileUpload 
                                id="image"
                                label={props.t("Project image")}
                                snackbar={props.snackbar} 
                                accept={'image/jpeg, image/png, image/gif'}
                                text='Try dropping some files here, or click to select files to upload. Only .jpg,
                                        .png and .gif type files will be accepted.'
                                countLimit={1}
                                value={props.values.image}
                                setFieldValue={props.setFieldValue}
                                filesAreImages={true}
                                />
                          </FormRowLayout>
                        </Panel>
                       
                        {/*props.values.channels && 
                        <Panel>
                         <FormRowLayout infoLabel={props.t("This project is visible on:__description")} infoLabelFullHeight={true}>
                            <SwitchInput
                              id="isVisible"
                              label={props.t("This project is visible on:")}
                              error={props.touched.isVisible && props.errors.isVisible}
                              value={props.values.isVisible}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                        </FormRowLayout>
                        <FormRowLayout infoLabel=''>
                          <CheckboxGroupInput
                          inline
                          id="channels"
                          //label={props.t("Channels")}
                          disabled={channels ? false : true}
                          error={props.touched.channels && props.errors.channels}
                          value={props.values.channels}
                          setFieldValue={props.setFieldValue}
                          options={channels ? channels:[]}
                        />
                 {channels ? null : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                        </FormRowLayout>
                        </Panel>
*/}


                         <Panel label={props.t("erasmus_plus")}>
                         <FormRowLayout infoLabel={props.t('This project is Erasmus+ funded__description')}>
                            <SwitchInput
                              id="isErasmusFunded"
                              label={props.t("This project is Erasmus+ funded")}
                              error={props.touched.isErasmusFunded && props.errors.isErasmusFunded}
                              value={props.values.isErasmusFunded}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                        </FormRowLayout>
                        <FormRowLayout infoLabel={props.t('Erasmus+ grant agreement number__description')}>
                          <TextInput
                            id="grantAgreementNumber"
                            type="text"
                            disabled={!props.values.isErasmusFunded}
                            label={props.t("Erasmus+ grant agreement number")}
                            error={props.touched.grantAgreementNumber && props.errors.grantAgreementNumber}
                            value={props.values.grantAgreementNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                        </Panel>
               
              
                
            </div>
          )} />
        );
    }
}
export const Basic = BasicForm;
