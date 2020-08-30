const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.connectHandler = async event => {
  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: event.requestContext.connectionId
    }
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};

exports.disconnectHandler = async event => {
    const deleteParams = {
      TableName: process.env.TABLE_NAME,
      Key: {
        connectionId: event.requestContext.connectionId
      }
    };
  
    try {
      await ddb.delete(deleteParams).promise();
    } catch (err) {
      return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
    }
  
    return { statusCode: 200, body: 'Disconnected.' };
};

exports.defaultHandler = async event => {
    let connectionData;
    console.log(`defaultHandler entry with ${process.env.TABLE_NAME} and ddb client${!!ddb}`)
    try {
        connectionData = await ddb.scan({ TableName: process.env.TABLE_NAME, ProjectionExpression: 'connectionId' }).promise();
    } catch (e) {
        console.log(`defaultHandler error: ${JSON.stringify(e)}`)
        return { statusCode: 500, body: e.stack };
    }
    console.log('defaultHandler connectionData: ', JSON.stringify(connectionData))
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });
    
    const postData = JSON.parse(event.body).data;
    console.log('defaultHandler postData: ', JSON.stringify(postData))
    const postCalls = connectionData.Items.map(async ({ connectionId }) => {
        try {
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
        console.log('defaultHandler: postedToConnection')
        } catch (e) {
        if (e.statusCode === 410) {
            console.log(`Found stale connection, deleting ${connectionId}`);
            await ddb.delete({ TableName: process.env.TABLE_NAME, Key: { connectionId } }).promise();
        } else {
            throw e;
        }
        }
    });
    
    try {
        await Promise.all(postCalls);
        console.log('defaultHandler: postCalls')
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }
    
    return { statusCode: 200, body: 'Data sent.' };
};