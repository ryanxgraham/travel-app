//VALIDATE DATE FORMAT
function dateChecker(possibleDate) {
  var datePattern = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

  var res = possibleDate.match(datePattern);
  return (res !== null)
}

//GET INFO ABOUT A TRIP
const getTripData = async(loc, date, dataToSave = {}) => {
  try {
    let res = await fetch(`http://localhost:8080/forecast?loc=${loc}&date=${date}`)
    console.log(res)
    let resData = res.json()
    return resData;
  } catch (error) {
    console.log('Error!', error)
  }
}

//ADD A TRIP & SAVE LOCALLY
async function addTrip(event) {
  try{
    event.preventDefault();
    const loc = document.getElementById('loc');
    const date = document.getElementById('date');
    console.log(loc.value)
    console.log(date.value)
    if (Client.dateChecker(date.value) != true) {
      alert('Invalid date! Please use YYYY-MM-DD format.');
      return false;
    }
    const tripData = await getTripData(loc.value, date.value)
      console.log(tripData);
      await saveTripstoCache(tripData);
      displayOneTrip(tripData, getTripData.length);
      loc.value = "";
      date.value = "";
  } catch (error) {
    console.log('Error!', error)
  }
}

//DISPLAY ALL TRIPS
const displayTrips = async() => {
  var trips = await getTripsfromCache();

  if (!trips) return;

  const tripsDisplay = document.getElementById('results');
  tripsDisplay.innerHTML = "";

  trips.map((trip, index) => {
    displayOneTrip(trip, index, tripsDisplay);
  })
}

document.addEventListener('DOMContentLoaded', () => displayTrips(), false);

//SAVE TRIPS LOCALLY
const saveTripstoCache = async(tripData) => {
  var trips = JSON.parse(localStorage.getItem('trips'));
  console.log(trips)
  if (!trips)
    trips = new Array();
  if (trips.length > 0)
    tripData.id = Math.max(...trips.map(x => x.id)) + 1;
  else
    tripData.id = 1;
    console.log(tripData);
    trips.push(tripData);
    localStorage.setItem('trips', JSON.stringify(trips));
}

//RETRIEVE LOCALLY STORED TRIPS
const getTripsfromCache = async() => {
  var trips = JSON.parse(localStorage.getItem('trips'));
  if (!trips) return null;
  return trips;
}

//DELETE A LOCALLY STORED TRIP
const delTripFromCache = async(id) => {
  let trips = await getTripsfromCache();
  if (!trips) return null;

  trips = trips.filter(x => x.id !=id);
  localStorage.setItem('trips', JSON.stringify(trips));
  await displayNoTrips();
}

//DISPLAY ONE TRIP
async function displayOneTrip(trip, index, tripsDisplay) {
  await displayNoTrips()
  let scrollLast = false;
  if (!tripsDisplay) {
    tripsDisplay = document.getElementById('results');
    scrollLast = true;
  }

  //CREATE TRIP CARD
  const text = `Trip to ${trip.location.name}, ${trip.location.adminName1}, ${trip.location.countryCode} on ${trip.date}`;
  let tripCard = document.createElement('div');
  tripCard.className = 'card';

  //CREATE DELETE BUTTON
  const delIcon = document.createElement('a');
  delIcon.innerText = 'X';
  delIcon.href = "#";
  delIcon.className = 'close'
  delIcon.addEventListener('click', async(e) => {
    if (confirm(`Delete trop to ${trip.location.name}?`)) {
      await delTripFromCache(trip.id);
      await displayTrips();
    }
  });
  tripCard.appendChild(delIcon);

  //WEATHER icon
  if (trip.weather.icon) {
    let wDiv = document.createElement('div');
    wDiv.className = 'weather';
    let img = document.createElement('img');
    img.src = `icons/${trip.weather.icon}.png`;
    img.className ='icon';
    wDiv.appendChild(img);
    let wInfo = document.createElement('div');
    wInfo.innerHTML = `${(trip.weather.temperature*9/5+32).toFixed(1)}&deg;F (${(trip.weather.temperature).toFixed(1)}&deg;C) with ${trip.weather.description}`;
    wDiv.appendChild(wInfo);
    tripCard.appendChild(wDiv);
  } else {
    let noInfo = document.createElement('div');
    noInfo.innerHTML = 'No Weather Data Available.';
    noInfo.className = 'noinfo';
    tripCard.appendChild(noinfo);
  }

  //LOCATION PHOTO
  let picDiv = document.createElement('div');
  let img = null;
  if (trip.image && trip.image.webformatURL) {
    let imgDiv = document.createElement('div');
    let img = document.createElement('img');
    img.src = trip.image.webformatURL;
    imgDiv.className = 'image';
    imgDiv.appendChild(img);
    tripCard.appendChild(imgDiv);

    if (scrollLast == true) {
      img.addEventListener('load', () => {
        img.scrollIntoView({behavior: 'smooth'});
      })
    }
  }
  let p = document.createElement('p');
  p.innerText = text;
  tripCard.appendChild(p);
  tripsDisplay.appendChild(tripCard);
  if (!img && scrollLast == true)
    tripsDisplay.lastChild.scrollIntoView({ behavior: 'smooth'});
}
//NO TRIPS TO DISPLAY
const displayNoTrips = async() => {
  const tripsFromCache = await getTripsfromCache();
  const noTripsSection = document.getElementById('no-data');
  noTripsSection.style.display = !tripsFromCache || tripsFromCache.length == 0 ? "block" : "none";
}

export { addTrip, dateChecker }
