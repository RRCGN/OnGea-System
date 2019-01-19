import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import {TextInput, CountryInput, TelephoneInput} from '../../elements/FormElements/FormElements';
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
    contentType: ContentTypes.Organisations
  }


  componentDidMount() {

    if((this.props.match && this.props.match.params.id === "new") || (this.props.isReference && this.props.referenceId === "new")){

      this.setInitialValues();

    }

  }

  componentWillReceiveProps(newProps) {
      if(newProps.data && newProps.data !== this.props.data){
        this.setState({data:newProps.data});
      }
  }
  
  setInitialValues = () => {

        
              var data = {
                  title:null,
                  acronym:null,
                  mail:null,
                  website:null,
                  street:null,
                  postcode:null,
                  town:null,
                  country:null,
                  phone:null,
                  aboutUs:null,
                  logo:null,
                  image:null,
                  piccode:null
              };
              
              this.setState({data});
      }

  

    render() {

      const {data, ...props} = this.props;
      const readOnly = this.props.readOnly;
       return (
           <EditView data={this.state.data} {...props} render={(props) => (

            <div>

                     <Panel label={props.t("Organisation")}>
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="title"
                            disabled={readOnly}
                            type="text"
                            label={props.t("Organisation name")}
                            error={props.touched.title && props.t(props.errors.title)}
                            value={props.values.title}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="acronym"
                            disabled={readOnly}
                            type="text"
                            label={props.t("Acronym")}
                            error={props.touched.acronym && props.t(props.errors.acronym)}
                            value={props.values.acronym}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="mail"
                            disabled={readOnly}
                            type="text"
                            label={props.t("E-mail address")}
                            error={props.touched.mail && props.t(props.errors.mail)}
                            value={props.values.mail}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                         <FormRowLayout infoLabel=''>
                          <TextInput
                            
                            id="website"
                            disabled={readOnly}
                            type="text"
                            label={props.t("Website")}
                            error={props.touched.website && props.t(props.errors.website)}
                            value={props.values.website}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                  </Panel>

                

                  <Panel label={props.t("address")}>
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            
                            id="street"
                            disabled={readOnly}
                            type="text"
                            label={props.t("Street address")}
                            error={props.touched.street && props.t(props.errors.street)}
                            value={props.values.street}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="postcode"
                            disabled={readOnly}
                            type="text"
                            label={props.t("Postcode")}
                            error={props.touched.postcode && props.t(props.errors.postcode)}
                            value={props.values.postcode}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="town"
                            disabled={readOnly}
                            type="text"
                            label={props.t("City")}
                            error={props.touched.town && props.t(props.errors.town)}
                            value={props.values.town}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                         <FormRowLayout infoLabel=''>
                          <CountryInput
                                    id="country"
                                    disabled={readOnly}
                                    type='text'
                                    label={props.t("Country")}
                                    error={props.touched.country && props.t(props.errors.country)}
                                    value={props.values.country}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                        </FormRowLayout> 

                         <FormRowLayout infoLabel=''>
                          <TelephoneInput
                            id="phone"
                            disabled={readOnly}
                            type="text"
                            label={props.t("Phone")}
                            error={props.touched.phone && props.t(props.errors.phone)}
                            value={props.values.phone}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            setFieldValue={props.setFieldValue}
                          />
                        </FormRowLayout> 

                        
                  </Panel>
                  <Panel label={props.t("About us")}>

                     <FormRowLayout>
                              <TextInput
                                id="aboutUs"
                                disabled={readOnly}
                                type="text"
                                label={props.t("About us")}
                                multiline
                                rows={7}
                                error={props.touched.aboutUs && props.t(props.errors.aboutUs)}
                                value={props.values.aboutUs}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                    </FormRowLayout>
                  </Panel>
                  <Panel label={props.t("logo")}>
                    <FormRowLayout>
                            <FileUpload 
                                id="logo"
                                disabled={readOnly}
                                label={props.t("logo")}
                                snackbar={props.snackbar} 
                                accept={'image/jpeg, image/png, image/gif'}
                                text={props.t('try_dropping_files')}
                                countLimit={1}
                                value={props.values.logo}
                                setFieldValue={props.setFieldValue}
                                filesAreImages={true}
                                />
                    </FormRowLayout>
                  </Panel>
                  <Panel label={props.t("image")}>
                    <FormRowLayout>
                            <FileUpload 
                                id="image"
                                disabled={readOnly}
                                label={props.t("image")}
                                snackbar={props.snackbar} 
                                accept={'image/jpeg, image/png, image/gif'}
                                text={props.t('try_dropping_files')}
                                countLimit={1}
                                value={props.values.image}
                                setFieldValue={props.setFieldValue}
                                filesAreImages={true}
                                />
                    </FormRowLayout>
                    </Panel>
                   <Panel label={props.t("specific_information_erasmus")}>
                        <FormRowLayout>
                          <TextInput
                            id="piccode"
                            disabled={readOnly}
                            type="text"
                            label={props.t("PIC code")}
                            error={props.touched.piccode && props.t(props.errors.piccode)}
                            value={props.values.piccode}
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
