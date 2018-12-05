import React from 'react';
import Panel from '../../elements/Panel';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import { SelectInput, DateInput } from '../../elements/FormElements/FormElements';
import ExportSettings from '../ExportElements/ExportSettings';
import PrintPage from '../ExportElements/PrintPage';
import Grid from '@material-ui/core/Grid';
import { getDate} from '../../../libs/utils/dateHelpers';
import {getStaysByDate, orderStaysByDate, getStayDates} from '../../../libs/utils/staysHelpers';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';
import {withExportProvider} from '../withExportProvider';


 

class Export1_accommodationList extends React.Component {
 

constructor(props) {
        super(props);

        this.state = {
          stays:[],
          dates:[],
          selectedPlaceId:null,
          dateTo:null,
          dateFrom:null
        };
      
      }




static defaultProps = {
    initialValues_Header: [
              {
                id:'title', 
                label: 'Title',
                value: undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'subtitle', 
                label: 'Subtitle',
                value:undefined,
                type:'TextInput',
                visible:false
              },
              {
                id:'place', 
                label: 'Place',
                value:undefined,
                type:'TextInput',
                visible:true
              }




              ]
  }



componentDidMount() {

  const listColumns = [
                {id: 'stay', columnLabel:'', location: 'event.title',visible:true, order:1},
                {id: 'fullPrice', columnLabel:'Persons at full price', location: (stay)=>this.getPriceCount(stay,true) ,visible:true, order:2}, 
                {id: 'reducedPrice', columnLabel:'Persons at reduced Price', location: (stay)=>this.getPriceCount(stay,false) ,visible:true, order:3}
              ];

  this.props.setData({listColumns:listColumns});
        //const stays = this.getStays(placeID);
        //this.props.updateList(stays,getStayDates(stays));
      }



getStays=(placeId)=>{

  var stays = [];
  
  const mobilities = this.props.data.mobilities;

  const notExist = (mobilityStay) => (stays.findIndex((it)=>(it.id === mobilityStay.id)) === -1)

  if(mobilities && mobilities.length>0){
    for(var mobility of mobilities){
      const mobilityStays = mobility.stays;
      if(mobilityStays && mobilityStays.length > 0){
        for(var mobilityStay of mobilityStays){
          
          if(notExist(mobilityStay) && mobilityStay.event && mobilityStay.event.place && (mobilityStay.event.place.id === placeId)){
            stays.push(mobilityStay);

          }
        }
      } 
    }
  }
  
  console.log('filteredStays',stays);
  stays = orderStaysByDate(stays);
  console.log('orderedStays',stays);
  return (stays);
}



  handleChangePlace = (event) => {
  console.log('evetn',event.target);
  var fields_Header = this.props.initialValues_Header;
  const placeName = this.props.data.places.find((it)=>(it.id===event.target.value)).name;

  fields_Header.find((it)=>it.id==='place').value = placeName;
  
  const title = this.props.data.title;
  fields_Header.find((it)=>it.id==='title').value = title;

  const stays = this.getStays(event.target.value);

  const dates = getStayDates(stays);
  const dateFrom = dates[0];
  const dateTo = dates[dates.length-1];
  
  
  //fields_Header.find((it)=>it.id==='dateFrom').value = dateFrom;

  //fields_Header.find((it)=>it.id==='dateTo').value = dateTo;
//console.log('gggtg',stays);
  this.props.setData({data:stays,iteration:dates}, false);
  this.setState(
    {selectedPlaceId:event.target.value, stays, dates, dateFrom, dateTo},
    ()=>this.props.updateList(fields_Header,true)
  );

  }


    getPriceCount = (stay, fullPrice) => {
        const staysData = this.state.stays;
        const date = new Date((stay.eventDay && stay.eventDay.length>0) ? stay.eventDay[0].date : stay.event.startDate);
        var count = 0;
        
        const stays = getStaysByDate(date,staysData);

        const checkFullPrice = (it) =>{
          if(fullPrice){
            return (it.reducedPrice===false || it.reducedPrice==="0");
          }else{
             return (it.reducedPrice===true || it.reducedPrice==="1");
          }
        
      }

     

        const filteredStays = stays.filter((it)=>{
          if(it.eventDay && it.eventDay.length >0 && stay.eventDay && stay.eventDay.length > 0){
                return (it.eventDay[0].id === stay.eventDay[0].id) && checkFullPrice(it);
              }else{
                return (it.event.id === stay.event.id) && checkFullPrice(it);
              }
        });

        for(var filteredStay of filteredStays){
          count = count + filteredStay.mobilityIds.length;
        }

        return count;
    }


handleChangeDates = (e) => {

    console.log(e.target);
    var dateFrom=this.state.dateFrom;
    var dateTo = this.state.dateTo;

    if(e.target.name === 'dateFrom'){
      dateFrom = e.target.value;
    }else{

      dateTo = e.target.value;
    }

    const dates = getStayDates(this.state.stays,dateFrom, dateTo);
console.log('ffffff',dates);



    this.setState({[e.target.name]:e.target.value, dates}, this.props.setData({iteration:dates},true));
}


  
  render() {
    
    const {data, t, dataList, fields_Header, columnVisibility, hasIndex,handleRequestSort, order, orderBy} = this.props;
    const {selectedPlaceId, dates, dateTo, dateFrom} = this.state;
    const headers = dates.map((it)=>(getDate(it)));

     
    return (
      <div>
      <div className="ongeaAct__exports_settings">
          <Panel label={t("Choose place")}>
                      <FormRowLayout infoLabel=''>
                        <SelectInput
                          id="place"
                          type="text"
                          label={t("Place")}
                          value={selectedPlaceId || ''}
                          onChange={this.handleChangePlace}
                          onBlur={()=>{return(true);}}
                          options={data.places.length ? (data.places.map((place)=>{return({value:place.id,label:place.name});})):[{value:null,label:'No Places found in this Activity'}]}
                        />
                        </FormRowLayout>


                        
                    <FormRowLayout infoLabel=''>
                       <Grid container spacing={40}>
                          <Grid item xs>
                         
                          <DateInput
                                          id={'dateFrom'}
                                          label={t('From')}
                                          disabled={selectedPlaceId ? false : true}
                                          value={dateFrom}
                                          onChange={this.handleChangeDates}
                                          
                                         
                                        />
                          </Grid>
                          <Grid item xs>
                            <DateInput
                                          id={'dateTo'}
                                          label={t('To')}
                                          disabled={selectedPlaceId ? false : true}
                                          value={dateTo}
                                          onChange={this.handleChangeDates}
                                          
                                      
                                        />
                          </Grid>
                          </Grid>
                    </FormRowLayout>
          </Panel>
      </div>

      <ExportSettings
        t={t} 
        handleReset={this.props.handleReset}
        handleChange_Header={this.props.handleChange_Header}
        fields_Header={fields_Header}
        handleChange_List={this.props.handleChange_List}
        columnVisibility={columnVisibility}
      />
     
         <DownloadAndPrint 
                t={t}
              />
      
        {selectedPlaceId ? <PrintPage 
                  t={t}
                  fields_Header={fields_Header}
                  handleRequestSort = {handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  dataList={dataList}
                  hasIndex={hasIndex}
                  isIterated={true}
                  headers={headers}
                /> : t('Please select place.')}

      </div>
    );
  }
}

export default withExportProvider(Export1_accommodationList);

