import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import api from './utils/api';
import 'antd/dist/antd.css';
import Loader from './components/Loader';
import SignupForm from './components/SignupForm';
import {config} from './config/config';
import { withNamespaces } from "react-i18next";





class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      error: "",
      optionalFields: {},
      showSignup:false,
      user:null,
      mobility:null
    }

 
    
  }

  
  

 

  componentDidMount() {
    console.log('config is', config);
    if (config.activityId.length === 0) {
      this.setState({error: 'No Activity-Id found.'});
    } else {


       
        

        api.getOptionalFields({id:config.activityId})
          .then((result) => {
            
            const showSignup = this.shouldShowSignup(result.body);
            const user = result.body.user;
            const mobility = result.body.mobility;
          

            this.setState({optionalFields:result.body,user,mobility,isLoading:false, showSignup});

          })
          .catch((error) => {
            
            this.setState({error:"Could not get form data",isLoading:false});
          });


      
      
    }
    
  }

  shouldShowSignup=(optionalFields)=>{
    

    if(optionalFields && optionalFields.signupIsActive === true){
     
      if(optionalFields.whoCanSee === 'sign-up form visible only for logged-in users' && optionalFields.loggedIn !== true){
        return false;
      }else{

        return true;
      }

    }else{
      return false;
    }

  }

  render() {
    const {isLoading, error, optionalFields, showSignup, user, mobility} = this.state;
    
   console.log(optionalFields);
   console.log('props',this.props);
    return (
      <React.Fragment>

      {isLoading && !error.length>0 ? <Loader /> : showSignup &&
        <div className="ongea-signUp">

          
             
              {error.length > 0 && <div className="error ongea-signUp--error">Error: {error}</div>
              }

            
            <div className="ongea-signUp--intro">{this.props.t('intro_signup_form')}</div>
            <br/>

          
            
            <SignupForm t={this.props.t} user={user} mobility={mobility} optionalFields={optionalFields}/>
          
            

        </div>
      }
      </React.Fragment>
    );
  }
}

export default withNamespaces('translations')(App);