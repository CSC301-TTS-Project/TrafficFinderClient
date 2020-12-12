export const ENDPOINT = 'http://trafficfinder-env-1.eba-xdiqm5xb.us-east-2.elasticbeanstalk.com'

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