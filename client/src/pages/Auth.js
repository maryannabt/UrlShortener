import React, { useState, useEffect, useContext } from 'react';

import Input from '../components/Input';
import Loader from '../components/Loader';
import ErrorModal from '../components/ErrorModal';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH
} from '../utils/validators';
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
    window.M.updateTextFields();
  }, []);

  const switchModeHandler = () => {
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          '/api/auth/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          '/api/auth/register',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        );
        
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
  <React.Fragment>
    {error && <ErrorModal error={error} onClear={clearError} />}
    <div className="row">
      <div className="col s6 offset-s3">
        <h1 style={{display: 'flex', justifyContent: 'center'}}>URL Shortener</h1>
        <div className="card blue darken-1">
        {isLoading && <Loader asOverlay />}
        <form onSubmit={authSubmitHandler}>
          <div className="card-content white-text">
            <span className="card-title">Login Required</span>
              <Input
                id="email"
                type="email"
                label="E-Mail"
                className="lime"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
              />

              <Input
                id="password"
                type="password"
                label="Password"
                className="lime"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters."
                onInput={inputHandler}
              />
          </div>
          <div className="card-action">
            <button
              type="submit"
              className="btn deep-purple lighten-1"
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
  </React.Fragment>
  );
};

export default Auth;
