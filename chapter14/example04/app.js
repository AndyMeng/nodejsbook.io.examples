var app = require('express').createServer()
, twitter = require('ntwitter')
, io = require('socket.io').listen(app)
, love = 0
, hate = 0
, total = 0

app.listen(3000);

var twit = new twitter({
  consumer_key: 'tK1npUCwqPIrRh6urfxcg',
  consumer_secret: 'ggjnyhRb3b0dbRhKwpPCBDf7Q3cbikK1vaL2Or2Fo1A',
  access_token_key: '359840007-1D3nxPc0iwRL0D3SA3ouTe46FCMvbWVxQ9DIPCUG',
  access_token_secret: 'iIQisVEdJFheBBXiAInarFGGjjaqYZO0i9LlmNjM3c'
});

twit.stream('statuses/filter', { track: ['love', 'hate'] }, function(stream) {
  stream.on('data', function (data) {
    if (data.text.indexOf('love') != -1) {
      love++
      total++
    }
    if (data.text.indexOf('hate') != -1) {
      hate++
      total++
    }
    io.sockets.volatile.emit('tweet', { 
      user: data.user.screen_name, 
      text: data.text,
      love: (love/total)*100,
      hate: (hate/total)*100
    });
  });
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

