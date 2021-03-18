# Cypress Live Coding Session

This is the repository for the live coding session from the [Karlsruher Software Testing Meetup Group](https://www.meetup.com/de-DE/software-testing-karlsruhe/). This tutorial take place on Thursday, March 18, 2021 from 19:00 to 20:30.

## Goals
The goal of this live coding tutorial is to get in touch with Cypress.

# Setup

## Pre-Condition

Please check, if you have fullfilled all the versions of node and chrome. 

* node > v14.2.0
* chrome > v87
* IDE e.g. Visual Studio Code

## 

Before starting, we install 

```bash
git clone https://github.com/askui/cypress-live-coding-session.git
npm install
```


# Tutorial

# 1. Start Cypress

First step is to start Cypress with the following command. Don't be shocked, it starts an own cypress application and creates many example files in the `/cypress`-folder 

```bash
./node_modules/.bin/cypress open
```

Click on the play icon left of `Run 16 integrations specs` and see how all tests are executing. 

After you've started cypress, the following folder structure should be created:
```

- cypress
    |- fixtures <-- example jsons
        |- example.json
    |- integrations <-- location of tests
        |- examples <-- example specs created from cypress
            |- action.spec.js 
            |- ...
            |- window.spec.js 
    |- plugins 
    |- support
- node_modules
- cypress.json <-- global Cypress config files file
- package-lock.json
- package.json
- README.md
```

Now delete all files under `cypress/fixtures/*` and `cypress/integration/*`.

# 2. Write your own test

## Open a page

Create a new file `cypress/integration/login.spec.js`:
```javascript

describe('Login', () => {
    const username = 'user@test.de'
    const password = 'test123'


    it('Successful login', () => {
        cy.visit('https://testshop-615f6.web.app/login');
   
    });
})

```

If you execute the test via the cypress app, you will notice that you get a *Security Error*. Add `"chromeWebSecurity": false` to `cypress.json` to start chrome with disabled web security. (I don't like this solution.) I think this is related to the best practice, which says please don't visit other sides and please use http requests instead  ([Visiting external sites](https://docs.cypress.io/guides/references/best-practices.html#Visiting-external-sites)).

After you've restarted the test, the error is gone and the side is opened.

## Type username

Now let's type the username in the username textfield. 

```javascript
...
cy.visit('https://testshop-615f6.web.app/login');

cy.get('#loginEmailId').type(username);
...
```


## Type password


Now let's type the username in the username textfield. 

```javascript
...
cy.visit('https://testshop-615f6.web.app/login');

cy.get('#loginEmailId').type(username);
cy.get('#loginPassword').type(password);
...
```

## Click the button

```javascript
...
cy.visit('https://testshop-615f6.web.app/login');

cy.get('#loginEmailId').type(username);
cy.get('#loginPassword').type(password);


cy.get('#loginButton').click();
...
```

## Check if elements exist
        

```javascript
...
cy.visit('https://testshop-615f6.web.app/login');

cy.get('#loginEmailId').type(username);
cy.get('#loginPassword').type(password);


cy.get('#loginButton').click();

cy.contains('Our Best Products').should('be.visible');
...
```



## Stay logged in 

Cypress applies unit test rules for end-2-end tests. Best practices include:
* [one assert per test](https://docs.cypress.io/guides/references/best-practices.html#Creating-%E2%80%9Ctiny%E2%80%9D-tests-with-a-single-assertion)
* [tests should run independent of each other](https://docs.cypress.io/guides/references/best-practices.html#Having-tests-rely-on-the-state-of-previous-tests)   

Simple questions, like how can I log in before each tests, will be referred to this simple rules e.g. [Having to log in within every test - is this normal?](https://github.com/cypress-io/cypress/issues/1177)


But nevertheless let's check how we can share our login in multiple tests. The first way is to add this to the beforeEach methode:
```javascript
describe('Product detail view', () => {

    beforeEach( () => {
        const username = 'user@test.de'
        const password = 'test123'
        cy.visit('https://testshop-615f6.web.app/login');

        cy.get('#loginEmailId').type(username);
        cy.get('#loginPassword').type(password);        
        
        cy.get('#loginButton').click();

        cy.contains('Our Best Products').should('be.visible');

        cy.wait(2000);
    })

    it('Open product detail view', () => {

        cy.contains('Our Products').click();
        cy.wait(1000);
        cy.contains('Samsung Galaxy S10').click();

        cy.contains('Product Details').should('be.visible');
    })
})
```

And if you want to share this between multiple tests, you can easily add a command. Therefore add to the `cypress/support/command.js` follwing command:
```javascript
Cypress.Commands.add('login', () => {
    const username = 'user@test.de'
    const password = 'test123'
    cy.visit('https://testshop-615f6.web.app/login');

    cy.get('#loginEmailId').type(username);
    cy.get('#loginPassword').type(password);        
    
    cy.get('#loginButton').click();

    cy.contains('Our Best Products').should('be.visible');

    cy.wait(2000);
})
```

Now, this command can be reused in every test. Therfore we replace the beforeEach function in `cypress/integration/product-detail-view.spec.js` by:
```javascript
beforeEach( () => {
    cy.login();
})
```

## Loops

If you have multiple elements like product lists. Therfore we add a new test file under `cypress/integraion/loop.spec.js` and iterate over product elements.


```javascript
describe('Loops', () => {

    beforeEach( () => {
        cy.login()
    })

    it('Open product detail view', () => {        
        cy.contains('Our Products').click();
        cy.wait(2000);
        
        cy.get('.navbar')
            .find(':nth-child(2) > div > .nav-link > .fa > .mt-2')
            .should('have.text', ' 0')
        
        cy.get('.col-md-9 > .container > .row > div')
            .each(($el, index, $list) => {
                cy.log($list);
                cy.log(index);
                cy.log($el);
                if(index === 3){
                    cy.wrap($el).find('.item > .mb-r > .card > .card-body > .card-footer > .right > [mdbtooltip="Add to Cart"]').click()
                }
            })

        cy.get('.navbar')
            .find(':nth-child(2) > div > .nav-link > .fa > .mt-2')
            .should('have.text', ' 1')        
    })
})
```

# Aliases with as

To improve the readability of a text we can us the `as` method.

```javascript
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
                cy.log($list);
                cy.log(index);
                cy.log($el);
                if(index === 3){
                    cy.wrap($el).find('.item > .mb-r > .card > .card-body > .card-footer > .right > [mdbtooltip="Add to Cart"]').click()
                }
            })

        cy.get('@navCartIconText').should('have.text', ' 1')      
    })
})
```

# Advanced Functions

## Fixtures

Fixtures allow you to use files inside your test. Therefore we create a `credentials.json` first - under `cypress/fixtures/` and us it as fixture in our login command under `cypress/fixtures/commands.js`

```json
{
    "username": "user@test.de",
    "password": "test123"
}
```

Now we can load the credentials from a config file inside the 

```javascript
Cypress.Commands.add('login', () => {
    cy.fixture('credentials.json').then((content) => {
        cy.log(content);

        cy.visit('https://testshop-615f6.web.app/login');

        cy.get('#loginEmailId').type(content.username);
        cy.get('#loginPassword').type(content.password);        
        
        cy.get('#loginButton').click();
    
        cy.contains('Our Best Products').should('be.visible');
    });  

    cy.wait(2000);
})
```



## Take Screenshot

You can take a screenshot of the whole page. To do so create a new file `cypress/integration/screenshot.spec.js` 
```javascript
describe('Screenshot', () => {

    it('Full page screenshot', () => {
        cy.visit('https://testshop-615f6.web.app/login');

        cy.screenshot('fullpage_screenshot');
    })
})
```

The screenshot is stored in `cypress/screenshots/screenshot.spec.js/` for you to have a look at it. 

You can also take a screenshot from a part of the element. Add the following code snippet to
```javascript
    it('Element screenshot', () => {
        cy.visit('https://testshop-615f6.web.app/login');

        cy.get('#loginButton').screenshot('element_screenshot');
    })
```

# Out of scope

## Run OS commands

System commands can be executed like this: `cy.exec('npm run build')`

## Lets deal with IFrames

Accessing IFrames is restricted, the same applies to normal web applications. You have to disable the chrome web security to achive this goal. For more information have a look here [Working with iframes in cypress](https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/)  

## Intercept HTTP Reuqests

Cypress allows you to intercept the connection, to stub HTTP requests and speed up your testing. This is used mostly in combination with fixtures. Have a look at [Introducing cy.intercept - Next Generation Network Stubbing in Cypress 6.0](https://www.cypress.io/blog/2020/11/24/introducing-cy-intercept-next-generation-network-stubbing-in-cypress-6-0/)



