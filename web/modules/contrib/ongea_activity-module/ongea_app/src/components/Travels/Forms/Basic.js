import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import { TextInput, SelectInput, DateInput, TimeInput, CheckboxInput } from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import CircularProgress from '@material-ui/core/CircularProgress';


export class BasicForm extends React.Component {
   
 constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      chooseArrExistingPlace:null,
      chooseDepExistingPlace:null
                      
     };
  }
  

  static defaultProps = {
    contentType: ContentTypes.Travels,
    contentTypesForSelects:  [{contentType:ContentTypes.Places, additionalOptions:[{value:null,label:'none'}]}, {contentType:ContentTypes.Organisations}]
  }


componentDidMount() {

    if((this.props.match && this.props.match.params.id === "new") || (this.props.isReference && this.props.referenceId === "new")){

      this.setInitialValues();

    }

  }

  handleChangeLocation = (event, setFieldValue, setField) => {
    setFieldValue(setField,event.target.value);
    this.setState({[event.target.name]:event.target.value});
  }

  componentWillReceiveProps(newProps) {
      if(newProps.data && newProps.data !== this.props.data){
        this.setState({data:newProps.data});
      }
  }

  setInitialValues = () => {

        
              var data = {
                title:null,
                departureCustomLocation:null,
                
                departureDate:null,
                departureTime:null,
                //departureFromProject:false,
                arrivalCustomLocation:null,
               
                arrivalDate:null,
                arrivalTime:null,
                //arrivalToProject:false,
                informationForTravellers:null,
                requestPhotoOfTicket:false,
                assignToParticipants:false,
                assignToParticipantsOrganisation:null
              };
              
              this.setState({data});
      }


  render() {
    const {data, ...props} = this.props;
    
    
    return (
        <EditView data={this.state.data} {...props} render={(props,{organisations, places}) => (

            <div>
            
                  <Panel label={props.t("travel")}>
                    <FormRowLayout infoLabel={props.t('Travel Name__description')}>
                          <TextInput
                            id="title"
                            type="text"
                            label={props.t("Travel Name")}
                            error={props.touched.title && props.t(props.errors.title)}
                            value={props.values.title}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                        
                  </Panel>

                  <Panel label={props.t("from_place")}>
                    <FormRowLayout infoLabel={props.t('Enter location__description')}>
                          <TextInput
                            id="departureCustomLocation"
                            type="text"
                            label={props.t("Enter location")}
                            error={props.touched.departureCustomLocation && props.t(props.errors.departureCustomLocation)}
                            value={props.values.departureCustomLocation}
                            onChange={(event)=>{
                              this.setState({chooseDepExistingPlace:null});
                              props.handleChange(event);
                            }}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                        <FormRowLayout infoLabel={props.t('Or select place from the database__description')}>
                          <SelectInput
                                id="chooseDepExistingPlace"
                                type='text'
                                label={props.t("Or select place from the database")}
                                disabled={places ? false : true}
                                value={this.state.chooseDepExistingPlace}
                                onChange={(event)=>this.handleChangeLocation(event,props.setFieldValue,'departureCustomLocation')}
                                onBlur={()=>{}}
                                options={places ? places.map((place)=>({value:place.label,label:place.label})) : []}
                              />
                              {!places && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                      </FormRowLayout>

                       <FormRowLayout>
                            <DateInput
                              id="departureDate"
                              label={props.t("Departure date")}
                              error={props.touched.departureDate && props.t(props.errors.departureDate)}
                              value={props.values.departureDate}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                                    
                       </FormRowLayout> 
                       <FormRowLayout>
                            <TimeInput
                              id="departureTime"
                              label={props.t("Departure time")}
                              error={props.touched.departureTime && props.t(props.errors.departureTime)}
                              value={props.values.departureTime}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                                    
                       </FormRowLayout> 
                       {/*<FormRowLayout infoLabel={props.t("Departure from project__description")}>
                                              <CheckboxInput 
                                                       id="departureFromProject"
                                                       label={props.t("Departure from project")}
                                                       error={props.touched.departureFromProject && props.t(props.errors.departureFromProject)}
                                                       value={props.values.departureFromProject}
                                                       onChange={props.handleChange}
                                                       onBlur={props.handleBlur}
                                                     />
                                             </FormRowLayout> */}
                  </Panel>

                  <Panel label={props.t("to_place")}>
                    <FormRowLayout infoLabel={props.t('Enter location__description')}>
                          <TextInput
                            id="arrivalCustomLocation"
                            type="text"
                            label={props.t("Enter location")}
                            error={props.touched.arrivalCustomLocation && props.t(props.errors.arrivalCustomLocation)}
                            value={props.values.arrivalCustomLocation}
                            onChange={(event)=>{
                              this.setState({chooseArrExistingPlace:null});
                              props.handleChange(event);
                            }}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                        <FormRowLayout infoLabel={props.t('Or select place from the database__description')}>
                          <SelectInput
                                id="chooseArrExistingPlace"
                                type='text'
                                label={props.t("Or select place from the database")}
                                disabled={places ? false : true}
                                value={this.state.chooseArrExistingPlace}
                                onChange={(event)=>this.handleChangeLocation(event,props.setFieldValue,'arrivalCustomLocation')}
                                onBlur={()=>{}}
                                options={places ? places.map((place)=>({value:place.label,label:place.label})) : []}
                              />
                              {!places && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                      </FormRowLayout>

                       <FormRowLayout>
                            <DateInput
                              id="arrivalDate"
                              label={props.t("Arrival date")}
                              error={props.touched.arrivalDate && props.t(props.errors.arrivalDate)}
                              value={props.values.arrivalDate}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                                    
                       </FormRowLayout> 
                       <FormRowLayout>
                            <TimeInput
                              id="arrivalTime"
                              label={props.t("Arrival time")}
                              error={props.touched.arrivalTime && props.t(props.errors.arrivalTime)}
                              value={props.values.arrivalTime}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                                    
                       </FormRowLayout> 
                       {/*<FormRowLayout infoLabel={props.t("Arrival to project__description")}>
                                              <CheckboxInput 
                                                       id="arrivalToProject"
                                                       label={props.t("Arrival to project")}
                                                       error={props.touched.arrivalToProject && props.t(props.errors.arrivalToProject)}
                                                       value={props.values.arrivalToProject}
                                                       onChange={props.handleChange}
                                                       onBlur={props.handleBlur}
                                                     />
                                             </FormRowLayout> */}
                  </Panel>
                  <Panel>
                   <FormRowLayout infoLabel={props.t('Information for travellers__description')}>
                          <TextInput
                            id="informationForTravellers"
                            type="text"
                            multiline
                            rows={5}
                            label={props.t("Information for travellers")}
                            error={props.touched.informationForTravellers && props.t(props.errors.informationForTravellers)}
                            value={props.values.informationForTravellers}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                   {/* <FormRowLayout infoLabel={props.t("Request photo of ticket__description")}>
                                          <CheckboxInput 
                                                   id="requestPhotoOfTicket"
                                                   label={props.t("Request photo of ticket")}
                                                   error={props.touched.requestPhotoOfTicket && props.t(props.errors.requestPhotoOfTicket)}
                                                   value={props.values.requestPhotoOfTicket}
                                                   onChange={props.handleChange}
                                                   onBlur={props.handleBlur}
                                                 />
                                     </FormRowLayout> */}
                  </Panel>

              {/*this.props.parentOfReference === "activities" && 
                  <Panel>
                    <FormRowLayout infoLabel={props.t("Assign this travel to all participants sent to this activity by:__description")}>
                            <SwitchInput
                                  id="assignToParticipants"
                                  label={props.t("Assign this travel to all participants sent to this activity by:")}
                                  error={props.touched.assignToParticipants && props.t(props.errors.assignToParticipants)}
                                  value={props.values.assignToParticipants}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                />
                      </FormRowLayout>
                    <FormRowLayout infoLabel={''}>
                          <SelectInput
                                id="assignToParticipantsOrganisation"
                                type='text'
                                label={props.t("Organisation")}
                                disabled={organisations && props.values.assignToParticipants ? false : true}
                                error={props.touched.assignToParticipantsOrganisation && props.t(props.errors.assignToParticipantsOrganisation)}
                                value={props.values.assignToParticipantsOrganisation}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                options={organisations || []}
                              />
                              {!organisations && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                      </FormRowLayout>

                   </Panel>
                 */}
            </div>
          )} />
    )
  }
  
}

export const Basic = BasicForm;
