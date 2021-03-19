
describe('Login', () => {

    const username = 'user@test.de'
    const password = 'test123'

    it('Successfull Login', () => {
        cy.visit('https://testshop-615f6.web.app/login');

        cy.get('#loginEmailId').type(username);
        cy.get('#loginPassword').type(password);

        cy.get('#loginButton').click();

        cy.contains('Our Best Products').should('be.visible');
    })
})