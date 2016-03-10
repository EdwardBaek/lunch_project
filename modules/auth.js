var uuid = require("node-uuid");
var Auth = function(){
	this.tokenTable = [];
	/*
	tokenTable[token] = 
	{	
		lastAccestime 	: '',
		userId 			: '',
		userEmail		: ''
	}
	*/
	this.tokenExpireDuration = 2 * 24 * 60 * 60 * 1000;
	this.tokenCheckCycle = 60 * 60 * 1000;
	this.toeknLastCheckedTime = 0;
};
Auth.prototype.getTokenInfo = function(token){
	return this.tokenTable[token];
};
Auth.prototype.isValidToken = function(token){
	return (token in this.tokenTable);
};
Auth.prototype.isValidTokenUser = function(token, userEmail){
	return (this.tokenTable[token].userEmail === userEmail);
};
Auth.prototype.removeToken = function( token ){
	delete this.tokenTable[token];
};
Auth.prototype.insertToken = function( token, userId, userEmail ){
	this.tokenTable[token] = 
	{
		lastAccestime 	: Date.now(), 
		userId 			: userId,
		userEmail 		: userEmail
	};
}
Auth.prototype.checkInValidToken = function(){
	var nNow = Date.now();
	if( ( nNow - this.toeknLastCheckedTime ) < this.tokenCheckCycle )
		return;
	for( token in this.tokenTable ){
		var tokenData = this.tokenTable[token];
		if( this.tokenExpireDuration < ( nNow - tokenData.lastAccestime ) ){
			this.removeToken(token);
		}
	}
	this.toeknLastCheckedTime = nNow;
};
Auth.prototype.getNewToken = function(){
	var strToken;
	var isContain;
	this.checkInValidToken();
	do
	{
		strToken = uuid.v4();
		isContain = this.isValidToken(strToken);
	} while( isContain === true );
	return strToken;
};
Auth.prototype.issueNewToken = function( userId, userEmail ){
	var newToken = this.getNewToken();
	this.insertToken(newToken, userId, userEmail);
	return newToken;
};
Auth.prototype.reissueToken = function( token ){
	this.tokenTable[token].lastAccestime = Date.now();
};


var _auth = new Auth();
module.exports = _auth;