var lunchManager = require('./modules/lunch.js');
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
	app.get(	'/api/restaurant/:num/:offset',		lunchManager.getRestaurantList );

	app.get(	'/api/today/lunch/:num/:offset',	lunchManager.getTodayLunchList );
	
	app.put(	'/api/today/lunch',					lunchManager.insertNewTodayLunch );

	app.put(	'/api/reset_today_lunch',			lunchManager.getRestaurantList );

	app.post(	'/api/add_new_restaurant',			upload.single('uploadFile'), lunchManager.addNewRestaurant );

	app.delete(	'/api/today/lunch',					lunchManager.deleteTodayLunch );

	app.get(	'/api/test',						lunchManager.testGet );
	app.put(	'/api/test',						lunchManager.testPut );
	app.post(	'/api/test',						lunchManager.testPost );
	app.delete(	'/api/test',						lunchManager.testDelete );

	app.post(	'/api/test/db',						lunchManager.testDb );

	console.log('setApi set...');
};

// module.exports = setApi;