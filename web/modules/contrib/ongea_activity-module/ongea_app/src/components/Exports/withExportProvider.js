import React from 'react';
import {getStaysByDate} from '../../libs/utils/staysHelpers';
import moment from 'moment';

export const withExportProvider = (Export) => {

	




  	class wrappedExport extends React.Component {




  		constructor(props) {
		    super(props);
		    
		    this.state = {
		      
		      fields_Header: [
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
					              }],
		      dataList:[],
		      hasIndex:false,
		      columnVisibility:[],
		      listColumns:[],
		      order:'asc',
		      orderBy:null,
		      orderSecondary:'asc',
		      orderBySecondary:null
		      
		    };
	    
	    var initialValues_Header = props.initialValues_Header;
	    var listColumns=[];
	    var data = undefined;
	    var iteration=undefined;
	    var filterFunction = getStaysByDate;
	    var listId=null;
	  	}



	  setData=(dataObject,shouldListUpdate)=>{
	  	//console.log('gggg',dataObject.listColumns);
	  	if(dataObject.data){
	  		//console.log('fffff',dataObject.data);
	  		this.data = dataObject.data;
	  	}
	  	if(dataObject.listColumns){
			this.listColumns = dataObject.listColumns;
			const columnVisibility = this.orderColumns(this.combineEqualColumns(this.listColumns, this.listColumns));
        	this.setState({columnVisibility});

	  	}
	  	if(dataObject.iteration){
	  		this.iteration = dataObject.iteration;
	  		
	  	}
	  	if(dataObject.filterFunction){
	  		this.filterFunction = dataObject.filterFunction;
	  		
	  	}
	  	if(dataObject.listId){
	  		this.listId = dataObject.listId;
	  		
	  	}
	  	
	  	
	  	



	  	if(shouldListUpdate){
	  		this.updateList(this.state.fields_Header);
	  	}


	  	

	  	
	  }



	  shouldComponentUpdate(nextProps, nextState) {
    

    
		    if(nextProps.t && nextProps.t !== this.props.t){
		    	this.updateList();
		      return true;
		    }

		   

		    
		    return (nextState!==this.state);

		  }



  		updateList = (newFields_Header, makeInitial) => {
  			

  			const runGetListData = () => {
  				var dataList = [];
  				if(this.iteration){
	  				dataList = this.getMultipleListsData(this.iteration,this.data,this.listColumns);
	  			}else{
	  				 dataList = this.getListData(this.data,this.listColumns);
	  			}
	  			this.getOrder(this.listColumns);
	  			this.setState({dataList});

  			}

  			if(makeInitial){
  				this.initialValues_Header = JSON.parse(JSON.stringify(newFields_Header));
  			}

  			if(newFields_Header){
  				this.setState({fields_Header:newFields_Header},runGetListData);
  					
  			}else{
  				runGetListData();
  			}
  		
		  
		}


		/*compare = (a,b) =>{
			
			const sortA = a.find((it)=>(it.id === this.sortBy)).value;
			const sortB = b.find((it)=>(it.id === this.sortBy)).value;
				if (sortA < sortB)
				    return -1;
				if (sortA > sortB)
				    return 1;
				  return 0;
		

		  
		}

		compare2 = (a,b) =>{
			
			const sortA = a.find((it)=>(it.id === this.sortBy2)).value;
			const sortB = b.find((it)=>(it.id === this.sortBy2)).value;
				if (sortA < sortB)
				    return -1;
				if (sortA > sortB)
				    return 1;
				  return 0;
		

		  
		}*/


  		getMultipleListsData=(iteration,data,columns)=>{
		    var dataList = [];
		    
		    for(var it of iteration){
		      var dataOnIteration = this.filterFunction(it,data);
		      //staysOnDate = removeStayInstances(staysOnDate);
		      dataList.push(this.getListData(dataOnIteration,columns, it));
		    }
		    
		    return dataList;


		}



		stableSort=(array, cmp, cmp2)=>{
		    const stabilizedThis = array.map((el, index) => [el, index]);
		    stabilizedThis.sort((a, b) => {
		      const order = cmp(a[0], b[0]) || (cmp2 ? cmp2(a[0],b[0]) : 0);
		      if (order !== 0) return order;
		      return a[1] - b[1];
		    });
		    return stabilizedThis.map(el => el[0]);
		  }


		  getSorting=(order, orderBy)=>{
		    return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => -this.desc(a, b, orderBy);
		  }



		  desc=(a, b, orderBy) =>{
		    //console.log('a',a);
		    //console.log('b',b);
		    //console.log('sortBy',orderBy);

		   	const isVisible = (column) => {
		   		const visibility = this.state.columnVisibility.find((it)=>(it.id === column.id));
		   		return visibility.visible === true;
		   	};

		    var sortA = a.find((it)=>(it && it.id === orderBy && isVisible(it)));
		    var sortB = b.find((it)=>(it && it.id === orderBy && isVisible(it)));

		    sortA = sortA ? (sortA.value || '') :'';
		    sortB = sortB ? (sortB.value || '') :'';



		     

		    if (sortB < sortA) {
		      return -1;
		    }
		    if (sortB > sortA) {
		      return 1;
		    }
		    return 0;
		  }

		  handleRequestSort = (event, property) => {
		    const orderBy = property;
		    let order = 'desc';

		    if (this.state.orderBy === property && this.state.order === 'desc') {
		      order = 'asc';
		    }

		    this.setState({ order, orderBy });
		  };



		 



		  getOrder = (data) => {
		   
		    var order= null;
		    var orderBy = null;
		    var orderSecondary='asc';
		    var orderBySecondary = null;

		    const orderColumnSecondary = data.find((it)=>(it.sortBySecondary !== undefined));
		    if(orderColumnSecondary){
		      orderSecondary = orderColumnSecondary.sortBy;
		      orderBySecondary = orderColumnSecondary.id;
		    }


		    const orderColumn = data.find((it)=>(it.sortBy !== undefined));
		    
		    if(orderColumn){
		      order = orderColumn.sortBy;
		      orderBy = orderColumn.id;
		    }else{
		      order = 'asc';
		      orderBy = data[0].id;
		    }

		    this.setState({order,orderBy, orderBySecondary, orderSecondary});

		  }



		orderColumns = (columns) => {

		      return columns.sort(function(a, b){return a.order-b.order});

		    };

		combineEqualColumns = (row, columns) =>{
		    var newRow = row;
		    
		    var combinedColumns = [];


		    const findJoinKey = (equalColumns) => columns.find(it=>(it.columnLabel === equalColumns[0].columnLabel)).joinBy;

		    const removeColumn = (equalColumns) => newRow.filter(it=>(it.columnLabel !== equalColumns[0].columnLabel));

		      for(var i=0; i<row.length; i++){
		        const column = row[i]; 
		       
		        var equalColumns = newRow.filter(it=>(it.columnLabel && it.columnLabel === column.columnLabel));

		        
		        if (equalColumns.length > 1){
		          equalColumns = this.orderColumns(equalColumns);
		          const combinedColumnValue = [];
		          for(var j=0; j<equalColumns.length; j++){
		            combinedColumnValue.push(equalColumns[j].value);
		          }
		          const joinBy = findJoinKey(equalColumns);
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
		          newRow = removeColumn(equalColumns);
		          
		        }
		        

		      }
		      

		      return (newRow.concat(combinedColumns));
		      
		      
		    };


		getListData=(data, columns, iterationItem)=>{
		  if(data===undefined) data = [];  
		  /*const getDateFormat = (dateObject) => {
		    
		    var date = new Date(dateObject);
		    
		    return (("0" + date.getDate()).slice(-2) + '.' + ("0" + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear());
		  };*/


		  const hideColumns = (row) =>{
		    var visibleColumns = [];
		    var columnVisibility = [];
		    if(this.state.columnVisibility.length){
		       columnVisibility = this.state.columnVisibility;
		    }else {
		        columnVisibility = this.listColumns;
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
		            value= dataColumn.value;
		          }
		          else if(dataColumn.location){
		              if(typeof dataColumn.location === 'function'){
		                value = dataColumn.location(dataRow,dataColumn.id, iterationItem);
		              }
		              else{
		                const location = dataColumn.location.split('.');
		                
		                value = location.length === 2 ? dataRow[location[0]][location[1]] : dataRow[location];

		              }
		          }

		          if(dataColumn.translate){
		            	value =  this.props.t(value);
		            }

		          if(dataColumn.isBoolean){
		          		
		          		if(value===true || value===1 || value==='1'){
		          			value = 'YES'
		          		}else if(value===false || value===0 || value === '0'){
		          			value = 'NO'
		          		}
		            	
		            }

		          if(dataColumn.isDate && value){
		          	if(dataColumn.dateFormat){
		          		value = moment(value).format(dataColumn.dateFormat);
		          	}else{
		          		value = moment(value).format('DD.MM.YYYY')
		          	}
		            //value = getDateFormat(value);
		          }

		          var listColumn = {id:dataColumn.id, columnLabel:dataColumn.columnLabel,value: value, order:dataColumn.order};
		          if(dataColumn.width){
		          		listColumn.width = dataColumn.width;
		          }
		          
		         
		            listRow.push(listColumn);
		        }
		        
		      listRow = this.combineEqualColumns(listRow, columns);
		   
		      listRow = hideColumns(listRow);

		      listRow = this.orderColumns(listRow);
		         
		      
		      dataList.push(listRow);
		      

		    }
		    
		    return dataList;
		    

		}


		filterApproved=(mobilities)=>{
			var approvedMobilities = [];

			if(mobilities && mobilities.length>0){

				approvedMobilities = mobilities.filter((it)=>(it && it.participantStatus === 'approved'));

			}
			return approvedMobilities;
		}


		handleChange_Header = (e) => {
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



		    this.setState({fields_Header}, ()=>this.updateList(fields_Header));
		  }
		}




		handleReset = (e, targetId) => {
		  let fields_Header = [...this.state.fields_Header];
		  const index = fields_Header.findIndex(it => it.id === targetId);

		  if(index !== -1){
		    
		    fields_Header[index].value = this.initialValues_Header[index].value;
		    this.setState({fields_Header});
		  }
		}


		handleChange_List = (e) => {
		  if(e.target.name === 'index'){
		  	this.setState({hasIndex:e.target.checked});
		  }else{

		  	let columnVisibility = [...this.state.columnVisibility];

			  const index = columnVisibility.findIndex(it => it.id === e.target.id);
			  if(e.target.type === "checkbox"){
			    columnVisibility[index].visible = e.target.checked;
			  }
			  this.setState({columnVisibility}, ()=>this.updateList(this.state.fields_Header));

		  }
		  
		  
		}



		convertForCSV = (data) => {
			if(!this.iteration){
				var dataCSV = [];
				    var headersCSV = [];
				  for(var i=0;i<data.length; i++){
				    const row = data[i];
				    var csvRow = {};
				    for(var j=0;j<row.length; j++){
				      const column = row[j];
				      csvRow[column.id] = column.value;
				      if(i===0){
				      	headersCSV.push({label:column.columnLabel, key:column.id});
				      }
				    } 
				    dataCSV.push(csvRow);
				  	}
				  	if(this.listId === 'mobility_tool_list' && dataCSV && dataCSV.length>0){ //insert blnk row for List for EU mobility tool
				  		return {data:[this.makeBlankRow(dataCSV[0]),...dataCSV],headers:headersCSV};
				  	}else{
				  		return {data:dataCSV,headers:headersCSV};
				  	}

				    
					
			}
			else{
				return {};
			}
		    
		 }



		 makeBlankRow=(row)=>{
		    var blankRow = JSON.parse(JSON.stringify(row));

		    for(var key in blankRow){
		            blankRow[key] = '';
		    }
		    return blankRow;
		}
		 



    render() {
    	const {...passthrough} = this.props;
    	const {fields_Header, columnVisibility, hasIndex, order, orderBy, orderSecondary, orderBySecondary} = this.state;
    	var {dataList} = this.state;

    	if(this.iteration){
    		for(var i = 0; i<dataList.length;i++){
    			dataList[i] = this.stableSort(dataList[i],this.getSorting(order,orderBy), orderBySecondary ? this.getSorting(orderSecondary, orderBySecondary):false);
    		}
    	}else{
    		dataList = this.stableSort(dataList,this.getSorting(order,orderBy), orderBySecondary ? this.getSorting(orderSecondary, orderBySecondary):false);
    	}

    	var csvData = [];
    	if(!this.iteration){
    		 csvData = this.convertForCSV(dataList);
    		
    	}

      return <Export dataList={dataList} updateList={this.updateList} fields_Header={fields_Header} setData={this.setData} handleChange_Header={this.handleChange_Header} handleReset={this.handleReset} handleChange_List={this.handleChange_List} columnVisibility={columnVisibility} csvData={csvData} hasIndex={hasIndex} filterApproved={this.filterApproved} handleRequestSort={this.handleRequestSort} order={order} orderBy={orderBy} {...passthrough} />;
    }
  }
    
  return wrappedExport;
};