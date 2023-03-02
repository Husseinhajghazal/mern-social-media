import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import Nav from "../components/Nav/Nav";
import * as Yup from "yup";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { motion } from "framer-motion";
import { useHttp } from "../hooks/http-hook";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Error from "../components/Error/Error";
import Success from "../components/Success/Success";
import { useDispatch } from "react-redux";
import { setUser } from "../store/features/userSlice";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const [submiting, setSubmiting] = useState(null);

  const [successed, setSuccessed] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    name: "",
    password: "",
    oldpassword: "",
    bio: "",
  });

  useEffect(() => {
    const Fetch = async () => {
      try {
        const data = await sendRequest(
          `${process.env.URL}users/`,
          "GET",
          null,
          {
            Authorization: localStorage.getItem("token"),
          }
        );

        if (!error) {
          dispatch(setUser(data?.user));
          setInitialValues({
            name: data?.user?.name,
            bio: data?.user?.bio,
            password: "",
            oldpassword: "",
          });
        }
      } catch (err) {}
    };

    Fetch();
  }, [dispatch, error, sendRequest]);

  if (isLoading && !submiting) {
    return <LoadingSpinner asOverlay />;
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Required."),
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
      .matches(
        /(?=.*?[0-9])/g,
        "Old password should contain at least 1 number."
      ),
    oldpassword: Yup.string()
      .required("Required.")
      .min(8, "Min length of the old password should be 8.")
      .max(16, "Max length of the old password should be 16.")
      .matches(
        /(?=.*?[A-Z])/g,
        "Old password should contain at least 1 big letter."
      )
      .matches(
        /(?=.*?[a-z])/g,
        "Old password should contain at least 1 small letter."
      )
      .matches(
        /(?=.*?[0-9])/g,
        "Old password should contain at least 1 number."
      ),
    bio: Yup.string()
      .required("Required.")
      .max(50, "Bio should not be more than 50 character."),
  });

  const submitHandler = async (values) => {
    try {
      setSubmiting(true);
      await sendRequest(
        `${process.env.URL}users/`,
        "PATCH",
        JSON.stringify({
          name: values.name,
          bio: values.bio,
          oldpassword: values.oldpassword,
          password: values.password,
        }),
        {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        }
      );

      if (!error) {
        setSuccessed(true);
        setTimeout(() => {
          navigate("/");
        }, 6000);
      } else {
      }
    } catch (err) {}
    setSubmiting(false);
  };

  return (
    <section className="settings-page d-flex align-items-center justify-content-center">
      <Nav />
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
            animate={{ x: 0, opacity: 1 }}
            initial={{ x: "-100px", opacity: 0 }}
            onSubmit={handleSubmit}
            className="d-flex flex-column p-3 mt-3 mb-2 gap-5"
          >
            <div className="satir">
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
                id="bio"
                type="text"
                placeholder="Bio"
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={errors.bio && touched.bio}
                error={errors.bio}
              />
            </div>
            <div className="satir">
              <Input
                id="password"
                type="password"
                placeholder="New password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={errors.password && touched.password}
                error={errors.password}
              />
              <Input
                id="oldpassword"
                type="password"
                placeholder="Old password"
                value={values.oldpassword}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={errors.oldpassword && touched.oldpassword}
                error={errors.oldpassword}
              />
            </div>
            <p>
              Note: If you don't want to change the password just fill the two
              fields the same.
            </p>
            <Button type="submit" text="Edit" />
          </motion.form>
        )}
      </Formik>
      {submiting && <LoadingSpinner asOverlay />}
      {error && <Error text={error} clearError={clearError} />}
      {successed && <Success text="Editing succeeded, moving to Home in 6s." />}
    </section>
  );
};

export default Settings;
