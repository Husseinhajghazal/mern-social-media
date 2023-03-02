import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { Formik } from "formik";
import * as Yup from "yup";
import ImageUpload from "../ImageUpload/ImageUpload";
import Button from "../Button/Button";
import Input from "../Input/Input";
import "./SharePostForm.css";
import { useHttp } from "../../hooks/http-hook";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Error from "../Error/Error";
import Success from "../Success/Success";

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

const SharePostForm = ({ onClick }) => {
  const [succeeded, setSucceeded] = useState(false);

  const inputRef = useRef();
  const { isLoading, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const initialValues = {
    description: "",
    image: "",
  };

  const validationSchema = Yup.object({
    description: Yup.string()
      .required("Required.")
      .max(100, "Max character allowed 100."),
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
      await sendRequest(`http://localhost:5000/posts/`, "POST", fd, {
        Authorization: localStorage.getItem("token"),
      });

      if (!error) {
        setSucceeded(true);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (err) {}
  };

  return ReactDOM.createPortal(
    <div className="post-modal d-flex justify-content-center">
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
            animate={{ y: 0 }}
            initial={{ y: -900 }}
            exit={{ y: -900 }}
            className="d-flex flex-column p-4 gap-2"
            onSubmit={handleSubmit}
          >
            <Input
              id="description"
              type="textarea"
              placeholder="Description"
              Ref={inputRef}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={errors.description && touched.description}
              error={errors.description}
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
            <Button type="submit" text="Share post" />
          </motion.form>
        )}
      </Formik>
      <motion.div
        whileHover={{
          scale: 1.2,
          color: "#ee0000",
        }}
        whileTap={{
          scale: 0.9,
        }}
        animate={{
          x: 0,
        }}
        initial={{
          x: 50,
        }}
        exit={{
          x: 50,
        }}
        className="close"
      >
        <AiOutlineClose size="1.5rem" onClick={onClick} />
      </motion.div>
      <motion.div
        animate={{
          opacity: 1,
        }}
        initial={{ opacity: 0 }}
        exit={{
          opacity: 0,
        }}
        className="background"
        onClick={onClick}
      />
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <Error text={error} clearError={clearError} />}
      {succeeded && <Success text="Posting succeeded, reloading page in 5s" />}
    </div>,
    document.getElementById("share-post-root")
  );
};

export default SharePostForm;
