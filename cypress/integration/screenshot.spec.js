describe('Screenshot', () => {

    it('Full page screenshot', () => {
        cy.visit('https://testshop-615f6.web.app/login');

        cy.screenshot('fullpage_screenshot');
    })
    
    it('Element screenshot', () => {
        cy.visit('https://testshop-615f6.web.app/login');

        cy.contains('Login').screenshot('login_button_screenshot');
    })
})