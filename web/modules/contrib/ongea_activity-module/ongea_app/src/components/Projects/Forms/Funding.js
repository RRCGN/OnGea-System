import React from 'react';
import EditView from '../../_Views/EditView'
import { ContentTypes } from '../../../config/content_types';
import {TextInput} from '../../elements/FormElements/FormElements';
import FileUpload from '../../elements/FormElements/FileUpload';
import Panel from '../../elements/Panel';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
 

export class FundingForm extends React.Component {
 

  static defaultProps = {
    contentType: ContentTypes.Project
  }



  

  render() {
    const readOnly = this.props.readOnly;
    return (
      <EditView {...this.props} render={(props) => (
        
        <div>
            <Panel label={props.t("funding_information")}>
                        <FormRowLayout>
                              <TextInput
                                id="fundingText"
                                disabled={readOnly}
                                type="text"
                                label={props.t("Project funding text")}
                                multiline
                                error={props.touched.fundingText && props.t(props.errors.fundingText)}
                                value={props.values.fundingText}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>
            </Panel>

            <Panel>
                        <FormRowLayout>
                              <FileUpload 
                                id="funderLogos"
                                disabled={readOnly}
                                label={props.t("Project funder logos")} 
                                snackbar={props.snackbar} 
                                accept={'image/jpeg, image/png, image/gif'}
                                text={props.t('try_dropping_files')}
                                countLimit={10}
                                value={props.values.funderLogos}
                                setFieldValue={props.setFieldValue}
                                filesAreImages={true}
                              />
                        </FormRowLayout>
              </Panel>


        </div>
      )} />
  );
  }
}

export const Funding = FundingForm;