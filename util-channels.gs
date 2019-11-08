// slackのAPIからチャンネル情報を取得
function getChannels() {
  var url = 'https://slack.com/api/channels.list';
  
  var options = {
    'headers' : {
      'Authorization': 'Bearer ' + token
    }
  };
  var res = UrlFetchApp.fetch(url, options);
  var channels = JSON.parse(res).channels;
  return channels;
}

// チャンネル情報をシートから検索し、見つからなければ記入
function findOrCreateChannels(channelId, channelName, sheet, defaultRow, defaultColumn) {
  var lastRow = sheet.getLastRow();
  
  // 中断するまでセルのあるうちは繰り返す処理
  for(var i=0; i<lastRow; i++) {
    
    // 表のチャンネル名を取得
    var cellVal = sheet.getRange(i+defaultRow, defaultColumn).getValue();
    
    // 既に名簿にあるチャンネルだった場合終了
    if(cellVal === channelName) {
      return;
    }
    
    // まだ名簿にないチャンネルだった場合追加して終了
    if(!cellVal) {
      sheet.getRange(i+2,1).setValue(channelName);
      sheet.getRange(i+2,2).setValue(channelId);
      return;
    }
  }
}

// シート上のチャンネルを全てクリアする
function clearChannels() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('チャンネル表');
  var numRows = sheet.getLastRow();
  var range = sheet.getRange(2, 1, numRows, 2);
  range.clear();
}