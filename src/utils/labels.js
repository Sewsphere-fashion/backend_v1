import {logger} from "./logger.js";

class Labels {
  static dbLog = {
    info: (msg,meta) => logger.info(msg, { label: "DATABASE",...meta }),
    error: (msg,meta) => logger.error(msg, { label: "DATABASE",...meta }),
    warn: (msg,meta) => logger.warn(msg, { label: "DATABASE",...meta }),
  };
  static controllerLog = {
    info: (msg,meta) => logger.info(msg, { label: "CONTROLLER",...meta }),
    error: (msg,meta) => logger.error(msg, { label: "CONTROLLER",...meta }),
    warn: (msg,meta) => logger.warn(msg, { label: "CONTROLLER",...meta }),
  };
  static authLog = {
    info: (msg,meta) => logger.info(msg, { label: "AUTH",...meta }),
    error: (msg,meta) => logger.error(msg, { label: "AUTH",...meta }),
    warn: (msg,meta) => logger.warn(msg, { label: "AUTH",...meta }),
  };
  static serviceLog = {
    info: (msg,meta) => logger.info(msg, { label: "SERVICE",...meta }),
    error: (msg,meta) => logger.error(msg, { label: "SERVICE",...meta }),
    warn: (msg,meta) => logger.warn(msg, { label: "SERVICE",...meta }),
  };
  static routeLog = {
    info: (msg,meta) => logger.info(msg, { label: "ROUTE",...meta }),
    error: (msg,meta) => logger.error(msg, { label: "ROUTE",...meta }),
    warn: (msg,meta) => logger.warn(msg, { label: "ROUTE",...meta }),
  };
  static validationLog = {
    info: (msg,meta) => logger.info(msg, { label: "VALIDATION",...meta }),
    error: (msg,meta) => logger.error(msg, { label: "VALIDATION",...meta }),
    warn: (msg,meta) => logger.warn(msg, { label: "VALIDATION",...meta }),
  };

//   this allows you create any log u want
  static createLabel(labelName) {
    return {
      info: (msg,meta) => logger.info(msg, { label: labelName,...meta }),
      error: (msg,meta) => logger.error(msg, { label: labelName,...meta }),
      warn: (msg,meta) => logger.warn(msg, { label: labelName,...meta }),
    };
  }
}

export default Labels;
