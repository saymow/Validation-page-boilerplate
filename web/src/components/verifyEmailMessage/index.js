import React from "react";
import { BsCheckCircle } from "react-icons/bs";

import "./styles.css";

const VerifyEmailMessage = (props) => {
  const { email, handleReSendConfirmationEmail } = props;

  async function handleResendEmail() {
    await handleReSendConfirmationEmail();
  }

  return (
    <div className="verify-email-box">
      <div>
        <span id="verify-icon">
          <BsCheckCircle size="120px" />
        </span>
        <h1>You are one step away.</h1>
      </div>
      <div>
        <p>
          Welcome to Kanban App, we sent you a confirmation link to your
          registered email:
        </p>
        <p>
          <strong>{email}</strong>
        </p>
        <p>We're waiting you confirmate it, thus you can realize your login.</p>
      </div>
      <strong id="verify-footer-msg">
        Did'nt received it? <span onClick={handleResendEmail}>re-send</span> it
        now
      </strong>
    </div>
  );
};

export default VerifyEmailMessage;
