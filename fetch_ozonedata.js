var googleMaps = require('@google/maps').createClient({
    key: 'AIzaSyDGN0SayMyX14nqiGXxeYOHwrhwUjHOrBI'
});
var fs = require('fs');

googleMaps.reverseGeocode({
    latlng: [40.7128, -74.0059],
}, function(err, response) {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(response));
        var output = response;
        if (output.hasOwnProperty('json')) {
            var state_name;
            var county_name;
            result = output.json.results[0];
            if (output.json.results[0].hasOwnProperty('address_components')) {
                var len = output.json.results[0].address_components.length;
                for (var i = 0; i < len; i++) {
                    if (output.json.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                        state_name = output.json.results[0].address_components[i].long_name;
                    } else if (output.json.results[0].address_components[i].types[0] == "administrative_area_level_2") {
                        county_name = output.json.results[0].address_components[i].long_name;
                    }
                    if (state_name != undefined && county_name != undefined) {
                        break;
                    }
                }

            }
            if (county_name.includes('County')) {
                county_name = county_name.replace("County", "");
            }
            console.log(county_name);
            console.log(state_name);
        }
        var file_data = fs.readFileSync('./ozone_data.json', 'utf8');
        file_data = JSON.parse(file_data);
        for(var j=0;j<file_data.length;j++)
        {
            if(file_data[j]['State Name']==state_name.trim()&&file_data[j]['County Name']==county_name.trim())
            {
                console.log("record found");
                console.log(file_data[j]['Ozone value (ppb)']);
                break;
            }
        }
        res.json(JSON.stringify(response.json));
    }
});
