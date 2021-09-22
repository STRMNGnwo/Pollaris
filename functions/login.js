const functions = require('firebase-functions');
const cors = require('cors')({origin: "https://www.pollaris.ie"});
const admin= require('firebase-admin');


exports.authorizedendpoint = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
    
            console.log('Check if request is authorized with Firebase ID token');
            if ((!request.headers.authorization || !request.headers.authorization.startsWith('Bearer '))) {
                console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
                    'Make sure you authorize your request by providing the following HTTP header:',
                    'Authorization: Bearer <Firebase ID Token>');
                response.status(403).send('Unauthorized');
                return;
            }
            let idToken;
            if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
                console.log('Found "Authorization" header');
                // Read the ID Token from the Authorization header.
                idToken = request.headers.authorization.split('Bearer ')[1];
            } else {
                // No cookie
                response.status(403).send('Unauthorized');
                return;
            }
    
            try {
                const decodedIdToken = admin.auth().verifyIdToken(idToken).then((token) => {
                    console.log('ID Token correctly decoded', token);
                    response.send("Welcome to the secure section " + token);
                });
            } catch (error) {
                console.error('Error while verifying Firebase ID token:', error);
                response.status(403).send('Unauthorized');
                return;
            }
        });//end of cors functions
      
      }) //end of the firebase function