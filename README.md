# Kanjibenkyo (Kanben)

Kanben is a web app for studying Japanese kanji for the JLPT (Japanese-Language Proficiency Test). It lists kanji by JLPT level (N5 to N1), shows each kanji's readings and meanings, shows example sentences, and lets logged-in users mark kanji as studied. The app tracks each user's known kanji and unlocks the next level as they progress.

## Features

- Kanji lists grouped by JLPT level (N5 to N1), with the level you are on, the levels you have passed, and the ones still locked.
- A detail page for each kanji with its on'yomi, kun'yomi and English meanings.
- Example sentences that contain the kanji, from Tatoeba.
- Sign up, log in and log out with Firebase authentication.
- Per-user progress: mark kanji as studied or unmark them, and the level you are placed at follows from the number of known kanji.
- A "Last viewed kanji" card on the home page, plus an About page with FAQ and contact guidance.

## Tech stack

| Part     | Technology                                                                 |
|----------|----------------------------------------------------------------------------|
| Frontend | Angular 8, TypeScript, Bootstrap 4, jQuery                                  |
| Backend  | Python, Flask, Flask-RESTful, Flask-CORS, Gunicorn                          |
| Data     | MongoDB (kanji and sentence data, read-only from the app)                   |
| Auth and user progress | Firebase Authentication and Realtime Database (via `pyrebase`) |

## Repository layout

```
Kanjibenkyo/
├── Client/              Angular frontend
│   └── src/app/         Components, routing and HTTP services
└── Server/              Flask backend
    ├── main.py          Routes: pages, kanji data, sentences, auth and progress
    ├── initialization/  Helpers (util.py) and the local config.py (not in git)
    ├── requirements.txt Python dependencies
    └── Procfile         Process definition for Heroku-style hosts
```

## API

All routes are defined in [Server/main.py](Server/main.py).

| Method | Route | Purpose |
|--------|-------|---------|
| GET  | `/dictionary/sentence/<kanji>` | Up to 20 example sentences containing the kanji |
| GET  | `/kanji/<level>` | All kanji for a level (for example `n5`) |
| GET  | `/kanji/<level>/<kanji>` | One kanji from a level |
| POST | `/user/login` | Sign in with email and password; returns the auth data plus `kanji_known` |
| POST | `/user/signup` | Create an account and an empty progress record |
| POST | `/user/kanji/new` | Update the user's `kanji_known` list |

The Flask app also serves the built Angular app for the page routes `/`, `/home`, `/login`, `/signup`, `/level`, and `/about`.

## Setup

### Prerequisites

- Python 3 and `pip`
- Node.js with npm (the project uses Angular CLI 8, so an older Node LTS is the safest choice)
- Access to a MongoDB database with the `kanji` and `phrase_data` databases
- A Firebase project with Email/Password authentication and a Realtime Database

### 1. Backend

```bash
cd Server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `Server/initialization/config.py`. It is ignored by git because it holds secrets. It must define two values:

```python
mongo = "mongodb+srv://<user>:<password>@<cluster>/..."   # MongoDB connection string

firebase_config = {
    "apiKey": "...",
    "authDomain": "<project>.firebaseapp.com",
    "databaseURL": "https://<project>.firebaseio.com",
    "storageBucket": "<project>.appspot.com",
}
```

Run the server for development:

```bash
flask --app main run --port 5000
```

### 2. Frontend

```bash
cd Client
npm install
npm start          # ng serve, runs at http://localhost:4200
```

The frontend calls a hosted API, and the base URL is hard-coded in [Client/src/app/shared/http.service.ts](Client/src/app/shared/http.service.ts). To talk to a local backend, change those URLs to `http://localhost:5000`. Keep in mind that the CORS configuration in `main.py` only allows `localhost:4200`.

### 3. Production build

```bash
cd Client
npm run build -- --prod    # output goes to Client/dist/kanjibenkyo/
```

Flask renders `index.html` from a `templates/` folder, which is not in the repo. Copy the built `index.html` into `Server/templates/`, and copy the rest of `dist/kanjibenkyo/` into `Server/static/`, so the Flask app can serve it.

## Deployment

`Server/Procfile` is set up for Heroku-style hosts:

```
web: gunicorn main:app
```

Note: the current Procfile line also contains `runserver 0.0.0.0:5000` after `main:app`. Gunicorn does not accept that, so use the line above (or add `--bind 0.0.0.0:$PORT`) when deploying.

## Data sources and licenses

- Kanji data (readings, meanings and JLPT levels) comes from [Jonathan Waller's JLPT Resources](http://www.tanos.co.uk/jlpt/), licensed under Creative Commons BY.
- Example sentences come from [Tatoeba](https://tatoeba.org), licensed under CC BY 2.0 FR.
- Thanks to Kim Ahlström for permission to use the [Jisho.org](https://jisho.org) API early in the project.

## Status

This project started in February 2020 and has had no recent development. Known gaps: the progress page's graphs and test are placeholders, and password reset is handled by email to support rather than in the app.
