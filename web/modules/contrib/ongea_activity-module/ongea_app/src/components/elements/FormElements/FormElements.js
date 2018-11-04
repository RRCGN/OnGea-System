import React from 'react';

import classnames from 'classnames';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import MaterialSelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import NumberFormat from 'react-number-format';
import PhoneInput from 'react-phone-number-input/custom';
import CountrySelectNative from '../../phone_number_input/CountrySelectNative';
import InputBasic from '../../phone_number_input/InputBasic';
import metadata from 'libphonenumber-js/metadata.min.json';
import InternationalIcon from 'react-phone-number-input/international-icon';
import labels from 'react-phone-number-input/locale/default';



import FormControl from '@material-ui/core/FormControl';
import {Typography,Chip} from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearIcon from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import Input from '@material-ui/core/Input';
import 'react-select/dist/react-select.css';
import { withStyles } from '@material-ui/core/styles';
import {currencies, countries} from '../../../libs/utils/constants';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import FormRowLayout from './FormRowLayout';
import FormGroup from '@material-ui/core/FormGroup';

export const InputFeedback = ({error}) => error
  ? (
    <div className="input-feedback">{error}</div>
  )
  : null;
 




export const Label = ({
  error,
  className,
  children,
  ...props
}) => {
  return (
    <label className="label" {...props}>
      {children}
    </label>
  );
};

export const FormControls = (props) => {
  return (
    <FormRowLayout alignItems="left" fullWidth>
    <ResetAndSave 
        {...props}
      />
  </FormRowLayout>
  );
}

export const ResetAndSave = ({
  isSubmitting,
  dirty,
  handleReset,
  ...props
}) => {
  return (

    <div className='buttonWrapper'>
    {(handleReset!==undefined && <div>
      <Button
        onClick={handleReset}
        disabled={!dirty || isSubmitting}
        variant="contained">
        {props.t('reset')}
      </Button>&nbsp;&nbsp;</div>)}
   
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="contained"
        color="primary">
        {props.t((props.saveLabel)?props.saveLabel:'save')}
      </Button>
      {isSubmitting && <CircularProgress size={24} className='buttonProgress'/>}
    </div>
  );
};




export const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  ...props
}) => {
  const classes = classnames('input-group', {
    'animated shake error': !!error
  }, className);

  if (value && value.constructor === Array) {
    value = value.join();
  }
  console.log(...props);
  return (

    <div className={classes}>
      {/*<Label htmlFor={id} error={error}>
          {label}
    </Label>*/}
   
      <TextField
        error={(!!error)}
        id={id}
        name={id}
        label={label}
        className="text-input"
        type={type}
        value={value || ''}
        onChange={onChange}
        helperText={error}
        {...props}/> {/*<InputFeedback error={error} />*/}
    </div>

  );
};


 
export const TextInputSelect = ({onBlur, value,options,...props}) => {

    return(

      <TextInput 
        select 
        onBlur={event => {
            event.target.name = props.id;
            event.target.id = props.id;
            onBlur(event);
          }}
        value={value===null ? '' : value}
        {...props}
      >
      {options.map(option => (
          <MenuItem key={(option.value)?option.value:option} value={(option.value)?option.value:option}>
            {(option.label)?option.label:option}
          </MenuItem>
        ))}
      </TextInput>

    );
    };






export class SelectInput extends React.Component{

render(){

    const {id,
      label,
      error,
      value,
      onChange,
      className,
      onBlur,
      options,
      ...props
        } = this.props;
      
      

      const classes = classnames('input-group', {
        'animated shake error': !!error
      }, className);
      
      const betterValue = (value === null || value === undefined) ? '' : value;
      var key = 0;
      
      return (
        <div className={classes}>
          {/*<Label htmlFor={id} error={error}>
                      {label}
                    </Label>*/}

          <FormControl>
            <InputLabel error={(!!error)}>{label}</InputLabel>
            <MaterialSelect
              error={(!!error)}
              name={id}
              inputProps={{
                id: id,
                name: id
              }}
              className="select-input"
              type='text'
              value={betterValue}
              onChange={onChange}
              onBlur={event => {
                event.target.name = id;
                event.target.id = id;
                
                onBlur(event);
              }}
              {...props}>
              {options.map(option => (
                <MenuItem key={key++} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MaterialSelect>
            <FormHelperText error={(!!error)}>{error}</FormHelperText>
          </FormControl>

          {/*<InputFeedback error={error} />*/}
        </div>
      );
  }
};


export class MultiSelectInput extends React.Component{

render(){

    const {id,
      label,
      error,
      value,
      onChange,
      className,
      onBlur,
      options,
      ...props
        } = this.props;
     
      const betterValue = (value === null || value === undefined) ? []: value;

      const classes = classnames('input-group', {
        'animated shake error': !!error
      }, className);

      

      return (
        <div className={classes}>
          {/*<Label htmlFor={id} error={error}>
                      {label}
                    </Label>*/}

          <FormControl>
            <InputLabel error={(!!error)}>{label}</InputLabel>
            <MaterialSelect
              multiple
              error={(!!error)}
              name={id}
              inputProps={{
                id: id,
                name: id
              }}
              className="select-input"
              type='text'
              value={betterValue}
              renderValue={selected => selected.join(', ')}
              onChange={onChange}
              onBlur={event => {
                event.target.name = id;
                event.target.id = id;
                
                onBlur(event);
              }}
              {...props}>
              {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={betterValue.indexOf(option.value) > -1} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </MaterialSelect>
            <FormHelperText error={(!!error)}>{error}</FormHelperText>
          </FormControl>

          {/*<InputFeedback error={error} />*/}
        </div>
      );
  }
};



export const CurrencyInput = (props) => {

     const getCurrencyOptions = (currencies)=>{
        var options = [];
        
        Object.keys(currencies).map((key)=>{
          options.push({value:currencies[key].code,label:currencies[key].name+' - '+currencies[key].symbol});
          return true;
        });

        return (options);
     };

      return(
        <SelectInput options = {getCurrencyOptions(currencies)} {...props} />
        );

  };









export const DateInput = ({type,value,InputLabelProps,...props}) => {


  const formatNumberLength = (num, length) => {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
  }


  const getDateFormat = (dateObject) => {
    
    var date = new Date(dateObject);
    //return(date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear());
    
    return (((date.getFullYear() >= 1000) ? date.getFullYear() : formatNumberLength(date.getFullYear(),4)) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2));
  };

  return(<TextInput 
      value={!value || (value && value.constructor === Array) ?'':getDateFormat(value)}
      type='date'
      InputLabelProps={{
        shrink: true
      }}
      {...props}
      />);
};




export const TimeInput = ({type,InputLabelProps,...props}) => {

  
  return(<TextInput 
      type='time'
      InputLabelProps={{
        shrink: true
      }}
      {...props}
      />);
};



export const SwitchInput = ({
  id,
  label,
  error,
  value,
  onChange,
  className,
  ...props
}) => {
  const classes = classnames('input-group', {
    'animated shake error': !!error
  }, className);
  
  return (

    <div className={classes}>
      {/*<Label htmlFor={id} error={error}>
                    {label}
              </Label>*/}
      <FormControlLabel
        control= {<Switch checked = {value}
                            onChange = {onChange}
                            id = {id}
                            name = {id}
                            {...props} 
                          />}
        label={label} /> {/*<InputFeedback error={error} />*/}
    </div>

  );
};


export const CheckboxInput = ({
  id,
  label,
  error,
  value,
  onChange,
  className,
  ...props
}) => {
  const classes = classnames('input-group', {
    'animated shake error': !!error
  }, className);
  return (

    <div className={classes}>
      {/*<Label htmlFor={id} error={error}>
                    {label}
              </Label>*/}
      <FormControlLabel
        control= {<Checkbox checked = {value}
                            onChange = {onChange}
                            id = {id}
                            name = {id}
                            {...props} 
                          />}
        label={label} /> {/*<InputFeedback error={error} />*/}
    </div>

  );
};

export class CheckboxGroupInput extends React.Component{
  
    constructor(props) {
      super(props);
      this.state = {
          checked: this.props.value || []
       };
    }




    customOnChange = (event) => {
      const formGroupId = this.props.id;
      const setFieldValue = this.props.setFieldValue;
      let checked = Object.assign(this.state.checked);

      if(event.target.checked){
        checked.push(event.target.id);
      }
      else{
        const i = checked.indexOf(event.target.id);
        if (i > -1) {
          checked.splice(i, 1);
        }
      }

      setFieldValue(formGroupId,checked);
      this.setState({checked});

    }

    customOnBlur = (event) => {
        //console.log('Checkbox group onBlur: ',event.target);
    }

    render(){

      const {
              options,
              id,
              label,
              setFieldValue,
              value,
              error,
              ...props} = this.props;

        const {checked} = this.state;

      return(
        <FormControl>
            {label && <div><FormLabel>{label}</FormLabel>
            <br/></div>}
            <FormGroup className={"ongeaAct__formGroup "+(props.inline)?"ongeaAct__formGroup--inline":""} id={id} >
            
              {options.map(option => (
                            <CheckboxInput
                              id={option.value}
                              label={option.label}
                              value={checked.indexOf(option.value)>-1}
                              onChange={(event)=>this.customOnChange(event)}
                              onBlur={(event)=>this.customOnBlur(event)}
                              key={option.value}
                              {...props}
                            />

                          ))}
            </FormGroup>
            <FormHelperText>{error}</FormHelperText>
          </FormControl>
        );
  }
}



export class RadioInput extends React.Component{
 

    /* componentDidMount(){
      if(!this.props.disabled){
        this.props.setFieldValue(this.props.id,this.props.value);
      }
     }

     componentWillReceiveProps(newProps){
        if(this.props.disabled && !newProps.disabled){
          this.props.setFieldValue(this.props.id,this.props.value);
        }

     }*/

  render(){

    const {
      id,
      label,
      error,
      value,
      onChange,
      options,
      setFieldValue,
      disabled,
      className,
      ...props} = this.props;


  const classes = classnames('input-group', {
    'animated shake error': !!error
  }, className);

  //setFieldValue(id,value);

  return (

    <div className={classes}>
      {/*<Label htmlFor={id} error={error}>
                    {label}
              </Label>*/}
      <FormControl component="fieldset" error={!!error}>
        <FormLabel component="legend">{label}</FormLabel>
        <br/>
        
        <RadioGroup
          id={id}
          aria-label={label}
          name={id}
          value={value}
          onChange={onChange}
          {...props}
          >

          {options.map(option => (
                <FormControlLabel
                  key={option.value}
                  disabled={disabled}
                  value={option.value}
                  label={option.label}

                  control={< Radio id={id} color = "secondary" />}/>
              ))}

        </RadioGroup>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    </div>

  );
};
}



export class NumberInput extends React.Component {
  
   constructor(props) {
    super(props);
    
    this.state = {
      rawAmount : (!props.value || (props.value && props.value.constructor === Array)) ?'':props.value
     };
  }

  
  


  NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        
        onValueChange={values => {
          this.props.setFieldValue(props.name,values.value, true);
          this.setState({rawAmount:values.formattedValue});
        }}
        {...other}
      />
    );
  }


render(){

const {type,
  id,
  label,
  error,
  className,
  setFieldValue,
  helperText,
  value,
  ...props} = this.props;


  const classes = classnames('input-group', {
    'animated shake error': !!error
  }, className);

  return (

    <div className={classes}>
      {/*<Label htmlFor={id} error={error}>
          {label}
    </Label>*/}

      <TextField
        error={(!!error)}
        id={id}
        name={id}
        label={label}
        className="text-input"
        type={type}
        value={this.state.rawAmount}
        InputProps={{
            inputComponent: this.NumberFormatCustom,
          }}
        
        helperText={error}
        
        {...props}/> {/*<InputFeedback error={error} />*/}
    </div>

  );
}
}



//#region ReferenceSelectField
class Option extends React.Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props;

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {children}
      </MenuItem>
    );
  }
}


function SelectWrapped(props) {
  const { classes, ...other } = props;

  return (
    <Select
      optionComponent={Option}
      noResultsText={<Typography>{'No results found'}</Typography>}
      arrowRenderer={arrowProps => {
        return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
      }}
      clearRenderer={() => <ClearIcon />}
      valueComponent={valueProps => {
        const { value, children, onRemove } = valueProps;

        const onDelete = event => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        };

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          );
        }

        return <div className="Select-value">{children}</div>;
      }}
      {...other}
    />
  );
}






const ITEM_HEIGHT = 48;
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select--multi .Select-input': {
      margin: 0,
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,

      height: 'auto',
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0,
      color: 'inherit !important'
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black,
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select.is-focused > .Select-control': {
      background: 'none !important',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1,
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
    '.Select--single.is-searchable, .Select--multi.is-searchable': {
      padding: '23px 0 7px'
    }
  },
});
class ReferenceSelectInput extends React.Component {
  render() {
    const {id,
      label,
      error,
      value,
      options,
      onChange,
      className,
      onBlur,
      classes,
      placeholder,
      ...props} = this.props;
    
    return (
      <div className={classes}>
      {/*<Label htmlFor={id} error={error}>
                  {label}
                </Label>*/}

      <FormControl>
        <InputLabel error={(!!error)}>{label}</InputLabel>
        <div className={classes.root}>
        <Input
            fullWidth
            inputComponent={SelectWrapped}
            value={value}
            //onChange={this.handleChange('single')}
            onChange={onChange}
            placeholder=''
            id={'reference-select_'+id}
            inputProps={{
              classes,
              multi: props.multiSelect,
              name: (props.mutliSelect?'react-select-chip-label':'react-select-single'),
              instanceId: 'reference-select_'+id,
              simpleValue: true,
              options: options,
            }}
          />
          </div>
        <FormHelperText error={(!!error)}>{error}</FormHelperText>
      </FormControl>

      {/*<InputFeedback error={error} />*/}
    </div>
    )
  }
}
export const ReferenceSelect= withStyles(styles)(ReferenceSelectInput);


//#endregion 

const CountrySelectInput = ({
      id,
      label,
      error,
      value,
      options,
      onChange,
      className,
      onBlur,
      setFieldValue,
      classes,
      placeholder,
      ...props}) => {

     const getCountryOptions = (countries)=>{
        var options = [];
        
        Object.keys(countries).map((key)=>{
          options.push({value:countries[key].code,label:countries[key].name+' - '+countries[key].code});
          return true;
        });

        return (options);
     };
     
     const customOnChange = (value)=>{
       setFieldValue(id,value,true);
     };

      return(
        
       

        <FormControl>
        <InputLabel error={(!!error)}>{label}</InputLabel>
        <div className={classes.root}>
        <Input
            fullWidth
            inputComponent={SelectWrapped}
            value={value || ''}
            //onChange={this.handleChange('single')}
            onChange={customOnChange}
            onBlur={onBlur}
            placeholder=''
            id={id}
            inputProps={{
              classes,
              multi: props.multiSelect,
              name: (props.mutliSelect?'react-select-chip-label':'react-select-single'),
              instanceId: 'country-select_'+id,
              simpleValue: true,
              options: getCountryOptions(countries),
            }}
            {...props}
          />
          </div>
        <FormHelperText error={(!!error)}>{error}</FormHelperText>
      </FormControl>
        );

  };
export const CountryInput= withStyles(styles)(CountrySelectInput);


export class TelephoneInput extends React.Component{

  constructor(props) {
    super(props);
    
    this.state = {
      phone: this.props.value
     };
  }

  handleChange(phone){
    
    this.setState({ phone });
    this.props.setFieldValue(this.props.id,phone,true);
  }
  handleBlur(phone){
    
    
    this.props.setFieldTouched(this.props.id);
  }

  render(){

    
    const {
        type,
        id,
        label,
        error,
        value,
        setFieldValue,
        onChange,
        onBlur,
        className,
        setFieldTouched,
        ...props
      } = this.props;


      const classes = classnames('input-group', {
      'animated shake error': !!this.props.error
    }, className);
      

  return (

    <div className={classes}>
      {/*<Label htmlFor={id} error={error}>
          {label}
    </Label>*/}

    

        <PhoneInput
          countrySelectComponent={CountrySelectNative}
          inputComponent={InputBasic}
          internationalIcon={InternationalIcon}
          labels={labels}
          placeholder={label}
          error={error}
          value={ this.state.phone }
          id={id}
          metadata={metadata}
          type={type}
          name={id}
          label={label}
          onBlur={ (phone) => this.handleBlur(phone) }
          onChange={ (phone) => this.handleChange(phone) } 
          {...props}
        />

    </div>

  );
  }
}




