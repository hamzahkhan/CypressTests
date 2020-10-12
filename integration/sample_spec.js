describe('LivChat login', () => {
    it('login test', () => {
        cy.visit('http://localhost:8080/#/auth/login')
    })
    it('Username write', () => {
        const username =  "drjohnsmith@mailcupp.com";
        const password = "QwErT!2#"
        cy.get('[data-cy="login-mail"]').type(username)
        cy.get('[data-cy="login-pswd"]').type(password)
        cy.get('[data-cy="submit"]').click()
    })
})



describe('LivChat new chat start', () => {
    it('start chat test', () => {
        cy.visit('http://localhost:8080/#/startChat/search')
    })
    it('Select new chat', () => {
        cy.get('[data-cy="search_user_type"]').type("Ham")
    })
})