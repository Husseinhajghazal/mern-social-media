import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { motion } from "framer-motion";
import { useHttp } from "../../hooks/http-hook";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Error from "../Error/Error";

const LoginForm = ({ changeMode }) => {
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Required.")
      .email("Plese enter a valid email."),
    password: Yup.string()
      .required("Required.")
      .min(8, "Min length of the password should be 8.")
      .max(16, "Max length of the password should be 16.")
      .matches(
        /(?=.*?[A-Z])/g,
        "Password should contain at least 1 big letter."
      )
      .matches(
        /(?=.*?[a-z])/g,
        "Password should contain at least 1 small letter."
      )
      .matches(/(?=.*?[0-9])/g, "Password should contain at least 1 number."),
  });

  const submitHandler = async (values) => {
    try {
      const data = await sendRequest(
        `http://localhost:5000/users/login`,
        "POST",
        JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      if (!error) {
        localStorage.setItem("token", `Bearer ${data.token}`);
        localStorage.setItem("expiresIn", data.expiresIn);
        window.location.reload();
      }
    } catch (err) {}
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitHandler}
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <motion.form
          animate={{ x: 0, opacity: 1, transition: { stiffness: 400 } }}
          initial={{ x: "-100px", opacity: 0 }}
          onSubmit={handleSubmit}
          className="d-flex flex-column p-3 mt-3 mb-2 gap-2"
        >
          <Input
            id="email"
            type="text"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={errors.email && touched.email}
            error={errors.email}
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={errors.password && touched.password}
            error={errors.password}
          />
          <Button type="submit" text="Login" />
          <Button
            type="link"
            text="Switch to signup page."
            onClick={changeMode}
          />
          {isLoading && <LoadingSpinner asOverlay />}
          {error && <Error text={error} clearError={clearError} />}
        </motion.form>
      )}
    </Formik>
  );
};

export default LoginForm;
