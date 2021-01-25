import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';
import Loader from '../components/Loader';
import ErrorModal from '../components/ErrorModal';
import LinksList from '../components/LinksList';

const Links = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedLinks, setLoadedLinks] = useState();

    useEffect(() => {
        const fetchLinks = async () => {
          try {
            const responseData = await sendRequest('/api/link', 'GET', null, {
                Authorization: 'Bearer ' + auth.token
              });
    
              setLoadedLinks(responseData.links);
          } catch (err) {}
        };

        fetchLinks();
    }, [sendRequest, auth.token]);

    if (isLoading) {
        return <Loader />
    }

    if (!loadedLinks && !error) {
        return (
            <div className="center">
                <h3 style={{paddingTop: '2rem', paddingBottom: '2rem'}}>No links found. Maybe create one?</h3>
                <div className="card-action">
                  <Link
                    to={'/links/new'}
                    className="btn deep-purple lighten-1"
                  >
                    Create Link
                  </Link>
                </div>
            </div>
        );
    }

    return (
      <React.Fragment>
        {error && <ErrorModal error={error} onClear={clearError} />}
        {!isLoading && loadedLinks && <LinksList links={loadedLinks} />}
      </React.Fragment>
    );
};

export default Links;