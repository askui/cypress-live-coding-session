describe('Product detail view', () => {

    beforeEach( () => {
        cy.login();
    })

    it('Open product detail view', () => {

        cy.contains('Our Products').click();
        cy.contains('Samsung Galaxy S10').click();

        cy.contains('Product Details').should('be.visible');

    })
})