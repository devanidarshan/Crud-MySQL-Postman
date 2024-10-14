import React, { useEffect } from 'react';

const SignOut = () => {

  useEffect(() => {
    // Redirect to the logout endpoint
    window.location.href = '/api/register-user';
  }, []);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default SignOut;
