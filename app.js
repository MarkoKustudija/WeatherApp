require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req, res) => {
  res.sendFile(__dirname + "/index.html")

});

app.post("/", (req, res)=>{

  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;

  const unit = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;

  https.get(url, function (response){
    console.log(response.statusCode);

    response.on("data", function(data){
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const feelsLike = weatherData.main.feels_like;
        const min = weatherData.main.temp_min;
        const max = weatherData.main.temp_max;
        const humidity = weatherData.main.humidity;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.write("<h1>Temperature in: " + query + " is " + temp + " degrees Celsius.</h1>");
        res.write("<p> The weather is currently: " + description + ".</p>");
        res.write("<p> Feels like: " + feelsLike + " degrees Celsius. </p>");
        res.write("<p> Daily min: " + min + " degrees Celsius.</p>");
        res.write("<p> Daily max: " + max + " degrees Celsius.</p>");
        res.write("<p> Humidity is: " + humidity + " %.</p>")
        res.write("<img src = " + imageURL + ">")
        res.send();

    });
  });
});

app.listen(3000, function(){
  console.log("Server is running on port 3000");
})
