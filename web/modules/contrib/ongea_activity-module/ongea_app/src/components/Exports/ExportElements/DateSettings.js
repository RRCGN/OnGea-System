import React from 'react';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import Grid from '@material-ui/core/Grid';
import { DateInput } from '../../elements/FormElements/FormElements';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Cached';





export default class DateSettings extends React.Component {
  

  handleChange = (e, target) => {

    
    var dateFrom=this.props.valueFrom;
    var dateTo = this.props.valueTo;

    

    if(target === 'dateFrom'){
      dateFrom = e.target.value;
    }else{

      dateTo = e.target.value;
    }

    this.props.onChange(dateFrom,dateTo);
}

handleReset=(e)=>{
	const dateFrom = this.props.initialFrom;
	const dateTo = this.props.initialTo;

	this.props.onChange(dateFrom,dateTo);
}

  
  render() {
    //console.log('PROPS',this.props);
    const {t,disabled, valueFrom, valueTo, onChange, initialFrom, initialTo} = this.props;

    
    return (
      
        <FormRowLayout infoLabel=''>
                       <Grid container spacing={40}>
                          <Grid item xs>
                         
                          <DateInput
                                          id={'dateFrom'}
                                          label={t('From')}
                                          disabled={disabled}
                                          value={valueFrom}
                                          onChange={(e)=>this.handleChange(e,'dateFrom')}
                                          InputProps={{
                                          endAdornment: <InputAdornment position="end">
                                                          <Tooltip title="Reset">
                                                          <div>
                                                          <IconButton onClick={this.handleReset} aria-label="Reset" tooltip='reset' disabled={disabled}>
                                                            <RefreshIcon />
                                                          </IconButton>
                                                          </div>
                                                          </Tooltip>
                                                        </InputAdornment>
                                      	}}
                                         
                                        />
                          </Grid>
                          <Grid item xs>
                            <DateInput
                                          id={'dateTo'}
                                          label={t('To')}
                                          disabled={disabled}
                                          value={valueTo}
                                          onChange={this.handleChange}
                                          InputProps={{
                                          endAdornment: <InputAdornment position="end">
                                                          <Tooltip title="Reset">
                                                          <div>
                                                          <IconButton onClick={this.handleReset} aria-label="Reset" tooltip='reset' disabled={disabled}>
                                                            <RefreshIcon />
                                                          </IconButton>
                                                          </div>
                                                          </Tooltip>
                                                        </InputAdornment>
                                      	}}
                                      
                                        />
                          </Grid>
                          </Grid>
                    </FormRowLayout>


     
    );
  }
}


