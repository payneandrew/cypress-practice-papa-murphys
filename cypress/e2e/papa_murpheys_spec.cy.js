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

describe('Papa Murphys spec', () => {

  beforeEach(() => {
    cy.visit('https://test-www.papamurphys.com/order/')

    cy.setCookie("OptanonAlertBoxClosed", new Date().toISOString()).setCookie(
      "OptanonConsent",
      getOneTrustConsent()
    );
  });

  it('When a user searches for Vancouver, Washington as the pickup location, the first element contains Vancouver, Washington and 5 elements are displayed', () => {
    cy.get('#onetrust-accept-btn-handler').click();
    cy.get('#pick-up-input').type('Vancouver, Washington');

    cy.get('.pac-item').eq(0).should('contain', 'Vancouver').and('contain', 'Washington');
    cy.get('.pac-item').and('have.length', 5);

    cy.get('.pac-item').eq(0).click();
    cy.get('.store-card').should('have.length', 3);
    cy.get('.store-card').eq(0).should('contain', "SS101 – PAPA MURPHY'S WT Testing");
  });


  it('When a user searches for Vancouver, Washington as the pickup location, the first element contains Butte, MT and 5 elements are displayed', () => {
    cy.get('#onetrust-accept-btn-handler').click();
    cy.get('#pick-up-input').type('Butte');
    cy.get('.pac-item').eq(0).should('contain', 'Butte').and('contain', 'MT');
    cy.get('.pac-item').and('have.length', 5);

    cy.get('.pac-item').eq(0).click();
    cy.get('.store-card').should('have.length', 1);
    cy.get('.store-card').eq(0).should('contain', "SS102 Willow Tree Papa Murphy’s Pizza Lab");
  });

  it('When a user searches for Charlottesville, no locations display', () => {
    cy.get('#onetrust-accept-btn-handler').click();
    cy.get('#pick-up-input').type('Charlottesville');
    cy.get('.pac-item').eq(0).click();
    cy.get('[data-cy="side-panel-message-body"]').should('contain', 'Sorry, we couldn’t find any locations near your search. Please try searching again in a different area.');
    cy.get('.store-card').should('have.length', 0);
  });


});