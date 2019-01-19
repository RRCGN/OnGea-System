import React from 'react';
import Panel from '../../elements/Panel';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import HeaderInputField from '../ExportElements/HeaderInputField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import {CheckboxInput} from '../../elements/FormElements/FormElements';






export default class ExportSettings extends React.Component {
  
  
  render() {
    //console.log('PROPS',this.props);
    const {t,handleChange_Header, handleChange_List, handleReset, fields_Header, hasIndex, columnVisibility, noIndex, hr} = this.props;
    
    return (
      <div className="ongeaAct__exports_settings">
        <Panel label={t("header")}>

      {fields_Header && fields_Header.map((field, i)=>{
        return( 
          
            <FormRowLayout infoLabel='' key={'HeaderFields_'+i}>
          {(field.id !== "dateFrom" && field.id !== "dateTo") &&
                      <HeaderInputField
                          t={t}
                          handleChange={handleChange_Header} 
                          handleReset={handleReset} 
                          field={field} 
          
                      />}

          {field.id === "dateFrom" && 
                    <Grid container spacing={40}>
                      <Grid item xs>
                     
                      <HeaderInputField
                          handleChange={handleChange_Header} 
                          handleReset={handleReset} 
                          field={field} 
                          t={t}
                      />
                      </Grid>
                      <Grid item xs>
                        <HeaderInputField
                              t={t}
                              handleChange={handleChange_Header} 
                              handleReset={handleReset} 
                              field={fields_Header.find((field)=>field.id === "dateTo")} 
                          />
                      </Grid>
                      </Grid>
                      
                    }
          </FormRowLayout>
          );

      })}


                  
      </Panel>


      {(!columnVisibility || columnVisibility.length>0) && noIndex ? null :

        <Panel label={t("include")}>
              <FormRowLayout infoLabel=''>
              <FormControl>
                    <FormLabel>{t("columns")}</FormLabel><br />
                    <FormGroup>
                    <Grid container spacing={40}>
                    <Grid item xs>
                    {!noIndex && <CheckboxInput
                                                          id={'index'}
                                                          label={t('index')}
                                                          value={'index'}
                                                          onChange={handleChange_List}
                                                          checked={hasIndex}
                                                          
                                                        />}
                {columnVisibility && columnVisibility.map((field, i)=>{
                
                return(
                    <div key={'columnVisibility_1'+i}>
                      {(i % 2 === 0) &&
                       <CheckboxInput
                                            id={field.id}
                                            label={t(field.columnLabel || field.id)}
                                            value={field.id}
                                            onChange={handleChange_List}
                                            checked={field.visible}
                                            
                                          />
                    }
                  
                
                      </div>
                                           );
                      
                      
      
                })}
                </Grid>
                <Grid item xs>
                {columnVisibility && columnVisibility.map((field, i)=>{
                
                return(
                    <div key={'columnVisibility_2'+i}>
                      {(i % 2 !== 0) &&
                       <CheckboxInput
                                            id={field.id}
                                            label={t(field.columnLabel || field.id)}
                                            value={field.id}
                                            onChange={handleChange_List}
                                            checked={field.visible}
                                            
                                          />
                        }
                
      
                    </div>
                                           );
                      
      
                })}
                </Grid>
                </Grid>
                </FormGroup>
                </FormControl>
              </FormRowLayout>
                     
            </Panel>}
      {(hr===undefined || hr===true) &&<hr />}
      </div> 
      
    );
  }
}


