import React from 'react';
import Header from '../ExportElements/Header';
import List from '../ExportElements/List';








export default class PrintPage extends React.Component {
  
  
  render() {
    //console.log('PROPS',this.props);
    const {t,fields_Header, dataList, hasIndex, isIterated, headers, commentHeader, commentFooter, handleRequestSort, order, orderBy, noIndex} = this.props;

    


    var title = '';
    var subtitle = '';
     //console.log('datalist',dataList);
     if(fields_Header){
        title = fields_Header.find(it => it.id === 'title' && it.visible === true);
        subtitle = fields_Header.find(it => it.id === 'subtitle' && it.visible === true);
      }

    
    return (
      
        <div className='ongeaAct__exports_printPage'>
          <div className='ongeaAct__exports_printPage-header'>
              <Header 
                title={title ? title.value : undefined}
                subtitle={subtitle ? subtitle.value : undefined}
                data={fields_Header.filter((it)=>(it.id !== 'title' && it.id !== 'subtitle'))}
                t={t}
              />

         
               </div>

          <div className='ongeaAct__exports_printPage-body'>
          {commentHeader}

          {isIterated && dataList && dataList.length >0 ? dataList.map((dataDay,i)=>{
              return (

                <div key={'list_'+i}>
                {(headers && headers.length > 0) ? <h3>{headers[i]}</h3> : null}

                <List 
                          data={dataDay}
                          hasIndex={noIndex===true?false:hasIndex}
                          t={t}
                          handleRequestSort={handleRequestSort}
                          order={order}
                          orderBy={orderBy}
                        />
                <br/><br/>
                </div>
                      );
          }):
          (dataList && dataList.length>0 && 
                                  <List 
                                    data={dataList}
                                    hasIndex={noIndex===true?false:hasIndex}
                                    t={t}
                                    handleRequestSort={handleRequestSort}
                                    order={order}
                                    orderBy={orderBy}
                                  />)
        }
          
          {commentFooter}
          </div>
           
        </div>
      
    );
  }
}


