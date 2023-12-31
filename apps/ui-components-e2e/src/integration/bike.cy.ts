describe('Bike Component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=bikecomponent--primary'));
  it('should render the component', () => {
    cy.get('cpt-bike').should('exist');
  });

  it('should detect clicks on the delete button', () => {
    cy.storyAction('click');
    cy.get('.btn--danger').click();
    cy.get('@click').should('have.been.calledOnce');
  });

  // it('should detect clicks on the complete button', () => {
  //   cy.storyAction('click');
  //   cy.get('.bike-completed').click();
  //   cy.get('@click').should('have.been.calledOnce');
  // });

  // it('should be able to edit the title', () => {
  //   cy.storyAction('dblclick');
  //   cy.get('.bike-title').dblclick();
  //   cy.get('@dblclick').should('have.been.calledOnce');
  //   cy.get('.form-control.h4').should('exist');
  // });
});
