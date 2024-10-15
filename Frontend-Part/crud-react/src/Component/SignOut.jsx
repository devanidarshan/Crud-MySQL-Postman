import React, { useEffect } from 'react';
import Cookies  from "js-cookie";

const SignOut = () => {

  useEffect(() => {
    // Redirect to the logout endpoint
    Cookies.remove("cookieData");
    Cookies.remove("token");
    window.location.href = '/api/register-user';
  }, []);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default SignOut;
