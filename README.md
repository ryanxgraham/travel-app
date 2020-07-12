# Udacity FEND Capstone Project - Travel App

## Description
The goal of this project was a simple Javascript travel planning app that queries three different APIs and then responsively updates the view based on the location and date the user enters.  It uses [Geonames](https://www.geonames.org)for location data, that is then passed to [Weatherbit](https://www.weatherbit.io) for a weather forecast (up to 16 days in the future). [Pixabay](https://pixabay.com) is then used to find an image of the location.

Added trips are automatically stored locally so the user can revisit the site and see their previous searches.  A delete button allows the user to remove a trip from the cache and page.

## Installation
Clone this repo with
```
 git clone git@github.com:ryanxgraham/travel-app.git
```
Navigate to the root folder:
```
cd travel-app
```
Run the following:
```
npm install
```
You will need to create accounts at
```
https://www.weatherbit.io/account/create
https://pixabay.com/accounts/register/
https://www.geonames.org/login

```
and get API keys from weatherbit and pixabay, then create a ```.env``` file in the root directory of the repo.
add the following lines to the ```.env``` file:
```
WEATHERBIT_API_KEY=YOUR_WEATHERBIT_KEY
PIXABAY_API_KEY=YOUR_PIXABAY_KEY
GEONAMES_USERNAME=YOUR_GEONAMES_USERNAME
```

## Running The App
### In Dev Mode

To run the dev server:
```
npm run build-dev
```
To run in Development Mode:
```
npm run dev
```
To run tests:
```
npm run test
```

### In Production Mode
```
npm run build-prod
```
```
npm run start
```
Open your preferred web browser and navigate to:
```
http://localhost:3000/
```

## Contributions
Starter code provided by Udacity, Functionality implemented by
* Ryan Graham - [Github](https://github.com/ryanxgraham)
