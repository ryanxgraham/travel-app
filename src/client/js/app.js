/* Global Variables */
const appid = '4fc34f4fd7c6a420a3ffc004db1baa95'
const baseURL = 'api.openweathermap.org/data/2.5/weather?'

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

//fetch the Weather
const fetchWeather = async (baseURL, zip, api) => {
  const url = `http://${baseURL}zip=${zip}&appid=${api}`
  const res = await fetch(url);
  try {
    let userData = await res.json();
    console.log(userData);
    return userData
  } catch (error) {
    console.log("error", error);
  }
}

//end user post function

const postData = async (url = '', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      date: data.date,
      temp: data.temp,
      content: data.content
    })
  })

  try {
    const newData = await req.json();
    console.log(newData);
    return newData;
  }
  catch (error) {
    console.log(error);
  }
};

//update ui function

const update = async () => {
  const req = await fetch('/all');
  try {
    const allData = await req.json()
    console.log(allData);
    document.getElementById('date').innerHTML = allData.date;
    document.getElementById('temp').innerHTML = (1.8*(allData.temp - 273) + 32).toFixed(1)
    document.getElementById('content').innerHTML = allData.content;
  }
  catch (error) {
    console.log('error', error);
  }
};

//Event handlers
const handleClick = async () => {
  const newZip = document.getElementById('zip').value;
  const content = document.getElementById('feelings').value;
  const form = document.getElementsByTagName('form')
  fetchWeather(baseURL, newZip, appid)
    .then(function (userData) {
      postData('/add', {date: newDate, temp: userData.main.temp, content})
    }).then(function (newData) {
      update()
    })
}

const generate = document.getElementById('generate')
generate.addEventListener('click', handleClick)
