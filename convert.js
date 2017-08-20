var Converter = require("csvtojson").Converter;
var fs = require("fs");
var converter = new Converter({});
var path = './ozone_csv.csv';
converter.fromFile(path,function(err,result){ 
	if(err)
		{  console.log("error"); }
    else { 
           console.log(result);
           fs.writeFile('ozone_data.json', JSON.stringify(result) , 'utf-8');
         }
});