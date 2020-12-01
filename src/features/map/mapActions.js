export const ENDPOINT = 'http://trafficfinder-env-1.eba-xdiqm5xb.us-east-2.elasticbeanstalk.com/'

let MAPBOX_PUBLIC_KEY
let HERE_PUBLIC_KEY

function getHereToken () {
	fetch(`${ENDPOINT}api/getKeys`, {
	    method: "POST",
	  })
    .then((response) => {
      if (response.status !== 200) {
        console.log("Internal error, status code: " + response.status);
      } else {
        response.json().then((data) => {
        	return data['HERE_PUBLIC_KEY']
        	
        });
      }
    })
    .catch((error) => {
      console.log("Could not get api keys: " + error);
	});
};

async function getMapboxToken () {
	fetch(`${ENDPOINT}api/getKeys`, {
	    method: "POST",
	  })
    .then((response) => {
      if (response.status !== 200) {
        console.log("Internal error, status code: " + response.status);
      } else {
        response.json().then((data) => {
        	console.log(data['MAPBOX_PUBLIC_KEY'])
        	return data['MAPBOX_PUBLIC_KEY']
        	
        });
      }
    })
    .catch((error) => {
      console.log("Could not get api keys: " + error);
	});
};

export {getHereToken, getMapboxToken}

