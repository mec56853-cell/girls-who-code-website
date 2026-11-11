# Girls Who Code: Girl Scout Coding Adventures

An interactive coding-education website with age-appropriate Girl Scout learning tracks. Young Explorers practice sequencing with Maya's story, and Middle Coders use events, coordinates, conditions, planning, testing, and debugging in **Code the Character**.

Published URL after a repository owner enables Pages: <https://mec56853-cell.github.io/girls-who-code-website/>

## Code the Character

Students build a sequence of arrow commands, run it one step at a time, and guide Scout through a forest grid to a campsite. Four distinct, solvable courses rotate with **New Forest**:

- Camping — Pinecone Camp
- Hiking — Ridge Hike
- Wildlife — Wildlife Watch
- Troop adventure — Troop Trail

Keyboard arrow keys and large on-screen controls both add commands. Collision and boundary feedback points students toward debugging. Completion is stored only in the student's browser with `localStorage`; the site has no accounts, analytics, or personal-data collection.

## Local setup

Prerequisites:

- Python 3.10 or newer
- Node.js 20 or newer (only for the focused activity tests)

Create a virtual environment and install Flask:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Open <http://127.0.0.1:5000/>. Flask is used only for local development; GitHub Pages serves a generated static version.

## Build and validate the Pages site

The static exporter resolves Flask `url_for` expressions to portable relative links, copies only public assets, and writes the deployable site to the ignored `dist/` directory.

```powershell
python scripts/build_static.py
python scripts/validate_static.py
node --test tests/middle_game.test.cjs
```

Preview the exact artifact locally:

```powershell
python -m http.server 8000 --directory dist
```

Then open <http://localhost:8000/>. The validation checks every expected route and every local HTML asset/navigation reference. The Node tests verify that all forest layouts are distinct, stay inside the board, report collisions, and have a valid route from the trailhead to the campsite.

## Automatic GitHub Pages deployment

`.github/workflows/deploy-pages.yml` runs after every push to `main` and can also be started manually from the repository's **Actions** tab. It tests the activity, builds and validates `dist/`, uploads only that generated artifact, and deploys through GitHub's `github-pages` environment using GitHub's supported Pages actions and least-privilege job permissions.

For a new repository, an owner must make one one-time selection: open **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**, and save. No deploy branch, committed build output, or secret is required.

## Project structure

```text
app.py                         Flask development routes
templates/                     Source HTML templates
static/                        Shared and activity CSS, JavaScript, and images
scripts/build_static.py        Static Pages exporter
scripts/validate_static.py     Generated-artifact link and route checks
tests/middle_game.test.cjs     Forest and movement logic tests
.github/workflows/             Automatic Pages build and deployment
```

## Contributing

Keep public routes in `app.py` and `scripts/build_static.py` in sync. Before opening a pull request, run all three build and validation commands above. Do not commit `dist/`; deployment always generates it from the reviewed source.
