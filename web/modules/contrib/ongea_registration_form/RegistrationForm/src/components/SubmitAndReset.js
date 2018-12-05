import React from 'react';
import { Button } from 'antd';
import {config} from '../config/config';


export const SubmitAndReset = ({
  handleReset,
  userIsLoggedIn,
  isSubmitting,
  t,
  ...props
}) => {

  return (

    <div className='buttonWrapper'>
      <Button
      onClick={handleReset}
        >
        {t('clear')}
      </Button>&nbsp;&nbsp;
   
      <Button
        htmlType="submit"
        type="primary"
        loading={isSubmitting}
        >
        {((props.saveLabel)?t(props.saveLabel):t('submit'))}
      </Button>
     
     {config.appLoginUrl && !userIsLoggedIn && <div className="ongea-signUp--linkToApp"> 
        <a href={config.appLoginUrl}>I already have a login for {(config.appName && config.appName !== '') ? config.appName : (config.basePath ? config.basePath : 'this OnGea Portal')}
        </a>
      </div>}


    </div>
  );
};
