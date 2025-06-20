$(document).ready(function () {
  // Variables globales
  let currentFocus = -1;
  let fetchTrigger = null;

  // Masquer les champs date et heure par défaut
  $('#time-container, #date-container').hide();

  // Gestionnaire de sélection d'adresse
  $(document).on('mousedown', '.address-feedback a', function (event) {
    event.preventDefault();
    const target = $(event.target);
    const input = target.closest('.form-group').find('input[type="text"]');
    const inputId = input.attr('id');

    // Mise à jour des champs cachés associés
    const coordinates = target.data('coordinates');
    const fieldPrefix = inputId === 'adresse_depart' ? 'departure' : 'arrival';

    $(`#${fieldPrefix}City`).val(target.data('city'));
    $(`#${fieldPrefix}PostalCode`).val(target.data('postcode'));
    $(`#${fieldPrefix}Coordinates`).val(Array.isArray(coordinates) ? coordinates.join(',') : '');

    input.val(target.data('label')).removeClass('is-invalid');
    target.parent().empty();
    $(`#${fieldPrefix}Error`).text('');
  });

  // Gestionnaire de saisie d'adresse
  $('#adresse, #adresse_depart').on('input', function () {
    const input = $(this);
    clearTimeout(fetchTrigger);

    // Réinitialisation des champs liés
    const prefix = input.attr('id') === 'adresse_depart' ? 'departure' : 'arrival';
    $(`#${prefix}City, #${prefix}PostalCode, #${prefix}Coordinates`).val('');
    input.removeClass('is-invalid');
    $(`#${prefix}Error`).text('');

    if (input.val().trim().length < 3) {
      input.next('.address-feedback').empty();
      return;
    }

    fetchTrigger = setTimeout(() => {
      $.getJSON('https://api-adresse.data.gouv.fr/search/', {
        q: input.val(),
        limit: 5,
        autocomplete: 1,
      })
        .done((data) => {
          if (data.features.length === 0) {
            input.next('.address-feedback').html('<p class="text-muted">Aucune suggestion disponible</p>');
            return;
          }

          const suggestions = data.features
            .map(
              (feature) => `
                <a class="list-group-item list-group-item-action py-1" href="#"
                  data-label="${feature.properties.label}"
                  data-city="${feature.properties.city}"
                  data-postcode="${feature.properties.postcode}"
                  data-coordinates="${JSON.stringify(feature.geometry.coordinates)}">
                  ${feature.properties.label}
                </a>
              `
            )
            .join('');

          input.next('.address-feedback').html(suggestions);
          currentFocus = -1;
        })
        .fail(() => {
          input.next('.address-feedback').html('<p class="text-danger">Erreur lors du chargement des suggestions</p>');
        });
    }, 300);
  });

  // Navigation clavier
  $('#adresse, #adresse_depart').keydown(function (e) {
    const items = $(this).next('.address-feedback').find('a');
    if (!items.length) return;

    switch (e.keyCode) {
      case 38: // Flèche haut
        currentFocus = Math.max(currentFocus - 1, 0);
        break;
      case 40: // Flèche bas
        currentFocus = Math.min(currentFocus + 1, items.length - 1);
        break;
      case 13: // Entrée
        items.eq(currentFocus).trigger('mousedown');
        return;
      default:
        return;
    }

    items.removeClass('active').eq(currentFocus).addClass('active');
    e.preventDefault();
  });

  // Gestion date/heure
  $('input[name="course-time"]').on('change', function () {
    const show = $(this).val() === 'later'; // Afficher les champs seulement si "Plus tard" est sélectionné
    $('#time-container, #date-container').toggle(show); // Masquer ou afficher les champs
    $('#pick_date, #pick_time').prop('required', show); // Rendre les champs obligatoires uniquement si "Plus tard"
  });

  // Validation formulaire pour les adresses
  $('form').on('submit', function (e) {
    let isValid = true;

    ['departure', 'arrival'].forEach((prefix) => {
      const city = $(`#${prefix}City`).val();
      const coordinates = $(`#${prefix}Coordinates`).val();
      const input = $(`#${prefix === 'departure' ? 'adresse_depart' : 'adresse'}`);

      if (!city || !coordinates) {
        input.addClass('is-invalid');
        $(`#${prefix}Error`).text('Veuillez sélectionner une adresse dans la liste');
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      $('.address-error').fadeIn(500).delay(3000).fadeOut(500);
    }
  });

  // --- Partie validation du téléphone ---
  function validateFrenchPhoneNumber(phoneNumber) {
    // Expression régulière pour accepter différents formats
    const frenchPhoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[\s.-]?\d{2}){4}$/;
    return frenchPhoneRegex.test(phoneNumber);
  }

  $('#phone').on('blur', function() {
    const phoneNumber = $(this).val().trim();
    const errorElement = $('#phoneError');

    if (validateFrenchPhoneNumber(phoneNumber)) {
      errorElement.text(""); // Effacer le message d'erreur
      $(this).removeClass('is-invalid'); // Supprimer la classe d'erreur visuelle
    } else {
      errorElement.text(""); // Pas de blocage ni de message frustrant
      $(this).removeClass('is-invalid'); // Supprimer toute erreur visuelle
    }
  });

  // $('form').on('submit', function(e) {
  //   const phoneNumber = $('#phone').val().trim();

  //   if (!validateFrenchPhoneNumber(phoneNumber)) {
  //     console.log("Numéro non strictement valide, mais on continue.");
  //     // Ici, vous pouvez loguer ou enregistrer l'information sans bloquer la soumission.
  //   }
  // });
});


