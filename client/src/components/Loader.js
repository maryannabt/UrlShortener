import React from 'react';

const Loader = props => {
  const { asOverlay } = props;

  const asOverlayStyles = {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    background: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '10'
  };
  
  const regularStyles = {
    display: 'flex', 
    justifyContent: 'center', 
    paddingTop: '2rem'
  };

  return (
      <div style={asOverlay ? asOverlayStyles : regularStyles}>
        <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div>
                <div className="gap-patch">
                    <div className="circle"></div>
                </div>
                <div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
            </div>
        </div>
      </div>
  );
};

export default Loader;