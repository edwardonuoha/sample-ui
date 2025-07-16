import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = 'dev-wdh82gg3yt66uguz.us.auth0.com';
const clientId = '1sEfKm8nTfqWWKEmPvRszRv9y89p5NFn';

// const domain = 'dev-cl040kos5bcm7biv.us.auth0.com';
// const clientId = 'qFT0J680UKxTRjV79Notcg2zJMYwhChs';
//this is found in oauth0 dashboard in Application-->APIs
const audience = 'http://localhost:9021';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                 audience: audience, // Optional: Required if you want to get access token for your backend
            }}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>
);

reportWebVitals();
