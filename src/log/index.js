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
  debug(...args) {
    consoleDebug(TAG, ...args);
  },

  error(...args) {
    consoleError(TAG, ...args);
  },

  info(...args) {
    consoleInfo(TAG, ...args);
  },

  log(...args) {
    consoleLog(TAG, ...args);
  },

  warn(...args) {
    consoleWarn(TAG, ...args);
  },

  trace(...args) {
    consoleTrace(TAG, ...args);
  },
};

export default Log;
