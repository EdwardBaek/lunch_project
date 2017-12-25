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
    	var uploadFilename = Date.now() + '-' +  file.originalname;
      cb(null, uploadFilename );
      console.log( file );
      console.log( "uploadFilename:", uploadFilename );
    }
});
var upload = multer({ storage: storage });

module.exports.setApi = function( app )
{
	// Login	
	app.post('/api/signup',						lunchManager.signup );
	app.put(	'/api/login',							lunchManager.login );

	// Lunch Project
	//	insert new restaurant with picture
	app.post('/api/add_new_restaurant',			upload.single('file'), lunchManager.addNewRestaurant );

	//	Restaurant
	app.get(	'/api/restaurant/:num/:offset',		lunchManager.getRestaurantList );
	app.get(	'/api/restaurant-random/:num',		lunchManager.getRandomRestaurantList );
	app.get(	'/api/restaurant-random-with-recent-today',lunchManager.getRandomRestaurantListWithRecentTodayLunch );
	app.get(	'/api/restaurant-random_with_saving',	lunchManager.getNewTodayRestaurantWithSaving );
	app.get(	'/api/restaurant-random_with_saving_and_reset',lunchManager.getNewTodayRestaurantWithSavingReset );

	app.delete(	'/api/restaurant/:id',			lunchManager.deleteRestaurant );
	app.delete(	'/api/restaurant',				lunchManager.deleteRestaurant );
	
	//	Today 	
	app.get(	'/api/today/lunch/:num/:offset',		lunchManager.getTodayLunchList );
	app.get(	'/api/today/lunch-random',			lunchManager.getRandomTodayLunch );
	
	app.post(	'/api/today/lunch',				lunchManager.insertNewTodayLunch );
	app.delete(	'/api/today/lunch',				lunchManager.deleteTodayLunch );

	// Test
	//    Http Method 
	app.get(	'/api/test',							testManager.testGet );
	app.put(	'/api/test',							testManager.testPut );
	app.post(	'/api/test',						testManager.testPost );
	app.delete(	'/api/test',						testManager.testDelete );
	//    Db
	app.get(	'/api/test/db',						testManager.testDb );	

	console.log('setApi set...');
};