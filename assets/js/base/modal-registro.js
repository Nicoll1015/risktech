/**
 * Modal de registro.
 *
 * Cada página incluye este archivo dos veces (venía duplicado en el HTML
 * original). El guardia evita que la segunda ejecución registre los listeners
 * otra vez; antes fallaba con «Identifier 'openModalButtons' has already been
 * declared» porque las constantes estaban en el ámbito global.
 */
(function () {
	'use strict';

	if (window.riskTechModalRegisterReady) {
		return;
	}
	window.riskTechModalRegisterReady = true;

	// Botones que abren el modal.
	var openModalButtons = document.querySelectorAll('.btnOpenModalRegister');

	// El propio modal.
	var modalRegister = document.querySelector('.modalRegister');

	// Botón de cierre.
	var closeModalButton = document.querySelector('.closeModalRegister');

	if (!modalRegister) {
		return;
	}

	openModalButtons.forEach(function (button) {
		button.addEventListener('click', function (event) {
			event.preventDefault();
			modalRegister.classList.remove('d-none');
		});
	});

	if (closeModalButton) {
		closeModalButton.addEventListener('click', function (event) {
			event.preventDefault();
			modalRegister.classList.add('d-none');
		});
	}
}());
