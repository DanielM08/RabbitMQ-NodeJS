const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', function (err, conn) {
  
  conn.createChannel(function (err, ch) {

      //This tells RabbitMQ not to give more than one message to a worker at a time. 
      ch.prefetch(1);

      /*
        *The first parameter is the queue name, 
        *the second param is the callback method, 
          which will be invoked once we get a message in the queue. 
        *The third parameter is the acknowledgement setting.

        *If we set the noAck field as true, 
          then the queue will delete the message the moment it is read from the queue.
          if you kill a worker we will lose the message it was just processing. 
          We'll also lose all the messages that were dispatched to this particular worker 
            but were not yet handled.

        *RabbitMQ works with Round Robin concept, 
          so the worker acess to the queue is not deterministic
      */
      ch.consume('influencer-data-crawled-by-social-media-crawlers', function (msg) {
        console.log('.....');
        setTimeout(function(){
          console.log(" [x] Read message: %s", msg.content.toString());
        },1000);
      },{ noAck: false }
    );

  });

});