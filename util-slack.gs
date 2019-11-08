// Slackのチャンネルにメッセージを送信
function postMessageAsUser(text, channelId) {
  var url = 'https://slack.com/api/chat.postMessage';
  
  var headers = {
    'Authorization': 'Bearer ' + token
  }

  var data = {
    "channel": channelId,
    "text": text,
    "as_user": "true"
  }

  var options = {
    'method': 'post',
    'headers' : headers,
    'payload': JSON.stringify(data),
    'contentType': 'application/json'
  };
  var res = UrlFetchApp.fetch(url, options);
  return res;
}

// 配列を1つずつメッセージとして送信
function postMessageFromArray(array, channelId){
  for(var i = 0; i < array.length; i++) {
    postMessageAsUser(array[i], channelId);
  }
}



// Slackのチャンネルにファイルをアップロード
function uploadFile(file, fileName, channelId){
  var url = 'https://slack.com/api/files.upload';
  
  var options = {
    "method" : "post",
    "payload" : {
      token: token,
      file: file,
      filename: fileName,
      channels: channelId
    }
  }
  
  var res = UrlFetchApp.fetch(url, options);
  return res;
}

// 配列から複数のファイルをアップロード
function uploadFilesFromArray(files, fileName, channelId) {
  for (var i = 0; i < files.length; i++) {
    uploadFile(files[i], fileName, channelId);
  }
}