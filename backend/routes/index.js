var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const https = require("https");

router.use(bodyParser.json());
const Streamings = require("../models/streaming");

const filter = require('./utils/filter');

// const questions = [
//   "There is no display on the monitor, what do I do now?",
//   "I get a 'no signal input' message on my monitor, what do I do?",
//   "The wheel on my mouse isn't working properly, what do I do?",
//   "What are the lengths of my trim?",
//   "Do your products run true to size?",
//   "Why is the letter I used to represent current?",
//   "Are 'time period' and 'time constant' the same thing?",
//   "What is the difference between organic and other kinds of farming?",
//   "How can a local certification body receive recognition in international markets, thus providing market access for local exporters?",
//   "What are the rules for labeling of organic products in main international markets?",
//   "How can I become eligible for labeling my product 'organic' in Japan?"
// ]

// const category = "clothes";


router.route("/keywordprocessing/:streamname")

  // show all the streamings

  .get((req, res, next) => {
    Streamings.find({ name: req.params.streamname })
      .then(
        (streaming) => {
          const questions = streaming[0].allqueries;

          console.log(streaming);

          filter.advancedFilter(questions, req.params.streamname).then((filteredData) => {
            console.log("Advanced Filter results");
            console.log(filteredData);
            console.log('\n');
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(filteredData);
          });


        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })


router.get("/", function (req, res, next) {

  _EXTERNAL_URL = 'https://words.bighugelabs.com/api/2/4d118534a6a0af9f2b7a788ad8bf5f31/computer/';

  https.get(_EXTERNAL_URL, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log("ended");
      console.log(data);
      res.json(data);
      // console.log(JSON.stringify(data));
    });

  }).on("error", (err) => {

    console.log("Error: " + err.message);
  });
  // // Standard Filter
  // filter.standardFilter(questions, category).then((filteredData) => {
  //   console.log("Standard Filter results");
  //   console.log(filteredData);
  //   console.log('\n');
  // });


  // // Advanced Filter (May consume more time for search results than the Standard Filter)
  // filter.advancedFilter(questions, category).then((filteredData) => {
  //   console.log("Advanced Filter results");
  //   console.log(filteredData);
  //   console.log('\n');
  // });

  /* GET home page. */

});

module.exports = router;
