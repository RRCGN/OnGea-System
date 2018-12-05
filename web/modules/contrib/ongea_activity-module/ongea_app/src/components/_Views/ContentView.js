import React from 'react'
import {translate} from "react-i18next";
import {Route} from 'react-router-dom';

import {routes, getPath} from '../../config/routes';
import Paper from '@material-ui/core/Paper';

import TabsContainer from '../elements/Tabs/TabsContainer';
import {PageContext} from '../../contexts/page-context';




//-------------------------------------
/*const TitleContext = React.createContext();
class TitleProvider extends React.Component {
  state = {
    title: '',
  }
  render() {
    return (
      <TitleContext.Provider value={this.state}>
        {this.props.children}
      </TitleContext.Provider>
    );
  }
}*/
//-------------------------------------



class ContentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subtitle: ''
      
    }
    this._isMounted = false;
  }



  componentDidMount() {
    this._isMounted=true;
    //console.log('ongea: ContentView.js componentDidMount', this.props);
   
  }
  componentWillUnmount() {
    this._isMounted=false;
   
   }

  changeSub = (value) => {
    if(this._isMounted){
      console.log('sub',value);
    this.setState({subtitle: value})
  }
  }

  

  render() {
    const {t,match} = this.props;
    const {title, id} = this.props.contentType;
    const {subtitle} = this.state;
  
    return (
      <div>
        <PageContext.Provider value={this.state}>
        <h2 className="ongeaAct__contentView_header">{t(title, {count: 0})}
        
        <span>{(subtitle)
                ? <span className="sub">{subtitle}</span>
    : ''}</span>
    {/*<PageContext.Consumer>{context => <span>{(context.config.subtitle.length <= 0)
                ? ''
    : <span className="sub">{context.config.subtitle}</span>}</span>}</PageContext.Consumer>*/}
        </h2>
        <Paper>
          {(id && id.length > 1 && !this.props.hideTabs) && <TabsContainer>

            {routes[id].map((r, i) => <div
              exact={(r.exact)
              ? "true"
              : "false"}
              key={'route-' + i}
              path={getPath(r.path,match.params.id,match.params.parentId)}
              label={t(r.label)}
              visible={(r.visible !== undefined)
              ? r.visible.toString()
              : "true"}>
              <Route
                path={r.path}
                render={(props) => (
                                <r.component {...props} value={this.state} changeSub={this.changeSub.bind(this)} contentType={this.props.contentType} t={t} setDirtyFormState={this.props.setDirtyFormState} formIsDirty={this.props.formIsDirty}/>/*updateTitle={this.updateTitle}*/
                              )}/>
            </div>)}
          </TabsContainer>
            }
          {this
            .props
          .render(this.props)}
           
        </Paper>

        </PageContext.Provider>
      </div>
    )
  }
}

//export const Content = translate('translations')(Content);
export default translate('translations')(ContentView);