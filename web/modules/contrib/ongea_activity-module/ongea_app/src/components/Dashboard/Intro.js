import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';
//import Button from '@material-ui/core/Button';
import projectImage from '../../assets/logos/project.svg'
import activityImage from '../../assets/logos/activity.svg'
import mobilityImage from '../../assets/logos/mobility.svg'
import Image from '../elements/Media/Image';

export default class Intro extends React.Component {
  render() {
    const {t} = this.props;
    return (
      <div>
        <Paper className="ongeaAct__intro">
          <div>
            <h3 className="ongeaAct__intro-title">{t("get_started")}</h3>
            <div className="ongeaAct__intro-shortcuts">
              <Grid container spacing={24} className="ongeaAct__shortcuts">
                <Grid item xs={12} sm={12} md={4} className="ongeaAct__shortcuts-item">

                  <Image src={projectImage}></Image>
                  <h3>{t("project")}</h3>
                  <p>{t("info_project")}</p>
                  <Link to="/projects/new">{t('add_new_project')}</Link>

                </Grid>

                <Grid item xs={12} sm={12} md={4} className="ongeaAct__shortcuts-item">
                  <Image src={activityImage}></Image>
                  <h3>{t("activity")}</h3>
                  <p>{t("info_activity")}</p>
                  <Link to="/activities/new">{t('add_new_activity')}</Link>
                </Grid>

                <Grid item xs={12} sm={12} md={4} className="ongeaAct__shortcuts-item">
                  <Image src={mobilityImage}></Image>
                  <h3>{t("mobility")}</h3>
                  <p>{t("info_mobility")}</p>
                  <Link to="/mobilities">{t('add_new_mobility')}</Link>

                </Grid>
              </Grid>
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}
