/*
呼び出されたタイミングで、それぞれ試験配布時刻・解答配布時刻かどうか判定する
ごく稀にGASの処理速度の関係で1分遅れることがあったため、1分の誤差は許容する
*/

function isExamTime(sheet, hours, minutes) {
  var examHours = sheet.getRange('J2').getValue();
  var examMinutes = sheet.getRange('K2').getValue();
  
  // テスト開始時刻の前後1分以内かどうか
  var isExam = (hours == examHours && minutes >= examMinutes - 1 && minutes < examMinutes + 1)
  return isExam; // true or false
}

function isAnswerTime(sheet, hours, minutes) {
  var answerHours = sheet.getRange('J3').getValue();
  var answerMinutes = sheet.getRange('K3').getValue();
  
  // 解答配布時刻の前後1分以内かどうか
  var isAnswer = (hours == answerHours && minutes >= answerMinutes - 1 && minutes < answerMinutes + 1)
  return isAnswer; // true or false
}