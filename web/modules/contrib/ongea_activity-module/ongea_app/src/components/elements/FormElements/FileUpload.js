import React from 'react';
import Dropzone from 'react-dropzone';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {post} from 'axios';
import {TextInput} from '../../elements/FormElements/FormElements';
import LinearProgress from '@material-ui/core/LinearProgress';
import InputLabel from '@material-ui/core/InputLabel';
import {config,apiConfig} from '../../../config/config';
import Image from '../Media/Image';
import Grid from '@material-ui/core/Grid';


export default class FileUpload extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filesPreview: [],
      currentFiles: (props.value && props.value.constructor === Array ? props.value : (props.value && [props.value])) || [],
      uploadingFiles: [],
      countLimit: props.countLimit || 10
    };

  }



  componentDidMount() {

    const filesPreview = this.updateFilesPreview(this.state.currentFiles);
    this.setState({filesPreview});

    var dropzones = Array.from(document.getElementsByClassName("filesDropZone"));
    dropzones.map((zone) => {
      const initalClass = zone.className;
      zone.ondragover = function () {
        zone.className = initalClass + ' ongeaAct__fileUpload__is-dragover';
      };
      zone.ondragenter = function () {
        zone.className = initalClass + ' ongeaAct__fileUpload__is-dragover';
      };
      zone.ondragleave = function () {
        zone.className = initalClass;
      };
      zone.ondragend = function () {
        zone.className = initalClass;
      };
      zone.ondrop = function () {
        zone.className = initalClass;
      };
      return true;
    });
  }

  convertToArray(object){

    const array = [];
    if(!Array.isArray(object)){
      array.push(object);
      return array;
    }
    else{
     return object;
    }

  }

  handleChange = (event) => {

    const inputId = event
      .target
      .id
      .split('_')[1];
    const inputType = event
      .target
      .id
      .split('_')[0];

    var currentFiles = Object.assign(this.convertToArray(this.state.currentFiles));

    for (var i = 0; i < currentFiles.length; i++) {
      if (currentFiles[i].id.toString() === inputId) {
        currentFiles[i][inputType] = event.target.value;
      }

    }

    const filesPreview = this.updateFilesPreview(currentFiles);
    this.setState({filesPreview, currentFiles});
    this
      .props
      .setFieldValue(this.props.id, currentFiles);
  }

  handleBlur(event) {}

  updateFormikInputValue(newFormikInputValue) {}

  updateFilesPreview(files) {

    var filesPreview = [];

    files = this.convertToArray(files);

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if(file){
              filesPreview.push(
                <div className="ongeaAct__fileUpload__item" key={i}>
                  <Grid container spacing={40} alignItems="center">
                    <Grid item xs={4} sm={4}>
                      <div className="ongeaAct__fileUpload__item-imageWrapper">
                        <Image
                          className="ongeaAct__fileUpload__item-image"
                          src={file.id
                          ? file.path
                          : file.url}></Image>

                        {(file.uploadStatus && file.uploadStatus < 100)
                          ? (
                            <div className="ongeaAct__fileUpload__item-imageOverlay"></div>
                          )
                          : null}
                        {(file.uploadStatus && file.uploadStatus < 100)
                          ? (<LinearProgress
                            className="ongeaAct__fileUpload__progressBar"
                            color="secondary"
                            variant="determinate"
                            value={file.uploadStatus}/>)
                          : null}

                      </div>

                      <div className="ongeaAct__fileUpload__item-filename">
                        {file.filename
                          ? file.filename
                          : 'unknown'}
                      </div>

                    </Grid>
                    <Grid item xs={6} sm={6}>
                   
                      {this.props.filesAreImages && file.id
                        ? <TextInput
                            id={"title_" + file.id}
                            type="text"
                            label="Title"
                            disabled={this.props.disabled}
                            value={file.title
                            ? file.title
                            :''}
                            onChange={(e) => this.handleChange(e)}
                            onBlur={this.handleBlur}/>
                        : null}
                      {this.props.filesAreImages && file.id
                        ? <TextInput
                            id={"alt_" + file.id}
                            type="text"
                            disabled={this.props.disabled}
                            label="Alt"
                            value={file.alt
                            ? file.alt
                            : ''}
                            onChange={(e) => this.handleChange(e)}
                            onBlur={this.handleBlur}/>
                        : null}
                    </Grid>

                    <Grid item xs={2} sm={2}>
                      {file.id
                        ? <div className="ongeaAct__fileUpload__item-action">
                            <IconButton
                              aria-label="clear"
                              disabled={this.props.disabled}
                              color="secondary"
                              styles={{
                              top: 10
                            }}
                              onClick={this
                              .clearFile
                              .bind(this, file.id)}><DeleteIcon/>
                            </IconButton>
                          </div>

                        : null}

                    </Grid>

                  </Grid>
                </div>
              );
          }

    }

    return filesPreview;

  }

  clearFile(id) {

    var currentFiles = Object.assign(this.state.currentFiles);
    console.log('currentFiles',currentFiles);

    var newCurrentFiles = currentFiles.filter(obj => obj.id !== id);

    var filesPreview = this.updateFilesPreview(newCurrentFiles);
    this.setState({filesPreview, currentFiles: newCurrentFiles});
    this
      .props
      .setFieldValue(this.props.id, newCurrentFiles);
  }

  onDrop(acceptedFiles, rejectedFiles) {

    var uploadingFiles = this.state.uploadingFiles;
    var currentFiles = this.state.currentFiles;
    var baseUrl = config.baseUrl;
    
    if (acceptedFiles.length) {
      if (acceptedFiles.length + currentFiles.length <= this.state.countLimit) {
        acceptedFiles.map((file) => {

          var uploadingFilesLength = uploadingFiles.push({url: file.preview, uploadStatus: 0, filename: file.name});

          const reader = new FileReader();
          reader.onload = () => {

            const fileAsBase64String = reader
              .result
              .split(',')[1];

            const fileUploadData = {
              "_links": {
                "type": { //TODO PUT IN UNCOMMENTED CODE IN ROW BELOW
                  "href": baseUrl+"/rest/type/file/image"
                }
              },
              "filename": [
                {
                  "value": file.name
                }
              ],
              "filemime": [
                {
                  "value": file.type
                }
              ],
              "filesize": [
                {
                  "value": file.size
                }
              ],
              "type": [
                {
                  "target_id": "image"
                }
              ],
              "data": [
                {
                  "value": fileAsBase64String
                }
              ]
            }
            const url = apiConfig.fileUploadUrl;
            const headers = apiConfig.configureHeaders();

            var config = {
              headers: {...headers, 'content-type': 'application/hal+json'},
              onUploadProgress: progressEvent => {

                //var uploadingFiles = this.state.uploadingFiles.splice();

                var percentLoaded = Math.round(progressEvent.loaded * 100 / progressEvent.total);
                if (percentLoaded >= 100) {
                  uploadingFiles[uploadingFilesLength - 1].uploadStatus = 100;

                } else {
                  uploadingFiles[uploadingFilesLength - 1].uploadStatus = percentLoaded;

                }

                var filesPreview = this.updateFilesPreview(this.state.currentFiles.concat(uploadingFiles));
                this.setState({uploadingFiles, filesPreview});

              }
            };

            post(url, fileUploadData, config).then(response => {
              var currentFiles = Object.assign(this.state.currentFiles);
              var uploadingFiles = Object.assign(this.state.uploadingFiles);

              currentFiles.push({
                id: response.data.fid[0].value,
                path: baseUrl + response.data.uri[0].url,
                filename: response.data.filename[0].value
              });

              var filesPreview = this.updateFilesPreview(currentFiles);

              var newUploadingFiles = uploadingFiles.filter(obj => obj.uploadStatus !== 100);

              this.setState({filesPreview, currentFiles, uploadingFiles: newUploadingFiles});
              this
                .props
                .setFieldValue(this.props.id, currentFiles);

            }).catch(error => {
              console.log(error);
            })
          };
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');

          reader.readAsDataURL(file);
          //reader.readAsBinaryString(file);

          return true;
        });

      } else {
        this
          .props
          .snackbar
          .showMessage("You are only allowed " + this.state.countLimit + " file here.",'warning');

      }
    }
    if (rejectedFiles.length) {
      if (rejectedFiles.length === 1) {
        this
          .props
          .snackbar
          .showMessage("The file " + rejectedFiles[0].name + " is not a jpeg or png file.",'warning');

      } else {
        this
          .props
          .snackbar
          .showMessage("Some files were not jpeg or png files.",'warning');

      }
    }
  }

  render() {

    const {filesPreview} = this.state;
    const {label, accept, text} = this.props;

    return (

      <div>

        <InputLabel>{label}</InputLabel>
        {!this.props.disabled &&
          <Dropzone
            accept={accept}
            onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
            className="filesDropZone">
            <div>{text}</div>
          </Dropzone>
        }
        {(filesPreview.length
          ? <div>
              Files uploaded: {filesPreview}

            </div>
          : null)}

      </div>
    );
  }
}