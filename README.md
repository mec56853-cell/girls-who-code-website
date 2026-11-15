# Girls Who Code: Girl Scout Coding Adventures

Live website: <https://mec56853-cell.github.io/girls-who-code-website/>

An interactive coding-education website with age-appropriate Girl Scout learning tracks. Young Explorers practice sequencing with **Maya's story**, Middle Coders use events, coordinates, conditions, planning, testing, and debugging in **Code the Character**, Advanced Coders debug conditional logic for a community tech day, and Senior Coders finish three lines to publish a Gold Award spotlight. A separate careers experience includes a career quiz, robot coding challenge, and career-matching game.

## Live activities

- [Young Explorers: Maya's Story](https://mec56853-cell.github.io/girls-who-code-website/youngest-game/)
- [Young Explorers: Coding Lesson](https://mec56853-cell.github.io/girls-who-code-website/youngest-game/lesson/)
- [Middle Coders: Code the Character](https://mec56853-cell.github.io/girls-who-code-website/middle-game/)
- [Advanced Coders: Debug the Launch](https://mec56853-cell.github.io/girls-who-code-website/ambassadors-game/)
- [Senior Coders: Code the Spotlight](https://mec56853-cell.github.io/girls-who-code-website/senior-game/)
- [Explore Coding & Careers](https://mec56853-cell.github.io/girls-who-code-website/explore-careers/)

All activities are integrated into the main website and automatically republished after a successful push to `main`.

## Senior Coders: Code the Spotlight

High school seniors finish one short program for a troop celebration page. They choose the line that joins a scout's name and Gold Award project, the check that treats 10 service hours as ready, and the badge text the page should show. One run compares their code with the expected spotlight. Hints, a preview card, a results table, and a replay stay on the page.

## Advanced Coders: Debug the Launch

Students learn how conditions, comparison operators, AND, and OR control program decisions. Three test-driven rounds ask them to fix the software for volunteer check-in, workshop registration, and a backup venue. The activity provides hints, accessible test-result tables, keyboard-friendly controls, and a replay option.

## Explore Coding & Careers

Students can explore technology interests through a five-question career quiz, program a robot through three grid puzzles, and match four technology careers to their descriptions.

## Middle Coders: Code the Character Activity

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
node --test tests/middle_game.test.cjs tests/senior_game.test.cjs
```

Preview the exact artifact locally:

```powershell
python -m http.server 8000 --directory dist
```

Then open <http://localhost:8000/>. The validation checks all seven public routes and every local HTML asset/navigation reference. The Node tests verify that all forest layouts are distinct, stay inside the board, report collisions, reject the old shared shortcut, and have a valid route from trailhead to destination. They also check that the Senior Spotlight accepts the three correct lines and rejects the nearby mistakes.

## Automatic GitHub Pages deployment

`.github/workflows/deploy-pages.yml` runs after every push to `main` and can also be started manually from the repository's **Actions** tab. It tests the activity, builds and validates `dist/`, uploads only that generated artifact, and deploys through GitHub's `github-pages` environment using GitHub's supported Pages actions and least-privilege job permissions.

For a new repository, an owner must make a one-time selection: open **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**, and save. No deploy branch, committed build output, or secret is required. This repository is already configured and publishing successfully.

## Project structure

```text
app.py                         Flask development routes
templates/                     Source HTML templates
static/                        Shared and activity CSS, JavaScript, and images
scripts/build_static.py        Static Pages exporter
scripts/validate_static.py     Generated-artifact link and route checks
tests/middle_game.test.cjs     Forest and movement logic tests
tests/senior_game.test.cjs     Senior Spotlight answer checks
.github/workflows/             Automatic Pages build and deployment
```

## Contributing

Keep public routes in `app.py` and `scripts/build_static.py` in sync. Before opening a pull request, run all three build and validation commands above. Do not commit `dist/`; deployment always generates it from the reviewed source.
