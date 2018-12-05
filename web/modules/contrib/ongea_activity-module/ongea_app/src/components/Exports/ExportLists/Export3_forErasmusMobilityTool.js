import React from 'react';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';
import {withExportProvider} from '../withExportProvider';
import ExportSettings from '../ExportElements/ExportSettings';
import PrintPage from '../ExportElements/PrintPage';






class Export3_forErasmusMobilityTool extends React.Component {
  


  componentDidMount() {

  const listColumns = [
                                                    {id: 'erasmusGrantAgreementNumber', columnLabel:'Grant Agreement No.', value: this.props.data.erasmusGrantAgreementNumber,visible:true, order:1}, 
                                                    {id: 'erasmusActivityNumber', columnLabel:'Activity No.', value:this.props.data.erasmusActivityNumber,visible:true, order:2}, 
                                                    {id: 'erasmusActivityType', columnLabel:'Activity Type', value:this.props.data.erasmusActivityType, visible:true, order:3},
                                                    {id: 'longTermActivity', columnLabel:'Long-term Activity', value:(this.props.data.longTermActivity ? 'Yes' : 'No') ,visible:true, order:4},
                                                    {id: 'participantId', columnLabel:'Participant Id', location:'',visible:true, order:5}, 
                                                    {id: 'firstName', columnLabel:'First Name', location:'participant.firstname',visible:true, order:6},
                                                    {id: 'lastName', columnLabel:'Last Name', location:'participant.lastname',visible:true, order:7, sortBy:'asc'},
                                                    {id: 'birthDate', columnLabel:'Participant Date of Birth', location:'participant.birthDate',visible:true, isDate:true, order:8},
                                                    {id: 'gender', columnLabel:'Participant Gender', location:'participant.gender',visible:true, order:9},
                                                    {id: 'email', columnLabel:'Participant Email', location:'participant.email',visible:true, order:10},
                                                    {id: 'nationality', columnLabel:'Nationality', location:this.getCountryCode,visible:true, order:11},
                                                    {id: 'accompanyingPerson', columnLabel:'Accompanying Person', location:'participant.accompanyingPerson',visible:true, order:12},
                                                    {id: 'groupLeader', columnLabel:'Group Leader / Trainer / Facilitator', location:'groupLeader',visible:true, order:14},
                                                    {id: 'participantSpecial', columnLabel:'Participant With Special Needs', location:'participantSpecial',visible:true, order:15},
                                                    {id: 'participantWithFewerOppurtunities', columnLabel:'Participant With Fewer Opportunities', location:'participantWithFewerOppurtunities',visible:true, isBoolean:true, order:16},
                                                    {id: 'europeanSolidaryCorpseVolunteer', columnLabel:'European Solidarity Corps volunteer',visible:true, order:17},
                                                    {id: 'europeanSolidaryCorpseID', columnLabel:'European Solidarity Corps ID Nr',visible:true, order:18},
                                                    {id: 'groupOfParticipants', columnLabel:'Participant Group', location:'groupOfParticipants',visible:true, order:19},
                                                    {id: 'mobilityId', columnLabel:'Mobility ID', location:'mobilityId',visible:true, order:20},
                                                    {id: 'sendingOrganisationId', columnLabel:'Sending Organisation ID', location:'sendingOrganisationId',visible:true, order:21},
                                                    {id: 'sendingOrgPiccode', columnLabel:'Sending Organisation PIC', location:'sendingOrganisation.piccode',visible:true, order:22},
                                                    {id: 'sendingOrgLegalName', columnLabel:'Sending Organisation Legal Name',visible:true, order:23},
                                                    {id: 'sendingOrgBusinessName', columnLabel:'Sending Organisation Business Name',visible:true, order:24},
                                                    {id: 'sendingOrgName', columnLabel:'Sending Organisation Full Legal Name (National Language)',visible:true, order:25},
                                                    {id: 'acronym', columnLabel:'Sending Organisation Acronym', location:'sendingOrganisation.acronym',visible:true, order:26},
                                                    {id: 'sendingOrganisationNationalID', columnLabel:'Sending Organisation National ID (if applicable)',visible:true, order:27},
                                                    {id: 'sendingOrgDepartment', columnLabel:'Sending Organisation Department',visible:true, order:28},
                                                    {id: 'sendingOrgType', columnLabel:'Sending Organisation Type',visible:true, order:29},
                                                    {id: 'sendingOrgPublicBody', columnLabel:'Sending Organisation Public Body',visible:true, order:30},
                                                    {id: 'sendingOrgNonProfit', columnLabel:'Sending Organisation Non-Profit',visible:true, order:31},
                                                    {id: 'sendingOrgBelow250', columnLabel:'Sending Organisation number of employees below 250',visible:true, order:32},
                                                    {id: 'sendingOrgLegalAddress', columnLabel:'Sending Organisation Legal Address',visible:true, order:33},
                                                    {id: 'sendingOrgVAT', columnLabel:'Sending Organisation VAT',visible:true, order:34},
                                                    {id: 'sendingOrgCountry', columnLabel:'Sending Organisation Country',visible:true, order:35},
                                                    {id: 'sendingOrgRegion', columnLabel:'Sending Organisation Region',visible:true, order:36},
                                                    {id: 'sendingOrgPO', columnLabel:'Sending Organisation P.O. Box',visible:true, order:37},
                                                    {id: 'sendingOrgPostcode', columnLabel:'Sending Organisation Post Code',visible:true, order:38},
                                                    {id: 'sendingOrgCEDEX', columnLabel:'Sending Organisation CEDEX',visible:true, order:39},
                                                    {id: 'sendingOrgCity', columnLabel:'Sending Organisation City',visible:true, order:40},
                                                    {id: 'sendingOrgEmail', columnLabel:'Sending Organisation Email',visible:true, order:41},
                                                    {id: 'sendingOrgWebsite', columnLabel:'Sending Organisation Website',visible:true, order:42},
                                                    {id: 'sendingOrgTel1', columnLabel:'Sending Organisation Telephone 1',visible:true, order:43},
                                                    {id: 'sendingOrgTel2', columnLabel:'Sending Organisation Telephone 2',visible:true, order:44},
                                                    {id: 'sendingOrgFax', columnLabel:'Sending Organisation Fax',visible:true, order:45},
                                                    {id: 'hostOrganisationId', columnLabel:'Receiving Organisation ID', location:'hostOrganisationId', visible:true, order:46},
                                                    {id: 'hostOrgPiccode', columnLabel:'Receiving Organisation PIC', value: this.props.data.project.organisations && this.props.data.project.organisations.find((it)=>it.isHost===true) ? this.props.data.project.organisations.find((it)=>it.isHost===true).piccode : '', visible:true, order:47},
                                                    {id: 'hostOrganisationLegalName', columnLabel:'Receiving Organisation Legal Name', visible:true, order:48},
                                                    {id: 'hostOrganisationBusinessName', columnLabel:'Receiving Organisation Business Name', visible:true, order:49},
                                                    {id: 'hostOrganisationFullLegalName', columnLabel:'Receiving Organisation Full Legal Name (National Language)', visible:true, order:50},
                                                    {id: 'hostOrganisationAcronym', columnLabel:'Receiving Organisation Acronym', value:this.props.data.project.organisations && this.props.data.project.organisations.find((it)=>it.isHost===true) ? this.props.data.project.organisations.find((it)=>it.isHost===true).acronym : '', visible:true, order:51},
                                                    {id: 'hostOrganisationNationalId', columnLabel:'Receiving Organisation National ID (if applicable)', visible:true, order:52},
                                                    {id: 'hostOrganisationDepartment', columnLabel:'Receiving Organisation Department', visible:true, order:53},
                                                    {id: 'hostOrganisationType', columnLabel:'Receiving Organisation Type', visible:true, order:54},
                                                    {id: 'hostOrganisationPublicBody', columnLabel:'Receiving Organisation Public Body', visible:true, order:55},
                                                    {id: 'hostOrganisationNonProfit', columnLabel:'Receiving Organisation Non-Profit', visible:true, order:56},
                                                    {id: 'hostOrganisationBelow250', columnLabel:'Receiving Organisation number of employees below 250', visible:true, order:57},
                                                    {id: 'hostOrganisationLegalAddress', columnLabel:'Receiving Organisation Legal Address', visible:true, order:58},
                                                    {id: 'hostOrganisationVAT', columnLabel:'Receiving Organisation VAT', visible:true, order:58},
                                                    {id: 'hostOrganisationCountry', columnLabel:'Receiving Organisation Country', visible:true, order:58},
                                                    {id: 'hostOrganisationRegion', columnLabel:'Receiving Organisation Region', visible:true, order:58},
                                                    {id: 'hostOrganisationPO', columnLabel:'Receiving Organisation P.O. Box', visible:true, order:58},
                                                    {id: 'hostOrganisationPostcode', columnLabel:'Receiving Organisation Post Code', visible:true, order:58},
                                                    {id: 'hostOrganisationCEDEX', columnLabel:'Receiving Organisation CEDEX', visible:true, order:58},
                                                    {id: 'hostOrganisationCity', columnLabel:'Receiving Organisation City', visible:true, order:58},
                                                    {id: 'hostOrganisationEmail', columnLabel:'Receiving Organisation Email', visible:true, order:58},
                                                    {id: 'hostOrganisationWebsite', columnLabel:'Receiving Organisation Website', visible:true, order:58},
                                                    {id: 'hostOrganisationTel1', columnLabel:'Receiving Organisation Telephone 1', visible:true, order:58},
                                                    {id: 'hostOrganisationTel2', columnLabel:'Receiving Organisation Telephone 2', visible:true, order:59},
                                                    {id: 'hostOrganisationFax', columnLabel:'Receiving Organisation Fax', visible:true, order:58},
                                                    {id: 'fromCountry', columnLabel:'Sending Country', location:this.getCountryCode,visible:true, order:59},
                                                    {id: 'fromCityPlace', columnLabel:'Sending City', location:'fromCityPlace',visible:true, order:60},
                                                    {id: 'toCountry', columnLabel:'Receiving Country', location:this.getCountryCode,visible:true, order:61},
                                                    {id: 'toCityPlace', columnLabel:'Receiving City', location:'toCityPlace',visible:true, order:62},
                                                    {id: 'distanceBand', columnLabel:'Distance Band', location:this.convertDistanceBand,visible:true, order:63},
                                                    {id: 'euTravelGrant', columnLabel:'EU Travel Grant',visible:true, order:64},
                                                    {id: 'expensiveDomesticTravels', columnLabel:'No. of Expensive Domestic Travels', visible:true, order:65},
                                                    {id: 'expensiveDomesticTravelsTopup', columnLabel:'Top-up for "Expensive Domestic Travel Cost"',visible:true, order:66},
                                                    {id: 'expensiveDomesticTravelsTopupTotal', columnLabel:'Total Top-up for "Expensive Domestic Travel Cost"', visible:true, order:67},
                                                    {id: 'expensiveDomesticTravelsDescription', columnLabel:'Expensive Domestic Travel Cost Description', visible:true, order:68},
                                                    {id: 'euGrantTotal', columnLabel:'Total EU Travel Grant',visible:true, order:69},
                                                    {id: 'euTravelGrantNotRequired', columnLabel:'Total EU Travel Grant - Grant Not Required', location:'euTravelGrantNotRequired',visible:true, order:70},
                                                    {id: 'commentsOnDifferentLocations', columnLabel:'Comments on different location than sending/receiving organisations',location:'whenTravellingTo', visible:true, order:71},
                                                    {id: 'mainWorkingLanguage', columnLabel:'Main Instruction/Work/Volunteering Language', value:this.getLanguages(this.props.data.mainWorkingLanguage), visible:true, order:72},
                                                    {id: 'nativeSpeaker', columnLabel:'Native Speaker Or Duly Justified Exception', visible:true, order:73},
                                                    {id: 'linguisticPreparation', columnLabel:'Linguistic Preparation',visible:true, order:74},
                                                    {id: 'linguisticPreparationGrant', columnLabel:'Linguistic Preparation Grant',visible:true, order:75},
                                                    {id: 'linguisticPreparationGrantNotRequired', columnLabel:'Linguistic Preparation Grant - Grant Not Required',visible:true, order:76},
                                                    {id: 'otherUserLanguage1', columnLabel:'Other Used Language 1',visible:true, order:77},
                                                    {id: 'otherUserLanguage2', columnLabel:'Other Used Language 2',visible:true, order:78},
                                                    {id: 'otherUserLanguage3', columnLabel:'Other Used Language 3',visible:true, order:79},
                                                    {id: 'dateFrom', columnLabel:'Start Date', value:this.props.data.dateFrom,visible:true, order:80},
                                                    {id: 'dateTo', columnLabel:'End Date', value:this.props.data.dateTo, visible:true, order:81},
                                                    {id: 'durationCalcDays', columnLabel:'Duration Calculated (days)',visible:true, order:82},
                                                    {id: 'inCaseOfInterruption', columnLabel:'Interruption Duration (days)', location:'inCaseOfInterruption',visible:true, order:83},
                                                    {id: 'durationMobility', columnLabel:'Duration of Mobility Period (days)', visible:true, order:84},
                                                    {id: 'howManyDaysCount', columnLabel:'Travel Days (max. 2)', location:'howManyDaysCount',visible:true, order:85},
                                                    {id: 'howManyDaysWithoutFunding', columnLabel:'Non-Funded Duration (days)', location:'howManyDaysWithoutFunding',visible:true, order:86},
                                                    {id: 'fundedDuration', columnLabel:'Funded Duration (days)',visible:true, order:87},
                                                    {id: 'euIndividualSupport', columnLabel:'EU Individual Support',visible:true, order:88},
                                                    {id: 'euIndividualSupportGrantNotRequired', columnLabel:'EU Individual Support - Grant Not Required', location:'euIndividualSupportGrantNotRequired',visible:true, order:89},
                                                    {id: 'organisationalSupportGrandPerDay', columnLabel:'Organisational Support Grant/Day',visible:true, order:90},
                                                    {id: 'organisationalSupport', columnLabel:'Organisational Support', visible:true, order:91},
                                                    {id: 'euOrganisationalSupportGrantNotRequired', columnLabel:'Organisational Support - Grant Not Required', location:'euOrganisationalSupportGrantNotRequired',visible:true, order:92},
                                                    {id: 'euGrantSpecial', columnLabel:'EU Special Needs Support', location:'euGrantSpecial',visible:true, order:93},
                                                    {id: 'euGrantSpecialComments', columnLabel:'EU Special Needs Support Comments',visible:true, order:94},
                                                    {id: 'exceptionalCosts', columnLabel:'Exceptional Costs', location:'exceptionalCosts',visible:true, order:95},
                                                    {id: 'exceptionalCostsComments', columnLabel:'Exceptional Costs Comments',visible:true, order:96},
                                                    {id: 'participantCouldntStay', columnLabel:'Force Majeure ?', location:'participantCouldntStay',visible:true, order:97},
                                                    {id: 'explanationCase', columnLabel:'Force Majeure Explanations', location:'explanationCase',visible:true, order:98},
                                                    {id: 'euMobilityTotalGrantCalc', columnLabel:'EU Mobility Total Grant Calculated',visible:true, order:99},
                                                    {id: 'certifyingId1', columnLabel:'Certifying Organisation ID 1',visible:true, order:100},
                                                    {id: 'recognitionSystem1', columnLabel:'Recognition System 1',visible:true, order:101},
                                                    {id: 'certifyingId2', columnLabel:'Certifying Organisation ID 2',visible:true, order:102},
                                                    {id: 'certificationType2', columnLabel:'Certification Type 2',visible:true, order:103},
                                                    {id: 'certifyingOrganisationId3', columnLabel:'Certifying Organisation ID 3',visible:true, order:104},
                                                    {id: 'certificationType3', columnLabel:'Certification Type 3',visible:true, order:105},
                                                    {id: 'overallComments', columnLabel:'Overall Comments',visible:true, order:106},
                                                    {id: 'participantReportRequestedOn', columnLabel:'Participant Report Requested On',visible:true, order:107},
                                                    {id: 'participantReportReceivedOn', columnLabel:'Participant Report Received On',visible:true, order:108},
                                                    {id: 'draftMobility', columnLabel:'Draft Mobility',value:'No',visible:true, order:109}


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
                value:undefined,
                type:'TextInput',
                visible:false
              }
              ];

  this.props.setData({listColumns:listColumns, data:this.props.filterApproved(this.props.data.mobilities)});
  this.props.updateList(initialValues_Header,true);
        //const stays = this.getStays(placeID);
        //this.props.updateList(stays,getStayDates(stays));
      }


getLanguages = (value) =>{

  if(value && value.length>0){
    return value.join(', ');
  }else{
    return '';
  }

}


convertDistanceBand(mobility,columnId){
  var distanceBand = mobility[columnId];
  
  if(distanceBand){
    distanceBand = distanceBand.substring(0,7);
  }
  
  return distanceBand;

}

getCountryCode(mobility,columnId){
console.log('columnId',columnId);

var countryCode = '';
if(columnId === 'nationality'){
    countryCode = mobility.participant[columnId];
}else{
    countryCode = mobility[columnId];
}

  

  switch(countryCode) {
    case 'GR':
        return 'EL';
    case 'GB':
        return 'UK';
    default:
        return countryCode;
  }

}


  
  render() {
     console.log('PROS',this.props);
     const {t, dataList, fields_Header, csvData, hasIndex,handleRequestSort, order, orderBy} = this.props;
     
    

     var title = '';
     //console.log('datalist',dataList);
     if(fields_Header){
        title = fields_Header.find(it => it.id === 'title' && it.visible === true);
      }

    return (
      <div>
      


    <ExportSettings
        t={t} 
        handleReset={this.props.handleReset}
        handleChange_Header={this.props.handleChange_Header}
        fields_Header={fields_Header}
        handleChange_List={this.props.handleChange_List}
        
      />

       <DownloadAndPrint 
        t={t}
        dataCSV={csvData && csvData.data && csvData.data.length > 0 ? csvData.data : undefined}
        headersCSV = {csvData && csvData.headers && csvData.headers.length > 0 ? csvData.headers : undefined}
        csvFilename={(title ? (title.value) : 'unknown')+'.csv' }
        print={false}
      />

      <PrintPage 
                 t={t}
                  fields_Header={fields_Header}
                  dataList={dataList}
                  hasIndex={hasIndex}
                  isIterated={false}
                  commentHeader={''}
                  commentFooter={''}
                  handleRequestSort = {handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
      </div>
    );
  }
}


export default withExportProvider(Export3_forErasmusMobilityTool);
