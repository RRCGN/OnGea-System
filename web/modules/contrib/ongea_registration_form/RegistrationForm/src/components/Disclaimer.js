import React from 'react';
import { Checkbox } from 'antd';




export const Disclaimer = ({
  writeFormItem,
  t,
  ...props
}) => {

  return (
    <React.Fragment>
        {writeFormItem('disclaimer', {label:' '}, <Checkbox>{t('signup_form_submit_disclaimer')}</Checkbox>, 
                  {initialValue: false, 
                    rules: [{ 
                      validator(rule, value, callback){
                        if(value===true){
                          callback();
                        }else{
                          callback(new Error(t('disclaimer_error')));
                        }
                      }
                    }] 
                  })}
    </React.Fragment>
  );
};
