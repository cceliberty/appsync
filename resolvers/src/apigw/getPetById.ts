import { Context, HTTPRequest, util } from '@aws-appsync/utils';

type PetArgs = {
  id: number;
};

export function request(ctx: Context<PetArgs>): HTTPRequest {
  console.log('Request context: ' + ctx);

  return {
    method: 'GET',
    params: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    resourcePath: `/test/pets/${ctx.args.id}`,
  };
}

export function response(ctx: Context<any>) {
  console.log('this is apigw/getPets.js response()');
  console.log('Context: ' + ctx);
  const { error, result } = ctx;
  if (error) {
    console.log('Error detected: ' + error.message);
    return util.appendError(error.message, error.type, result);
  }
  return JSON.parse(ctx.result.body);
}
