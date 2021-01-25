import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';
import Loader from '../components/Loader';
import ErrorModal from '../components/ErrorModal';
import LinkCard from '../components/LinkCard';

const LinkInfo = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedLink, setLoadedLink] = useState();
    const linkId = useParams().linkId;

    useEffect(() => {
        const fetchLink = async () => {
          try {
            const responseData = await sendRequest(`/api/link/${linkId}`, 'GET', null, {
                Authorization: 'Bearer ' + auth.token
              });
    
              setLoadedLink(responseData.link);
          } catch (err) {}
        };

        fetchLink();
    }, [sendRequest, linkId, auth.token]);

    if (isLoading) {
        return <Loader />
    }

    if (!loadedLink && !error) {
        return (
          <div className="row" style={{paddingTop: '5rem'}}>
            <div className="col s6 offset-s3">
              <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                  <span className="card-title">Oops!</span>
                  <p>Could not find link!</p>
                </div>
              </div>
            </div>
          </div>
        );
    }

    return (
      <React.Fragment>
        {error && <ErrorModal error={error} onClear={clearError} />}
        {!isLoading && loadedLink && <LinkCard link={loadedLink} />}
      </React.Fragment>
    );
};

export default LinkInfo;