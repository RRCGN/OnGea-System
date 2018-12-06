import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableRow from '@material-ui/core/TableRow';

export default  class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {t, order, orderBy, hasIndex, columns} = this.props;



    return (
      <TableHead>
        <TableRow>
          {hasIndex && <TableCell key={'headerIndex'}></TableCell>}
          {columns.map((columnLabel, index)=>{
            return (
              
              <TableCell
                key={'header'+index}
                sortDirection={orderBy === columnLabel.id ? order : false}

              >
                <Tooltip
                  title="Sort"
                  placement={'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === columnLabel.id}
                    direction={order}
                    onClick={this.createSortHandler(columnLabel.id)}
                  >
                    {t(columnLabel.label)}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>



    );
  }
}