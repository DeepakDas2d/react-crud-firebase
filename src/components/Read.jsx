import { collection, deleteDoc, getDocs, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";

const Read = () => {
  const [userData, setUserData] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));

      const user_data = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      setUserData(user_data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on mount
  }, []);

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "users", id));
      fetchData(); // Re-fetch after deletion
    } catch (error) {
      console.error("Error deleting document:", error);
    }
    setIsLoading(false);
  };

  console.log("User Data", userData);
  return (
    <div className="p-3">
      <h2 className="text-center">CRUD App</h2>
      <div className="container">
        {isLoading && (
          <div className="alert alert-danger" role="alert">
            Data Deleted!
          </div>
        )}
        <div className="row">
          {userData.length === 0 ? ( // Use strict equality for better practice
            <div className="alert alert-primary text-center my-5" role="alert">
              <h2>No Data Found 🚫</h2>
            </div>
          ) : (
            userData.map((user) => (
              <div className="col my-5" key={user.id}>
                <div className="card" style={{ width: "15rem" }}>
                  <img
                    src={user.fileURL}
                    className="card-img-top"
                    alt={user.fName}
                    width={100}
                    height={200}
                  />
                  <div className="card-body">
                    <span className="my-5">
                      📅 - {user.created?.toDate().toDateString()}{" "}
                      {/* Check if created is defined */}
                    </span>
                    <h5 className="card-title">{user.fName}</h5>
                    <p className="card-text">{user.fEmail}</p>
                    <button
                      className="btn btn-danger my-2"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                    <Link to={`edit/${user.id}`}>
                      <button className="btn btn-success mx-2">Edit</button>
                    </Link>
                    <a href="#" className="btn btn-primary">
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Read;
