
var MAX_SIZE = 3; // this should be 100 or whatever you need
var messages = [];
var USER_ID = 'USE ANY USER ID HERE';
var CHANNEL_URL = 'USE ANY OF YOUR CHANNEL URL';
var groupChannel;

var sb = new SendBird({appId: 'ENTER YOUR SENDBIRD APPLICATION HERE'});

sb.connect(USER_ID, (user, error) => {
    sb.GroupChannel.getChannel(CHANNEL_URL, (myChannel, error) => {
        setHandlers();
        groupChannel = myChannel;
        getPrevMessages( new Date().getTime() );
    })
});

function setHandlers() {
    var channelHandler = new sb.ChannelHandler();
    channelHandler.onMessageReceived = (channel, message) => {
        document.getElementById('butNewMessages').style.display = 'inline-block';
    };
    sb.addChannelHandler('UNIQUE_HANDLER_ID', channelHandler);
}

function getPrevMessages(timestamp) {
    const params = new sb.MessageListParams();
    params.isInclusive = false;
    params.prevResultSize = MAX_SIZE;
    groupChannel.getMessagesByTimestamp(timestamp, params, (channelMessages, error) => {
        messages = channelMessages;
        printMessages();
    })
}

function getnextMessages(timestamp) {
    const params = new sb.MessageListParams();
    params.isInclusive = false;
    params.nextResultSize = MAX_SIZE;
    groupChannel.getMessagesByTimestamp(timestamp, params, (channelMessages, error) => {
        messages = channelMessages;
        printMessages();
    })
}

function printMessages() {
    console.log(messages);
    var out = ``;
    for (let msg of messages) {
        out += `
        <div class="msg">
            ${ msg.message }
        </div>        
        `;
    }
    document.getElementById('list').innerHTML = out;
}

function addMessageToArray(msg) {
    var pos = 0;
    if (messages.length >= MAX_SIZE) {
        pos = messages.length - 1;
        messages.splice(pos, 0, msg)
    } else {
        messages.push( msg )
    }
}

function newMessageArrives() {
    getPrevMessages( new Date().getTime() );
    document.getElementById('butNewMessages').style.display = 'none';
}

function moveUp() {
    var timestamp = messages[ 0 ].createdAt;
    getPrevMessages(timestamp);
}

function moveDown() {
    var timestamp = messages[ messages.length - 1 ].createdAt;
    getnextMessages(timestamp);
}

/**
 * Optional. This will capture your scroll to the top of the list of messages.
 */
document.getElementById("list").addEventListener("scroll", function () {
    if (this.scrollTop == 0) {
      getPrevMessages(messages[0].createdAt);
    }
});

