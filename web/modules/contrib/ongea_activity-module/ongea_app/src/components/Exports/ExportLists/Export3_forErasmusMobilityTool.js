import React from 'react';
import Header from '../ExportElements/Header';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';
import Footer from '../ExportElements/Footer';
import List from '../ExportElements/List';
import HeaderInputField from '../ExportElements/HeaderInputField';
import Panel from '../../elements/Panel';
import Grid from '@material-ui/core/Grid';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import { ContentTypes } from '../../../config/content_types';
import {CheckboxInput} from '../../elements/FormElements/FormElements';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';






class Export3_forErasmusMobilityTool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
      fields_Header: [
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
              




              ],
        initialValues_Header:[],
        dataList:[],
        columnVisibility:[],
        listColumns:[
                                                    {id: 'erasmusGrantAgreementNumber', columnLabel:'Grant Agreement No.', value: this.props.data.erasmusGrantAgreementNumber,visible:true, order:1}, 
                                                    {id: 'erasmusActivityNumber', columnLabel:'Activity No.', value:this.props.data.erasmusActivityNumber,visible:true, order:2}, 
                                                    {id: 'erasmusActivityType', columnLabel:'Activity Type', value:this.props.data.erasmusActivityType, visible:true, order:3},
                                                    {id: 'longTermActivity', columnLabel:'Long-term Activity', value:(this.props.data.longTermActivity ? 'YES' : 'NO') ,visible:true, order:4},
                                                    {id: 'participantId', columnLabel:'Participant Id', location:'',visible:true, order:5},
                                                    {id: 'firstName', columnLabel:'First Name', location:'participant.firstName',visible:true, order:6},
                                                    {id: 'lastName', columnLabel:'Last Name', location:'participant.lastName',visible:true, order:7},
                                                    {id: 'birthDate', columnLabel:'Participant Date of Birth', location:'participant.birthDate',visible:true, isDate:true, order:8},
                                                    {id: 'gender', columnLabel:'Participant Gender', location:'participant.gender',visible:true, order:9},
                                                    {id: 'email', columnLabel:'Participant Email', location:'participant.email',visible:true, order:10},
                                                    {id: 'nationality', columnLabel:'Nationality', location:'participant.nationality',visible:true, order:11},
                                                    {id: 'accompanyingPerson', columnLabel:'Accompanying Person', location:'participant.accompanyingPerson',visible:true, order:12},
                                                    {id: 'groupLeader', columnLabel:'Group Leader / Trainer / Facilitator', location:'groupLeader',visible:true, order:14},
                                                    {id: 'participantSpecial', columnLabel:'Participant With Special Needs', location:'participantSpecial',visible:true, order:15},
                                                    {id: 'participantWithFewerOppurtunities', columnLabel:'Participant With Fewer Opportunities', location:'participant.nationality',visible:true, order:16},
                                                    {id: 'europeanSolidaryCorpseVolunteer', columnLabel:'European Solidarity Corps volunteer',visible:true, order:17},
                                                    {id: 'europeanSolidaryCorpseID', columnLabel:'European Solidarity Corps ID Nr', location:'participant.nationality',visible:true, order:18},
                                                    {id: 'groupOfParticipants', columnLabel:'Participant Group', location:'groupOfParticipants',visible:true, order:19},
                                                    {id: 'mobilityId', columnLabel:'Mobility ID', location:'mobilityId',visible:true, order:20},
                                                    {id: 'sendingOrganisationId', columnLabel:'Sending Organisation ID', location:'sendingOrganisationId',visible:true, order:21},
                                                    {id: 'sendingOrgPiccode', columnLabel:'Sending Organisation PIC', location:'sendingOrganisation.piccode',visible:true, order:22},
                                                    {id: 'sendingOrgLegalName', columnLabel:'Sending Organisation Legal Name',visible:true, order:23},
                                                    {id: 'sendingOrgBusinessName', columnLabel:'Sending Organisation Business Name',visible:true, order:24},
                                                    {id: 'sendingOrgName', columnLabel:'Sending Organisation Full Legal Name (National Language)',visible:true, order:25},
                                                    {id: 'acronym', columnLabel:'Sending Organisation Acronym', location:'sendingOrganisation.acronym',visible:true, order:26},
                                                    {id: 'sendingOrganisationNationalID', columnLabel:'Sending Organisation National ID (if applicable)', location:'participant.nationality',visible:true, order:27},
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
                                                    {id: 'hostOrgPiccode', columnLabel:'Receiving Organisation PIC', value:this.props.data.project.organisations.find((it)=>it.isHost===true) ? this.props.data.project.organisations.find((it)=>it.isHost===true).piccode : '', visible:true, order:47},
                                                    {id: 'hostOrganisationLegalName', columnLabel:'Receiving Organisation Legal Name', visible:true, order:48},
                                                    {id: 'hostOrganisationBusinessName', columnLabel:'Receiving Organisation Business Name', visible:true, order:49},
                                                    {id: 'hostOrganisationFullLegalName', columnLabel:'Receiving Organisation Full Legal Name (National Language)', visible:true, order:50},
                                                    {id: 'hostOrganisationAcronym', columnLabel:'Receiving Organisation Acronym', value:this.props.data.project.organisations.find((it)=>it.isHost===true) ? this.props.data.project.organisations.find((it)=>it.isHost===true).acronym : '', visible:true, order:51},
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
                                                    {id: 'mainWorkingLanguage', columnLabel:'Main Instruction/Work/Volunteering Language', value:this.props.data.mainWorkingLanguage, visible:true, order:72},
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
                                                    {id: 'draftMobility', columnLabel:'Draft Mobility',value:'NO',visible:true, order:109}


                                              ]
    };
    
  }

  componentDidMount() {
      const fields_Header = JSON.parse(JSON.stringify(this.state.fields_Header));

      if(this.props.columnsHideable){
        const columnVisibility = this.orderColumns(this.combineEqualColumns(this.state.listColumns, this.state.listColumns));
        this.setState({columnVisibility});
      }

      this.setState({initialValues_Header:fields_Header});
     
      this.updateList();

  }

convertDistanceBand(mobility,columnId){
  var distanceBand = mobility[columnId];
  
  if(distanceBand){
    distanceBand = distanceBand.substring(0,7);
  }
  
  return distanceBand;

}

getCountryCode(mobility,columnId){

  var countryCode = mobility[columnId];

  switch(countryCode) {
    case 'GR':
        return 'EL';
    case 'GB':
        return 'UK';
    default:
        return countryCode;
  }

}


updateList = () => {
  const dataList = this.getListData(this.props.data.mobilities,this.state.listColumns);
  this.setState({dataList});
}


orderColumns = (columns) => {

      return columns.sort(function(a, b){return a.order-b.order});

    };

combineEqualColumns = (row, columns) =>{
    var newRow = row;
    
    var combinedColumns = [];

      for(var i=0; i<row.length; i++){
        const column = row[i]; 
       
        var equalColumns = newRow.filter(it=>(it.columnLabel === column.columnLabel));
        
        if (equalColumns.length > 1){
          equalColumns = this.orderColumns(equalColumns);
          const combinedColumnValue = [];
          for(var j=0; j<equalColumns.length; j++){
            combinedColumnValue.push(equalColumns[j].value);
          }
          const joinBy = columns.find(it=>(it.columnLabel === equalColumns[0].columnLabel)).joinBy;
          var combinedColumn = {};
          for(var key in equalColumns[0]){
            if (equalColumns[0].hasOwnProperty(key)) {
              
              if(key==='value'){ 
                  combinedColumn[key] = combinedColumnValue.join(joinBy);
                }
              else {
                combinedColumn[key] = equalColumns[0][key];
              }

            }
          }
          combinedColumns.push(combinedColumn);
          newRow = newRow.filter(it=>(it.columnLabel !== equalColumns[0].columnLabel));
          
        }
        

      }
      

      return (newRow.concat(combinedColumns));
      
      
    };

getListData=(data, columns)=>{
    
  const getDateFormat = (dateObject) => {
    
    var date = new Date(dateObject);
    //return(date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear());
    
    return (("0" + date.getDate()).slice(-2) + '.' + ("0" + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear());
  };


  const hideColumns = (row) =>{
    var visibleColumns = [];
    var columnVisibility = [];
    if(this.state.columnVisibility.length){
       columnVisibility = this.state.columnVisibility;
    }else {
        columnVisibility = this.state.listColumns;
    }
    
    for(var i=0; i< row.length; i++){
      const column = row[i];
      


      if(columnVisibility.find(it => ((it.id === column.id) && it.visible))){
        visibleColumns.push(column);
      }

      
    }

    return visibleColumns;
  };


    var dataList = [];
    
    for(var i=0; i< data.length; i++){
      const dataRow = data[i];
      var listRow = [];
        for(var j=0; j<columns.length; j++){
          const dataColumn = columns[j];
          var value = '';
          if(dataColumn.value){
            console.log('value',dataColumn);
            value=dataColumn.value;
          }
          else if(dataColumn.location){
              if(typeof dataColumn.location === 'function'){
                value = dataColumn.location(dataRow,dataColumn.id);
              }
              else{
                const location = dataColumn.location.split('.');
                value = location.length === 2 ? dataRow[location[0]][location[1]] : dataRow[location];
              }
          }
          if(dataColumn.isDate && value){
            value = getDateFormat(value);
          }
          var listColumn = {id:dataColumn.id, columnLabel:dataColumn.columnLabel,value: value, order:dataColumn.order};
          
          //console.log('gg',this.state.columnVisibility.find(it => ((it.id === listColumn.id) && it.visible)));
          //if(this.state.columnVisibility.find(it => ((it.id === listColumn.id) && it.visible))){
            listRow.push(listColumn);
          //}
        }
        
      listRow = this.combineEqualColumns(listRow, columns);
      listRow = hideColumns(listRow);
      listRow = this.orderColumns(listRow);
      
      
      dataList.push(listRow);
      

    }
    
    return dataList;
    

}



handleChange_Header = (e) => {
  console.log(e.target);
  let fields_Header = [...this.state.fields_Header];
  const index = fields_Header.findIndex(it => it.id === e.target.id.split('_')[0]);
  if(index !== -1){
    if(e.target.type === "checkbox"){
      if(e.target.id.split('_')[1] === 'show'){
          fields_Header[index].visible = e.target.checked;
      }else{
          fields_Header[index].value = e.target.checked;
      }
      

    }else{
      fields_Header[index].value = e.target.value;
    }
    this.setState({fields_Header});
  }
}

handleChange_List = (e) => {
  console.log(e.target);
  let columnVisibility = [...this.state.columnVisibility];

  const index = columnVisibility.findIndex(it => it.id === e.target.id);
  if(e.target.type === "checkbox"){
    columnVisibility[index].visible = e.target.checked;
  }
  this.setState({columnVisibility});
  this.updateList();
}




handleReset = (e) => {
  
  let fields_Header = [...this.state.fields_Header];
  const index = fields_Header.findIndex(it => it.id === e.target.id.split('_')[0]);
  if(index !== -1){
    
    fields_Header[index].value = this.state.initialValues_Header[index].value;
    this.setState({fields_Header});
  }
}

 
 convertForCSV = (data) => {
    var dataCSV = [];
    var headersCSV = [];
  for(var i=0;i<data.length; i++){
    const row = data[i];
    var csvRow = {};
    for(var j=0;j<row.length; j++){
      const column = row[j];
      csvRow[column.id] = column.value;
      headersCSV.push({label:column.columnLabel, key:column.id});
    } 
    dataCSV.push(csvRow);
  }

    return {data:dataCSV,headers:headersCSV};
 }

  
  render() {
     console.log('PROS',this.props);
     const {t, columnsHideable} = this.props;
     const {fields_Header,columnVisibility, dataList} = this.state;
     const dataCSV = this.convertForCSV(dataList);

     var title = '';
     var subtitle = '';
     console.log('datalist',dataList);
     if(fields_Header){
        title = fields_Header.find(it => it.id === 'title' && it.visible === true);
        subtitle = fields_Header.find(it => it.id === 'subtitle' && it.visible === true);
      }

    return (
      <div>
      <div className="ongeaAct__exports_settings">
      <Panel label={t("Header")}>

      {fields_Header && fields_Header.map((field, i)=>{
        return( 
          
            <FormRowLayout infoLabel='' key={'HeaderFields_'+i}>
          {(field.id !== "dateFrom" && field.id !== "dateTo") &&
                      <HeaderInputField
                          
                          handleChange={this.handleChange_Header} 
                          handleReset={this.handleReset} 
                          field={field} 
          
                      />}

          {field.id === "dateFrom" && 
                    <Grid container spacing={40}>
                      <Grid item xs>
                     
                      <HeaderInputField
                          handleChange={this.handleChange_Header} 
                          handleReset={this.handleReset} 
                          field={field} 
          
                      />
                      </Grid>
                      <Grid item xs>
                        <HeaderInputField
                              handleChange={this.handleChange_Header} 
                              handleReset={this.handleReset} 
                              field={fields_Header.find((field)=>field.id === "dateTo")} 
                          />
                      </Grid>
                      </Grid>
                      
                    }
          </FormRowLayout>
          );

      })}


                  
      </Panel>
      <Panel label={t("List")}>
        {columnsHideable && <FormRowLayout infoLabel=''>
        <FormControl>
              <FormLabel>{"Columns"}</FormLabel><br />
              <FormGroup>
              <Grid container spacing={40}>
              <Grid item xs>
          {columnVisibility && columnVisibility.map((field, i)=>{
          
          return(
              <div key={'columnVisibility_1'+i}>
                {(i % 2 === 0) &&
                 <CheckboxInput
                                      id={field.id}
                                      label={field.columnLabel}
                                      value={field.id}
                                      onChange={this.handleChange_List}
                                      checked={field.visible}
                                      
                                    />
              }
            
          
                </div>
                                     );
                
                

          })}
          </Grid>
          <Grid item xs>
          {columnVisibility && columnVisibility.map((field, i)=>{
          
          return(
              <div key={'columnVisibility_2'+i}>
                {(i % 2 !== 0) &&
                 <CheckboxInput
                                      id={field.id}
                                      label={field.columnLabel}
                                      value={field.id}
                                      onChange={this.handleChange_List}
                                      checked={field.visible}
                                      
                                    />
                  }
          

              </div>
                                     );
                

          })}
          </Grid>
          </Grid>
          </FormGroup>
          </FormControl>
        </FormRowLayout>}
               
      </Panel>
      <hr />
    </div> {/*settings end*/}


      {dataCSV.data.length > 0 &&
          <DownloadAndPrint 
            dataCSV={dataCSV.data}
            headersCSV = {dataCSV.headers}
            csvFilename={(title ? (title.value) : 'unknown')+'.csv' }
          />
      }
      <div className='ongeaAct__exports_printPage'>
      <div className='ongeaAct__exports_printPage-header'>
       <Header
              title={title ? title.value : undefined}
              subtitle={subtitle ? subtitle.value : undefined}
              data={fields_Header.filter((it)=>(it.id !== 'title' && it.id !== 'subtitle' && it.id !== 'confirmation'))}
            />

     
           </div>

      <div className='ongeaAct__exports_printPage-body'>

      <List 
        data={dataList}
      />
      </div>
       
      </div>
      </div>
    );
  }
}

export default (Export3_forErasmusMobilityTool);
