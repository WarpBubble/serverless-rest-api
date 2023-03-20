import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { table } from "console";
import { v4 } from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "ProductsTable";

export const CreateProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const reqBody = JSON.parse(event.body as string);

  const product = {
    ...reqBody,
    productID: v4(),
  };

  await docClient
    .put({
      TableName: "ProductsTable",
      Item: {
        product,
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};



export const getProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;

  const output = await docClient
    .get({
      TableName: tableName,
      Key: {
        productId: id,
      },
    })
    .promise();

    {/* if the output is not found return a status code for not found*/}
  if (!output.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "NOT FOUND" }),
    };
  }

   {/* return that it has been found and the json string of detail */}
  return {
    statusCode: 200,
    body: JSON.stringify(output),
  };
};
