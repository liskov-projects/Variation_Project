describe("Basic test", () => {
    it("loads the home page", () => {
        // Visit the public home page and check for actual content
        cy.visit("/");
        cy.contains("Innovate.").should("exist");
        cy.contains("Create").should("exist");
        cy.contains("Transform").should("exist");
    });
    
    it("loads the sign-in page", () => {
        // Test the sign-in page which should be accessible
        cy.visit("/sign-in");
        cy.url().should("include", "/sign-in");
    });
});