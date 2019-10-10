var pgp = require('pg')(/* options */)
var db = pgp('postgres://mrikelctdoichh:c7e5955d89d75e3af7d8ab6e8037a9b1a37370477207b092175de425087faed1@ec2-176-34-183-20.eu-west-1.compute.amazonaws.com:5432/d2siu1ipm9dhqj')

db.one('SELECT $1 AS value', 123)
  .then(function (data) {
    console.log('DATA:', data.value)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
