# Promenadologie: Dynamic Maps for Soundscape Composition

Copy over recordings and fit files to the soundwalks folder.

Convert fit files from soundwalks folder to latlongs json files
```
npm install
node fitToJSON.js
```

Make sure to add the filenames of the generated files to `static/frontend.json`

Run the static server
```
python -m http.server --directory static
open http://localhost:8000
```