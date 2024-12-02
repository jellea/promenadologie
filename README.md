# Promenadologie: Dynamic Maps for Soundscape Composition

This repository contains code for **Promenadologie**, a browser-based interface for exploring geo-tagged field recordings as presented on the [Dimmi 2024 conference](https://event.unitn.it/dimmi2024/)

Inspired by soundscape composition and the concept of dérive, we explored a alternative way to enjoy field recordings.

Read more about it in [our paper](https://www.researchgate.net/publication/386086931_Promenadologie_Dynamic_Maps_for_Soundscape_Composition)

## How to run it

Copy over recordings and fit files to the soundwalks folder, give them matching names.

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