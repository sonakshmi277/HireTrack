import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-dnjrpm5yycr0i21z.us.auth0.com"
      clientId="uKEOAtn3wZMquK7QNqMq4bG0hqse9wO1"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={(appState) => {
        const role = localStorage.getItem("selectedRole");
        if (role === "admin") {
          window.history.replaceState({}, document.title, "/admindash");
        } else if (role === "job_searcher") {
          window.history.replaceState({}, document.title, "/userDashboard");
        } else {
          window.history.replaceState({}, document.title, "/");
        }
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
