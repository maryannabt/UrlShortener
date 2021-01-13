import React, { useState, useEffect } from 'react';

import Input from '../components/Input';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH
} from '../utils/validators';
import { useForm } from '../hooks/form-hook';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, inputHandler] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const switchModeHandler = () => {
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        console.log("Logged In!");
        console.log(formState.inputs);
      } catch (err) {}
    } else {
      try {
        console.log("Registered!");
        console.log(formState.inputs);
      } catch (err) {}
    }
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>URL Shortener</h1>
        <div className="card blue darken-1">
        <form onSubmit={authSubmitHandler}>
          <div className="card-content white-text">
            <span className="card-title">Login Required</span>
              <Input
                id="email"
                type="email"
                label="E-Mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
              />

              <Input
                id="password"
                type="password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters."
                onInput={inputHandler}
              />
          </div>
          <div className="card-action">
            <button
              type="submit"
              className="btn yellow darken-4"
              disabled={!formState.isValid}
            >
              {isLoginMode ? 'LOGIN' : 'REGISTRATION'}
            </button>
          </div>
        </form>
        <div className="card-action">
         <button
            className="btn grey lighten-1 black-text"
            onClick={switchModeHandler}
         >
            SWITCH TO {isLoginMode ? 'REGISTRATION' : 'LOGIN'}
         </button>
        </div>
        </div>
      </div>
     </div>
  )
}

export default Auth;
