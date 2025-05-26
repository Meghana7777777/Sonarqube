import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { AlertMessages } from 'packages/ui/src/components/common';

/**
 * Log a warning and show a toast!
 */
export const errorLoggingMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    AlertMessages.getErrorMessage(action.payload);
  }

  return next(action);
};
