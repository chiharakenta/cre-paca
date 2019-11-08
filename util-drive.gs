// プロパティに設定したテスト入れフォルダーから、フォルダー名が一致するフォルダーを検索して返す
function getFolderByName(folderName) {
  var folders = DriveApp.getFolderById(examFolderId).getFolders();
  
  while(folders.hasNext()) {
    var folder = folders.next();
    if(folder == folderName) {
      return folder
    }else{
      continue;
    }
  }
}

// 引数に渡したフォルダーの中からファイル名が一致するファイルを検索して返す
function getFileInFolderByName(folder, fileName, nowIsAnswerTime) {
  if(nowIsAnswerTime) {
    fileName += '解答';
  }
  var files = folder.getFiles();
  
  while(files.hasNext()) {
    var file = files.next();
    if(file == fileName) {
      var file = file.getBlob();
      return file
    }else{
      continue;
    }
  }
}

// 引数に渡したフォルダーの中からファイル名が一致するファイルを検索する
// 同名のファイルを複数検索して配列で返す
function getFilesInFolderByName(folder, fileName, nowIsAnswerTime) {
  if(nowIsAnswerTime) {
    fileName += '解答';
  }
  var files = folder.getFiles();
  var filesToUpload = [];
  
  while(files.hasNext()) {
    var file = files.next();
    if(file == fileName) {
      var file = file.getBlob();
      filesToUpload.push(file);
    }
  }
  
  return filesToUpload
}

function setFolders() {
  var folders = DriveApp.getFolderById(examFolderId).getFolders();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('フォルダー表');
  
  while(folders.hasNext()) {
    var folderName = folders.next();
    findOrCreate(folderName, sheet, 2, 1);
  }
}

function findOrCreate(folderName, sheet, defaultRow, defaultColumn) {
  var lastRow = sheet.getLastRow();
  
  // 中断するまでセルのあるうちは繰り返す処理
  for(var i=0; i<lastRow; i++) {
    
    // 表のチャンネル名を取得
    var cellVal = sheet.getRange(i+defaultRow, defaultColumn).getValue();
    
    // 既に名簿にあるチャンネルだった場合終了
    if(cellVal == folderName) {
      return;
    }
    
    // まだ名簿にないチャンネルだった場合追加して終了
    if(!cellVal) {
      sheet.getRange(i+2,1).setValue(folderName);
      return;
    }
  }
}