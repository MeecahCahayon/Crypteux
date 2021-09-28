//Load the AWS SDK
var { OAuth2Client } = require('google-auth-library');

 //Load the AWS SDK
var AWS = require('aws-sdk'),
    region = "ap-southeast-2",
    secretName = "google_client_id_secret",
    decodedBinarySecret


// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region,
    endpoint: 'https://secretsmanager.ap-southeast-2.amazonaws.com'
});

// Call the AWS API and return a Promise
function getAwsSecret(secretName) {
    return client.getSecretValue({ SecretId: secretName }).promise();
}

// Create a async function to use the Promise
// Top level await is a proposal
async function getAwsSecretAsync(secretName) {
    var error;
    var response = await getAwsSecret(secretName).catch(err => (error = err));
    return [error, response];
}




//Verify the token 
const verify = async (token,google_client,CLIENT_ID) => {
    console.log("STARTING VERIFICATION");

    //Returned Ticket
    const ticket = await google_client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });

    console.log("Obtained Ticket");
    //Getting the data payload
    const payload = await ticket.getPayload();
    
    console.log("Obtained Payload");

    //Getting the user ID
    const userid = payload['sub'];
    
    console.log("Obtained Sub");

    return [token, ticket, payload, userid];
    
}

// Help function to generate an IAM policy
const generatePolicy = (principalId, payload, event, effect, resource) => {
    var authResponse = {};
    
    console.log("In policy")
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
        
    }
    
   
    
    if(payload !== undefined){
        
        authResponse.context = {
            
            name : payload.name,
            family_name : payload.family_name,
            given_name : payload.given_name,
            picture : payload.picture,
            email : payload.email,
            sub : payload.sub,
            token: event.authorizationToken
        }
    }

    return authResponse;
}

// Handler
exports.handler = async (event, context) => {
    
    try {
        console.log("eejkrejlr", event['methodArn']);
        console.log("eejkrejlr", event['type']);
        console.log("eejkrejlr", event['authorizationToken']);
        console.log("eealksdjf", context);

        //Getting google client id secret value
        var [error, secret] = await getAwsSecretAsync(secretName);

        //Google Auth
        const CLIENT_ID = JSON.parse(secret.SecretString).google_client_id;
        const google_client = new OAuth2Client(CLIENT_ID);
    
        const token = event.authorizationToken;
    
        //Verify the login token
        const out = await verify(token, google_client, CLIENT_ID);
        
        //Deny access to an account that is not a Google account
        if (out[2]['iss'] != ['accounts.google.com'] && out[2]['iss'] != ['https://acounts.google.com']) {
            console.log("not in ")
            return generatePolicy(null, undefined, undefined, 'Deny', event['methodArn']);
        }
        
        return generatePolicy(out[3], out[2], event, 'Allow', event['methodArn'])
        
    } catch (error) {
        console.log("not the a")
        console.error;
        
        //Deny acess to id token
        return generatePolicy(null, undefined, undefined, 'Deny', event['methodArn']);
    }
}