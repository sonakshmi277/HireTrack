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
    const role = appState?.role;
    if (role === "admin") {
      window.location.href = "/admindash";
    } else if (role === "job_searcher") {
      window.location.href = "/jobSearchMain";
    }
  }}
>
  <App />
</Auth0Provider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
