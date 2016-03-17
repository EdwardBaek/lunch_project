var define  = require("./define.js");

var Util = function Util(){};

Util.prototype.responseWithHeadAndData = function responseWithHeadAndData( res, httpStatusCode, head, jsonData ){
	res.writeHead( httpStatusCode, head );
	res.end(JSON.stringify(jsonData));
};
Util.prototype.responseWithData = function responseWithData( res, httpStatusCode, jsonData ){
	res.writeHead( httpStatusCode, {"Content-Type" : "application/json"} );
	res.end(JSON.stringify(jsonData));
};

var _util = new Util();
module.exports = _util;