const { SQS } = require("aws-sdk");

// 인위적으로 처리속도를 제어하기 위해서 지연을 준다.
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
const sqs = new SQS();

const producer = async (event) => {
  let statusCode = 200
  let message;
  await delay(1000); // function A 처리속도를 제어하기 위해서 지연을 준다.
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  try {
    await sqs
      .sendMessage({
        QueueUrl: "https://sqs.ap-northeast-2.amazonaws.com/307420834314/aws-node-sqs-worker-dev-jobs",
        MessageBody: event.body
      })
      .promise();

    message = `Message accepted!`;
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 400
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

const consumer = async (event) => {
  for (const record of event.Records) {
    console.log("Message Body: ", record.body);
    await delay(4000); // function B 처리속도를 제어하기 위해서 지연을 준다.
    const message = `${parseInt(JSON.parse(record.body).input) + 1}`;
    console.log(message);
  }
};

module.exports = {
  producer,
  consumer,
};
