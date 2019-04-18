//var ui = SpreadsheetApp.getUi();
var ss = SpreadsheetApp.openById("1GS8aFgywW3LGkHO2Bl_8a6_dgRFKgGRBC6Uc74cAeo8");
var sheet = ss.getActiveSheet();
var rangeData = sheet.getDataRange();
var lastColumn = rangeData.getLastColumn();
var lastRow = rangeData.getLastRow();
var searchRange = sheet.getRange(1,1, lastRow-1, lastColumn-1);

function getPost(passedDate) {
  // Get array of values in the search Range
  var rangeValues = searchRange.getValues();

  var tableOfEvents = "Type|Artist(s)/Event|Venue|Price|Time<br>---|---|---|---|---|---|---|<br>"
  var testdate
  var newEntry
  
  begin = convertToNextFriday(passedDate);
  end = new Date(begin)
  end = offsetDate(new Date(begin),7)
  
  // Loop through array and if condition met, add relevant
  // background color.
  for ( i = 0; i < lastRow - 1; i++){
    currentTimestamp = new Date(sheet.getRange(i+2,2).getValue())
    if (currentTimestamp>begin&&currentTimestamp<end) { //THIS ISN'T WORKING. TEST WHY
      startTime=convertDateToString(new Date(sheet.getRange(i+2,2).getValue()))
      eventType=sheet.getRange(i+2,3).getValue()
      venue=sheet.getRange(i+2,4).getValue()
      price=sheet.getRange(i+2,5).getValue()
      eventName=sheet.getRange(i+2,6).getValue()
      eventURL=sheet.getRange(i+2,7).getValue()
      if (eventURL === "")
        eventWithLink = eventName
      else
        eventWithLink = "[" + eventName + "](" + eventURL + ")"
      newEntry = eventType + "|" + eventWithLink + "|" + venue + "|" + price + "|" + startTime + "<br>"
      tableOfEvents = tableOfEvents + newEntry
    }
    postText="<p>* Add upcoming events [here](https://docs.google.com/forms/d/e/1FAIpQLScMdbi9dpdNGrfIQ4yHKqa2XTLitwj2ie0f5Al3YaitBFKUJQ/viewform?usp=sf_link). See all events currently added [here](https://docs.google.com/spreadsheets/d/1GS8aFgywW3LGkHO2Bl_8a6_dgRFKgGRBC6Uc74cAeo8/edit?usp=sharing). If you know of something awesome happening, add it there, and it will get pulled into the post for that week.<p>* I added a bot to subscribe to future posts. To subscribe, send the bot a message by clicking [here](https://www.reddit.com/message/compose/?to=SergeantAlPowellsBot&subject=Subscribe&message=Subscribe) or (for mobile users, since that link doesn't work) just open /u/SergeantAlPowellsBot's profile, and send it a message. The title should just read 'Subscribe'. Body can be whatever you want.<p>* Errors and Omissions ABSOLUTELY expected. If you see something wrong, or have any suggestions on how I can make this better, let me know.<p>"
  }
  
  if (tableOfEvents == "Type|Artist(s)/Event|Venue|Price|Time<br>---|---|---|---|---|---|---|<br>")
    tableOfEvents = "No Entries for this week (yet)<br>"  
  return tableOfEvents + postText

}

function convertToNextFriday(currentDate) {
 offset = 5 - currentDate.getDay()
 return offsetDate(currentDate,offset)
}


function offsetDate(passedDate,offset) {
  returnDate = new Date(passedDate)
  returnDate.setHours(0,0,0,0)
  return new Date(returnDate.setDate(returnDate.getDate() + offset))
}


function convertDateToString(currentDate) {
  var minutesVal
  var weekday = new Array(7);
  weekday[0] =  "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thu";
  weekday[5] = "Fri";
  weekday[6] = "Sat";
  if (currentDate.getMinutes() < 10)
    minutesVal = "0" + currentDate.getMinutes()
  else
    minutesVal = currentDate.getMinutes()
  return weekday[currentDate.getDay()] + " " + currentDate.getDate() + " " + currentDate.getHours() + ":" + minutesVal
}

function doGet() {
  today = new Date
  lastWeek = offsetDate(new Date(today),-7)
  nextWeek = offsetDate(new Date(today),7)
  output = "<b>LAST WEEK:</b><p>" + getPost(lastWeek) + "<b>THIS WEEK:</b><p>" + getPost(today) + "<b>NEXT WEEK:</b><p>" + getPost(nextWeek)
  return HtmlService.createHtmlOutput(output);
}
