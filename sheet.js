Logger.log("Getting Spreadsheet");
ACTIVE_SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

async function m() {
  const a = await myFunction();
  console.log(a)
}

function myFunction() {
  const data = ACTIVE_SPREADSHEET.getSheetByName("Sheet1").getDataRange().getValues();
  // console.log(data)
  // const mapping = {}
  // for (const [index, row] of data.entries()) {
  //   mapping[index] = row.slice(0, 5)
  // }
  return ContentService.createTextOutput(JSON.stringify({data}))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet1() {
  return ACTIVE_SPREADSHEET.getSheetByName("Sheet1")
}

function doGet(request) {
  const data = ACTIVE_SPREADSHEET.getSheetByName("Sheet1").getDataRange().getValues();
  const mapping = data.map(item => item.slice(0, 5))
  return ContentService.createTextOutput(JSON.stringify({mapping}))
    .setMimeType(ContentService.MimeType.JSON);
}

function findRow(concat, sheet) {
  const [headers, ...data] = sheet.getDataRange().getValues();
  for (const [index, row] of data.entries()) {
    // console.log(index, row, row[3])
    if (row[3] == concat){
      // console.log(index+2, row[4])
      return [index+2, parseInt(row[4])+1]
    }
  }
  return 0
}

function doPost(e) {
  try{
    const { facultyNameEn, majorNameEn, studentYear } = JSON.parse(e.postData.contents)
    const concat = facultyNameEn + "-" + majorNameEn + "-" + studentYear
    const sheet = getSheet1()
    const found = findRow(concat, sheet)
    // found
    if(Array.isArray(found)){
      sheet.getRange(found[0], 5).setValue(found[1]);
      console.log("found and already add 1 to count")
      return ContentService.createTextOutput(JSON.stringify({"status": "success", "mode": "increase", "enter": concat}))
      .setMimeType(ContentService.MimeType.JSON);
    }
    else{
      const row = sheet.getDataRange().getLastRow() + 1;
      sheet.getRange(row, 1).setValue(facultyNameEn);
      sheet.getRange(row, 2).setValue(majorNameEn);
      sheet.getRange(row, 3).setValue(studentYear);
      sheet.getRange(row, 4).setValue(concat);
      sheet.getRange(row, 5).setValue(1);
      console.log("not found add new row")
      return ContentService.createTextOutput(JSON.stringify({"status": "success", "mode": "new", "enter": concat}))
      .setMimeType(ContentService.MimeType.JSON);
    }
  }catch{
    return ContentService.createTextOutput(JSON.stringify({"status": "failed"}))
    .setMimeType(ContentService.MimeType.JSON);
  }
  
}
