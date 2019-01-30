import React from 'react';

import PropTypes from 'prop-types';
//import {connect} from 'react-redux';
import {compose} from 'redux'
import {translate} from "react-i18next";
import {Getter} from '@devexpress/dx-react-core';
import {
  DataTypeProvider,
  SortingState,
  EditingState,
  PagingState,
  SelectionState,
  RowDetailState,
  IntegratedFiltering,
  IntegratedPaging,
  IntegratedSorting,
  FilteringState,
  IntegratedSelection,
  SearchState,
  TreeDataState,
  CustomTreeData
} from '@devexpress/dx-react-grid';
import {
  Grid, 
  Table,
  SearchPanel,
  TableRowDetail,
  TableHeaderRow,
  TableFilterRow,
  TableTreeColumn,
  TableEditColumn,
  PagingPanel,
  /*TableColumnResizing,*/
  TableColumnVisibility,
  Toolbar 
} from '@devexpress/dx-react-grid-material-ui';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ReadIcon from '@material-ui/icons/RemoveRedEye';
import ClearIcon from '@material-ui/icons/Clear';
import emptyProfilePic from '../../../assets/img/baseline-account_circle-24px.svg';

import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';

import {withStyles} from '@material-ui/core/styles';

import {withRouter} from 'react-router-dom'

//var dateFormat = require('dateformat');
import Moment from 'react-moment';
import moment from 'moment';

import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/es';
import 'moment/locale/nl';
import 'moment/locale/lt';
import 'moment/locale/ro';
import 'moment/locale/hu';
import 'moment/locale/fr';
import 'moment/locale/el';
import 'moment/locale/ca';

import {Link} from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import { ReferenceTypes, Lists } from '../../../config/content_types';
import { SelectInput, TextInput } from '../FormElements/FormElements';

import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import {withSnackbar} from '../SnackbarProvider';



const styles = theme => ({
  lookupEditCell: {
    paddingTop: theme.spacing.unit * 0.875,
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit
  },
  dialog: {
    width: 'calc(100% - 16px)'
  },
  inputRoot: {
    width: '100%'
  }
});

const getFullName = (row) => {
  const {profile} = row;
  return (<div className="ongeaAct__data-table__title">
    <span>
    {(profile.firstName?profile.firstName+" ":"")+profile.lastName}</span>
    </div>);
}

const getChildRows = (row, rootRows) => (row ? row.items : rootRows);

class SelectCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true
    };
    this._isMounted=false;
  }
  

  
  componentDidMount() {
    this._isMounted=true;
    Lists.getDataAsync(this.props.column.reference).then(
      (result) => {
        if(this._isMounted){
        this.setState({data:result,
          isLoading:false});}
      });
      
   }
   componentWillUnmount() {
    this._isMounted=false;
   }



  render() {
    const {t, contentTypeId,setFieldValue,filter, onFilter, classes, readOnly, ...rest } = this.props;
   
    return (
        <Table.Cell {...rest}>
    <SelectInput
    disabled={this.state.isLoading || this.props.readOnly}
        id={this.props.column.name}
        type="text"
        value={filter ? filter.value:(this.props.value || '')}
        onChange={(e) => {
          (onFilter)?onFilter(e.target.value ? { value: e.target.value } : null):
          this.props.row[this.props.column.name] = e.target.value;
          if(setFieldValue){setFieldValue(this.props.contentTypeId,this.props.column,e.target.value,this.props.row.id);}
          //if(setFieldValue){setFieldValue(this.props.contentTypeId+'['+this.props.row.index+']'+this.props.column.name,e.target.value);}
        }}
        onBlur={() => {
          //DO NOTHING
        }}
        options={this.state.data.map((item,index) => ({value: (item.value || index),label: (t(item.label) || t(item))}))}
      />
  </Table.Cell>
    )
  }
}


const ReferenceFilterCell = withStyles(styles, { name: 'SelectBoxFilter' })(SelectCell);


const BooleanFilterCellBase = ({ filter, onFilter, classes }) => (
  <TableCell className={classes.cell}>
    <Checkbox
    checked={filter ? filter.value : false}
    onChange={e => onFilter({ value: e.target.checked })}
    value={filter ? filter.value.toString() : 'false'}
    />
  </TableCell>
);
const BooleanFilterCell = withStyles(styles, { name: 'CheckBoxFilter' })(BooleanFilterCellBase);

const FilterCell = (props) => {
  if(props.column.referenceType!==undefined){
    switch(props.column.referenceType){
      case ReferenceTypes.BOOLEAN: {
        return <BooleanFilterCell {...props} />;
      }
      case ReferenceTypes.REFERENCE: {
        return <ReferenceFilterCell {...props} />;
      }
      default: {
        break;
      }
    }
  }
  return <TableFilterRow.Cell {...props} />;
};

const EmailFormatter = ({value}) => <div style={{display:'flex'}}>{value>0 &&<MailOutlineIcon/>}
<a className="email" style={{marginLeft: '5px',fontSize:'1.1em'}} href={'mailto:'+value}>{value}</a>
</div>








const CheckboxCell = (props) => {
  const { contentTypeId,setFieldValue, ...rest } = props; 



  return <Table.Cell {...rest}>
    {(props.row[props.column.name+'_disabled'] && props.row[props.column.name+'_disabled']===true) ? null :<Checkbox onChange={(event) => {
    
          
          
            props.row[props.column.name] = event.target.checked;
          
          
          if(setFieldValue){setFieldValue(props.contentTypeId,props.column,event.target.checked,props.row.id);}
        }}
        checked={(props.value === true || props.value === 'yes' )?true:false} 
        disabled={props.readOnly}
        value={props.column.name} 
        />}
  </Table.Cell>;
}




class TextInputCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value:this.props.value || ''
    };
    this._isMounted=false;
  }



  render(){
    const { contentTypeId,setFieldValue, ...rest } = this.props; 
    
    return(

        <Table.Cell {...rest}>
    {(this.props.row[this.props.column.name+'_disabled'] && this.props.row[this.props.column.name+'_disabled']===true) ? null :
                      <TextInput
                            type="text"
                            disabled={this.props.readOnly}
                            value={this.state.value}
                            onChange={(event)=>{this.setState({value:event.target.value})}}
                            onBlur={(event)=>{
                              
                              this.props.row[this.props.column.name] = event.target.value;
                              
                              
                              if(setFieldValue){setFieldValue(this.props.contentTypeId,this.props.column,event.target.value,this.props.row.id);}
                            }}
                          />}
  </Table.Cell>

      );
    }
  }



/*const TextInputCell = (props) => {
  const { contentTypeId,setFieldValue, ...rest } = props; 

  return <Table.Cell {...rest}>
    {(props.row[props.column.name+'_disabled'] && props.row[props.column.name+'_disabled'].value) ? null :<TextInput
                            type="text"
                            value={props.value}
                            onChange={()=>{}}
                            onBlur={(event)=>{
                              console.log('onBlur',props.column);
                              
                              props.row[props.column.name] = event.target.value;
                              
                              
                              if(setFieldValue){setFieldValue(props.contentTypeId,props.column,event.target.value,props.row.id);}
                            }}
                          />}
  </Table.Cell>;
}*/


const LookupEditCellBase = ({
  availableColumnValues, value, onValueChange, classes,
}) => (
  <TableCell
    className={classes.lookupEditCell}
  >
    <Select
      value={value}
      onChange={event => onValueChange(event.target.value)}
      input={
        <Input
          classes={{ root: classes.inputRoot }}
        />
      }
    >
      {availableColumnValues.map(item => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
      ))}
    </Select>
  </TableCell>
);
export const LookupEditCell = withStyles(styles, { name: 'ControlledModeDemo' })(LookupEditCellBase);



/*const Cell = (props) => {
  console.log('PROOOOOOPS',props);
  
  if(props.column.referenceType!==undefined){
    switch(props.column.referenceType){
      case ReferenceTypes.BOOLEAN: {
        return <CheckboxCell {...props}/>
      }
      case ReferenceTypes.REFERENCE: {
        return <SelectCell {...props}/>
      }
      default: {
        return <Table.Cell {...props}/>
      }
    }
  }
  return <Table.Cell {...props}/>;
};*/




/*const availableValues = {
  product: globalSalesValues.product,
};*/
const getRowId = row => row.id;

class DataTable extends React.Component {
  constructor(props) {
    super(props);
      
    this.state = {
      columns: props.columns,
      //translatedColumns: (props.translatedColumnTitles)?props.translatedColumnTitles:props.columns,
      defaultHiddenColumnNames: ['id', ...props.columns.filter((it)=>(it.isHidden===true)).map((it)=>(it.name))],
      dateColumns: props
        .columns
        .filter(d => (d.isDate))
        .map(function (obj) {
          return obj.name;
        }),
      relativeDateColumns: props
        .columns
        .filter(d => (d.isRelativeDate))
        .map(function (obj) {
          return obj.name;
        }),
      dateTimeColumns: props
        .columns
        .filter(d => (d.isDateTime)) 
        .map(function (obj) {
          return obj.name;
        }),
      emailColumns: props
        .columns
        .filter(d => (d.isEmail))
        .map(function (obj) {
          return obj.name;
        }),
      participantColumns: props
        .columns
        .filter(d => (d.isNameAndImage))
        .map(function (obj) {
          return obj.name;
        }),
      defaultColumnWidths: props
        .columns
        .map(function (obj) {
          return {columnName: obj.name,width:(obj.width)?obj.width:(100/props.columns.length)+'%'};
        }),
      groupColumn: props
        .columns
        .find((column)=>(column.group===true)),
      currentPage: 0,
      deletingRows: [],
      editingRowIds: [],
      pageSize: 0,
      pageSizes: [
        5, 10, 0
      ],
      filters: [],
      showFilter: false,
      rowChanges: {},
      titleColumns: props
        .columns
        .filter(d => (d.isPrimary))
        .map(function (obj) {
          return obj.name;
        }),
      defaultSortColumn: props
        .columns
        .filter(d => (d.sortBy))
        .map(function (obj) {
          return obj;
        }),
      sortingStateColumnExt: props
        .columns
        .filter(d => (d.sortingEnabled !== undefined))
        .map(function (obj) {
          return obj;
        }),
      rows: props.data || [],
      //setValues: props.setValues || null
      //filterByIds: props.filterByIds || []
      /*tableColumnExtensions: [
            { columnName: 'Completion', align: 'right' },
          ],*/
    };
 

    this.changeRowChanges = rowChanges => { if(this._isMounted)this.setState({ rowChanges })};

    this.changeEditingRowIds = editingRowIds => {
      if(this.props.isReference){
        //OPEN DIALOGUE WITH EDIT VIEW
        this.props.linkTo(editingRowIds[0]);
      }
      else{
        //GOTO EDIT VIEW
      this.props.history.push(this.props.linkTo.replace(':id', editingRowIds[0]));
    }
    };

    this.commitChanges = ({added, changed, deleted}) => {
      if(changed){
        alert('DataTable changed');
      }
      let {rows} = this.state;
      /*if (added) {
            const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            rows = [
              ...rows,
              ...added.map((row, index) => ({
                id: startingAddedId + index,
                ...row,
              })),
            ];
          }
          if (changed) {
            rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
          }*/
      if(this.props.isReference){
        this.props.delete(deleted[0]);
      }
      else{
      this.setState({ rows,deletingRows: deleted || this.state.deletingRows});
    }
    };
    this.cancelDelete = () => this.setState({deletingRows: []});
    this.deleteRows = () => {

      const rows = this.state.rows.slice();

      this.state.deletingRows.forEach((rowId) => {
          this
            .props
            .delete({id: rowId})
            .then((result) => {
              this
                .props
                .snackbar
                .showMessage(this.props.t('delete_success'),'success');

                if(this.props.afterDelete){
                   this.props.afterDelete();
                }


            })
            .catch((error) => {
              console.error(error);
              this
                .props
                .snackbar
                //.showMessage('delete_success.','success');
                .showMessage(this.props.t('snackbar_delete_error'),'error');

                //Temporary.. should not be here in error
                if(this.props.afterDelete){
                   this.props.afterDelete();
                }
            });
          const index = rows.findIndex(row => row.id === rowId);
          if (index > -1) {
            rows.splice(index, 1);
          }
        });
      this.setState({rows, deletingRows: []});

      

    };
    this.toggleFilter = () => {
      this.setState({
        filters: [],
        showFilter: !this.state.showFilter
      });
    };
    this.changeFilters = filters => this.setState({ filters });


  
  }

getParentRowIds = () => {
  const {rows} = this.state;
  
  var parentRowIds = [];
  for(var i=0;i<rows.length;i++){
    const row = rows[i];
   
    if(row.items !== undefined){
      
      parentRowIds.push(row.id);
    }
  }
  return parentRowIds;
}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.data !== prevProps.data) {
      this.setState({ rows: this.props.data });
    }    
  }

  render() {
    const {columns,classes, t,setFieldValue,contentTypeId,parentContentTypeId, readOnly} = this.props;
    const isEditable = this.props.isEditable === false ? false : true;
    const isDeletable = this.props.isDeletable === false ? false : true;
    //if(this.props.isReference)isEditable=false;
    const {
      //translatedColumns,
      rowChanges,
      rows,
      dateColumns,
      relativeDateColumns,
      dateTimeColumns,
      /*defaultColumnWidths,*/
      showFilter,
      titleColumns,
      emailColumns,
      participantColumns,
      editingRowIds,
      deletingRows,
      pageSizes,
      filters,
      defaultHiddenColumnNames
    } = this.state;
    const TableHeaderCell = (props) => {
      return <TableHeaderRow.Cell {...props}>
        
      </TableHeaderRow.Cell>;
    };

    const getEditColumnWidth = ()=>{

      if(readOnly){
        return 0;
      }
      else if(isEditable && isDeletable && this.props.removeReference){
        return 210;
      }
      else if(isEditable && this.props.removeReference){
        return 210;
      }
      else if(isEditable && isDeletable){
        return 155;
      }
      else if(isEditable && !isDeletable){
        return 155;
      }
      else if(!isEditable && this.props.removeReference){
        return 155;
      }else{
        return 0;
      }
      

    }
    const EditButton = ({onExecute}) => (
      <IconButton onClick={onExecute} title={this.props.t("edit")}>
        <EditIcon/>
      </IconButton>
    );

    const DeleteButton = ({onExecute}) => (
      <IconButton onClick={onExecute} title={this.props.t("Delete")}>
        <DeleteIcon/>
      </IconButton>
    );
    const RemoveButton = ({onExecute}) => (
      <IconButton onClick={onExecute} title={this.props.t("Remove")}>
        <ClearIcon/>
      </IconButton>
    );
    const ReadButton = ({onExecute}) => (
      <IconButton onClick={onExecute} title={this.props.t("Read")}>
        <ReadIcon/>
      </IconButton>
    );

    const commandComponents = {
      edit: EditButton,
      delete: DeleteButton,
      add:ReadButton
    };
    /*const commandComponentsReference = {
      edit: EditButton,
      delete: RemoveButton
    };*/


    const Command = ({id, onExecute}) => {
      

      const CommandButton = commandComponents[id];
      
      return (<CommandButton onExecute={onExecute}/>);
    };

    /*const CommandReference = ({id, onExecute}) => {
        

      const CommandButton = commandComponentsReference[id];
      
      return (<CommandButton onExecute={onExecute}/>);
    };*/


    //console.log('peop',this.props);
    Moment.globalLocale = this.props.lng || 'en';

    const DateFormatter = ({value}) => {
      
      return(<div>
    {value && <Moment locale={Moment.globalLocale || 'en'} format="ll">{value}</Moment>}
    </div>);}
    const DateTimeFormatter = ({value}) => <div>
    {value && <Moment locale={Moment.globalLocale || 'en'} format="LLL">{value}</Moment>}
    </div>
    const RelativeTimeFormatter = ({value}) => {
      
      return <div>
      {value && <Moment locale={Moment.globalLocale || 'en'} fromNow>{new Date(value*1000)}</Moment>}
    </div>;}


    const EmailTypeProvider = props => (<DataTypeProvider formatterComponent={EmailFormatter} {...props}/>);
    const DateTypeProvider = props => (<DataTypeProvider formatterComponent={DateFormatter} {...props}/>);
    const RelativeTimeTypeProvider = props => (<DataTypeProvider formatterComponent={RelativeTimeFormatter} {...props} />);
    const DateTimeTypeProvider = props => (<DataTypeProvider formatterComponent={DateTimeFormatter} {...props} />);


    const defaultSorting = [(this.state.defaultSortColumn.length>0)?{columnName:this.state.defaultSortColumn[0].name,direction:this.state.defaultSortColumn[0].sortBy}:{ columnName: this.props.defaultSorting || 'dateFrom', direction: 'desc' }];

    
    
    const expandedRowIds = this.getParentRowIds();
      
    const sortingStateColumnExtensions = (this.state.sortingStateColumnExt.length>0)?this.state.sortingStateColumnExt.map((column)=>({columnName:column.name,sortingEnabled:column.sortingEnabled})) : undefined;
    
    const pagingPanelMessages = {
      showAll: t('all_rows'),
      rowsPerPage: t('rows_per_page'),
      info: t('rows_n_to_n', {first_row:'{from}', last_row:'{to}'})+' ('+t('n_elements',{n:'{count}'})+')' //t('rows_n_to_n').replace('first_row','from').replace('last_row','to')+' ('+t('n_elements').replace('{n}','{count}')+')' //'Zeilen {from} bis {to} ({count} Elemente)'
    };
    const panelMessages = {
      searchPlaceholder: t('search')
    };

    const tableMessages = {
      noData: t('no-data')
    };
    const editColumnMessages = {
      editCommand: t('edit'),
      deleteCommand: t('delete'),
      cancelCommand: t('cancel')
    };
    const filterRowMessages = {
      filterPlaceholder: t('filter')
    };

    const TitleFormatter = ({row}) => (
      <div className="ongeaAct__data-table__title-col">
        {(this.props.isReference) ?
        <h4>{row[this.props.columns.find(it=>it.isPrimary===true).name]}</h4>
        :
        <React.Fragment>
          {(row.participant) &&
            <span></span>
          }
          {this.props.linkTo ? <Link to={this.props.linkTo.replace(":id",row["id"])}>
            {row[this.props.columns.find(it=>it.isPrimary===true).name]}
          </Link>
          :
          row[this.props.columns.find(it=>it.isPrimary===true).name]
        }
          </React.Fragment>
        }
        <i>{row["subtitle"]}</i>
      </div>
    );


const RowDetailProfile = ({ row }) => {
  const data = (row.participant)?row.participant:row;
  const age = moment().diff(data.birthDate, 'years');
  
  

return (
<div className="ongeaAct__data-table__detail ongeaAct__profile">
  <div className="ongeaAct__detail-info">
    <div>
      <label>{t('name')}</label>
      <div>{getFullName(row)}</div>
    </div>
    <div>
      <label>{t('Country of Residency')}</label>
      <div>{t(data.country)}</div>
    </div>
    <div>
      <label>{t('About me')}</label>
      <div>{data.aboutme}</div>
    </div>
    <div>
      <label> {t('Phone')}</label>
      <div>{data.phone}</div>
    </div>
    <div>
      <label> {t('Birth date')}</label>
      <div>{data.birthDate}<br />{t('age')}: {age}</div>
    </div>
    <div>
      <label> {t('skills_and_interests')}</label>
      <div>{data.skillsAndInterests}</div>
    </div>
    <div>
      <label> {t('food_requirements')}</label>
      <div>{data.foodOptions}</div>
    </div>
    <div>
      <label> {t('emergency_contact')}</label>
      <div>{data.emergencyContact}</div>
    </div>
  </div>

</div>
)};



const ParticipantFormatter = ({row}) => (
  <div className="ongeaAct__data-table__title-col" style={{
    display: 'flex'
  }}>

    <div
      style={{
      
      background: 'white',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      margin: '-8px 8px -8px 0',
      textAlign: 'center',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <img
        src={(row.profile.profilePicture && row.profile.profilePicture.path)?row.profile.profilePicture.path:emptyProfilePic}
        style={{
        height: '50px',
        margin: '0 auto',
        maxWidth: 'initial'
      }}
        alt="Avatar"/>
    </div>
      <div className="ongeaAct__profile__avatar"
     >
          <Link to={this.props.linkTo.replace(":id",row["id"])}>
            {getFullName(row)}
          </Link>
         
        
        <i>{(row.participant)?row.participant["nickname"]:row["nickname"]}</i>
        </div>
  </div>
);

    const TitleTypeProvider = props => (<DataTypeProvider formatterComponent={TitleFormatter} {...props}/>);
    const ParticipantTypeProvider = props => (<DataTypeProvider formatterComponent={ParticipantFormatter} {...props}/>);

   const EditCell = (props) => {

    
      return(
         <TableEditColumn.Cell {...props}>
          {React.Children.map(props.children, (child,i)=>{
            
            if((child && child.props.id === 'delete' && props.tableRow.row.manage === false) || !this.props.isEditable){
              return null;
            }
            if(child && child.props.id === 'edit' && props.tableRow.row.manage === false){
              return <ReadButton {...child.props}/>;
            }


            return child;
          })}
          {this.props.removeReference && !this.props.readOnly && <RemoveButton onExecute={()=>this.props.removeReference(props.row.id)} />}
           {/*React.Children.toArray(props.children)
             .filter((child) => {

               if (child.props.id === 'delete') {
                 if (props.tableRow.row.manage) {
                   return true;
                 }
                 return false;
               }


               return true;
             }

             )*/}
          
         </TableEditColumn.Cell>
       );
    };

    const Cell = (props,row) => {
      
      if(props.column.referenceType!==undefined){
        switch(props.column.referenceType){
          case ReferenceTypes.BOOLEAN: {
            return <CheckboxCell {...props} readOnly={readOnly} contentTypeId={contentTypeId || 0} setFieldValue={setFieldValue || null}/>
          }
          case ReferenceTypes.REFERENCE: {
            //return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />
            return <SelectCell {...props} t={this.props.t} readOnly={readOnly} contentTypeId={contentTypeId || 0} setFieldValue={setFieldValue || null}/>
          }
          case ReferenceTypes.STRING: {
            //return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />
            return <TextInputCell {...props} readOnly={readOnly} contentTypeId={contentTypeId || 0} setFieldValue={setFieldValue || null}/>
          }
          default: {
            break;
            //return <Table.Cell {...props}/>
          }
        }
      }

      return <Table.Cell {...props}/>;
    };


    return (
      <div>
        {rows.length > 0
          ? (
            <div className={'ongeaAct__data-table ongeaAct__data-table--'+((parentContentTypeId)?parentContentTypeId+"-"+contentTypeId:contentTypeId)}>
              <div className="ongeaAct__data-table__filter">
                <Tooltip title={t('filter_list')}>
                  <IconButton onClick={this.toggleFilter} aria-label={t('filter_list')}>
                    <FilterListIcon/>
                  </IconButton>
                </Tooltip>
              </div>
              
              <Grid rows={rows} columns={columns} pageSizes={pageSizes} getRowId={getRowId}>

                 <FilteringState
                  filters={filters}
                  onFiltersChange={this.changeFilters}
                />
                <SortingState defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions}/>
                <TreeDataState 
                expandedRowIds={expandedRowIds}/>
                <CustomTreeData
                  getChildRows={getChildRows}
                />
                <SelectionState/>
                <DateTypeProvider for={dateColumns}/>
                <DateTimeTypeProvider for={dateTimeColumns}/>
                <RelativeTimeTypeProvider for={relativeDateColumns}/>
                <EmailTypeProvider for={emailColumns}/>
                <ParticipantTypeProvider for={participantColumns} linkTo={this.props.linkTo} />
                <TitleTypeProvider for={titleColumns} linkTo={this.props.linkTo}/>
                <PagingState defaultCurrentPage={0} defaultPageSize={pageSizes[0]}/>

                <EditingState editingRowIds={editingRowIds} onEditingRowIdsChange={this.changeEditingRowIds} rowChanges={rowChanges} onRowChangesChange={this.changeRowChanges} 
                
                  onCommitChanges={this.commitChanges}/>
                <SearchState defaultValue="" />
                <IntegratedFiltering/>
                <IntegratedSelection/>
                <IntegratedSorting/>
                <IntegratedPaging/>

                 <RowDetailState
                  defaultExpandedRowIds={[]}
                />

                

                <Table cellComponent={Cell} messages={tableMessages}/>

                {participantColumns.length>0 &&
                <TableRowDetail /*rowHeight */
                  contentComponent={RowDetailProfile}
                />}
 
                
          
                <TableEditColumn
                                   width={getEditColumnWidth()}
                                   showEditCommand={isEditable && !readOnly}
                                   showDeleteCommand={isDeletable && !readOnly}
                                   commandComponent={Command}
                                   cellComponent={EditCell}
                                   messages={editColumnMessages}/> 



                  {showFilter && <TableFilterRow cellComponent={FilterCell} messages={filterRowMessages}/>}
                <TableHeaderRow cellComponent={TableHeaderCell} showSortingControls /> {/* cellComponent={TableHeaderCell} */}
                
                <TableColumnVisibility
                  defaultHiddenColumnNames={defaultHiddenColumnNames}
                />
                  
        
                <Toolbar />
                <SearchPanel messages={panelMessages} className="ongeAct__data-table__search"/>
                  
                <TableTreeColumn
                  for="title"
                />
               
                <PagingPanel pageSizes={pageSizes} messages={pagingPanelMessages}/>
              

                <Getter
                                                  name="tableColumns"
                                                  computed={({tableColumns}) => [
                                                  ...tableColumns.filter(c => c.type !== 'editCommand'), {
                                                    key: 'editCommand',
                                                    type: 'editCommand',
                                                    width: getEditColumnWidth()
                                                  }
                                                ]
                                              }/>
                

              </Grid>
            </div>
          )
          : (
            <div className="ongeaAct__no-data">
              <div className="ongeaAct__no-data--icon"><span aria-label="emoji: sad - no data" role="img">😔</span></div>
              <div className="ongeaAct__no-data--text"> {t('no-data')}</div>
            </div>
          )}

        <Dialog
          open={!!deletingRows.length}
          onClose={this.cancelDelete}
          classes={{
          paper: classes.dialog
        }}>
          <DialogTitle>{rows.filter(d => d && deletingRows.indexOf(d.id) > -1).length > 0 && <p><span style={{textTransform:'uppercase'}}>{t('delete')}</span> <span className="color--primary">{rows.filter(d => deletingRows.indexOf(d.id) > -1)[0].title}</span></p>
}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('delete_'+contentTypeId+'_confirm')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelDelete} color="primary">{t("cancel")}</Button>
            <Button onClick={this.deleteRows} color="secondary">{t("delete")}</Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired
};

export default compose(
//connect(mapStateToProps),
translate('translations'), withSnackbar(), withRouter, withStyles(styles, {name: 'ControlledModeDemo'})
//withStyles(styles)
)(DataTable);
