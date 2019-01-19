import React from 'react';
import {TextInput,CheckboxInput, DateInput} from '../../elements/FormElements/FormElements';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Cached';
import VisibleIcon from '@material-ui/icons/Visibility';
import VisibleOffIcon from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';







export default class HeaderInputField extends React.Component {
  
  getInput = (type) => {
    const {t, handleChange, handleReset, field, ...rest} = this.props;

      switch(type) {
        case 'TextInput':
            return (<TextInput
                                      id={field.id}
                                      type="text"
                                      label={t(field.label)}
                                      disabled={!field.visible}
                                      value={field.value}
                                      onChange={handleChange}
                                      InputProps={{
                                          endAdornment: <InputAdornment position="end">
                                                          <Tooltip title={t("reset")}>
                                                          <div>
                                                          <IconButton onClick={(e)=>handleReset(e,field.id)} aria-label="Reset" disabled={!field.visible}>
                                                            <RefreshIcon />
                                                          </IconButton>
                                                          </div>
                                                          </Tooltip>
                                                          <CheckboxInput
                                                            id={field.id+"_show"}
                                                            icon={<VisibleOffIcon />}
                                                            checkedIcon={<VisibleIcon />}
                                                            label={''}
                                                            checked={field.visible}
                                                            onChange={handleChange}
                                                          />
                                                        </InputAdornment>
                                      }}
                                      {...rest}
                                    />
                                    
                                    );
            
        case 'DateInput':
            return(<DateInput
                                      id={field.id}
                                      label={t(field.label)}
                                      disabled={!field.visible}
                                      value={field.value}
                                      onChange={handleChange}
                                      InputProps={{
                                          endAdornment: <InputAdornment position="end">
                                                          <Tooltip title="Reset">
                                                          <div>
                                                          <IconButton onClick={(e)=>handleReset(e,field.id)} aria-label="Reset" tooltip='reset' disabled={!field.visible}>
                                                            <RefreshIcon />
                                                          </IconButton>
                                                          </div>
                                                          </Tooltip>
                                                          <CheckboxInput
                                                            id={field.id+"_show"}
                                                            icon={<VisibleOffIcon />}
                                                            checkedIcon={<VisibleIcon />}
                                                            label={''}
                                                            checked={field.visible}
                                                            onChange={handleChange}
                                                          />
                                                        </InputAdornment>
                                      }}
                                      {...rest}
                                    />);
        case 'CheckboxInput':
            return(<CheckboxInput
                                      id={field.id+"_show"}
                                      label={t(field.label)}
                                      value={field.id}
                                      onChange={handleChange}
                                      checked={field.visible}
                                      {...rest}
                                    />);
        
            
        default:
            return null;
        }
    
      



  }
  
  render() {
    //console.log('PROPS',this.props);
    const {field} = this.props;

    
    return (
      <div>
        {field.type &&
          

          this.getInput(field.type)
                            
         
        }
      </div>
    );
  }
}


