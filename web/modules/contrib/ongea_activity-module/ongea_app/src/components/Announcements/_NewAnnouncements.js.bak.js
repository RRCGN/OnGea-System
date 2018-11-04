// Higher Order Component
import React from 'react';
import { withFormik } from 'formik';
import TextField from 'material-ui/TextField';
import TextInputLine from './elements/InputFields/TextInputLine';


// Our inner form component which receives our form's state and updater methods as props
const InnerForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <form onSubmit={handleSubmit}>
<TextInputLine
                  type="number"
                  name="zahl"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.zahl}
                  />


  	<TextField
           type="email"
           name="email"
           onChange={handleChange}
           onBlur={handleBlur}
           value={values.email}
            />
    
    {touched.email && errors.email && <div>{errors.email}</div>}
    <input
      type="password"
      name="password"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.password}
    />
    {touched.password && errors.password && <div>{errors.password}</div>}
    <button type="submit" disabled={isSubmitting}>
      Submit
    </button>
  </form>
);

// Wrap our form with the using withFormik HoC
export const NewAnnouncement = withFormik({
  // Transform outer props into form values
  mapPropsToValues: props => ({ email: '', password: '',zahl:0 }),
  // Add a custom validation function (this can be async too!)
  validate: (values, props) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    return errors;
  },
  // Submission handler
  handleSubmit: (
    values,
    {
      props,
      setSubmitting,
      setErrors /* setValues, setStatus, and other goodies */,
    }
  ) => {
    alert('SEND MESSAGE TO '+values.email);
    /*LoginToMyApp(values).then(
      user => {
        setSubmitting(false);
        // do whatevs...
        // props.updateUser(user)
      },
      errors => {
        setSubmitting(false);
        // Maybe even transform your API's errors into the same shape as Formik's!
        setErrors(transformMyApiErrors(errors));
      }
    );*/
  },
})(InnerForm);
