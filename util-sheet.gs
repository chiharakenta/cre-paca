// 本日のテストに対応するコメントをシート上から取得
// まだビジネス上必要なかったため、一時的に使用停止
/*
function getCommentFromToday(folderName, fileName, isExam, isAnswer) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(folderName);
  var lastRow  = sheet.getLastRow();
  
  for(var i=0; i<lastRow; i++) {
    var row = i + 2;
    var day = sheet.getRange(row, 1).getValue();
    
    // セルが空になったら終了
    if(day == ''){
      return;
    }
    
    
    if(fileName == day) {
      if(isExam) {
        var message = sheet.getRange(row, 2).getValue();
      }else if(isAnswer) {
        message = sheet.getRange(row, 3).getValue();
      }else{
        return
      }
      return message
    }
  }
}
*/

// 本日のテストに対応するコメントをシート上から取得
function getCommentForToday(sheet, nowIsExamTime, nowIsAnswerTime) {
  if(nowIsExamTime) {
    var message = sheet.getRange('I9').getValue();
  } else if(nowIsAnswerTime) {
    var message = sheet.getRange('J9').getValue();
  }
  return message;
}