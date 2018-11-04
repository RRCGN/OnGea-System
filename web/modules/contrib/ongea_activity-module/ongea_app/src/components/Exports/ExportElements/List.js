import React from 'react';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';


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
  constructor(props) {
    super(props);

    
  }

  getColumnsLabels=()=>{
    const {data} = this.props;
    var columnLabels = [];
    if(data.length > 0){
      for(var i=0; i<data[0].length;i++){
        
        columnLabels.push(data[0][i].columnLabel);
      }
      return columnLabels;
    }
    return [];
  }

  
  render() {
    //console.log('PROPS',this.props);
    const {data, hasIndex} = this.props;
    const columns = this.getColumnsLabels();
    
    const { classes } = this.props;
    return (
      <div className={'ongeaAct__exports_printPage-body_list'}>
          {columns.length > 0 && data.length > 0 && 
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {hasIndex && <TableCell key={'headerIndex'}></TableCell>}
                  {columns.map((columnLabel, index)=>{
                          return(
                              <TableCell key={'header'+index} >{columnLabel}</TableCell>
                            );
                        })
                  }
                
                
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row,i) => {
                return (
                  <TableRow key={'row'+i}>
                    {hasIndex && <TableCell key={'index'+i}>{i+1}</TableCell>}
                    {columns.map((columnLabel,j)=>{
                        return(
                              <TableCell key={'cell'+j}>{row.find((it)=>(it.columnLabel===columnLabel)).value}</TableCell>
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
