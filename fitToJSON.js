// Require the module
var FitParser = require('fit-file-parser').default;

// Read a .FIT file
var fs = require('fs'),
  path = require('path');


// Create a FitParser instance (options argument is optional)
var fitParser = new FitParser({
  force: true,
  speedUnit: 'km/h',
  lengthUnit: 'km',
  temperatureUnit: 'kelvin',
  elapsedRecordField: true,
  mode: 'cascade',
});

// Find all .fit files in directory
let fitFiles = [];

const folder = "soundwalks/"

fs.mkdir("static/build", () => { });

const findFirst = latlongs => {
  let lastKnown = 123
  for (ll of latlongs) {
    if (ll[0] != undefined || ll[1] != undefined) {
      lastKnown = ll
      break;
    }
  }
  return lastKnown
}

// Some Wahoo fit files contains a lot of Nulls, we substitute those with the last (or first) known location, not to jumble time.
const substituteNulls = latlongs => {
  let lastKnown = findFirst(latlongs)

  return latlongs.map(latlong => {
    if (latlong[0] != null || latlong[1] != null) {
      lastKnown = latlong
      return latlong
    } else {
      return lastKnown
    }
  })
}

const readFit = (filename) => {
  fs.readFile((folder + filename), function (err, content) {
    // Parse your file
    fitParser.parse(content, function (error, data) {
      // Handle result of parse method
      if (error) {
        console.log(error);
      } else {
        recs = data.activity.sessions[0].laps.map(l => l.records).flat();
        coordsi = substituteNulls(recs.map(r => [r.position_lat, r.position_long]))

        output = { latlongs: coordsi }

        fs.writeFile('static/build/' + filename.replace(".fit", ".json"), JSON.stringify(output, null, 2), () => { })
      }
    });
  });
}

fs.readdirSync(folder).forEach(file => {
  if (path.extname(file) === '.fit') {
    fitFiles.push(file.replace(".fit", ".json"));
    readFit(file);
  }
});

console.log(fitFiles)