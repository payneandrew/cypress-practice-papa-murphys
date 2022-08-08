/// <reference types="Cypress" />

const getOneTrustDateStamp = () => {
  const date = new Date();
  return `${date
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      second: "numeric",
    })
    .split(" ")
    .map((x) => x.replace(",", ""))
    .join("+")}%3A00%3A00+GMT-0${date.getTimezoneOffset() / 60}00+(${date
    .toLocaleDateString(undefined, {
      day: "2-digit",
      timeZoneName: "long",
    })
    .substring(4)
    .split(" ")
    .join("+")})`;
};

const getOneTrustConsent = () => {
  return `isIABGlobal=false&datestamp=${getOneTrustDateStamp()}&version=6.3.0&landPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0004%3A1%2CSPD_BG%3A1&hosts=`;
};

const VW = "Vancouver, Washington";

describe('Papa Murphys spec', () => {
  let myData = []

  beforeEach(() => {
    cy.setCookie("OptanonAlertBoxClosed", new Date().toISOString()).setCookie(
      "OptanonConsent",
      getOneTrustConsent()
    );
    cy.fixture(Cypress.env('nearBody') ?? 'default-three-stores.json').then((data)=> {myData = data}).as('data');

    cy.interceptRestaurantsNearEndpoint().as('getData');

    cy.visit('https://test-www.papamurphys.com/order/')
  });

  it('When a user searches for Vancouver, Washington as the pickup location, the first element contains Vancouver, Washington and 5 elements are displayed', () => {
    cy.inputTextFieldAndSelect(VW, 0);
    cy.get('.store-card').should('have.length', myData.length).each(($el, index) => {
      cy.wrap($el).should('contain', myData[index].name);
     });
  });


  it('When a user searches for Butte, MT as the pickup location, the first element contains Butte, MT and 5 elements are displayed', {env: {nearBody: 'default-one-store.json'}}, () => {
    cy.get('@data').then((data)=> {
      cy.inputTextFieldAndSelect('Butte', 0);
      cy.get('.store-card').should('have.length', data.length);
      cy.get('.store-card').eq(0).should('contain', data[0].name);
    }); 
  });

  it('When a user searches for Charlottesville, no locations display', {env: {nearBody: 'empty.json'}}, () => {
    cy.inputTextFieldAndSelect('Charlottesville', 0);
    cy.get('[data-cy="side-panel-message-body"]').should('contain', 'Sorry, we couldn’t find any locations near your search. Please try searching again in a different area.');
    cy.get('.store-card').should('have.length', myData.length);
  });

  it('When a 400 is returned, no results are displayed', {env: {nearStatusCode: 400, nearBody: 'empty.json'}},() => {
    cy.inputTextFieldAndSelect(VW, 0).wait('@getData');
    cy.get('.store-card').should('not.exist');
  });


});