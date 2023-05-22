const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var _db;

module.exports = {
    connectToServer: function (callback) {
        client.connect().then(function (db) {

            //verify we got a good "db" object
            if (db) {
                _db = db.db("employees");
                console.log("Successfully connected to MongoDB.");
            }
        }).catch(err=>callback(err));
    },

    getDb:function(){
        return _db;
    }
}