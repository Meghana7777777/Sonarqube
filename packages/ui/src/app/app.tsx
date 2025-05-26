import { AxiosInstance } from '@xpparel/shared-services';
import { ConfigProvider, ThemeConfig } from 'antd';
import en_US from 'antd/es/locale/en_US';
import { useEffect, useState } from 'react';
import CustomProLayout from '../basic-layout/custom-pro-layout';
import { LoginComponent, useIAMClientState } from '../common/iam-client-react';
import LoadingSpinner from '../common/loading-spinner/loading-spinner';
import './main.css';
import bgImage from './xpperal-flow.jpg';



function App() {
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  let counter = 0;
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const script = document.createElement('script');
    const windowLocal:any=window
  
    script.src = "https://proticketx-be.schemaxtech.in/static/helpx-bot/helpx-bot.js?appClientId=39&&applicationName='Norlanka'";
  
    document.body.appendChild(script);
    script.onload = () => {
      console.log('Script loaded successfully');
      if (typeof windowLocal.initializeTicketingTool === 'function') {
        windowLocal.initializeTicketingTool();
      }
    };
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  const light: ThemeConfig = {
    // algorithm: [theme.compactAlgorithm],
    token: {
      wireframe: false,
      borderRadius: 5,
      colorPrimary: "#2c8bb1",//#1976d2
      fontFamily: `'Nunito', 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue','sans-serif'`,
    },
    components: {
      Table: {
        headerBg: '#0086ac',//'#0db1b1',
        headerColor: '#ffffff'
      },
      Collapse: {
        // headerBg: '#0096c1',
        headerBg: '#01576f',
        colorTextHeading: '#fff'
      }
    }
  }

  AxiosInstance.interceptors.request.use(request => {
    counter++;
    if (!request['loadStatus']) {
      setLoad(true);
    }
    return request;
  });

  AxiosInstance.interceptors.response.use(response => {
    counter--;
    if (counter == 0) {
      setLoad(false);
    }
    return response;
  }, error => {
    counter--;
    if (counter == 0)
      setLoad(false);
    throw error;
  })

  return (IAMClientAuthContext.isAuthenticated ? <ConfigProvider theme={light} locale={en_US}>
    <LoadingSpinner loading={load} />
    <div className="App">
      <CustomProLayout key="1" />
    </div>
  </ConfigProvider> :
    /**Old Login Component */
    <div style={{ backgroundImage: `url(${bgImage})`, display: 'flex', backgroundSize: 'cover', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <LoginComponent />      
    </div>
    /**New Standard Component */
    /* <NewLoginComponent/> */    

  );
}

export default App;
