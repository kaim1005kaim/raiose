Raiose Website

Static website for Raiose. The site lives under `raiose-website/` and is deployed to GitHub Pages via Actions.

Local preview
- Serve locally to avoid CORS issues with ES modules:
  - Python: `cd raiose-website && python3 -m http.server 8080`
  - Then open: `http://localhost:8080/index.html`

Deploy
- Push to `main` and the GitHub Actions workflow (`.github/workflows/deploy.yml`) publishes `raiose-website/` to Pages.
- In the repository settings, enable GitHub Pages with Source = GitHub Actions (default for public repos).

Structure
- `raiose-website/`: Static site (HTML/CSS/JS)
- `raiose-website/models/LOGO.glb`: 3D logo shown on the hero via Three.js
- `raiose-website/js/three-hero.js`: Three.js + GLTF/DRACO loader

