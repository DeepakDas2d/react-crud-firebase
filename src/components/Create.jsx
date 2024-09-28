import React, { useEffect, useState } from "react";
import db, { storage } from "../firebase/firebaseConfig";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getDoc,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const Create = () => {
  const [fName, setFName] = useState(""); // Initialized with empty string
  const [fEmail, setFEmail] = useState(""); // Initialized with empty string
  const [fileURL, setFileUrl] = useState(""); // Initialized with empty string
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setIsEdit(false);
      setFName("");
      setFEmail("");
      setFileUrl("");
    } else {
      setIsEdit(true);
      fetchSingleData();
    }
  }, [id]);

  const fetchSingleData = async () => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFName(docSnap.data().fName);
        setFEmail(docSnap.data().fEmail);
        setFileUrl(docSnap.data().fileURL);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async (e) => {
    let file = e.target.files[0];
    setIsLoading(true);

    try {
      let imageRef = storageRef(storage, `images/${file.name}`);
      await uploadBytesResumable(imageRef, file);
      const url = await getDownloadURL(imageRef);
      console.log(url);
      setFileUrl(url);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    let data = {
      _id: new Date().getUTCMilliseconds(),
      fName: fName,
      fEmail: fEmail,
      fileURL: fileURL,
      created: Timestamp.now(),
    };
    try {
      const collectionRef = collection(db, "users"); // Renamed variable
      await addDoc(collectionRef, data); // Use renamed variable

      setFName("");
      setFEmail("");
      setFileUrl("");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "users", id), {
        fName: fName,
        fEmail: fEmail,
        fileURL: fileURL,
      });
      setFName("");
      setFEmail("");
      setFileUrl("");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-50 mx-auto border p-5 bg-dark text-white rounded-4 my-5">
      <h2>{isEdit ? "Update a card" : "Add a card"}</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="input_name" className="form-label">
            Enter Name
          </label>
          <input
            type="text"
            className="form-control"
            name="input_name"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="input_email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            name="input_email"
            value={fEmail}
            onChange={(e) => setFEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-3">
          {isLoading && (
            <div className="alert alert-danger" role="alert">
              Please wait! File is uploading
            </div>
          )}

          <label htmlFor="input_file" className="form-label">
            Upload Profile
          </label>
          <div>
            {fileURL && (
              <img
                src={fileURL}
                alt={fName}
                width={100}
                className="m-2 rounded"
              />
            )}
          </div>
          <input
            type="file"
            className="form-control"
            name="input_file"
            onChange={handleUpload}
          />
        </div>
        {isEdit ? (
          <button
            type="submit"
            className={`btn btn-primary ${isLoading ? "disabled" : ""}`}
            onClick={handleEdit}
          >
            {isLoading ? "Loading..." : "Update"}
          </button>
        ) : (
          <button
            type="submit"
            className={`btn btn-primary ${isLoading ? "disabled" : ""}`}
            onClick={handleAdd}
          >
            {isLoading ? "Loading..." : "Add"}
          </button>
        )}
      </form>
    </div>
  );
};

export default Create;
