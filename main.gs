// テスト登録シートに記入されたテストを全て送信
function handleExam() {
  var sheet    = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('テスト登録');
  var lastRow  = sheet.getLastRow();
  
  var today    = new Date();
  var hours    = today.getHours();
  var minutes  = today.getMinutes();
  
  // 誤ってテスト配布時刻・解答配布時刻以外の時間帯に実行したら処理を中断
  var nowIsExamTime   = isExamTime(sheet, hours, minutes);
  var nowIsAnswerTime = isAnswerTime(sheet, hours, minutes);
  if(!nowIsExamTime && !nowIsAnswerTime) {
    Logger.log('テスト開始時刻でも解答配布時刻でもありません');
    return;
  }
  
  var errorMessages = [];
  // テスト登録シートのデータの数だけ繰り返す
  for(var i=0; i<lastRow; i++) {
    var row = i + 2;
    
    var folderName = sheet.getRange(row, 1).getValue();
    
    // シートのデータが見つからなくなったらループ処理から脱出
    if(folderName == ''){
      break;
    }
    
    // チャンネルIDが見つからなければ次のループへ
    var channelId = sheet.getRange(row, 3).getValue();
    if(channelId == '') {
      errorMessages.push(String(row) + '行目のチャンネルIDが空です');
      continue;
    }
    
    // フォルダーが見つからなければ次のループへ
    var folder = getFolderByName(folderName);
    if(folder === undefined) {
      errorMessages.push(String(row) + '行目、' + 'テスト入れの中に「' + folderName + '」フォルダーが見つかりません'); //例 誤字があった場合 '2行目、テスト入れの中に「英単後」フォルダーが見つかりません'
      continue;
    }
    
    // ファイル名を元にアップロードするファイルを取得
    // ファイルが見つからなければ次のループへ
    var fileName = sheet.getRange(row, 6).getValue();
    var files = getFilesInFolderByName(folder, fileName, nowIsAnswerTime);
    if(files.length == 0) {
      errorMessages.push(String(row) + '行目、「' + folderName + '」フォルダーの中に「' + fileName + '」ファイルがありません'); //例 '3行目、「英単語」フォルダーの中に「7日目」ファイルがありません。'
      continue;
    }
    
    // テスト開始時刻ならテストのファイル名とテスト配布用の文章を取得 解答配布時刻なら解答ファイル名と解答配布用の文章を取得
    // コメントが見つからなければ次のループへ
    var message = getCommentForToday(sheet, nowIsExamTime, nowIsAnswerTime);
    if(message == undefined) {
      errorMessages.push(String(row) + '行目、「' + folderName + '」シートの中に「' + fileName + '」のコメントが見つかりません');// 例 '4行目、「英単語」シートの中に「7日目」のコメントが見つかりません
      continue;
    }
    
    // ファイルをアップロードし、APIからのレスポンスを代入
    /*
    var res = uploadFile(file, fileName, channelId);
    var jsonRes = JSON.parse(res);
    */
    
    uploadFilesFromArray(files, fileName, channelId);
    postMessageAsUser(message, channelId);
    
    // ファイルの送信に成功したら本日のメッセージも送信
    // ファイルの送信に失敗したら、エラーメッセージにレスポンスを追加
    /*
    if(jsonRes.ok) {
      postMessageAsUser(message, channelId);
      Logger.log(String(row) + '行目、' + folderName + fileName + 'のファイル送信に成功しました');
    }else{
      errorMessages.push(String(row) + '行目、' + folderName + fileName + 'のファイル送信に失敗しました\n' + res);
    }
    */
  }
  
  // 1つでも失敗したものがあればSlackの管理者用のチャンネルに通知
  var haveErrors = (errorMessages.length !== 0);
  if(haveErrors) {
    var adminChannelId = sheet.getRange('J6').getValue();
    var warningMessage = '*テストの送信でエラーが発生しました!*';
    postMessageAsUser(warningMessage, adminChannelId);
    postMessageFromArray(errorMessages, adminChannelId);
  }
}


//Slack上のチャンネル情報をシートに転記
function setChannels() {
  var channels = getChannels();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('チャンネル表');
  for(var i=0; i<channels.length; i++) {
    var channel = channels[i]
    var channelId = channel.id;
    var channelName = channel.name;
    findOrCreateChannels(channelId, channelName, sheet,2,1);
  }
}
