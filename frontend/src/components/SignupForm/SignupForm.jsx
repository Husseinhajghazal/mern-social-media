import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import ImageUpload from "../ImageUpload/ImageUpload";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { motion } from "framer-motion";
import { useHttp } from "../../hooks/http-hook";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Error from "../Error/Error";

const MAX_FILE_SIZE = 51200;

const validFileExtensions = {
  image: ["jpg", "png", "jpeg"],
};

function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
}

const SignupForm = ({ changeMode }) => {
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    bio: "",
    image: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required."),
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
    bio: Yup.string()
      .required("Required.")
      .max(50, "Bio should not be more than 50 character."),
    image: Yup.mixed()
      .required("Required.")
      .test(
        "is-valid-size",
        "Max allowed size is 50KB",
        (value) => value && value.size <= MAX_FILE_SIZE
      )
      .test("is-valid-type", "Not a valid image type", (value) =>
        isValidFileType(value && value.name.toLowerCase(), "image")
      ),
  });

  const submitHandler = async (values) => {
    try {
      const fd = new FormData();
      for (let value in values) {
        fd.append(value, values[value]);
      }
      const data = await sendRequest(
        `http://localhost:5000/users/signup`,
        "POST",
        fd
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
        setFieldValue,
      }) => (
        <motion.form
          animate={{ x: 0, opacity: 1, transition: { stiffness: 400 } }}
          initial={{ x: "-100px", opacity: 0 }}
          onSubmit={handleSubmit}
          className="d-flex flex-column p-3 mt-3 mb-2 gap-2"
        >
          <Input
            id="name"
            type="text"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={errors.name && touched.name}
            error={errors.name}
          />
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
          <Input
            id="bio"
            type="text"
            placeholder="Bio"
            value={values.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={errors.bio && touched.bio}
            error={errors.bio}
          />
          <ImageUpload
            id="image"
            value={values.image}
            onChange={(a, b) => {
              setFieldValue(a, b);
            }}
            isValid={errors.image && touched.image}
            error={errors.image}
          />
          <Button type="submit" text="Sign up" />
          <Button
            type="link"
            text="Switch to login page."
            onClick={changeMode}
          />
          {isLoading && <LoadingSpinner asOverlay />}
          {error && <Error text={error} clearError={clearError} />}
        </motion.form>
      )}
    </Formik>
  );
};

export default SignupForm;
