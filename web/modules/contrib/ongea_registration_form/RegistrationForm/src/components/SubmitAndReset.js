import React from 'react';
import { Button } from 'antd';
import {config} from '../config/config';


export const SubmitAndReset = ({
  handleReset,
  ...props
}) => {

  return (

    <div className='buttonWrapper'>
      <Button
      onClick={handleReset}
        >
        {('clear')}
      </Button>&nbsp;&nbsp;
   
      <Button
        htmlType="submit"
        type="primary"
        >
        {((props.saveLabel)?props.saveLabel:'submit')}
      </Button>
     
     {config.appLoginUrl && <div className="ongea-signUp--linkToApp">
        <a href={config.appLoginUrl}>I already have a login for {(config.appName && config.appName !== '') ? config.appName : (config.basePath ? config.basePath : 'this OnGea Portal')}
        </a>
      </div>}


    </div>
  );
};
