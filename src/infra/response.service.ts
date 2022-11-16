import { assoc } from 'ramda';
export = () => {
  const defaultResponse = (success = true) => ({
    success,
    version: '1.0',
    timestamp: new Date(),
  });

  const Success = async (data: any) =>
    assoc('data', data, defaultResponse(true));

  const Fail = async (data: any) => {
    console.log(data);
    let message = data;
    if (!data) {
      message = 'Something went wrong';
    }
    return assoc('error', message, defaultResponse(false));
  };

  return {
    Success,
    Fail,
  };
};
