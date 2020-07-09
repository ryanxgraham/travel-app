var dotenv = require('dotenv');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var axios = require('axios')

// SERVER CONFIG
dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'))

app.listen(8080, () => {
  console.log(`Listening on port: 8080`)
});

//GET REQUESTS
app.get('/', function (req, res) {
  res.sendFile(path.resolve('./dist/index.html'))
});

app.get('/forecast', async(req, res) => {
  console.log(`looking for: ${req.query.loc} with date: ${req.query.date}`);

  const loc = encodeURIComponent(req.query.loc);
  const date = req.query.date;

  try {
    if(!loc || !date) throw Error('Invalid Location or Date');
    var dataToSave = await getCombinedData(loc, date);
    res.send(dataToSave);
  } catch (error) {
    console.error('error', error)
    res.status(500).send();
  }
})

async function getCombinedData(loc, date) {
  const headers = {
    headers: {
      Accept: "application/json"
    }
  }
  //Location Data
  var geoUser = process.env.GEONAMES_USERNAME;
  let geoURL = `http://api.geonames.org/searchJSON?q=${loc}&maxRows=1&username=${geoUser}`
  var geoRes = await axios.get(geoURL, headers)
  var locationGeo = geoRes.data.geonames[0]
  //Weather Data
  let weather = {}
  if (getWeatherData(date) == true) {
    const weatherKey = process.env.WEATHERBIT_API_KEY;
    const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${locationGeo.lat}&lon=${locationGeo.lng}&key=${weatherKey}`
    var weatherRes = await axios.get(weatherURL, headers)
    const weatherData = weatherRes.data.data[0]
    const onDate = weatherRes.data.data.find(x => x.datetime == date)
    if (onDate) {
      weather.temperature = onDate.temp
      weather.min_temp = onDate.min_temp
      weather.max_temp = onDate.max_temp
      weather.icon = onDate.weather.icon
      weather.description = onDate.weather.description
    }
  }
  //Image Data
  const pixKey = process.env.PIXABAY_API_KEY;
  const imgURL = `https://pixabay.com/api/?key=${pixKey}&q=${loc}&image_type=photo&pretty=true&category=places`
  imgURLRes = await axios.get(imgURL, headers)
  let imageURL = ""
  if (imgURLRes.data != null && imgURLRes.data.hits != null && imgURLRes.data.hits.length > 0)
    imageURL = imgURLRes.data.hits[0]

  var dataToSave = {
    date: date,
    location: locationGeo,
    weather: weather,
    image: imageURL
  }
  return dataToSave
}

function getWeatherData(date) {
  let dte = new Date(date)
  const diffTime = Math.abs(dte - new Date())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays < 16;
}

module.exports = app;
