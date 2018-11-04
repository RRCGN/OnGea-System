import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import api from './utils/api';
import 'antd/dist/antd.css';
import Loader from './components/Loader';
import SignupForm from './components/SignupForm';
import {config} from './config/config';





class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      error: "",
      optionalFields: {},
      showSignup:false
    }

 
    
  }

  setLanguage(data) {
    console.log('setLanguage', data);
    this.setState({t: data});
  }

  



  componentDidMount() {
    console.log('config is', config);
    if (config.activityId.length === 0) {
      this.setState({error: 'No Activity-Id found.'});
    } else {


       
        

        api.getOptionalFields({id:config.activityId})
          .then((result) => {
            
            const showSignup = this.shouldShowSignup(result.body);
            
            this.setState({optionalFields:result.body,isLoading:false, showSignup});

          })
          .catch((error) => {
            
            this.setState({error:"Could not get form data",isLoading:false});
          });


       

      
    }
    
  }

  shouldShowSignup=(optionalFields)=>{
    
console.log('dd',optionalFields.signupIsActive);
    if(optionalFields && optionalFields.signupIsActive === true){
      console.log('gg');
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
    const {isLoading, error, optionalFields, showSignup} = this.state;
    
   console.log(optionalFields);
    return (
      <React.Fragment>

      {isLoading && !error.length>0 ? <Loader /> : showSignup &&
        <div className="ongea-signUp">

          
             
              {error.length > 0 && <div className="error ongea-signUp--error">Error: {error}</div>
              }

            
            

          
            
            <SignupForm optionalFields={optionalFields}/>
          
          

        </div>
      }
      </React.Fragment>
    );
  }
}

export default App