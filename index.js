var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var DarkSky = require('dark-sky');
var forecast = new DarkSky('e260353eba9d89a8abd4ed8207666e11');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.get('/lat_lng.html', function(req, res) {
    res.sendFile(__dirname + "/" + "lat_lng.html");
})

app.post('/weather-data', urlencodedParser, function(req, res) {

    forecast
        .latitude(req.body.lat) // required: latitude, string.
        .longitude(req.body.lon)
        .exclude('minutely,daily')
        .get()
        .then(result => {
            console.log(JSON.stringify(result));
            var weather_data = result;
            if (weather_data.hasOwnProperty('flags')) {
                console.log("flag is present");
                if (weather_data.flags.hasOwnProperty('darksky-unavailable')) {
                    console.log("DarkSky service is unavailable at the moment");
                } else {
                    var obj = {};
                    console.log("DarkSky is working fine");
                    obj.darksky_unavailable = "DarkSky is working fine";
                    if (weather_data.hasOwnProperty('alerts')) {
                        console.log("Alerts are present");
                        var alerts_len = weather_data.alerts.length;
                        for (var i = 0; i < alerts_len; i++) {
                            console.log(weather_data.alerts[i].desciption);
                        }
                    }


                    if (weather_data.hasOwnProperty('currently')) {
                        console.log(weather_data.currently.icon);
                        console.log(weather_data.currently.summary);
                        obj.currently = {};
                        obj.currently.icon_msg = weather_data.currently.icon;
                        obj.currently.summary_msg = weather_data.currently.summary;
                        if (weather_data.currently.hasOwnProperty('pressure')) {
                            if (parseInt(weather_data.currently.pressure) > 1030) {
                                console.log("Atmospheric pressure is high in your region");
                                obj.pressure_msg = "Atmospheric pressure is high in your region";
                            } else if (parseInt(weather_data.currently.pressure) < 1000) {
                                console.log("Atmospheric pressure is low in your region");
                                obj.pressure_msg = "Atmospheric pressure is low in your region";
                            } else {
                                console.log("Normal atmospheric pressure in your region");
                                obj.pressure_msg = "Normal atmospheric pressure in your region";
                            }
                        }
                        if (weather_data.currently.hasOwnProperty('windSpeed')) {
                            if (parseInt(weather_data.currently.windSpeed) > 25) {
                                console.log("There is a strong breeze in your region");
                                obj.windspeed_msg = "There is a strong breeze in your region";
                            }

                        }
                        if (weather_data.currently.hasOwnProperty('nearestStormDistance')) {
                            if (parseInt(weather_data.currently.nearestStormDistance) >= 10) {
                                console.log("There is a storm near your region");
                                obj.stormwarning_msg = "There is a storm near your region";
                            }
                        }
                    }
                    if (weather_data.hasOwnProperty('hourly')) {
                        console.log(weather_data.hourly.icon);
                        console.log(weather_data.hourly.summary);
                        obj.hourly = {};
                        obj.hourly.icon_msg = weather_data.hourly.icon;
                        obj.hourly.summary_msg = weather_data.hourly.summary;
                    }
                    console.log(JSON.stringify(obj));
                    res.json(result);
                }
            }

        })
        .catch(err => {
            console.log(err)
        })


})

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})
