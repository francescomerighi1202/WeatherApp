import express from 'express';
import axios from 'axios';

// Create express app
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = "9ebbfdd774e657147a1f4f82b56e007c";
const GEO_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall";

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/weather', async (req, res) => {

    const city = req.body.city;

    if (!city) {
        res.send("Please enter a city name");
    } else {
        try {
            const geoResponse = await axios.get(GEO_API_URL + `?q=${city}` + "&limit=1" + `&appid=${API_KEY}`);

            const name = geoResponse.data[0].name;
            const lat = geoResponse.data[0].lat;
            const lon = geoResponse.data[0].lon;
            const country = geoResponse.data[0].country;
            const state = geoResponse.data[0].state;

            const weatherResponse = await axios.get(WEATHER_API_URL + `?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts
                                                    &units=metric` + `&appid=${API_KEY}`);

            const currentTemp = Math.round(weatherResponse.data.current.temp);
            const summary = weatherResponse.data.daily[0].summary;
            const mainWeather = weatherResponse.data.current.weather[0].main;
            const description = weatherResponse.data.current.weather[0].description;
            const icon = weatherResponse.data.current.weather[0].icon;
            const iconLink = `http://openweathermap.org/img/wn/${icon}@4x.png`; 

            res.render('weather.ejs', {cityName: name, countryName: country, stateName: state, currentTemp: currentTemp, 
                                    summary: summary, mainWeather: mainWeather, description: description, icon: iconLink});
        } catch (error) {
            console.log(error);
        }
    }

});

// Port listening
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});