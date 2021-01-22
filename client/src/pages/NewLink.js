import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../components/Input';
import Loader from '../components/Loader';
import ErrorModal from '../components/ErrorModal';
import { VALIDATOR_REQUIRE } from '../utils/validators';
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';

const NewLink = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      link: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const linkSubmitHandler = async event => {
    event.preventDefault();

    try {
      const responseData = await sendRequest('/api/link/generate', 'POST', JSON.stringify({ from: formState.inputs.link.value }),  {
        Authorization: 'Bearer ' + auth.token
      });

      history.push(`/links/${responseData.link.id}`);
    } catch (err) {}
  };

  return (
  <React.Fragment>
    {error && <ErrorModal error={error} onClear={clearError} />}
    <div className="row">
      <div className="col s8 offset-s2" style={{paddingTop: '5rem'}}>
        {isLoading && <Loader asOverlay />}
        <form onSubmit={linkSubmitHandler}>
            <Input
              id="link"
              type="text"
              label="Type your link"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid URL."
              onInput={inputHandler}
            />
            <div className="card-action">
              <button
                type="submit"
                className="btn deep-purple lighten-1"
                disabled={!formState.isValid}
              >
                Generate Short Link
              </button>
            </div>
        </form>
      </div>
    </div>
  </React.Fragment>
  );
};

export default NewLink;