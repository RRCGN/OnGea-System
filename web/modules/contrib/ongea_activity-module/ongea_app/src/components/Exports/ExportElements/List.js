import React from 'react';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import EnhancedTableHead from './EnhancedTableHead';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});



class List extends React.Component {
  
 
  

  getColumnsLabels=()=>{
    
    const {data} = this.props;
    var columnLabels = [];
    if(data[0] && data[0].length > 0){
      for(var i=0; i<data[0].length;i++){
        
        columnLabels.push({id:data[0][i].id,label:data[0][i].columnLabel});
      }

      return columnLabels;
    }
    return [];
  }

  

  
  render() {
    const {t, data, hasIndex, order, orderBy, handleRequestSort} = this.props;
    const columns = this.getColumnsLabels();
    const { classes } = this.props;

    return (
      <div className={'ongeaAct__exports_printPage-body_list'}>
          {columns.length > 0 && data.length > 0 && 
          <Table className={classes.table}>
            <EnhancedTableHead columns={columns} t={t} hasIndex={hasIndex} order={order} orderBy={orderBy} onRequestSort={handleRequestSort}/>
              
            <TableBody>
              {data.map((row,i) => {
                return (
                  <TableRow key={'row'+i}>
                    {hasIndex && <TableCell key={'index'+i}>{i+1}</TableCell>}
                    {columns.map((columnLabel,j)=>{
                      
                      const cell = row.find((it)=>(it.id===columnLabel.id));
                     // console.log(columnLabel,cell.value);
                        return(
                              <TableCell 
                                key={'cell'+j}
                                style={cell.width ? {minWidth: cell.width+'px'}:{}} 
                              >
                                {cell.value}
                              </TableCell>
                          );
                      })
                    }
                    
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          }
      </div>
    );
  }
}

List.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(List);
