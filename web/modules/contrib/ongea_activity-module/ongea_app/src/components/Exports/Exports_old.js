import React from 'react';
import ContentView from '../_Views/ContentView'
import { ContentTypes } from '../../config/content_types';
import {translate} from "react-i18next";
import Panel from '../elements/Panel';
import FormRowLayout from '../elements/FormElements/FormRowLayout';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SelectInput } from '../elements/FormElements/FormElements';
import moment from 'moment';
import PrintIcon from '@material-ui/icons/Print';
import Button from '@material-ui/core/Button';
import Container from '../elements/Container';



const activityApi = ContentTypes.Activities.api;
const getDates = function(startDate, endDate) {
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

class ActivityHeader extends React.Component {
  render() {const {activity} = this.props;
    return (
      <div className="print">
        <h1>{activity.title}</h1>
        {(
         () => {
          var a = moment(activity.dateFrom);
var b = moment(activity.dateTo);
const dates = getDates(a,b);     

          return (<ul>
            {
              dates.map((date,index) => {return(
               <li key={"date-"+index}>{moment(date,"MM-DD-YYYY").toString()}</li>)
              })
            }
          </ul>
          )}
        )()}

      </div>
    )
  }
}




class Exports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: [],
      isLoading: true,
      selectedActivityId:0,
      activity: null
    };
    this.handleChange = this.handleChange.bind(this);
  }
  static defaultProps = {
    contentType: ContentTypes.Exports
  }

  componentDidMount(){
    const activities = this.getActivities();
    this.setState({activities});
  }

  handleChange(event) {
    this.setState({selectedActivityId: event.target.value});
    this.getActivity(event.target.value);
  }
  getActivity = (id) => {
    activityApi.getSingle({id: id}).then((result) => {
      this.setState({activity: result.body});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  getActivities = () => {
    var activities = [];
    activityApi
          .get({_format:'json', scope:'small'})
          .then((result) => {
            
            result.body.map((activity) => {
              activities.push({value:activity.id,label:activity.title});
                return true;
            });
            this.setState({isLoading: false});
          })
          .catch((error) => {
            console.error(error);
          });
          return activities;
        
  }
  render() {
    const {activities,activity, isLoading,selectedActivityId} = this.state;
    const {t} = this.props;
    return (
      <ContentView {...this.props} render={() => (
        <Container>
               <Panel label={t("Choose activity")}>
                                              <FormRowLayout infoLabel=''>
                                                <SelectInput
                                                  required
                                                  id="activity"
                                                  type="text"
                                                  disabled={isLoading}
                                                  label={t("Activity")}
                                                  //error={props.touched.project && props.errors.project}
                                                  value={selectedActivityId}
                                                  onChange={this.handleChange}
                                                  onBlur={()=>console.log('blur')}
                                                  options={isLoading ? [] :activities}
                                                />
                                                {isLoading  && <CircularProgress size={24} className='ongeaAct__activity_basicForm__projectSelectProgress'/>}
                                                </FormRowLayout>
                                          </Panel>
                <hr />
                <FormRowLayout alignItems="right" fullWidth>
                <Button onClick={window.print} variant="fab" color="primary" aria-label="Add" >
        <PrintIcon />
      </Button></FormRowLayout>
               
                  { activity && <ActivityHeader activity={activity} />}
                  <h1><span aria-label="emoji: under-construction" role="img">🚧</span> &nbsp;This page is still under construction</h1>
                <pre>MAYBE TABS-CONTAINER WITH LIST-TYPES</pre>
                <pre>
                    DISPLAY LIST WITH <br />
                    HEADER<br />
                    INFO<br />
                    LIST <br />
                    FOOTER WITH COMMENTS <br />
                </pre>
            </Container>
      )} />
  );
  }
}

export default translate('translations')(Exports);
