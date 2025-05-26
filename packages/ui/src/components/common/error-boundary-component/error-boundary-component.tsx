import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import Icon from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface ErrorBoundaryState {
  error: any;
  errorInfo: ErrorInfo | null;
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: any, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
  }

  override render() {
    const { hasError, errorInfo } = this.state;
    if (hasError) {
      return (
        <Result
          status="error"
          title="Failed Loading Component"
          subTitle="Please check component configurations and try again."
          extra={[
            // <Button type="primary" key="go_back" >
            //     <Link to="/" >Go Back </Link>
            // </Button>,
            <Button key="buy" onClick={() => { window.location.reload() }}>Reload</Button>,
          ]}
        >
          <div className='desc'>
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 16,
                }}
              >
                The request has the following error:
              </Text>
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: 'red' }} type='close-circle' /> {errorInfo && errorInfo.componentStack.toString()}
            </Paragraph>
          </div>
        </Result>
      );
    }
    return <>{this.props.children}</>;
  }
}

export default ErrorBoundaryComponent;
