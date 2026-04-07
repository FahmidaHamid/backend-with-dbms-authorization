const logger = async (req, res, next) => {
  console.log("user is logging in...");
  next();
};

module.exports = logger;
