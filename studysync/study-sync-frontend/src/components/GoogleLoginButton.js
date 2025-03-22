import React from 'react'; // Add this import
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <div className="google-login-wrapper">
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            navigate('/dashboard');
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;