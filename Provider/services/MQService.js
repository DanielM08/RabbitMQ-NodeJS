function connect(){
  return require('amqplib').connect("amqp://localhost:5672")
    .then(conn => conn.createChannel());
}

function createQueue(channel, queue){
  return new Promise((resolve, reject) => {
    try{
      //Metadata of a durable queue is stored on disk, 
      //while metadata of a transient queue is stored in memory when possible
      channel.assertQueue(queue);
      resolve(channel);
    }
    catch(err){ reject(err) }
  });
}

//1)CreatQueue doesn't generate error if the queue exists
//We could avoid that if we were sure that the queue already exists. 

//2)In RabbitMQ a message can never be sent directly to the queue, it always needs to go through an exchange.
//  This exchange is special (nameless exchange) ‒ it allows us to specify exactly to which queue the message should go.


function sendToQueue(queue, message){
  connect()
    .then(channel => createQueue(channel, queue))
    .then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {persistent: true}))
    .catch(err => console.log(err));
}

function queueLenght(queue){
  return connect()
    .then(channel => channel.assertQueue(queue).then(function(info){console.log(info.messageCount)}))
    .catch(err => console.log(err));
}

function consume(queue, callback){
  connect()
    .then(channel => createQueue(channel, queue))
    .then(channel => channel.consume(queue, callback, { noAck: true }))
    .catch(err => console.log(err));
}

module.exports = {
  sendToQueue,
  consume,
  queueLenght
}