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


Cypress.Commands.add('login', () => {

    cy.fixture('crendentials.json').then(
        (content) => {
            cy.log(content);
            cy.visit('https://testshop-615f6.web.app/login');

            cy.get('#loginEmailId').type(content.username);
            cy.get('#loginPassword').type(content.password);        
            
            cy.get('#loginButton').click();

            cy.contains('Our Best Products').should('be.visible');

            cy.wait(2000);
        }
    )

    
})