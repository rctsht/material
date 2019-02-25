// @flow strict-local
const {
  debug: consoleDebug,
  error: consoleError,
  info: consoleInfo,
  log: consoleLog,
  warn: consoleWarn,
  trace: consoleTrace,
} = global.console;

const TAG = '@rctsht/material: ';

const Log = {
  // $FlowFixMe: console.* functions support params of any type
  debug(...args: Array<any>) {
    consoleDebug(TAG, ...args);
  },

  // $FlowFixMe: console.* functions support params of any type
  error(...args: Array<any>) {
    consoleError(TAG, ...args);
  },

  // $FlowFixMe: console.* functions support params of any type
  info(...args: Array<any>) {
    consoleInfo(TAG, ...args);
  },

  // $FlowFixMe: console.* functions support params of any type
  log(...args: Array<any>) {
    consoleLog(TAG, ...args);
  },

  // $FlowFixMe: console.* functions support params of any type
  warn(...args: Array<any>) {
    consoleWarn(TAG, ...args);
  },

  // $FlowFixMe: console.* functions support params of any type
  trace(...args: Array<any>) {
    consoleTrace(TAG, ...args);
  },
};

export default Log;
