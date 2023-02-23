/**
 * Startup commands
 * @memberOf cy
 * @method startup
 */
Cypress.Commands.add('startup', () => {
	cy.visit('localhost:8000');
	cy.get('#resetButton').click();
});

/**
 * Close all open pickrs
 * @memberOf cy
 * @method closePickr
 */
Cypress.Commands.add('closePickr', () => {
	cy.get('#logo').trigger('mousedown');
});

/**
 * Change the color of a pickr
 * @method changeColor
 * @param {string} newColor: New color in hex form
 * @param {boolean} forceClick
 */
Cypress.Commands.add(
	'changeColor',
	{prevSubject: ['element']},
	(subject, newColor, forceClick = false) => {
		for (let i = 0; i < subject.length; i++) {
			// open pickr
			cy.wrap(subject[i]).within(() => {
				cy.get('button').first().click({force: forceClick});
			});
			cy.get('.pcr-app.visible')
				.should('have.length', 1) // only one app should open
				.within(() => {
					// enter new color via input field
					cy.get('.pcr-result').type(
						'{selectall}{backspace}' + newColor
					);
					cy.get('.pcr-save').click({force: forceClick});
				});
			cy.closePickr();
		}
	}
);

/**
 * Get the color of a pickr
 * @memberOf cy
 * @method getColor
 * @return Color as hex
 */
Cypress.Commands.add('getColor', {prevSubject: true}, (subject) => {
	let returnValue;

	cy.wrap(subject[0]).within(() => {
		cy.wait(400).then(() => {
			cy.get('.pcr-button').then(($btn) => {
				let color = getComputedStyle($btn[0]).getPropertyValue(
					'--pcr-color'
				);
				color = color.replace('rgba(', '');
				color = color.replace(')', '');

				const colorList = color.split(',');

				const r = parseInt(colorList[0]).toString(16).padStart(2, '0');
				const g = parseInt(colorList[1]).toString(16).padStart(2, '0');
				const b = parseInt(colorList[2]).toString(16).padStart(2, '0');

				returnValue = `#${r}${g}${b}`.toUpperCase();
			});
		});
	});
	cy.then(() => {
		return cy.wrap(returnValue);
	});
});

/**
 * Asserts the color of a pickr
 * @memberOf cy
 * @method shouldHaveColor
 * @param {string}
 */
Cypress.Commands.add(
	'shouldHaveColor',
	{prevSubject: true},
	(subject, assertedColor) => {
		for (let i = 0; i < subject.length; i++) {
			let color = cy.wrap(subject[i]).getColor();

			color.then(($color) => {
				assert(
					$color === assertedColor,
					`Color should have been ${assertedColor}, but was ${$color}`
				);
			});
		}
	}
);

/**
 * Inputs a file
 * @memberOf cy
 * @method inputFile
 * @content {string}
 */
Cypress.Commands.add('inputFile', (content) => {
	if (Cypress.browser.name === 'firefox') {
		cy.get('#importButton').click();
		cy.get('#basicImport').should('be.visible').type(content);
		cy.get('#importAction').should('be.visible').click();
	} else {
		cy.writeFile('./cypress/downloads/temp.json', content);
		cy.get('#fileSelector').selectFile('./cypress/downloads/temp.json', {
			force: true,
		});
	}
	// wait until the content of the input file is processed
	cy.wait(3000);
});
