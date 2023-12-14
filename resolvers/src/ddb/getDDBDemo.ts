import { Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';

type PetArgs = {
  id: number;
};

export function request(ctx: Context<PetArgs>): DynamoDBQueryRequest {
  console.log('Request context: ' + ctx);

  return {
    operation: 'Query',
    query: {
      expression: 'partitionKey = :v1',
      expressionValues: { ':v1': { S: 'catbreeds' } },
    },
  };
}

export function response(ctx: Context<any>) {
  console.log('this is ddb/getDDBDemo.js response()');
  console.log('Context: ' + ctx);
  const { error, result } = ctx;
  if (error) {
    console.log('Error detected: ' + error.message);
    return util.appendError(error.message, error.type, result);
  }
  return JSON.parse(ctx.result.body);
}
