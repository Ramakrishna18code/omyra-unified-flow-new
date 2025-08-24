// Frontend Error Logging Service
export class ErrorLogger {
  private static logToConsole = true;
  private static logToServer = false; // Can be enabled for production

  static log(error: Error | string, context?: string, data?: any) {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : undefined;

    // Console logging with styling
    if (this.logToConsole) {
      console.group(`🚨 [${timestamp}] Frontend Error`);
      console.error(`❌ Message: ${errorMessage}`);
      if (context) console.error(`📍 Context: ${context}`);
      if (data) console.error(`📦 Data:`, data);
      if (stack) console.error(`📚 Stack:`, stack);
      console.groupEnd();
    }

    // You can also send to backend or external service
    if (this.logToServer) {
      // fetch('/api/errors', { method: 'POST', body: JSON.stringify({ error: errorMessage, context, data, stack, timestamp }) });
    }
  }

  static info(message: string, context?: string, data?: any) {
    const timestamp = new Date().toISOString();
    
    if (this.logToConsole) {
      console.group(`ℹ️ [${timestamp}] Info`);
      console.log(`✅ Message: ${message}`);
      if (context) console.log(`📍 Context: ${context}`);
      if (data) console.log(`📦 Data:`, data);
      console.groupEnd();
    }
  }

  static logApiError(url: string, method: string, status: number, response: any) {
    const timestamp = new Date().toISOString();
    
    console.group(`🔥 [${timestamp}] API Error`);
    console.error(`🌐 URL: ${method} ${url}`);
    console.error(`📊 Status: ${status}`);
    console.error(`📦 Response:`, response);
    console.groupEnd();
  }

  static logNetworkError(url: string, method: string, error: Error) {
    const timestamp = new Date().toISOString();
    
    console.group(`🌐 [${timestamp}] Network Error`);
    console.error(`🌐 URL: ${method} ${url}`);
    console.error(`❌ Error: ${error.message}`);
    console.error(`📚 Stack:`, error.stack);
    console.groupEnd();
  }

  static logComponentError(componentName: string, error: Error, props?: any) {
    const timestamp = new Date().toISOString();
    
    console.group(`⚛️ [${timestamp}] Component Error`);
    console.error(`🧩 Component: ${componentName}`);
    console.error(`❌ Error: ${error.message}`);
    if (props) console.error(`🎛️ Props:`, props);
    console.error(`📚 Stack:`, error.stack);
    console.groupEnd();
  }
}

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  ErrorLogger.log(event.error, 'Global Error Handler', {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  ErrorLogger.log(event.reason, 'Unhandled Promise Rejection', {
    promise: event.promise
  });
});

export default ErrorLogger;
