import React from 'react';

import Moment from 'react-moment';







export default class Header extends React.Component {
  
  
  render() {
    //console.log('PROPS',this.props);
    const {t,title, subtitle, data} = this.props;
//console.log(data);
    
    return (
      <div>
        {title && <h1>{title}</h1>}
        {subtitle && <h3>{subtitle}</h3>}
        
        {data && data.map((row, i)=>{
          if(row.visible && row.value)
              if(row.type==='DateInput'){
                  return(<div key={'header'+i}>{row.label && (t(row.label)+': ')}<Moment date={row.value} format="DD.MM.YYYY" /></div>);
              }else{
                   return(<div key={'header'+i}>{row.label && (t(row.label))+': '+row.value}</div>);
              }
         return null;
        })}
        


      </div>
    );
  }
}


