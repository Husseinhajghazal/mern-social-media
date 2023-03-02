import React, { useRef, useState, useEffect } from "react";
import Button from "../Button/Button";
import "./ImageUpload.css";
import { motion } from "framer-motion";

const ImageUpload = ({ id, error, isValid, onChange }) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    setFile(event.target.files[0]);
    onChange("image", event.target.files[0]);
  };

  return (
    <div>
      <input
        id={id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className="image-upload">
        <div className={`image-upload__preview ${isValid && "false"}`}>
          {previewUrl && (
            <motion.img
              animate={{ scale: 1 }}
              initial={{ scale: 1.2 }}
              src={previewUrl}
              alt="Preview"
            />
          )}
          {!previewUrl && (
            <p style={{ color: isValid ? "#ee0000" : "#00acee" }}>
              Please pick an image.
            </p>
          )}
        </div>
        <Button
          type="button"
          text="Pick image"
          onClick={() => filePickerRef.current.click()}
        />
      </div>
      {isValid && (
        <p
          className="text-center mt-1"
          style={{ color: "#ee0000", fontSize: 13 }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
