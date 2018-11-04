import React from 'react'
export const pageConfig = {
    subtitle: ''
  };
  
  export const PageContext = React.createContext({
   config: pageConfig,
   updatePageTitle: () => {},
  });