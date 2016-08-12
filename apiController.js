var lunchManager = require('./modules/lunch.js');
var testManager = require('./modules/test.js');
var multer = require('multer');

//upload module
// var upload  = multer( { dest: './public/uploads' });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      console.log( file );
      cb(null, Date.now() + '-' +  file.originalname )
    }
});
var upload = multer({ storage: storage });

module.exports.setApi = function( app )
{
	
	app.post(	'/api/signup',						lunchManager.signup );
	app.put(	'/api/login',						lunchManager.login );

	app.post(	'/api/add_new_restaurant',			upload.single('uploadFile'), lunchManager.addNewRestaurant );

	app.get(	'/api/restaurant/:num/:offset',		lunchManager.getRestaurantList );
	app.get(	'/api/today/lunch/:num/:offset',	lunchManager.getTodayLunchList );
	
	app.post(	'/api/today/lunch',					lunchManager.insertNewTodayLunch );
	app.delete(	'/api/today/lunch',					lunchManager.deleteTodayLunch );

	app.put(	'/api/reset_today_lunch',			lunchManager.getRestaurantList );

	app.get(	'/api/test',						testManager.testGet );
	app.put(	'/api/test',						testManager.testPut );
	app.post(	'/api/test',						testManager.testPost );
	app.delete(	'/api/test',						testManager.testDelete );

	app.get(	'/api/test/db',						testManager.testDb );	

	console.log('setApi set...');
};