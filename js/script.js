document.addEventListener('DOMContentLoaded', function () {
    // Charger les réservations lors du chargement de la page
    chargerReservations();

    // Fonction pour ajouter une réservation
    window.ajouterReservation = function () {
        const nomReservateur = document.getElementById('nomReservateur').value;
        const commentaire = document.getElementById('commentaire').value;
        const article = document.getElementById('article').value;

        if (!article || !commentaire) {
            alert('Veuillez remplir tous les champs avant d\'ajouter une réservation.');
            return;
        }
        const data = JSON.stringify({
            name: nomReservateur,
            product: article,
            comment: commentaire
        });

        ajouterReservationSurServeur(data);

    };

    // Fonction pour charger les réservations depuis le serveur
    async function chargerReservations() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("/reservation", requestOptions)
            .then(response => response.json())
            .then(reservations => afficherReservations(reservations))
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    // Fonction pour ajouter une réservation sur le serveur
    function ajouterReservationSurServeur(data) {
        fetch('/ajouter-reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
            .then(data => {
                console.log(data);
                chargerReservations(); // Rafraîchir la liste des réservations
            })
            .catch(error => {
                console.log('Erreur lors de l\'ajout de la réservation:', error);
                chargerReservations();
            });
    }
    // Ajout de la fonction de suppression côté client
   function deleteReservation(id) {
       fetch(`/supprimer-reservation/${id}`, {
           method: 'DELETE',
       })
           .then(response => response.json())
           .then(data => {
               console.log(data); // Affiche un message de succès
               chargerReservations(); // Rafraîchir la liste des réservations
           })
           .catch(error => {
               console.log('Erreur lors de la suppression de la réservation:', error);
               chargerReservations();
           });
   }

    // Fonction pour afficher les réservations dans le DOM
    function afficherReservations(reservations) {
        const reservationsList = document.getElementById('reservationsList');
        reservationsList.innerHTML = ''; // Effacer la liste actuelle

        reservations.forEach(reservation => {
            const reservationItem = `
        <div class="reservationItem" id="reservationItem-${reservation._id}">
          <p><strong>Nom du réservateur:</strong> ${reservation.name}</p>
          <p><strong>Article:</strong> ${reservation.product}</p>
          <p><strong>Commentaire:</strong> ${reservation.comment}</p>
          <button class="supprimerReservationBtn" data-id="${reservation._id}">Supprimer</button>
        </div>`;
            reservationsList.insertAdjacentHTML('beforeend', reservationItem);
        });

        document.querySelectorAll('.supprimerReservationBtn').forEach(button => {
            button.addEventListener('click', () => deleteReservation(button.dataset.id));
        });
    }



});
