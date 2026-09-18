# Spreadsheet Skills: Mission Excel

A self-guided P5/P6 spreadsheet skills lesson designed for deployment on Netlify.

## Files

- `index.html` — application shell
- `styles.css` — responsive UI and print styles
- `app.js` — lesson logic, spreadsheet interactions, scoring, localStorage, results and certificate

## Deploy to GitHub + Netlify

1. Create a new GitHub repository.
2. Upload these three files plus this README.
3. In Netlify, choose **Add new project → Import an existing project**.
4. Select the GitHub repository.
5. Build command: leave blank.
6. Publish directory: `/`
7. Deploy.

No server or database is required.

## Important implementation note

The current version is a browser-based spreadsheet simulator. It validates the formula exercises specified in the lesson rather than attempting to implement the entire Microsoft Excel calculation engine.

Student progress is stored in `localStorage` under `missionExcelV1`.

The Teacher View therefore shows the data available in the current browser. It does not send student information to a server.
