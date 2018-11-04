import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import Loader from './components/Loader';



const FORM_DATA = initFormDataSchema;

const rootElem = document.getElementById('ongea_activity_signupform');
const config = {
  langPath: rootElem.getAttribute('data-langpath') + rootElem.getAttribute('data-lang') + '/translations.json',
  apiUrl: rootElem.getAttribute('data-api'),
  activityId: rootElem.getAttribute('data-activityid'),
  sendingOrganisationId: rootElem.getAttribute('data-sendingorganisation')
}

function postData(url = ``, data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      error: "",
      t: {},
      formData: {},
      isSubmitting:false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setLanguage(data) {
    console.log('setLanguage', data);
    this.setState({t: data});
  }

  setFormData(data) {
    let formData = FORM_DATA;
    console.log('form data', formData);
    console.log('dynamic fields', data);

    // TODO ADD ORGANISATIONS OPTIONS TO FORMDATA SELECT
    
    // ADD DYNAMIC FIELDS IF THERE ARE ANY
    if (data && data.length > 0) {
      for (var field of data) {
        console.log(field);

        var newField = {
          type: 'textfield',
          key: field.name,
          label: field.name + "-" +this.state.t[field.name],
          //placeholder: 'Enter your first name.',
          input: true,
          validate: {
            required: (field.setting === 'in-sign-up-required')
              ? true
              : false
          }
        };

        if(field.type==='date'){
          newField.type="day";
          newField.fields={
            "day": {
                "type": "number"
            },
            "month": {
                "type": "select"
            },
            "year": {
                "type": "number"
            }
          }
        }

        // GET FORMFIELD FOR DYNAMIC FIELDS
        formData
          .components[1]
          .components
          .push(newField);
      }
    }

    this.setState({formData: formData});
  }

  componentDidMount() {
    console.log('config is', config);
    if (config.activityId.length === 0) {
      this.setState({error: 'No Activity-Id found.'});
    } else {

      // GET LANG FILE
      fetch(config.langPath)
        .then(r => r.json())
        .then(data => {
          this.setLanguage(JSON.parse(data))
        })
        .catch(e => {
          // Could not load language file, enable fallback to local english file.
          fetch('./data/translations.json')
            .then(r => r.json())
            .then(data => {
              this.setLanguage(data)
            })
        })

        // GET SIGNUP-FORM OPTIONAL FIELDS
        let username = 'api';
      let password = 'api';
      let headers = new Headers();
      let formdata = new FormData();
      formdata.append('grant_type', 'password');
      formdata.append('username', username);
      formdata.append('password', password);
      headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));

      fetch(`${config.apiUrl}signup/${config.activityId}?_format=json`, {headers: headers})
        .then(r => r.json())
        .then(data => {
          this.setFormData(data);
          this.setState({loading: false});
        })
        .catch(e => {
          // Could not get signUpFormField
          this.setState({error: "Could not get form data"});
        })

        // TRY TO GET USER DATA AND PREFILL FIELDS
        var blank = "";
    }
  }

  handleSubmit(submission) {
    console.log('Form is submitting',submission);
    //event.preventDefault();
    if(!this.state.isSubmitting) {
      this.setState({isSubmitting:true});

      postData(`${config.apiUrl}signup?_format=json`, submission.data)
  .then(data => console.log(data)) // JSON from `response.json()` call
  .catch(error => console.error(error));

    }
  }

  render() {
    const {loading, error, t, formData} = this.state;
    return (
      <React.Fragment>
        <div className="ongea-signUp">

          {(!error.length > 0 && loading)
            ? <Loader></Loader>
            : <div>
              {error.length > 0 && <div className="error ongea-signUp--error">Error: {error}</div>
}

            </div>
}
          {!error.length > 0 && !loading && <div>
            <Form onSubmit={this.handleSubmit} url={config.apiUrl+'signup/?_format=json'} src={formData}/>
          </div>
}

        </div>
      </React.Fragment>
    )
  }
}

export default App