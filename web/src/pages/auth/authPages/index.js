import React, { useRef } from "react";
import { Switch, Route } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { BsCardText } from "react-icons/bs";

import SignIn from "../signIn";
import SignUp from "../signUp";

import "./styles.css";

const AuthPages = () => {
  return (
    <div className="auth-container">
      <div className="auth-decoration">
        <span>
          <BsCardText size="160px" />
        </span>
      </div>
      <div className="auth-content">
        <Route
          render={({ location }) => (
            <TransitionGroup>
              <CSSTransition key={location.key} timeout={450} classNames="fade">
                <Switch location={location}>
                  <Route path="/" exact component={SignIn} />
                  <Route path="/register" component={SignUp} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </div>
    </div>
  );
};

export default AuthPages;
