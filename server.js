// Importerer de nødvendige Node.js moduler/packages
const express = require('express');  // Express framework til at lave webserver
const path = require('path');        // Hjælper med at håndtere filstier
const cors = require('cors');        // Tillader cross-origin requests (sikkerhed)
const authRoutes = require('./routes/auth');  // Vores authentication routes
const portfolioRoutes = require('./routes/portfolio');  // Vores portfolio routes

// Opretter en ny Express applikation (vores server)
const app = express();

// === MIDDLEWARE SETUP ===
// Middleware er funktioner der køres før vores route handlers
app.use(cors());  // Aktiverer CORS - tillader requests fra andre domæner
app.use(express.json());  // Gør at vi kan læse JSON data fra requests
app.use(express.urlencoded({ extended: true }));  // Gør at vi kan læse form data
app.use(express.static(path.join(__dirname, 'public')));  // Gør public mappen tilgængelig for klienten

// === VIEW ENGINE SETUP ===
app.set('views', path.join(__dirname, 'views'));  // Fortæller Express hvor vores views/templates er
app.set('view engine', 'ejs');  // Fortæller Express at vi bruger EJS som template engine

// === ROUTES ===
// Definerer hvilke routes der skal håndteres af hvilke route handlers
app.use('/api/auth', authRoutes);  // Alle auth relaterede endpoints starter med /api/auth
app.use('/', portfolioRoutes);     // Portfolio routes starter fra root path

// Hovedsiden
app.get('/', (req, res) => {  
    res.render('index');  // Viser index.ejs når nogen besøger hovedsiden
});

// === SERVER START ===
const PORT = process.env.PORT || 3000;  // Vælger port 3000, kører den på local server.
app.listen(PORT, () => {  
    console.log(`Server kører på port ${PORT}`);  // Logger når serveren er startet
}); 