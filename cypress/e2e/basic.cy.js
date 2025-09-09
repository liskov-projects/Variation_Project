describe("Basic test", () => {
    it("loads the home page", () => {
        cy.visit("/welcome");
        cy.contains("Welcome").should("exist")
    })
});
