 //Load the AWS SDK
var AWS = require('aws-sdk'),
    region = "ap-southeast-2",
    secretName = "mysql-data-user",
    decodedBinarySecret,
    connection;

var mysql = require('mysql');


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



const authenticateUser = async (token, event) => {

    //Check if use in database
    const results = await queryUser(event.sub);
    

    //If user not in database add new user
    if (results[0].res == 0) {
        await insertUser(event.email, event.family_name, event.given_name, event.sub, event.name, event.picture);
    }

    return { "Cookie": token }

}

// Handler
exports.handler = async (event, context) => {

    var [error, secret] = await getAwsSecretAsync(secretName);

    //Parsing secret JSON object
    const dbsecretJSON = JSON.parse(secret.SecretString);

    //Creating database connection
    connection =  mysql.createConnection({
        host: dbsecretJSON.host,
        user: dbsecretJSON.username,
        password: dbsecretJSON.password,
        database: dbsecretJSON.dbname,
    });

    let response;
    
    console.log(event)

    switch (true) {
        case event.httpMethod === 'POST' && event.path === '/login':
            //response = await buildResponse(200, await authenticateUser(event.token, event));
            await authenticateUser(event.token, event);
            response = await buildResponse(200, "Successful Login");
            break;
        case event.httpMethod === 'POST' && event.path === '/profile':
            const results = await queryUser(event.sub);
            if (results[0].res == 0){
                response = await buildResponse(401, "Invalid User");
            }else{
                response = await buildResponse(200, {
                id : event.sub, 
                name : event.name, 
                email : event.email,
                picture : event.picture});   
            }
            break;
        case event.httpMethod === 'GET' && event.path === '/watchlist':
            response = await buildResponse(200, await getWatchlist(event.sub));
            break;
        case event.httpMethod === 'POST' && event.path === '/watchlist':
            console.log(event)
            var encodedBody = event.body;
            var decodedBody = Buffer.from(encodedBody, 'base64');
            
            //console.log(JSON.parse(decodedBody));
            await insertWatchlist(JSON.parse(decodedBody).coinID, event.sub);
            
            response = await buildResponse(200, "Inserted");
            break; 
           
        case event.httpMethod === 'DELETE' && event.path === '/watchlist':
            var encodedBody = event.body;
            var decodedBody = Buffer.from(encodedBody, 'base64');
            
            await removeWatchlist(JSON.parse(decodedBody).coinID, event.sub);
            
            response = await buildResponse(200, "Deleted");
            break; 
        default:
            response = buildResponse(404, "Failed, unauthorized ");
    }
    return response;
}

const getWatchlist = async (id) => {
    return new Promise((resolve) => {
    connection.query('select * from watchlist where userID = ?',
        [id],
        (err, results) => {
            if (err) {
                throw err;
            }
        console.log(results);
        resolve(results);
        });
      }
    );
}

const queryUser = async (id) => {
    return new Promise((resolve) => {

    connection.query('SELECT EXISTS(SELECT * from users where id_subject = ?) as res',
        [id],
        (err, results) => {
            if (err) {
                throw err;
            }
        console.log(results);
        resolve(results);
        });
      }
    );
}

const insertUser = async (email, family_name, given_name, id_subject, name, picture) => {
  return new Promise((resolve) => {

    connection.query('insert into users (email, family_name, given_name, id_subject, name, picture) VALUES(?,?,?,?,?,?)',
        [email, 
        family_name, 
        given_name, 
        id_subject, 
        name, 
        picture],
        (err, results) => {
            if (err) {
                throw err;
            }
        console.log(results)
        resolve(results);
        });
      }
    ); 
}

const insertWatchlist = async (coinID, id) => {
  return new Promise((resolve) => {

    connection.query('insert into watchlist (coinID, userID) VALUES(?,?) ON DUPLICATE KEY UPDATE coinID=coinID',
        [coinID, 
        id],
        (err, results) => {
            if (err) {
                throw err;
            }
        console.log(results)
        resolve(results);
        });
      }
    ); 
}

const removeWatchlist = async (coinID, id) => {
  return new Promise((resolve) => {

    connection.query('DELETE FROM watchlist watchlist WHERE coinID = ? AND userID = ?',
        [coinID, 
        id],
        (err, results) => {
            if (err) {
                throw err;
            }
        console.log(results)
        resolve(results);
        });
      }
    ); 
}

const buildResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://pumped-load-balancer-57340942.ap-southeast-2.elb.amazonaws.com",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
            "Access-Control-Allow-Headers": "authorizationToken"
        }
    }
}