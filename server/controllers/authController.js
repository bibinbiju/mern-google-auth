const { google } = require("googleapis");

const CLIENT_ID =
  "753326917479-jcbipmh83vc1t5mchcfpoofccmipjnev.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "http://localhost:5000/login/callback";

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

exports.authMiddleware = async (req, res, next) => {
  try {
    // 1) Get token and check if there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "Fail",
        message: "Unauthorized access",
      });
    }
    // 2) Verification token
    const verify = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const userId = verify.getUserId();
    console.log(verify);
    if (userId) {
      next();
    } else {
      return res.status(401).json({
        status: "Fail",
        message: "Unauthorized access",
      });
    }

    // 3) Check if user still exist

    // 4) Check if user changed password after the token was issued
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      status: "Fail",
      message: "Unauthorized access",
    });
  }
};
