import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import { TextInput, NumberInput,CountryInput,SwitchInput,CurrencyInput } from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
//import GooglePlaces from '../../elements/FormElements/GooglePlaces';
import Grid from '@material-ui/core/Grid';

export class BasicForm extends React.Component {
   constructor(props) {
    super(props);

    this.state = {
      data: this.props.data
                      
     };
  }

  static defaultProps = {
    contentType: ContentTypes.Places
  }
 
componentDidMount() {

    if((this.props.match && this.props.match.params.id === "new") || (this.props.isReference && this.props.referenceId === "new")){

      this.setInitialValues();

    }

  }
   
  setInitialValues = () => {

        
              var data = {
                name:null,
                description:null,
                longitude:null,
                latitude:null,
                street:null,
                postcode:null,
                town:null,
                country:null,
                requiresKeyDeposit:false,
                keyDeposit:null,
                keyDepositCurrency:null
              };
              
              this.setState({data});
      }


  render() {
    const {data, ...props} = this.props;
    return (
        <EditView data={this.state.data} {...props} render={(props) => (

            <div>
                  {/*<Panel>
                                      <GooglePlaces
                                       {...props}
                                       onChange={props.handleChange}
                                       onPlaceSelected={ (place) => {
                                          
                              props.setFieldValue('name',place.name,true);
                              props.setFieldValue('description',place.description,true);
                              props.setFieldValue('latitude',place.lat,true);
                              props.setFieldValue('longitude',place.lng,true);
                              props.setFieldValue('street',(place.route)?place.route+(place.street_number || ''):'',true);
                              props.setFieldValue('postcode',place.postal_code || '',true);
                              props.setFieldValue('town',place.locality,true);
                              props.setFieldValue('country',place.country,true);
                        
                                       } }  />
                                    </Panel>*/}
                 <Panel label={props.t("place")}>
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="name"
                            type="text"
                            label={props.t("Place Name")}
                            error={props.touched.name && props.errors.name}
                            value={props.values.name || ''}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                       
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="description"
                            type="text"
                            label={props.t("Description")}
                            error={props.touched.description && props.errors.description}
                            value={props.values.description}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        
                  </Panel>

                  <Panel label={props.t("geolocation")}>
                        <FormRowLayout infoLabel=''>
                          <TextInput 
                            id="longitude"
                            type="text"
                            label={props.t("Longitude")}
                            error={props.touched.longitude && props.errors.longitude}
                            value={props.values.longitude}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="latitude"
                            type="text"
                            label={props.t("Latitude")}
                            error={props.touched.latitude && props.errors.latitude}
                            value={props.values.latitude}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        
                  </Panel>
                

                  <Panel label="Address">
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="street"
                            type="text"
                            label={props.t("Street")}
                            error={props.touched.street && props.errors.street}
                            value={props.values.street}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="postcode"
                            type="text"
                            label={props.t("Postcode")}
                            error={props.touched.postcode && props.errors.postcode}
                            value={props.values.postcode}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="town"
                            type="text"
                            label={props.t("Town")}
                            error={props.touched.town && props.errors.town}
                            value={props.values.town}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                         <FormRowLayout infoLabel=''>
                          <CountryInput
                                    id="country"
                                    type='text'
                                    label={props.t("Country")}
                                    error={props.touched.country && props.errors.country}
                                    value={props.values.country}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                        </FormRowLayout> 

                       

                        
                  </Panel>

                  <Panel label={props.t("key_deposit")}>
                        <FormRowLayout infoLabel={props.t("Place requires key deposit__description")}>
                          <SwitchInput
						        id="requiresKeyDeposit"
						        label={props.t("Place requires key deposit")}
						        error={props.touched.requiresKeyDeposit && props.errors.requiresKeyDeposit}
						        value={props.values.requiresKeyDeposit}
						        onChange={props.handleChange}
						        onBlur={props.handleBlur}
						      />
                        </FormRowLayout>
						            <FormRowLayout infoLabel=''>
	                        <Grid container spacing={24}>
	         					<Grid item xs={12} sm={6}>
			                        
			                          <NumberInput
			                            id="keyDeposit"
			                            disabled={!props.values.requiresKeyDeposit}
			                            type="text"
			                            label={props.t("Key deposit amount")}
			                            error={props.touched.keyDeposit && props.errors.keyDeposit}
			                            value={props.values.keyDeposit}
			                            onChange={props.handleChange}
			                            onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
			                          />
			                        
			                     </Grid>
			                     <Grid item xs={12} sm={6}>
			                       <CurrencyInput
        								        id="keyDepositCurrency"
        								        disabled={!props.values.requiresKeyDeposit}
        								        type='text'
        								        label={props.t("Currency")}
        								        placeholder="choose a currency"
        								        error={props.touched.keyDepositCurrency && props.errors.keyDepositCurrency}
        								        value={props.values.keyDepositCurrency}
        								        onChange={props.handleChange}
        								        onBlur={props.handleBlur}
        								      />
								 </Grid>
							</Grid>
						</FormRowLayout> 
                        
                  </Panel>




            </div>
          )} />
    )
  }
  
}

export const Basic = BasicForm;
