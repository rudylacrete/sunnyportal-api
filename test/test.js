
var assert = require('assert');
var SunnyPortal = require('../lib/sunnyportal')
var opts = {
	url : 'https://www.sunnyportal.com',
	username : 'YOUR_USERNAME',
	password : 'YOUR_PASSWORD'
}
var plantOID = 'xxx-xxxxxxxx-xxxxxxx-xxxx';
var fakePlantOID = 'aaa';

var sunnyPortal = new SunnyPortal(opts);

//These are not proper unit tests but should be used as examples on how to access the API.
describe('testSunnyPortalAPI',function() {
	this.timeout(30000);

	it('should return an error if the user is not logged in', function(done) {
		sunnyPortal.productionData().then(done.bind(null, new Error('User is logged in but should not')))
		.catch(done.bind(null, null));
	});

	it('Should log in successfuly', function(done) {
		sunnyPortal.login().then(done.bind(null, null), done);
	});

	it('should retrieve existing data once logged in', function(done) {
		sunnyPortal.productionData().then(function(data) {
			console.log(data);
			assert(typeof data == "object", "Data is not an object");
			done()
		}).catch(done)
	});

	it('should retrieve data for one particular plant', function(done) {
		sunnyPortal.productionDataForPlant(plantOID).then(function(data) {
			console.log(data);
			assert(data.hasOwnProperty('PlantName') == true, "Something wrong with the returned data");
			done()
		}).catch(done);
	});

	it('should return an error if the given plantOID does not exist', function(done) {
		sunnyPortal.productionDataForPlant(fakePlantOID).then(done.bind(null, new Error("Get something but should not!")))
		.catch(done.bind(null, null));
	});

});