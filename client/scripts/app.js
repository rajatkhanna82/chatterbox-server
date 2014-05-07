app = {
    // server: 'https://api.parse.com/1/classes/chatterbox/',
    serverUrl: 'http://127.0.0.1:3000/classes',
    server: 'http://127.0.0.1:3000/classes',
    username: 'anonymous',
    lastMessageId: 0,

    init: function() {
      console.log('running chatterbox');
      // Get username
      app.username = window.location.search.substr(10);
      app.loadAllMessages();



      // cache some dom references
      app.$text = $('#message');
      app.$room = $('#chatMessage');
      $('#send').on('submit', app.handleSubmit);
      $('#chatSend').on('submit',app.handleCreateRoom);
    },
    handleCreateRoom: function(e){
      e.preventDefault();
      var roomName =  app.$room.val();
      console.log(roomName);
      app.$room.val('');
      app.changeRoom(roomName);

    },
    loadAllMessages: function(){
     app.loadMsgs();
     setTimeout(app.loadAllMessages, 5000);
    },

    handleSubmit: function(e){
      e.preventDefault();

      var message = {
        username: app.username,
        text: app.$text.val()
      };

      app.$text.val('');

      app.sendMsg(message);
    },

    renderMessage: function(message){
      var $user = $("<div>", {class: 'user'}).text(message.username);
      var $text = $("<div>", {class: 'text'}).text(message.text);
      var $message = $("<div>", {class: 'chat', 'data-id': message.objectId }).append($user, $text);
      return $message;
    },

    processNewMessage: function(message, objectId){
      message.objectId = objectId;
      app.processNewMessages([message]);
    },

    processNewMessages: function(messages){
      // messages arrive newest first
      for( var i = 0; i < messages.length; i++ ){
        var message = messages[i];
        // check if objectId is in dom.
        // console.log(message.objectId);
        if( $('#chats').find('.chat[data-id='+message.objectId+']').length ){
          continue;
        }
        $('#chats').prepend(app.renderMessage(message));
      }
    },
    changeRoom : function(roomName){
      app.server = app.serverUrl +"/"+ roomName;
      $('.chat').detach();
      app.loadMsgs();
    },
    renderRoom: function(room){
      var $room = $("<div>", {class: "room "+ room }).text(room);
      $room.on
      return $room;
    },

    processRooms: function(rooms){
      // messages arrive newest first
      for( var i = 0; i < rooms.length; i++ ){
        var room = rooms[i];
        // check if objectId is in dom.
        // console.log(message.objectId);
        if( $('#safeRooms').find('.'+room).length < 1 ){
          $('#safeRooms').append(app.renderRoom(room));
          $('.'+room).click(function (){
              // $(this).toggleClass(".selected");
              app.changeRoom($(this).text());
          });
        } else {
          continue;
        }

      }
    },

    loadMsgs: function(){
      $.ajax({
        url: app.server,
        //data: { order: '-createdAt'},
        contentType: 'application/json',
        success: function(json){
          console.log(JSON.parse(json));
          app.processNewMessages(JSON.parse(json)['results']);
          app.processRooms(JSON.parse(json)['rooms']);

        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    sendMsg: function(message){
      $.ajax({
        type: 'POST',
        url: app.server,
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(json){
          console.log(JSON.parse(json));
          app.processNewMessage(message, JSON.parse(json)['objectId']);
        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    startSpinner: function(){
      $('.spinner img').show();
      $('form input[type=submit]').attr('disabled', "true");
    },

    stopSpinner: function(){
      $('.spinner img').fadeOut('fast');
      $('form input[type=submit]').attr('disabled', null);
    }

};
