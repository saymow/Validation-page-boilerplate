import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaSignInAlt } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

import { useAuth } from "../../../context/context";
import { ReSendConfirmationEmail } from "../../../services/authCon";

import VerifyEmailMessage from "../../../components/verifyEmailMessage";

const SignUp = () => {
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    user: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErros, setFormErros] = useState({
    user: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailCreated, setEmailCreated] = useState(false);

  function handleInputChange(event) {
    const { value, name } = event.target;

    if (formErros[name] !== "") {
      setFormErros({
        ...formErros,
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
        user: Yup.string()
          .required("User field can't be empty.")
          .min(3)
          .max(32),
        email: Yup.string()
          .required("Email field can't be empty.")
          .email("Invalid format of email.")
          .max(320),
        password: Yup.string()
          .required("Password field can't be empty.")
          .matches(
            /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/g,
            "Invalid format of password."
          )
          .min(8, "Password must have at least 8 characters.")
          .max(32, "Password must not be longer than 32 characters."),
        confirmPassword: Yup.string()
          .required("Password confirmation field can't be empty.")
          .oneOf(
            [Yup.ref("password")],
            "Confirmation doesn't match with password."
          ),
      });

      await schema.validate(formData, {
        abortEarly: false,
      });

      await handleSignUp();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessage = {
          user: "",
          email: "",
          password: "",
          confirmPassword: "",
        };

        err.inner.forEach((error) => {
          if (errorMessage[error.path]) return;
          errorMessage[error.path] = error.message;
        });

        setFormErros(errorMessage);
      }
    }
  }

  async function handleSignUp() {
    const response = await signUp(formData);

    if (response["error"]) {
      const field = Object.keys(response.error);
      setFormErros({
        ...formErros,
        [field]: response["error"][field],
      });
    } else if (response["success"]) {
      setEmailCreated(true);
    } else {
      alert("Ooops, Something went wrong :(.");
    }
  }

  async function handleReSendConfirmationEmail() {
    await ReSendConfirmationEmail(formData.email);
  }

  return (
    <div id="signUp-container">
      <p className="switch-pages-anchor">
        Already have an account? <Link to="/">Sign in</Link>
      </p>
      {emailCreated ? (
        <VerifyEmailMessage
          email={formData.email}
          handleReSendConfirmationEmail={handleReSendConfirmationEmail}
        />
      ) : (
        <form
          className="auth-form"
          onSubmit={(event) => handleSubmitForm(event)}
        >
          <h1>Sing Up</h1>
          <div
            className={
              formErros.user !== ""
                ? "inputError auth-input-wrapper"
                : "auth-input-wrapper"
            }
            data-tooltip={formErros.user}
          >
            <span>
              <FiUser size="30px" />
            </span>
            <input
              type="text"
              id="userR"
              name="user"
              value={formData.user}
              onChange={(event) => handleInputChange(event)}
            />
          </div>
          <div
            className={
              formErros.email !== ""
                ? "inputError auth-input-wrapper"
                : "auth-input-wrapper"
            }
            data-tooltip={formErros.email}
          >
            <span>
              <AiOutlineMail size="30px" />
            </span>
            <input
              type="email"
              id="emailR"
              name="email"
              value={formData.email}
              onChange={(event) => handleInputChange(event)}
            />
          </div>
          <div
            className={
              formErros.password !== ""
                ? "inputError auth-input-wrapper"
                : "auth-input-wrapper"
            }
            data-tooltip={formErros.password}
          >
            <span>
              <RiLockPasswordLine size="30px" />
            </span>
            <input
              type="password"
              id="passwordR"
              name="password"
              value={formData.password}
              onChange={(event) => handleInputChange(event)}
            />
          </div>
          <div
            className={
              formErros.confirmPassword !== ""
                ? "inputError auth-input-wrapper"
                : "auth-input-wrapper"
            }
            data-tooltip={formErros.confirmPassword}
          >
            <span>
              <RiLockPasswordLine size="30px" />
            </span>
            <input
              type="password"
              id="passwordRc"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(event) => handleInputChange(event)}
            />
          </div>
          <button>
            <span>
              <FaSignInAlt size="25px" />
            </span>
            <strong>Sign Up</strong>
          </button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
