export const ENDPOINT = 'http://127.0.0.1:8080'

export const authenticatedFetch = (url, token, request) => {
    console.log({
        ...request,
        headers: {
            'Authorization': `Token ${token}` 
        }
    })
    return fetch(url, {
        ...request,
        headers: {
            'Authorization': `Token ${token}` 
        }
    })
}