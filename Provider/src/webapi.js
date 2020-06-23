const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const queue = require("../services/MQService");
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
const router = express.Router();
 
router.post('/task', async (req, res) => {
    await queue.sendToQueue("influencer-data-crawled-by-social-media-crawlers", req.body);
    console.log("Número de mensagens na fila: ")
    console.log(queue.queueLenght("influencer-data-crawled-by-social-media-crawlers"));
    console.log('[ ] Send Message: ', req.body);
    res.statusCode = 200;
    res.json({message: 'Your request will be processed!'});
});
 
app.use('/', router);
 
app.listen(3000, () => {
  console.log("Back-end started!" );
});

//Other Topics
// ** Connection management, 
// ** Error handling, 
// ** Connection recovery, 
// ** Concurrency, 
// ** Metric collection 