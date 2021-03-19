
describe('Loops', () => {

    beforeEach( () => {
        cy.login()
    })

    it('Open product detail view', () => {        
        cy.contains('Our Products').click();
        cy.wait(2000);

        cy.get('.navbar')
            .find(':nth-child(2) > div > .nav-link > .fa > .mt-2')
            .as('navCartIconText')

        cy.get('@navCartIconText').should('have.text', ' 0')

        cy.get('.col-md-9 > .container > .row > div')
            .each(($el, index, $list) => {
                cy.log($el);
                cy.log(index);
                cy.log($list);
                if(index === 3) {
                    cy.wrap($el).find('.item > .mb-r > .card > .card-body > .card-footer > .right > [mdbtooltip="Add to Cart"] > .fa').click()
                }

        })


        cy.get('@navCartIconText').should('have.text', ' 1')
    })
})