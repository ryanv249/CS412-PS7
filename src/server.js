const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let app = express();

const redis = require('redis');
const client = redis.createClient();

const API = require('./app/config/geo')

// detect redis error
client.on('error', err => console.log('Redis Client Error', err));
// let back and front talk. (was being annoying so just allowing all ports)
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// process requests
app.post('/api/', async (req, res, next) => {
  console.log(req.body)

  // build id from input (not perfect but solid choice)
  const id = req.body.countryIds.trim() + req.body.minPopulation;
  console.log(id)

  if(await client.exists(id)){
    // cached!  just send it
    const data = await client.get(id);
    const reply = {
      data: JSON.parse(data),
      cached: true
    }
    res.send(reply);
  }
  else{
    // not cached!  fetch, send, cache!
    let url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions?limit=10&sort=population';

    // construct query string from input
    const countryIds = req.body.countryIds.trim().replace(',', '%2C');
    if(countryIds){
      url += "&countryIds=" + countryIds
    }
    if(req.body.minPopulation){
      url += "&minPopulation=" + req.body.minPopulation
    }
    // make api call
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'INSERT KEY HERE',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
        useQueryString: true
      }});
    // validated forms should protect from bad form causing weirdness here!

    // format response and turn into string for redis
    const data = await (JSON.stringify((await response.json()).data
      .map(d => ({name: d.name, country: d.country, population: d.population}))));

    // send/cache data!
    const reply = {
      data: JSON.parse(data),
      cached: false
    }
    res.send(reply);
    await client.set(id, data, {EX: 60});
  }
});

app.listen(3000, async () => {
  console.log('Server listening on port 3000');
  await client.connect();
});
