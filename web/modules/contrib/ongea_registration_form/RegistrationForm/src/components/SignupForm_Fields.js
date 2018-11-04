import React, {Component} from 'react';

import {config} from '../config/config';
import { Card } from 'antd';

import { Form, Input, Select, DatePicker, Spin, Icon, Radio} from 'antd';


const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const Loader = <Icon type="loading" style={{ fontSize: 24, position: 'absolute', left:50+'%', top:50+'%', marginTop:-12+'px',marginLeft:-12+'px' }} spin />;
const RadioGroup = Radio.Group;







export default class SignupForm_Fields extends Component {
  


  

getSectionFields(section){
  const sortedData = this.props.sortedData;
  var sectionFields = [];

  for(var i=0;i<sortedData.length;i++){
    const field = sortedData[i][1];
    const key = sortedData[i][0];
    const sectionIndex = field.order.split('_')[0];

    if(sectionIndex === section){
      sectionFields.push(this.props.writeInputField(field,key, i));
    }


  }
  return (sectionFields);
   
}

getSections(sortedData){
 
   var sections = [];

   for(var i=0;i<sortedData.length;i++){

      const field = sortedData[i][1];
      const sectionIndex = field.order.split('_')[0];

      if(i>0 && sectionIndex !== sortedData[i-1][1].order.split('_')[0]){
        sections.push({index:sectionIndex, label:field.groupLabel});
      }else if (i===0){
        sections.push({index:sectionIndex, label:field.groupLabel});
      }
   }

   return sections;
   
}


  render() {
    const {sortedData} = this.props;

    var sections = [];

    if(sortedData.length>0){
      sections = this.getSections(sortedData);
    }

    
    return(
        <div>
            {sections.map((section,i)=>{

                      return(
                        <div key={section.index} >
                        
                        <Card title={section.label}>
                          {this.getSectionFields(section.index)}
                        </Card>
                        <br/>
                        <br/> 
                        </div>
                          );
                        })
            }
        </div>

      );
    
 
  }
}


