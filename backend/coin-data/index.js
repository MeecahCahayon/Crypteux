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
    
    console.log("Event: " + JSON.stringify(event));
    //console.log("Event: " + event)
    switch (true) {
        case event.queryStringParameters && event.queryStringParameters.coinID && event.httpMethod === 'GET' && event.path === '/market-data':
            //console.log(event.body.coinID);
            var market_data = await queryCompanyMarketData(event.queryStringParameters.coinID); //Return the requested coins market 
            response = await buildResponse(200, market_data);
            break;
        case event.queryStringParameters && event.queryStringParameters.coinID && event.httpMethod === 'GET' && event.path === '/coin': //Return the requested coin
            var coin = await queryCoin(event.queryStringParameters.coinID);
            response = await buildResponse(200, coin);
            break;
        case event.httpMethod === 'GET' && event.path === '/coins': //Return all the coins 
            var coins = await queryAllCoin();
            response = await buildResponse(200, coins);
            break;
        default:
            response = buildResponse(404, "failed");
            break;
    }
    return response;
}

const queryCoin = async (coinID) => {
    return new Promise((resolve) => {
        connection.query("SELECT * FROM coin WHERE coinGeckoID = ?",
        coinID,
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

const queryAllCoin = async () => {
    return new Promise((resolve) => {
        connection.query("SELECT * FROM coin",
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

const queryCompanyMarketData = async (coinID) => {
    return new Promise((resolve) => {
        connection.query("SELECT * FROM market_data WHERE coinID = ?",
        coinID,
        (err, results) => {
            if (err) {
                throw err;
            }
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
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
        }
    }
}
