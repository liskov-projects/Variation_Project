export const isValidEmail = (email) => {
    console.log('Validating email...')
    return  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
}