var request = require('request');
var fs = require('fs');
var flow = require('flow')


var LOGIN_URL = '/Templates/Start.aspx';
var OPEN_INVERTER_URL = '/FixedPages/InverterSelection.aspx';
var SET_FILE_DATE_URL = '/FixedPages/InverterSelection.aspx';
var CURRENT_PRODUCTION_URL = '/Dashboard?_=1';
var DOWNLOAD_RESULTS_URL = '/Templates/DownloadDiagram.aspx?down=diag';


/**
 * Sunny Portal API Node Library
 * For interfacing with Sunny Portal.
 *
 * @module
 * @param {Object} opts  Need to pass in a url, username, password, and you plantOID.
 */
var SunnyPortal = function(opts) {

	if(!opts.url) {
		throw new Error('URL Option Must Be Defined');
	}
	if(!opts.username) {
		throw new Error('Username Must Be Defined');
	}
	if(!opts.password) {
		throw new Error('Password Must Be Defined');
	}
	if(!opts.plantOID) {
		throw new Error('Plant OID Must Be Defined');
	}

	var url = opts.url;
	var username = opts.username;
	var password = opts.password;
	var plantOID = opts.plantOID;

	var _login = function(callback) {
		var jar = request.jar();

		var requestOpts = {
			form : {
				__EVENTTARGET : '',
				__EVENTARGUMENT: '',
				__VIEWSTATE: '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',
				ctl00$ContentPlaceHolder1$Logincontrol1$LoginBtn : 'Login',
				ctl00$ContentPlaceHolder1$Logincontrol1$txtPassword : password,
				ctl00$ContentPlaceHolder1$Logincontrol1$txtUserName : username
			},
			// Service does not have a valid cert
			strictSSL : false,
			jar : jar,
			headers: {
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36'
			}
		};

		request.post(url + LOGIN_URL, requestOpts, function (err, httpResponse, body) {
			if (err) {
				console.error('login failed:', err);
				callback(err);
				return ;
			}
			// Hack to check for login.  Should forward to dashboard.
			if(httpResponse.headers.location && httpResponse.headers.location=='/Plants') {
				callback(err, jar);
			} else {
				callback(new Error('Login Failed'));
			}

			
		});

	};

	var _openInverter = function(jar, callback) {

		var requestOpts = {
			method : 'GET',
			strictSSL : false,
			jar : jar
		}	

		request(url + OPEN_INVERTER_URL, requestOpts, function (err, httpResponse, body) {
			
			if (err) {
				console.error('Could not open inverter')
				callback(err);
			}
			callback(err, body);
		});
	};

	var _setFileDate = function(month, day, year,jar,  callback) {
		//Javascript: January=0. Sunnyportal: January=1;
		var month = month+1;

		var form = {
			__EVENTTARGET:'',
			ctl00$ContentPlaceHolder1$UserControlShowInverterSelection1$DeviceSelection$HiddenPlantOID : plantOID,
			ctl00$ContentPlaceHolder1$UserControlShowInverterSelection1$SelectedIntervalID:'3',
			ctl00$ContentPlaceHolder1$UserControlShowInverterSelection1$UseIntervalHour:'0',
			ctl00$ContentPlaceHolder1$UserControlShowInverterSelection1$_datePicker$textBox: month + '/' + day + '/' + year,
			ctl00$HiddenPlantOID : plantOID
		}

		var requestOpts = {
			method : 'POST',
			form : form,
			// Service does not have a valid cert
			strictSSL : false,
			jar : jar
		};

		request.post(url + SET_FILE_DATE_URL, requestOpts, function (err, httpResponse, body) {
			if (err) {
				console.error('login failed:', err);
				callback(err);
				return ;
			};
			callback(err, body);
		});	
	};

	var _downloadResults = function(jar, callback) {
		var requestOpts = {
			method : 'GET',
			strictSSL : false,
			jar : jar
		}
		request(url + DOWNLOAD_RESULTS_URL, requestOpts, function(err, httpResponse, body) {
			if (err) {
				console.error('login failed:', err);
				callback(err);
				return ;
			};
			callback(err, body);
		});
	}

	/**
	* Returns the current production at this moment in time.
	*
	* @method currentProduction
	* @param {Number} month
	* @param {Number} day
	* @param {Number} year 
	* @param {Function} callback A callback function once current production is recieved.  Will return a JSON object of the current status.
	*/
	var currentProduction = function(callback) {
		_login(function(err, jar) {
			if(err) {
				callback(err);
			}

			var requestOpts = {
				method : 'GET',
				strictSSL : false,
				jar : jar
			}	
			//The timestamp is just ignored. Using 1.
			request(url + CURRENT_PRODUCTION_URL, requestOpts, function (err, httpResponse, body) {
				if (err) {
					console.error('Could not get instance production')
					callback(err);
				}
				callback(err, JSON.parse(body));
			});
		});
	};

	/**
	* Returns historical production for a given day.  
	*
	* @method historicalProduction
	* @param {Number} month 0=January
	* @param {Number} day
	* @param {Number} year 
	* @param {Function} callback A callback function once historical production is recieved. Will return a JSON object of the days production.
	*/
	var historicalProduction = function(month, day, year, callback) {

		// Due to app dependencies, you cannot just download the document.  
		//You need to crawl the application such that items get added to your session.  
		//Then you may download the days data.
		//
		//You could make this more efficient by not loging in everytime but... I just wanted something quick and dirty.
		var finalJar;
		flow.exec(
			function() {
				_login(this);
			},
			function(err, jar) {
				finalJar = jar;
				_openInverter(finalJar, this);
			},
			function(err, body) {
				_setFileDate(month, day, year, finalJar, this);
			},
			function(err, body) {
				_downloadResults(finalJar, this);
			},
			function(err, body) {
				var response = {};

				var lineItems = body.split('\n');
				//Skip the first line. It is a header
				for(i=1; i<lineItems.length; i++) {
					var entries = lineItems[i].split(';');
					if(entries[0] && entries[1]) {
						//8:30 PM 
						var ampm = entries[0].split(' ')[1];
						var time = entries[0].split(' ')[0];
						var hour = parseInt(time.split(':')[0]);
						var minute = parseInt(time.split(':')[1]);

						if(ampm == 'PM' && hour < 12) {
							hour += 12;
						}
						if(ampm == 'AM' && hour == 12) {
							hour = 0;
						}

						var date = new Date(year, month, day, hour, minute);
						//If set to midnight the next day, add another day. Their response is messed up
						if(hour == 0 && minute == 0) {
							date.setDate(date.getDate() + 1);
						}
						//Unix Time
						response[(date.getTime()/1000)] = parseFloat(entries[1]);
					}
				}
				
				callback(err, response);
			}
		);
	};

	return {
		currentProduction : currentProduction,
		historicalProduction : historicalProduction
	};

};

module.exports = SunnyPortal;
