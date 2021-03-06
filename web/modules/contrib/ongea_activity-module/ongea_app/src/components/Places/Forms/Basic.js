import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import { TextInput, NumberInput,CountryInput,SwitchInput,CurrencyInput } from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
//import GooglePlaces from '../../elements/FormElements/GooglePlaces';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MapsIcon from '@material-ui/icons/Adjust';

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

  componentWillReceiveProps(newProps) {
      if(newProps.data && newProps.data !== this.props.data){
        this.setState({data:newProps.data});
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


  renderGoogleLink=(values,t)=>{
    var link = 'https://www.google.com/maps/search/?api=1&query=';

    var encodedValues = {};
    encodedValues.street = values.street ? values.street : '';
    encodedValues.code = values.postcode ? values.postcode : '';
    encodedValues.town = values.town ? values.town : '';
    encodedValues.country = values.country ? t(values.country) : '';

    for(var key in encodedValues){
      if(encodedValues[key]){
        link += encodedValues[key]+'%2C';
      }
    }

    link = link.slice(0,-3);

    return link;
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
                            error={props.touched.name && props.t(props.errors.name)}
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
                            error={props.touched.description && props.t(props.errors.description)}
                            value={props.values.description}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        
                  </Panel>


                

                  <Panel label={props.t("address")}>
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="street"
                            type="text"
                            label={props.t("ongea_activity_place_street")}
                            error={props.touched.street && props.t(props.errors.street)}
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
                            error={props.touched.postcode && props.t(props.errors.postcode)}
                            value={props.values.postcode}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="town"
                            type="text"
                            label={props.t("ongea_activity_place_town")}
                            error={props.touched.town && props.t(props.errors.town)}
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
                                    error={props.touched.country && props.t(props.errors.country)}
                                    value={props.values.country}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                        </FormRowLayout> 
                        
                  </Panel>

                  <Panel label={props.t("geolocation")}>
                        

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="latitude"
                            type="text"
                            label={props.t("Latitude")}
                            error={props.touched.latitude && props.t(props.errors.latitude)}
                            value={props.values.latitude}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 
                        <FormRowLayout infoLabel=''>
                          <TextInput 
                            id="longitude"
                            type="text"
                            label={props.t("Longitude")}
                            error={props.touched.longitude && props.t(props.errors.longitude)}
                            value={props.values.longitude}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout>
                          <div className="ongeaAct__placesForm-googleMapsLink">
                            <a href={this.renderGoogleLink(props.values, props.t)} target="_blank">
                            {props.t('go_to_maps')}
                            <IconButton aria-label="Google Maps">
                                 <MapsIcon />
                            </IconButton>
                            </a>
                          </div>
                        </FormRowLayout>
                        
                  </Panel>

                  <Panel label={props.t("key_deposit")}>
                        <FormRowLayout infoLabel={props.t("Place requires key deposit__description")}>
                          <SwitchInput
						        id="requiresKeyDeposit"
						        label={props.t("Place requires key deposit")}
						        error={props.touched.requiresKeyDeposit && props.t(props.errors.requiresKeyDeposit)}
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
			                            error={props.touched.keyDeposit && props.t(props.errors.keyDeposit)}
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
        								        error={props.touched.keyDepositCurrency && props.t(props.errors.keyDepositCurrency)}
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
