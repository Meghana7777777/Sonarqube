import * as ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './app/app';
import { store } from './common/store';
import { IAMClientProvider } from './common/iam-client-react';
import { configVariables } from '@xpparel/shared-services';

const authServerUrl = configVariables.APP_IAM_SERVER_URL;
const clientId = configVariables.APP_IAM_CLIENT_ID;

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
    <Router>
        <Provider store={store}>
            <IAMClientProvider authServerUrl={authServerUrl} clientId={clientId}>
                <App />
            </IAMClientProvider>
        </Provider>
    </Router>,
);
