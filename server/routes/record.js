const express = require("express");
const cookie = require("js-cookie");
const axios = require("axios");
const { google } = require("googleapis");
const { authMiddleware } = require("../controllers/authController");

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

oauth2Client.on("tokens", (tokens) => {
  console.log("sdfsdfdsfs", tokens);
  if (tokens.refresh_token) {
    // store the refresh_token in your secure persistent database
    console.log(tokens.refresh_token);
  }
  console.log(tokens.access_token);
});
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from starting to objectId for _id.
const ObjectId = require("mongodb").ObjectId;
recordRoutes.route("/login").get((req, res) => {
  const { redirect } = req.query;
  try {
    // Generate a url that asks permissions for the Drive activity scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
      response_type: "code",

      // 'online' (default) or 'offline' (gets refresh_token)

      access_type: "offline",
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: "openid email",
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
      state: redirect,
    });
    res.redirect(authorizationUrl);
  } catch (error) {
    res.redirect("back");
  }
});

recordRoutes.route("/login/callback").get(async (req, res) => {
  try {
    const { code, state } = req.query;
    const gIdentity = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(gIdentity.tokens);
    res
      .cookie("token", gIdentity.tokens.id_token)
      .cookie("access-token", gIdentity.tokens.access_token)
      .redirect(state || "http://localhost:3000/login");
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "Login failed",
    });
  }
});

recordRoutes.route("/revoke").post(async (req, res) => {
  try {
    const { token } = req.body;
    const result = await oauth2Client.revokeToken(token);
    // const result = await axios.post("https://oauth2.googleapis.com/revoke", {
    //   token,
    // });
    res.clearCookie("token").clearCookie("access-token").status(204).json({
      status: "success",
      message: "Logged out",
    });
  } catch (error) {
    res.json(error);
  }
});

//This sectiopn will help you create a new record.
recordRoutes.route("/record/add").post(authMiddleware, (req, response) => {
  console.log(req);
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    position: req.body.position,
    level: req.body.level,
  };
  db_connect
    .collection("records")
    .insertOne(myobj)
    .then((res) => {
      response.cookie("nono", "sdkhsdg").json(res);
    })
    .catch((err) => {
      throw err;
    });
});

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(authMiddleware, (req, res) => {
  let db_connect = dbo.getDb("employees");
  db_connect
    .collection("records")
    .find({})
    .toArray()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      throw err;
    });
});

//This section will help you get a single record by id
recordRoutes.route("/record/:id").get(authMiddleware, (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  db_connect
    .collection("records")
    .findOne(myquery)
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      throw err;
    });
});

//This section will help you update a record by Id.
recordRoutes.route("/update/:id").post(authMiddleware, (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    },
  };
  db_connect
    .collection("records")
    .updateOne(myquery, newvalues)
    .then((res) => {
      console.log("1 document updated");
      response.json(res);
    })
    .catch((err) => {
      throw err;
    });
});

//This section will help you delete a record
recordRoutes.route("/:id").delete(authMiddleware, (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  db_connect
    .collection("records")
    .deleteOne(myquery)
    .then((res) => {
      console.log("1 document deleted");
      response.json(res);
    })
    .catch((err) => {
      throw err;
    });
});

recordRoutes.route("*").get(authMiddleware, (req, res) => {
  res.send("No route found");
});

module.exports = recordRoutes;
