import React from 'react';
import SearchableSelect from './SearchableSelect';
import TextField from '@material-ui/core/TextField';
import metadata from 'libphonenumber-js/metadata.min.json';
import Grid from '@material-ui/core/Grid';


export default class PhoneInput extends React.Component{

  constructor(props) {
    super(props);
    
    this.state = {
      prefix:null,
      number:null,
      wholeNumber:props.value || null
     };
  }

 
  onChange=(e,target)=>{
   
    var wholeNumber = null;
    var prefix = this.state.prefix;
    var number = this.state.number;
    if(target==='prefix'){
      prefix=e;
      
    }
    else{
      number=e.target.value;
      
    }

    wholeNumber = this.getWholeNumber(prefix,number);

    this.setState({prefix,number, wholeNumber});

    this.props.onChange(wholeNumber);
  }

  onBlur=(e)=>{
   this.props.onBlur(this.state.wholeNumber);
  }




  getWholeNumber=(prefix,number)=>{
   
    var wholeNumber=null;

    if(number){
      wholeNumber = prefix+number;
    }

    
    return wholeNumber;
  }




  getPrefixOptions = ()=>{
        var options = [];
        const callingCodes = metadata.country_calling_codes;
        Object.keys(callingCodes).map((key)=>{
          options.push({value:'+'+key,label:'+'+key+ ' ('+callingCodes[key][0]+(callingCodes[key].length>1?', ...':'')+')'});
          return true;
        });

        return (options);
     };


  render(){


    



     const {
        id,        
        value,
        error,
        label,
        onChange,
        onBlur,
        type,
        ...props
      } = this.props;
    
     


  return (
    <Grid container spacing={24}>
      <Grid item xs={4} sm={4} style={{marginTop:-3+'px'}}>
   
     <SearchableSelect
            id={'prefix_'+id}
            placeholder='Choose prefix'
            value={this.state.prefix || null}
            onChange={(e)=>this.onChange(e,'prefix')}
            options={this.getPrefixOptions()}
            onBlur={this.onBlur}
          />
      </Grid>
      <Grid item xs={8} sm={8}>
      <TextField
        error={(!!error)}
        id={id}
        name={id}
        label={label}
        className="text-input"
        type={type}
        value={this.state.number || ''}
        onChange={(e)=>this.onChange(e,'number')}
        onBlur={this.onBlur}
        helperText={error}
        {...props}
        />
      </Grid>
    </Grid>

    

  );
  }
}