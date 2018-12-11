import React, { Component } from 'react'
import InfoIcon from '@material-ui/icons/Info';
import InfoLabel from './FormElements/InfoLabel';

export default class IntroText extends Component {
    render() {
        const {t,contentTypeId,location} = this.props;

        var translationKey = 'intro_'+contentTypeId;
        if(location && location.pathname){
            translationKey+='_'+((isNaN(location.pathname.split('/').pop()))?location.pathname.split('/').pop():'basic');
        }
        else{
            translationKey+='_basic';
        }
        
        const translationValue = t(translationKey);
        
        return (
            <React.Fragment>
                {(translationKey!==translationValue && 
            <div className="ongeaAct__intro ongeaAct__intro--in-content">
            <div className="ongeaAct__intro-icon">
                <InfoIcon></InfoIcon>
            </div>
            <div className="ongeaAct__intro-text">

            <InfoLabel minHeight={75}>
            {translationValue}
            </InfoLabel>
            </div>
          </div>)}
          </React.Fragment>
        )
    /*}
    else{
        return (<React.Fragment>{contentTypeId}</React.Fragment>)
    }*/
    }
}
