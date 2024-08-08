// Global Variables
const ss = SpreadsheetApp.getActiveSpreadsheet();
const mainSheet = ss.getSheetByName('Main')


// Users Database Access
const corona_cherie71 = ss.getSheetByName('corona_cherie71@gmail.com')
const hardy_mckenna75 = ss.getSheetByName('hardy_mckenna75@gmail.com')
const hutton_sebastian86 = ss.getSheetByName('hutton_sebastian86@gmail.com')

//Todays Date to find the proper index in date List 
const date = new Date()
const year = date.getFullYear()
const month = `0${date.getMonth() + 1}`
const day = date.getDate()
const dateString = `${month}.${day}.${year}`



// HTML live server
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate();
}

// Including JavaScript DOM file
function include(filename) {
  return HtmlService.createHtmlOutputFromFile('app_server')
      .getContent();
}

// Getting all the Users from Database | Getting Email of the User | Sending to front-end
function getAgentsList() {

  let agentsNumber = mainSheet.getLastRow()
  i = 1;
  const agentsList = mainSheet.getRange(2, 1 ,agentsNumber - 1, 1).getValues()
  console.log(mainSheet.getRange(2, 1 ,agentsNumber - 1, 1).getValues())

  const teamLeadersList = mainSheet.getRange(2, 2, 5, 1).getValues()

  const activeAgent = Session.getActiveUser().getEmail();
  console.log(activeAgent)
  return JSON.stringify({activeAgent, agentsList: agentsList, teamLeadersList})
}

// Getting Data to Login User
function sendUsersDataToInterface() {
  const greetings = 'hello from server side!'
  const userDatabase = ss.getSheetByName(`${Session.getActiveUser().getEmail()}`).getName()
  return JSON.stringify( {userDatabase} )

}

// Connecting DataBase With Logged User
function connectUserToDatabase() {
  const greetings = 'hello from server side!'
  const activeAgent = Session.getActiveUser().getEmail();
  ss.getSheetByName(`${activeAgent}`)
  return JSON.stringify( {greetings} )
}


// Passing Time Duration Of Extra Activity To User's Database
function passSentTimeDuration(counter, buttonName) {
   const userDatabase = ss.getSheetByName(`${Session.getActiveUser().getEmail()}`)
   const listOfAllDatesInMonth = userDatabase.getRange(2,1,31,1).getValues().flat()
   let listOfExtraActivities = userDatabase.getRange(1,4,1, 20).getValues().flat()
   console.log(listOfExtraActivities.flat())

   
   let row = listOfAllDatesInMonth.indexOf(dateString)
   let column = listOfExtraActivities.indexOf(buttonName);
   column += 4
   row += 2
   console.log(column)
   


   //console.log(indexOfDate)
  //console.log(counter)
 if ( typeof userDatabase.getRange(row, column).getValue() === 'string' ) {
  userDatabase.getRange(row, column).setValue(counter)
 }
 else {
  let activityTimeEgsisted = userDatabase.getRange(row, column).getValue()
  counter = counter + activityTimeEgsisted
  userDatabase.getRange(row, column).setValue(counter)
 }
// userDatabase.getRange(row, column).setValue(counter)
}

function passExtraActivityAsTitleToDatabase(buttonName) {
  const userDatabase = ss.getSheetByName(`${Session.getActiveUser().getEmail()}`)
  let listOfExtraActivities = userDatabase.getRange(1,4,1, 20).getValues()[0]
 
  let fullCellsOfExtraAtivities = listOfExtraActivities.filter(extraActivity => extraActivity.toString().length > 0)
  //console.log(fullCellsOfExtraAtivities[0])

  if(fullCellsOfExtraAtivities.includes(buttonName)) {
    let row = 2;
    let column = fullCellsOfExtraAtivities.indexOf(buttonName) + 4
    userDatabase.getRange(row, column).setValue('true')
  } else {
    fullCellsOfExtraAtivities.push(buttonName)
    let row = 1;
    let column = fullCellsOfExtraAtivities.indexOf(buttonName) + 4
    userDatabase.getRange(row, column).setValue(buttonName)
    userDatabase.getRange(row, column).setBackground('#c9aee8')
    userDatabase.getRange(row, column).setFontSize(14).setFontWeight("bold")
    userDatabase.getRange(row, column).setHorizontalAlignment("center")


    row += 1
    userDatabase.getRange(row, column).setValue('true 2')
    userDatabase.autoResizeColumn(column);

  }

  //fullCellsOfExtraAtivities.forEach(extraActivity => {
    //console.log(extraActivity)
    //if(extraActivity == buttonName) {
      //userDatabase.getRange('B2').setValue('true')
    //} else (
     // userDatabase.getRange('B2').setValue('false')
   // )
  //})


}

function insertScriptDateCheck(sheetCurrentDate) {
  const userDatabase = ss.getSheetByName(`${Session.getActiveUser().getEmail()}`)
  userDatabase.getRange(35,1).setValue(sheetCurrentDate)

  
  //userDatabase.getRange(1, 1).setValue(sheetCurrentDate)
  //let sheetCurrentDate2 = sheetCurrentDate
  //console.log(listOfAllDatesInMonth)
  //console.log(roww)
  //console.log(sheetCurrentDate)
 //let allExtraActivitiesTimeData = userDatabase.getRange(sheetCurrentDate,4,1,20).getValues()[0]
  //let extraActivitiesTimeData = allExtraActivitiesTimeData.filter( extraActivity => extraActivity.toString().length > 0 )
}

function updateChartAfterInputDateClick() {
  const userDatabase = ss.getSheetByName(`${Session.getActiveUser().getEmail()}`)
  let scriptDateCheckRange = userDatabase.getRange(35,1).getValues().toString()
  let listOfAllDatesInMonth = userDatabase.getRange(2,1,31,1).getValues().flat()
  console.log(listOfAllDatesInMonth)
  let row = listOfAllDatesInMonth.indexOf(scriptDateCheckRange) + 2
  console.log(row)
  let randomData = userDatabase.getRange(row,1).getValues()[0]

  let listOfExtraActivities = userDatabase.getRange(1,4,1, 20).getValues()[0]
  let fullCellsOfExtraAtivities = listOfExtraActivities.filter(extraActivity => extraActivity.toString().length > 0)
  lengthOfExtraAtivities = fullCellsOfExtraAtivities.length
  let extraActivityTimeFromDay = userDatabase.getRange(row, 4, 1, lengthOfExtraAtivities).getValues().flat()
  let extraActivityMonthSchedule = userDatabase.getRange(1, 4, 1, lengthOfExtraAtivities).getValues().flat()

  let existedComment = userDatabase.getRange(row, 2).getValues().flat()


  return JSON.stringify({randomData, row, extraActivityTimeFromDay, extraActivityMonthSchedule, existedComment})
}

function insertComment(comment) {
  const userDatabase = ss.getSheetByName(`${Session.getActiveUser().getEmail()}`)
  let listOfAllDatesInMonth = userDatabase.getRange(2,1,31,1).getValues().flat()
  let row = listOfAllDatesInMonth.indexOf(dateString) + 2
  let column = 2
  comment.toString()
  let existedComment = userDatabase.getRange(row, column).getValues()
  existedComment =existedComment + ' ' + comment 
  userDatabase.getRange(row, column).setValue(existedComment)
}

function updateCommentHistoryAfterInsertCommentToDatabase() {
  const userDatabase = ss.getSheetByName(`${Session.getActiveUser().getEmail()}`)
  let listOfAllDatesInMonth = userDatabase.getRange(2,1,31,1).getValues().flat()
  let row = listOfAllDatesInMonth.indexOf(dateString) + 2
  let column = 2
  let existedComment = userDatabase.getRange(row, column).getValues()
  return JSON.stringify({ existedComment })

}


// TEAM LEADERS FUNCTIONS
// Team Leaders allows to overview users metrics
function getAccessToAgentsDatabaseAsTeamLeader(sheetCurrentDate, pickedAgent) {
  const userDatabase = ss.getSheetByName(`${pickedAgent}`)
  userDatabase.getRange(35,1).setValue(sheetCurrentDate)
  userDatabaseTL = ss.getSheetByName(pickedAgent)
  const mainDatabase = ss.getSheetByName('Main')
  const teamLeadersList = mainDatabase.getRange(2,2,10,1).getValues().flat()
  console.log(teamLeadersList)
  const loggedTeamLeader = teamLeadersList.find(loggedTeamLeader => loggedTeamLeader == Session.getActiveUser().getEmail())
  let row = teamLeadersList.indexOf(loggedTeamLeader) + 2
  mainDatabase.getRange(row,3).setValue(pickedAgent)


}


let userDatabaseTL
function insertScriptDateCheckForTeamLeader() {

  const mainDatabase = ss.getSheetByName('Main')
  const teamLeadersList = mainDatabase.getRange(2,2,10,1).getValues().flat()
  const loggedTeamLeader = teamLeadersList.find(loggedTeamLeader => loggedTeamLeader == Session.getActiveUser().getEmail())
  let pickedAgentRow = teamLeadersList.indexOf(loggedTeamLeader) + 2
  const pickedAgent = mainDatabase.getRange(pickedAgentRow,3).getValues()
 

  const userDatabase = ss.getSheetByName(pickedAgent)
  let scriptDateCheckRange = userDatabase.getRange(35,1).getValues().toString()
  let listOfAllDatesInMonth = userDatabase.getRange(2,1,31,1).getValues().flat()
  console.log(listOfAllDatesInMonth)
  let row = listOfAllDatesInMonth.indexOf(scriptDateCheckRange) + 2
  console.log(row)
  let randomData = userDatabase.getRange(row,1).getValues()[0]

  let listOfExtraActivities = userDatabase.getRange(1,4,1, 20).getValues()[0]
  let fullCellsOfExtraAtivities = listOfExtraActivities.filter(extraActivity => extraActivity.toString().length > 0)
  lengthOfExtraAtivities = fullCellsOfExtraAtivities.length
  let extraActivityTimeFromDay = userDatabase.getRange(row, 4, 1, lengthOfExtraAtivities).getValues().flat()
  let extraActivityMonthSchedule = userDatabase.getRange(1, 4, 1, lengthOfExtraAtivities).getValues().flat()

  let existedComment = userDatabase.getRange(row, 2).getValues().flat()


  return JSON.stringify({randomData, row, extraActivityTimeFromDay, extraActivityMonthSchedule, existedComment})
}

