import React, { useState } from "react";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaSignInAlt } from "react-icons/fa";

import { useAuth } from "../../../context/context";

const SignIn = () => {
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  function handleEventChange(event) {
    const { name, value } = event.target;

    if (formErrors[name] !== "") {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmitForm(event) {
    event.preventDefault();

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required("Email field must not be empty.")
          .email("Invalid format of email.")
          .max(320),
        password: Yup.string()
          .required("Password field must not be empty.")
          .min(8)
          .max(32)
          .matches(
            /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/g,
            "Invalid format of password."
          ),
      });

      await schema.validate(formData, {
        abortEarly: false,
      });

      await handleSignIn();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessage = {
          email: "",
          password: "",
        };

        err.inner.forEach((error) => {
          if (errorMessage[error.path]) return;
          errorMessage[error.path] = error.message;
        });

        setFormErrors(errorMessage);
      }
    }
  }

  async function handleSignIn() {
    const response = await signIn(formData);

    if (response["error"]) {
      const field = Object.keys(response.error);
      setFormErrors({
        ...formErrors,
        [field]: response["error"][field],
      });
    }
  }

  return (
    <div>
      <p className="switch-pages-anchor">
        Are you new here? <Link to="/register">Sign up</Link>
      </p>
      <form className="auth-form" onSubmit={(event) => handleSubmitForm(event)}>
        <h1>Sign In</h1>

        <div
          className={
            formErrors.email !== ""
              ? "inputError auth-input-wrapper"
              : "auth-input-wrapper"
          }
          data-tooltip={formErrors.email}
        >
          <span>
            <AiOutlineMail size="30px" />
          </span>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(event) => handleEventChange(event)}
          />
        </div>
        <div
          className={
            formErrors.password !== ""
              ? "inputError auth-input-wrapper"
              : "auth-input-wrapper"
          }
          data-tooltip={formErrors.password}
        >
          <span>
            <RiLockPasswordLine size="30px" />
          </span>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(event) => handleEventChange(event)}
          />
        </div>
        <button>
          <span>
            <FaSignInAlt size="25px" />
          </span>
          <strong>Sign In</strong>
        </button>
      </form>
    </div>
  );
};

export default SignIn;
