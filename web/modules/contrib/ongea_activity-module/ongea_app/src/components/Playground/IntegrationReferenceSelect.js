import React from 'react';
import { ReferenceSelect} from '../elements/FormElements/FormElements'

//import { withStyles } from '@material-ui/core/styles';


const suggestions = [
    { label: 'Afghanistan' },
    { label: 'Aland Islands' },
    { label: 'Albania' },
    { label: 'Algeria' },
    { label: 'American Samoa' },
    { label: 'Andorra' },
    { label: 'Angola' },
    { label: 'Anguilla' },
    { label: 'Antarctica' },
    { label: 'Antigua and Barbuda' },
    { label: 'Argentina' },
    { label: 'Armenia' },
    { label: 'Aruba' },
    { label: 'Australia' },
    { label: 'Austria' },
    { label: 'Azerbaijan' },
    { label: 'Bahamas' },
    { label: 'Bahrain' },
    { label: 'Bangladesh' },
    { label: 'Barbados' },
    { label: 'Belarus' },
    { label: 'Belgium' },
    { label: 'Belize' },
    { label: 'Benin' },
    { label: 'Bermuda' },
    { label: 'Bhutan' },
    { label: 'Bolivia, Plurinational State of' },
    { label: 'Bonaire, Sint Eustatius and Saba' },
    { label: 'Bosnia and Herzegovina' },
    { label: 'Botswana' },
    { label: 'Bouvet Island' },
    { label: 'Brazil' },
    { label: 'British Indian Ocean Territory' },
    { label: 'Brunei Darussalam' },
  ].map(suggestion => ({
    value: suggestion.label,
    label: suggestion.label,
  }));
  

class IntegrationReferenceSelect extends React.Component {
    state = {
      SelectedCountry: 'Armenia',
      SelectedCountries: []
    };
  
    handleChange = name => value => {
      this.setState({
        [name]: value,
      });
    };
  
    render() {
      
      return (
          <div>
        {/*<div className={classes.root}>*/}
          <ReferenceSelect
            id={'SelectedCountry'}
            multiSelect={false} 
            label="Country"
            onChange={this.handleChange('SelectedCountry')}
            options={suggestions} value={this.state.SelectedCountry}/>

          <ReferenceSelect
            id={'SelectedCountries'}
            multiSelect={true} 
            label="Countries"
            onChange={this.handleChange('SelectedCountries')}
            options={suggestions} value={this.state.SelectedCountries}/>
          {/*<Input
            fullWidth
            inputComponent={SelectWrapped}
            value={this.state.multi}
            onChange={this.handleChange('multi')}
            placeholder="Select multiple countries"
            name="react-select-chip"
            inputProps={{
              classes,
              multi: true,
              instanceId: 'react-select-chip',
              id: 'react-select-chip',
              simpleValue: true,
              options: suggestions,
            }}
          />
          <TextField
            fullWidth
            value={this.state.multiLabel}
            onChange={this.handleChange('multiLabel')}
            placeholder="Select multiple countries"
            name="react-select-chip-label"
            label="With label"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputComponent: SelectWrapped,
              inputProps: {
                classes,
                multi: true,
                instanceId: 'react-select-chip-label',
                id: 'react-select-chip-label',
                simpleValue: true,
                options: suggestions,
              },
            }}
        />*/}
        </div>
      );
    }
  }
  

  //export default withStyles(styles)(IntegrationReferenceSelect);
  export default IntegrationReferenceSelect;
