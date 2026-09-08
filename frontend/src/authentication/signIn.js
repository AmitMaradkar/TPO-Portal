import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/login.css";
import { useCookies } from "react-cookie";
import API_BASE_URL from "../config/api";

const LoginForm = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["usertype", "username", "token1"]);

  const [isLoading, setLoading] = useState(false);

  const [alertMessage, setalertMessage] = useState({
    message: "",
    wholeAlert: "alert d-none alert-success",
  });

  const [formValue, setformValue] = useState({
    email: "",
    password: "",
  });

  const [usertype, setUserType] = useState("student");

  const formValidate = () => {
    if (formValue.email === "") {
      setalertMessage({
        ...alertMessage,
        wholeAlert: "alert d-block alert-danger",
        message: "Email can't be empty!",
      });
    } else if (formValue.password === "") {
      setalertMessage({
        ...alertMessage,
        wholeAlert: "alert d-block alert-danger",
        message: "Password can't be empty!",
      });
    } else {
      setLoading(true);
      axios
        .post(`${API_BASE_URL}/${usertype}/login`, formValue, {
          withCredentials: true,
        })
        .then((res) => {
          setalertMessage({
            ...alertMessage,
            wholeAlert: "alert d-block alert-success",
            message: "Login successful!",
          });

          setCookie("token1", res.data.token, { path: "/", maxAge: 43200 });
          setCookie("usertype", `${usertype}`, { path: "/", maxAge: 43200 });
          setCookie("username", res.data?.student?.firstName, {
            path: "/",
            maxAge: 43200,
          });
          setLoading(false);
          navigate(`${usertype}/dashboard`);
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.message || "Incorrect email and password combination!";
          setalertMessage({
            ...alertMessage,
            wholeAlert: "alert d-block alert-danger",
            message: errorMessage,
          });
          setLoading(false);
        });
    }
  };

  const handleUserType = (event) => {
    setUserType(event.target.value);
  };

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card text-center">
        <div className="card-body">College TnP Platform</div>
      </div>
      <div id="signInForm">
        <main className="form-signin w-100 m-auto">
          <div className={alertMessage.wholeAlert} role="alert">
            {alertMessage.message}
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formValue.email}
              onChange={handleChange}
              id="exampleInputEmail1"
            />
            <div id="emailHelp" className="form-text">
              Enter email address as your user id
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formValue.password}
              onChange={handleChange}
              className="form-control"
              id="exampleInputPassword1"
            />
            <div id="passwordHelp" className="form-text">
              Enter secure password
            </div>
          </div>
          <div className="mb-3 d-flex form-check" onChange={handleUserType}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="usertype"
                id="flexRadioDefault1"
                value="admin"
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Admin
              </label>
            </div>
            <div className="mx-3 form-check">
              <input
                className="form-check-input"
                type="radio"
                name="usertype"
                id="flexRadioDefault2"
                value="student"
                defaultChecked="checked"
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Student
              </label>
            </div>
          </div>
          <br />
          <button onClick={formValidate} className="btn btn-primary">
            Sign In
          </button>
        </main>
      </div>
    </div>
  );
};

export default LoginForm;
