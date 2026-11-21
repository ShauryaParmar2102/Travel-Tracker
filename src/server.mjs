import path from "path";
import express from "express";
import ApiRouter from "./routers/apiRouter.mjs";
import FeaturesRouter from "./routers/featureRouter.mjs";
import { fileURLToPath } from "url";

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Serve frontend HTML, JavaScript and CSS files
app.use(express.static(path.join(__dirname, "public")));

// Serve backend EJS page stylesheets
app.use(
    "/views",
    express.static(path.join(__dirname, "views"))
);

// Routes
app.use("/api", ApiRouter);
app.use("/features", FeaturesRouter);

// Redirect root
app.get("/", (req, res) => {
    res.redirect("/views/allMyTrips.html");
});



// Start server
const port = 8080;
app.listen(port, () => {
    console.log(`Web server started on: http://localhost:${port}`);
});


/*
WHERE TO START
- client side & server side models
- routes ( maker sure i can read the server side data on the client side via fetch )

Pages in order:
    - edit page (get hotel data & destination data via fetch)
        populate html elements
        save the data to local storage
    
    - all my trips (this one does not require any server data)
        show the name of the trip
        show the amount of destinations (length of the legs array)
        show nights stayed (calculate this from legs array)

    - my summary page (get hotel data & destination & cost data data via fetch)
        showing that data

    - edit page revisit for POSTING and PUTTING to server

    - public leaderboard & statistics
*/
