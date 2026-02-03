import logger from "./logger.js";

class Labels {
  static dbLog = {
    info: (msg) => logger.info(msg, { label: "DATABASE" }),
    error: (msg) => logger.error(msg, { label: "DATABASE" }),
    warn: (msg) => logger.warn(msg, { label: "DATABASE" }),
  };
  static controllerLog = {
    info: (msg) => logger.info(msg, { label: "CONTROLLER" }),
    error: (msg) => logger.error(msg, { label: "CONTROLLER" }),
    warn: (msg) => logger.warn(msg, { label: "CONTROLLER" }),
  };
  static authLog = {
    info: (msg) => logger.info(msg, { label: "AUTH" }),
    error: (msg) => logger.error(msg, { label: "AUTH" }),
    warn: (msg) => logger.warn(msg, { label: "AUTH" }),
  };
  static serviceLog = {
    info: (msg) => logger.info(msg, { label: "SERVICE" }),
    error: (msg) => logger.error(msg, { label: "SERVICE" }),
    warn: (msg) => logger.warn(msg, { label: "SERVICE" }),
  };
  static routeLog = {
    info: (msg) => logger.info(msg, { label: "ROUTE" }),
    error: (msg) => logger.error(msg, { label: "ROUTE" }),
    warn: (msg) => logger.warn(msg, { label: "ROUTE" }),
  };
  static validationLog = {
    info: (msg) => logger.info(msg, { label: "VALIDATION" }),
    error: (msg) => logger.error(msg, { label: "VALIDATION" }),
    warn: (msg) => logger.warn(msg, { label: "VALIDATION" }),
  };

//   this allows you create any log u want
  static createLabel(labelName) {
    return {
      info: (msg) => logger.info(msg, { label: labelName }),
      error: (msg) => logger.error(msg, { label: labelName }),
      warn: (msg) => logger.warn(msg, { label: labelName }),
    };
  }
}

export default Labels;