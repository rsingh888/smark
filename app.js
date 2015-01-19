
var http = require('http');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var parkSchema = new Schema({
    Northing : String,
    LastUpdated : String,
    OccupancyPercentage : Number,
    Occupancy : Number,
    ShortDescription : String,
    Easting : String,
    State : String,
    FillRate : Number,
    SystemCodeNumber : String,
    DisabledCapacity : Number,
    QueueTime : Number,
    Capacity : Number, 
    ExitRate : Number,
    Fault : String
});
var Park = mongoose.model('Park', parkSchema);         
var db = mongoose.connect('mongodb://127.0.0.1/smark');



function dumpData()
{
   http.get('http://data.nottinghamtravelwise.org.uk/parking.json?noLocation=true?t=635570201048907102', function(res){
        var str = '';

        res.on('data', function (chunk) {
               str += chunk;
         });

        res.on('end', function () {
             var data = JSON.parse(str);
             
             var json = data["Parking"].Carpark;
             for(var i = 0; i < json.length; i++) {
              var obj = json[i];
              console.log('-----------------------------');
              console.log(obj);
              console.log('-----------------------------');

              var park = new Park(obj);

              park.save(function(err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  console.log(park);
                }
              });              
            }
        });
  });
}

function infinite(){
  dumpData();
  var dt = new Date()
  console.log(dt.getHours());
  if (dt.getHours()  >= 22 && dt.getHours() <= 5)
  {
    setTimeout(infinite,60*60*1000);    
  }
  else
  {
    setTimeout(infinite,10*60*1000);    
  }
}

infinite();