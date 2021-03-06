import React from 'react';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';
import Panel from '../../elements/Panel';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import {CheckboxInput} from '../../elements/FormElements/FormElements';
import ExportSettings from '../ExportElements/ExportSettings';
import {withExportProvider} from '../withExportProvider';
import PrintPage from '../ExportElements/PrintPage';


  
 

class Export2_listOfParticipants extends React.Component {
  

constructor(props) {
        super(props);
        
        this.state = {
            showConfirmation:true
          
        };
      
     
      
      }

  



  componentDidMount() {

  const listColumns = [
                                                    {id: 'lastName', columnLabel:'name', location: 'participant.lastname', joinBy:', ',visible:true, order:1, sortBySecondary:'desc'}, 
                                                    {id: 'firstName', columnLabel:'name', location:'participant.firstname', joinBy:', ',visible:true, order:2}, 
                                                    {id: 'birthDate', columnLabel:'Birth date', location:'participant.birthDate', isDate:true, visible:true, order:3},
                                                    {id: 'mail', columnLabel:'e-mail', location:'participant.mail',visible:true, order:4},
                                                    {id: 'address', columnLabel:'address', location:this.getAddress,visible:true, order:5},
                                                    {id: 'country', columnLabel:'Country of Residency', location:this.getCountry,visible:true, order:6, sortBy:'asc'},
                                                    {id: 'participantRole', columnLabel:'Role', location:'participantRole',visible:true, order:7},
                                                    {id: 'sendingOrganisation', columnLabel:'Sending organisation', location:'sendingOrganisation.title',visible:true, order:8},
                                                    {id: 'dateFrom', columnLabel:'date_plural', location:'dateFrom', joinBy:'-',visible:true, isDate:true, order:9},
                                                    {id: 'dateTo', columnLabel:'date_plural', location:'dateTo', joinBy:'-', isDate:true,visible:true, order:10},
                                                    {id: 'travels', columnLabel:'travel_plural', location:this.getTravels,visible:true, order:11},
                                                    {id: 'signature', columnLabel:'signature',visible:true, width:200 ,order:12}

                                              ];


  const initialValues_Header = [
              {
                id:'title', 
                label: 'Title',
                value:this.props.data.title || undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'subtitle', 
                label: 'Subtitle',
                value:this.props.data.subtitle || undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'grantAgreementNumber', 
                label: 'Erasmus+ grant agreement number',
                value:this.props.data.erasmusGrantAgreementNumber || undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'hostOrganisation', 
                label: 'host_organisation',
                value:this.props.data.organisations.filter((org)=>{return org.isHost === true})[0] ? this.props.data.organisations.filter((org)=>{return org.isHost === true})[0].title : undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'dateFrom', 
                label: 'from_time',
                value:this.props.data.dateFrom || undefined,
                type:'DateInput',
                visible:true
              },
              {
                id:'dateTo', 
                label: 'to_time',
                value:this.props.data.dateTo || undefined,
                type:'DateInput',
                visible:true
              },
              {
                id:'places', 
                label: 'place_plural',
                value: this.props.data.places ? this.props.data.places.map((place)=>{return place && place.name}).join(', ') : undefined,
                type:'TextInput',
                visible:true
              }
              




              ];

  this.props.setData({listColumns:listColumns, data:this.props.filterApproved(this.props.data.mobilities)});
  this.props.updateList(initialValues_Header,true);
        //const stays = this.getStays(placeID);
        //this.props.updateList(stays,getStayDates(stays));
      }




getTravels = (mobility) => {
 
  

  if(mobility.fromCityPlace || mobility.toCityPlace){
    return (mobility.fromCityPlace ? mobility.fromCityPlace : '') + ' - ' +(mobility.toCityPlace ? mobility.toCityPlace : '');
  }
  
  return '';
}

getAddress = (mobility) => {
  var address = '';
  if(mobility && mobility.participant){
    if(mobility.participant.street){
      address += mobility.participant.street+', ';
    }
    if(mobility.participant.street){
      address += mobility.participant.postcode+' ';
    }
    if(mobility.participant.town){
      address += mobility.participant.town+' ';
    }
    return address;
  }
  

  
}

getCountry = (mobility) => {

   return this.props.t(mobility.participant.country);
  
}



handleChange_Confirmation=(e)=>{
this.setState({showConfirmation:e.target.checked});
}


 
 

  
  render() {
    
     const {t, dataList, fields_Header, columnVisibility, csvData, hasIndex, handleRequestSort, order, orderBy} = this.props;
     const {showConfirmation} = this.state;
     

     var confirmation = null;
     if(showConfirmation){
      confirmation=(<div>
                                     
                                     <br/>
                                     {t("i_confirm_participation")} 
                                     
                                     <br/>
                                     <br/>
                                     {t('name')+':'}
                                     <br/>
                                     <br/>
                                     {t("place_and_date")+':'} 
                                     <br />
                                     <br/>
                                     {t("signature")+':'} 
                                      <br/>
                                     
                                     <br/>
                                     <br/>
                                    </div>);
     }
     

     var title = '';
     if(fields_Header){
        title = fields_Header.find(it => it.id === 'title' && it.visible === true);
      }
    const admitUser = (this.props.readOnly === true) ? false : true;
    return (

      admitUser ? 
      <div>
     


    <ExportSettings
        t={t} 
        handleReset={this.props.handleReset}
        handleChange_Header={this.props.handleChange_Header}
        fields_Header={fields_Header}
        handleChange_List={this.props.handleChange_List}
        columnVisibility={columnVisibility}
        hr={false}
      />

      <div className="ongeaAct__exports_settings">
          <Panel label={t("Confirmation")}>
                      <FormRowLayout infoLabel=''>
                        <CheckboxInput
                                      id={'confirmation'}
                                      label={t('confirmation_checkbox')}
                                      value={'confirmation'}
                                      onChange={this.handleChange_Confirmation}
                                      checked={this.state.showConfirmation}
                                     
                                    />
                        </FormRowLayout>
                   
          </Panel>
        <hr/>
      </div>
      
      <DownloadAndPrint
        t={t} 
        dataCSV={csvData && csvData.data && csvData.data.length > 0 ? csvData.data : undefined}
        headersCSV = {csvData && csvData.headers && csvData.headers.length > 0 ? csvData.headers : undefined}
        csvFilename={(title ? (title.value+'__signature_list') : 'signature_list')+'.csv' }
        printSectionRef={this.componentRef}
      />

      <PrintPage 
                  ref={el => (this.componentRef = el)}
                  t={t}
                  fields_Header={fields_Header}
                  dataList={dataList}
                  hasIndex={hasIndex}
                  isIterated={false}
                  commentHeader={confirmation}
                  commentFooter={''}
                  handleRequestSort = {handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
      </div>
      :
      <div class="ongeaAct__exports_noAdmittance">{t('no_admittance')}</div>
      
    );
  }
}


export default withExportProvider(Export2_listOfParticipants);
