// Import des modules
const express = require('express');
const mongoose = require('mongoose');


// Initialisation de l'application Express
const app = express();

// Configuration de body-parser pour traiter les données JSON
app.use(express.json())
app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
const generateMain = require("./getMainHtml.js")



// Connexion à la base de données MongoDB (assurez-vous d'avoir MongoDB installé localement)
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/decathlon');
    } catch (error) {
        console.log(error);
    }
}
connect();


// Définition du modèle pour les articles réservés
const reservationSchema = new mongoose.Schema({
    name: String,
    product: String,
    comment: String,
});
const Reservation = mongoose.model('reservation', reservationSchema);


app.get('/',async (req, res) => {
    const main = await generateMain();
    res.send(main);
})

// Route pour ajouter une réservation
app.post('/ajouter-reservation', (req, res) => {
    console.log(req.body);

    const nom = req.body.name;
    const commentaire = req.body.comment;
    const produit = req.body.product;
    const nouvelleReservation = new Reservation({
        name : nom,
        product : produit,
        comment : commentaire,
    });
    try {
        nouvelleReservation.save();
        res.status(200).send();
    }catch (error){
        console.log(error);
        res.status(500).send();
    }


});

// Route pour récupérer toutes les réservations
app.get('/reservation', async (req, res) => {
    const data = await Reservation.find();

    res.send(data);
});

// Ajout de la route DELETE côté serveur
app.delete('/supprimer-reservation/:id', async (req, res) => {
    const reservationId = req.params.id;
    console.log(reservationId);
    const result = await Reservation.findByIdAndDelete(reservationId);
    res.status(200).send();
});




// Port d'écoute du serveur
const port = process.env.PORT || 10002;
app.listen(port, () => {
    console.log(`serveur démarré : http://localhost:${port}`)
});
