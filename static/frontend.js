function secondsToTime(e) {
  m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
    s = Math.floor(e % 60).toString().padStart(2, '0');

  return m + ':' + s;
  //return `${h}:${m}:${s}`;
}


let playerLayer = L.DivOverlay.extend({
  _initLayout() {
    let options = this.options;
    options.interactive = true;
    options.bubblingMouseEvents = false;
    options.pane = "overlayPane";
    this._container = L.DomUtil.create('div', 'player-container');
    this._contentNode = L.DomUtil.create('div', "player");
    this._container.appendChild(this._contentNode);
    this.setContent('<audio src="' + options.audio_path + '" id="audio_' + options.id + '"></audio><p class="time" id="time_' + options.id + '">&#9654; <span class="current">00:00</span> - <span class="duration">00:00</span></p>')
  },
  _updateLayout() {
    L.Popup.prototype._updateLayout.call(this);
  },
  _adjustPan() { }
})

// Copy in your filenames from the console here.
const fitfiles =
  [
    'adige_loop.json',
    'duomo_fiera.json',
    'fersina.json',
    'funivia.json',
    'piazza_dante.json',
    'tribunale_italia.json'
  ]


const key = 'UoIv9jAncCOCQvJGRyYL';

var map

players = []

const initPlayer = (filename, fit) => {
  const playerID = self.crypto.randomUUID();

  // INIT PATH
  const latlongs = fit.latlongs

  let polyline = L.polyline(latlongs, { color: '#1693A7', smoothFactor: 2 });

  const startBounds = [
    [46.081186377535396, 11.167787296899851],
    [46.04497028086282, 11.076021806574046]
  ]
  map.fitBounds(startBounds, { padding: [0, 0] });

  let leaflatlngs = polyline.getLatLngs()

  let polylineRunner = L.polyline(leaflatlngs[0], {
    color: '#000000'
  });

  // Dot
  let dot = L.circle(latlongs[0], { radius: 5, color: '#000', fillOpacity: 1 });

  // Time

  timeDiv = new playerLayer(leaflatlngs[0], {
    id: playerID,
    audio_path: "/soundwalks/" + filename.replace(".json", "_R.wav")
  });

  playerGroup = L.layerGroup([polyline, polylineRunner, dot, timeDiv]).addTo(map)

  timeElemDiv = document.getElementById("time_" + playerID);

  let timeElem = document.querySelector('#time_' + playerID + ' .current')
  let durationElem = document.querySelector('#time_' + playerID + ' .duration')

  document.getElementById("audio_" + playerID).addEventListener("loadeddata", (event) => {
    const duration = event.target.duration
    durationElem.textContent = secondsToTime(duration)

    dot.setLatLng(latlongs[Math.floor(event.target.currentTime)])
  })

  document.getElementById("audio_" + playerID).addEventListener("timeupdate", (event) => {
    const duration = event.target.duration
    timeElem.textContent = secondsToTime(event.target.currentTime)
    length = polyline._path.getTotalLength();

    currentIndex = Math.floor(event.target.currentTime)
    polylineRunner.setLatLngs(leaflatlngs.slice(0, currentIndex))

    dot.setLatLng(leaflatlngs[currentIndex])
  });

  const togglePlay = () => {
    playerElem = document.getElementById("audio_" + playerID);
    if (playerElem.paused) {
      for (player of players) {
        document.getElementById("audio_" + player.id).pause();
      }
      playerElem.play()
      map.flyToBounds(polyline.getBounds().pad(0.05), { duration: 1 })
    } else {
      playerElem.pause()
    }
  }

  document.querySelector("#time_" + playerID).addEventListener("click", togglePlay)

  return { id: playerID }
}


window.onload = function () {
  /// INIT MAP
  map = L.map('map', {
    zoomSnap: 0.25,
    zoomControl: false,
  }).setView([46.0735, 11.115], 16);

  const mtLayer = L.maptilerLayer({
    apiKey: key,
    style: "d47026a1-e058-4367-9a08-604a33fb41ec", //optional
  }).addTo(map);

  map.removeControl(map.attributionControl) // Needs to come after Maptiler sdk init

  fitfiles.forEach(filename => {
    fetch("build/" + filename).then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json()
    }).then(data => {
      data.filename = filename
      players.push(initPlayer(filename, data))
    })
  })
}