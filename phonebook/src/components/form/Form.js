import React from "react"
import {
  Grid,
  makeStyles,
  Card,
  CardContent,
  MenuItem,
  InputLabel,
  Select,
  CardActions,
  Button,
  CardHeader,
  FormControl,
} from "@material-ui/core"

import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { TextField } from "formik-mui"
import { getApiData, postApiData } from "../../api/api"

const useStyle = makeStyles((theme) => ({
  padding: {
    padding: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
}))

//Data
const initialValues = {
  firstname: "Omic",
  lastname: "Rocks",
  phone: "5558675309"
}


//phone validation
const lowercaseRegEx = /(?=.*[a-z])/
const uppercaseRegEx = /(?=.*[A-Z])/
const numericRegEx = /(?=.*[0-9])/
const lengthRegEx = /^[0-9]{10}$/

//validation schema
let validationSchema = Yup.object().shape({
  firstname: Yup.string().required("Required"),
  lastname: Yup.string().required("Required"),
  phone: Yup.string()
    .matches(numericRegEx, "Must contains numeric digits!")
    .required("Required!"),
})

const UserForm = ({ addContact, sendMessage }) => {
  const classes = useStyle()

  const onSubmit = async (values, { resetForm }) => {

    try {
      const obj = {
        "firstname": values.firstname,
        "lastname": values.lastname,
        "phone": values.phone,
      }
      await postApiData(obj)
      sendMessage("Action Performed");
      resetForm(initialValues)
      const newresp = await getApiData()
      addContact(newresp)
    } catch (error) {
      console.log("##### submit error #####", error)
    }
  }

  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid item xs={12} md={6}>
        <Card className={classes.padding}>
          <CardHeader title="PhoneBook"></CardHeader>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>

            {({ dirty, isValid, values, handleChange, handleBlur }) => {
              return (
                <Form>
                  <CardContent>
                    <Grid item container spacing={3} justifyContent="center">
                      <Grid item xs={12}>
                        <Field
                          label="First Name"
                          variant="outlined"
                          fullWidth
                          name="firstname"
                          value={values.firstname}
                          component={TextField}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          label="Last Name"
                          variant="outlined"
                          fullWidth
                          name="lastname"
                          value={values.lastname}
                          component={TextField}
                        />
                      </Grid>


                      <Grid item xs={12}>
                        <Field
                          label="Phone"
                          variant="outlined"
                          fullWidth
                          name="phone"
                          value={values.phone}
                          component={TextField}
                        />
                      </Grid>

                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button
                      disabled={!dirty || !isValid}
                      variant="contained"
                      color="primary"
                      type="Submit"
                      className={classes.button}>
                      Add User
                    </Button>
                  </CardActions>
                </Form>
              )
            }}
          </Formik>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserForm
