const authenticator = async (req, res, next) => {
  console.log("authenticator...");
  next(); // call the next function
};

module.exports = authenticator;
