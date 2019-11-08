/*
GoogleAppsScriptには「トリガー」という定期実行機能がある
しかし、定期実行のトリガーは毎日18:00~19:00といった大まかな時間しか設定できない
一方、特定の日時を指定する使い切りのトリガーは、正確な時間を設定可能
そのため、毎日使い切りのトリガーをセットし、使い終わったら削除する関数を用意。それを定期実行する
*/

// スプレッドシートの時間通りに実行される、送信トリガーを作成
function setExamAndAnswerTrigger(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('テスト登録');
  var examHours = sheet.getRange('J2').getValue();
  var examMinutes = sheet.getRange('K2').getValue();
  setTodayTrigger(examHours, examMinutes, 'handleExam');
  
  var answerHours = sheet.getRange('J3').getValue();
  var answerMinutes = sheet.getRange('K3').getValue();
  setTodayTrigger(answerHours, answerMinutes, 'handleExam');
}

// トリガーを削除する関数
function deleteExamAndAnswerTrigger() {
  deleteTrigger('handleExam');
  deleteTrigger('handleExam');
}

// その日の特定の日時に実行するトリガーを設定
function setTodayTrigger(hours, minutes, triggerName) {
  var triggerDay = new Date();
  triggerDay.setHours(hours);
  triggerDay.setMinutes(minutes);
  ScriptApp.newTrigger(triggerName).timeBased().at(triggerDay).create();
}

// その日のトリガーを削除する関数(消さないと残る)
function deleteTrigger(triggerName) {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == triggerName) {
      var res = ScriptApp.deleteTrigger(triggers[i]);
      return res;
    }
  }
}
