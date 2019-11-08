//ファイル→プロジェクトのプロパティ→スクリプトのプロパティ からグローバル変数を定義
var token = PropertiesService.getScriptProperties().getProperty('TOKEN');
var examFolderId = PropertiesService.getScriptProperties().getProperty('EXAM_FOLDER_ID');