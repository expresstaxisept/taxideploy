// Fonction de validation du numéro de téléphone français
function validatePhone() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    const submitButton = document.querySelector('input[type="submit"]');
    const tooltip = document.querySelector('input[type="submit"]');
    
    // Récupérer la valeur du champ sans espaces
    const phoneValue = phoneInput.value.trim();
    
    // Accepte +33 X XX XX XX XX ou 0X XX XX XX XX avec ou sans espaces/tirets/points
    const frenchPhoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    
    // Vérification du format
    if (phoneValue === '') {
      // Champ vide
      phoneError.textContent = "Veuillez saisir un numéro de téléphone";
      phoneError.classList.add('text-danger');
      phoneError.classList.remove('text-success');
      phoneInput.classList.add('is-invalid');
      phoneInput.classList.remove('is-valid');
      submitButton.disabled = true;
      submitButton.setAttribute('title', 'Veulliez renseigner tous les champs svp !');

      return false;
    } else if (!frenchPhoneRegex.test(phoneValue)) {
      // Format invalide
      phoneError.textContent = "Format incorrect. Utilisez +33 6 XX XX XX XX ou 06 XX XX XX XX";
      phoneError.classList.add('text-danger');
      phoneError.classList.remove('text-success');
      phoneInput.classList.add('is-invalid');
      phoneInput.classList.remove('is-valid');
      submitButton.disabled = true;
      submitButton.setAttribute('title', 'Veulliez renseigner tous les champs svp !');

      return false;
    } else {
      // Format valide
      phoneError.textContent = "Numéro de téléphone valide ✓";
      phoneError.classList.remove('text-danger');
      phoneError.classList.add('text-success');
      phoneInput.classList.remove('is-invalid');
      phoneInput.classList.add('is-valid');
      submitButton.disabled = false;
      submitButton.removeAttribute('title');
      
      
      // Effacer le message après 2 secondes si le format est correct
      setTimeout(() => {
        if (phoneInput.classList.contains('is-valid')) {
          phoneError.textContent = "";
        }
      }, 2000);
      
      return true;
    }
  }
  
  // Formater le numéro pendant la saisie pour respecter strictement le format
  // +33 X XX XX XX XX ou 0X XX XX XX XX
  function formatPhoneNumber(input) {
    // Supprimer tous les caractères sauf les chiffres et le +
    let digits = input.value.replace(/[^\d+]/g, '');
    
    // Formater selon le type de numéro (international ou national)
    let formattedNumber = '';
    
    if (digits.startsWith('+33')) {
      // Format international +33
      if (digits.length <= 3) {
        // Garder tel quel jusqu'à +33
        formattedNumber = digits;
      } else {
        // Format +33 X XX XX XX XX
        formattedNumber = '+33 ';
        
        // Ajouter le premier chiffre après l'indicatif
        if (digits.length > 3) {
          formattedNumber += digits.charAt(3);
        }
        
        // Ajouter les paires de chiffres avec espaces
        if (digits.length > 4) {
          formattedNumber += ' ' + digits.substr(4, 2);
        }
        if (digits.length > 6) {
          formattedNumber += ' ' + digits.substr(6, 2);
        }
        if (digits.length > 8) {
          formattedNumber += ' ' + digits.substr(8, 2);
        }
        if (digits.length > 10) {
          formattedNumber += ' ' + digits.substr(10, 2);
        }
      }
    } else if (digits.startsWith('0')) {
      // Format national 0X
      formattedNumber = '0';
      
      // Ajouter le premier chiffre après le 0
      if (digits.length > 1) {
        formattedNumber += digits.charAt(1);
      }
      
      // Ajouter les paires de chiffres avec espaces
      if (digits.length > 2) {
        formattedNumber += ' ' + digits.substr(2, 2);
      }
      if (digits.length > 4) {
        formattedNumber += ' ' + digits.substr(4, 2);
      }
      if (digits.length > 6) {
        formattedNumber += ' ' + digits.substr(6, 2);
      }
      if (digits.length > 8) {
        formattedNumber += ' ' + digits.substr(8, 2);
      }
    } else {
      // Si ne commence ni par +33 ni par 0, on garde les chiffres saisis
      formattedNumber = digits;
    }
    
    // Appliquer le format au champ
    input.value = formattedNumber;
  }
  
  // Initialiser la validation du téléphone
  document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    const submitButton = document.querySelector('input[type="submit"]');
    
    // Désactiver le bouton par défaut jusqu'à ce que le numéro soit valide
    submitButton.disabled = true;
    
    if (phoneInput) {
      // Validation en temps réel pendant la saisie
      phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
        validatePhone();
      });
      
      // Validation à la perte de focus
      phoneInput.addEventListener('blur', function() {
        formatPhoneNumber(this); // Reformater à la perte de focus pour s'assurer du bon format
        validatePhone();
      });
      
      // Validation au chargement initial (si prérempli)
      validatePhone();
    }
    
    // modifier la fonction de validation du formulaire si elle existe déjà
    // ou créer une nouvelle si elle n'existe pas
    if (typeof validateForm !== 'undefined') {
      // La fonction existe déjà, gardons sa référence
      const originalValidateForm = validateForm;
      
      // Rempler par notre version qui vérifie aussi le téléphone
      window.validateForm = function() {
        const isPhoneValid = validatePhone();
        // Exécuter la validation originale et combiner avec notre validation de téléphone
        return originalValidateForm() && isPhoneValid;
      };
    } else {
      // si la fonction n'existe pas encore, il faut la créer
      window.validateForm = function() {
        return validatePhone();
      };
    }
  });