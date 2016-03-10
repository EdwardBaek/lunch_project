var define  = require("./define.js");

var Util = function Util(){};

Util.prototype.responseWithData = function responseWithData( res, httpStatusCode, jsonData ){
	res.writeHead( httpStatusCode, {"Content-Type" : "application/json"} );
	res.end(JSON.stringify(jsonData));
};

var _util = new Util();
module.exports = _util;