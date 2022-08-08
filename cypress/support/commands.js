// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('inputTextFieldAndSelect', (text, index) => {
    cy.get('#pick-up-input').type(text);
    cy.get('.pac-item').eq(index).click();
});

Cypress.Commands.add('interceptRestaurantsNearEndpoint', () => {
    cy.intercept('**/restaurants/near*', (req) => {
        req.reply({statusCode: Cypress.env('nearStatusCode') ?? 200, fixture: Cypress.env('nearBody') ?? 'default-three-stores.json'})
    })
});