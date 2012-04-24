
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button16 = {};	// @button
	var button15 = {};	// @button
	var button11 = {};	// @button
	var button5 = {};	// @button
	var button10 = {};	// @button
	var button9 = {};	// @button
	var dataGrid1 = {};	// @dataGrid
	var button3 = {};	// @button
	var button4 = {};	// @button
	var button2 = {};	// @button
	var button1 = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock


//David Robbins Functions - Start
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10){dd='0'+dd} 
if(mm<10){mm='0'+mm}
var myCurrentDate = mm+'/'+dd+'/'+yyyy;

function formatDate(dateObject) {
	var curr_date = dateObject.getDate();
	var curr_month = dateObject.getMonth();
	curr_month++;
	var curr_year = dateObject.getFullYear();
	return curr_month + "/" + curr_date + "/" + curr_year;
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months;
}


function lastDayOfMonth(year, month) {
 	return(new Date((new Date(year, month+1,1))-1)).getDate();
}

function daysInMonth(month,year) {
	var m = [31,28,31,30,31,30,31,31,30,31,30,31];
	if (month != 2) return m[month - 1];
	if (year%4 != 0) return m[1];
	if (year%100 == 0 && year%400 != 0) return m[1];
	return m[1] + 1;
}

function elapsedPayPeriods(userEntity) {
	var ptoHoursAccruedToDate;
	var seedPTOHours = userEntity.ptoHours.getValue();
	var seedPTOAccrualRate= userEntity.ptoAccrualRate.getValue();
	var seedPTODate = userEntity.ptoSeedDate.getValue();
	//Figure out how many pay periods have passed from PTO Seed Date
	// until current date.
	var todaysDate = new Date();
	var mm = todaysDate.getMonth()+1; //January is 0!
	var yyyy = todaysDate.getFullYear();
	var dd = todaysDate.getDate();
	var seedDay = seedPTODate.getDate();
	var numberOfPayPeriodsElapsed = monthDiff(seedPTODate, todaysDate) * 2;
	
	if (seedDay < 15) {
		numberOfPayPeriodsElapsed += 2;
	} else {
		numberOfPayPeriodsElapsed += 1;
	}
	
	if (dd > 14) {
		numberOfPayPeriodsElapsed += 1;	
	} 

	return numberOfPayPeriodsElapsed;
}

function updateUserAccountDisplay() {
	var myCurrentUser = WAF.directory.currentUser(); // Get the current user
	var myUser = WAF.ds.User.find("ID = " + myCurrentUser.ID, {
		onSuccess: function(event) {
			var theNumberOfElapsedPayPeriods = elapsedPayPeriods(event.entity);
			var currentPTOHours = event.entity.ptoHours.getValue() + (theNumberOfElapsedPayPeriods * event.entity.ptoAccrualRate.getValue());
			var myHTML = '';
			myHTML += '<p class="holiday">' + "Floating Holidays: " + event.entity.floatingDays.getValue() + "."  + '</p>'; 
			myHTML += '<p class="holiday">' + "Paid Time Off Hours: " + currentPTOHours + "."  + '</p>'; 
			//myHTML += '<p class="holiday">' + "Manager: " + "Under Construction" + "."  + '</p>'; 
			
			$('#container6').html('User Account: <br/><br/>' + myHTML);
		}
	}); // Load their user entity.
}

function disableInput() { 
	$('#container5').html('');
	$('#container6').html('');
}

function getNextWorkDay(textFieldIDSelector) {
	var lastDayArray = $(textFieldIDSelector).val().split("/");
	var yyyy = lastDayArray[2];
	var mm = lastDayArray[0];
	switch (mm) {
		case "01" :
		mm = "00";
		break;
		
		case "02" :
		mm = "01";
		break;
		
		case "03" :
		mm = "02";
		break;
		
		case "04" :
		mm = "03";
		break;
		
		case "05" :
		mm = "04";
		break;
		
		case "06" :
		mm = "05";
		break;
		
		case "07" :
		mm = "06";
		break;
		
		case "08" :
		mm = "07";
		break;
		
		case "09" :
		mm = "08";
		break;
		
		case "10" :
		mm = "09";
		break;
		
		case "11" :
		mm = "10";
		break;
		
		case "12" :
		mm = "11";
		break;		
	} //Switch
	
	var dd = lastDayArray[1];
	
	
	var lastDay = new Date(yyyy, mm, dd);
	lastDay.setDate(lastDay.getDate()+1);
	var yyyyNext = lastDay.getFullYear();
	var mmNext = lastDay.getMonth();
	
	switch (mmNext) {
		case 0 :
		mmNext = "01";
		break;
		
		case 1 :
		mmNext = "02";
		break;
		
		case 2 :
		mmNext = "03";
		break;	

		case 3 :
		mmNext = "04";
		break;	

		case 4 :
		mmNext = "05";
		break;	

		case 5 :
		mmNext = "06";
		break;	

		case 6 :
		mmNext = "07";
		break;	

		case 7 :
		mmNext = "08";
		break;	

		case 8 :
		mmNext = "09";
		break;	

		case 9 :
		mmNext = "10";
		break;	

		case 10 :
		mmNext = "11";
		break;	

		case 11 :
		mmNext = "12";
		break;	
	} //Switch mmNext
	
	var ddNext = lastDay.getDate();
	
	return(mmNext + "/" + ddNext + "/" + yyyyNext);
	//return lastDay.toDateString();
}
//David Robbins Functions - End


// eventHandlers// @lock

	button16.click = function button16_click (event)// @startlock
	{// @endlock
		$$('dialog2').closeDialog(); //cancel button
	};// @lock

	button15.click = function button15_click (event)// @startlock
	{// @endlock
		$$('dialog2').closeDialog(); //ok button
		WAF.sources.requestLineItemCollection.removeCurrent({
			onSuccess: function(event) {
				$("#errorDiv1").html("Your PTO request line item has been removed and your user account updated.");
				updateUserAccountDisplay();
			},
			onError: function(error) {
				$("#errorDiv1").html(error['error'][0].message + " (" + error['error'][0].errCode + ")");
			}
		});
	};// @lock

	button11.click = function button11_click (event)// @startlock
	{// @endlock
		if (WAF.sources.requestLineItemCollection.length > 1) {
			$("#errorDiv2").html("Are you sure you want to delete the selected line item?");
			$('#dialog2').css("top", 200);
			WAF.widgets['dialog2'].displayDialog();
		} else {
			$("#errorDiv1").html("You cannot remove the last line item from a request.");
		}
		
	};// @lock

	button5.click = function button5_click (event)// @startlock
	{// @endlock
		$('#dialog1').css("top", 200);
		WAF.widgets['dialog1'].displayDialog();
	};// @lock

	button10.click = function button10_click (event)// @startlock
	{// @endlock
		$$('dialog1').closeDialog(); //cancel button
	};// @lock

	button9.click = function button9_click (event)// @startlock
	{// @endlock
		WAF.sources.requestLineItemCollection.save({
        	onSuccess: function(event) {
				updateUserAccountDisplay();
				$("#errorDiv1").html("PTO Request Updated.");
			},
           	onError: function(error) {
           		$('#errorDiv1').html(error['error'][0].message + " (" + error['error'][0].errCode + ")");
          	}
      	});
		$$('dialog1').closeDialog(); //ok button
	};// @lock

	dataGrid1.onRowClick = function dataGrid1_onRowClick (event)// @startlock
	{// @endlock
		$("#errorDiv1").html('');
	};// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		$("#errorDiv1").html("");
		WAF.sources.pTO_Request.addNewElement({onSuccess:function(event) {}});
		//enableInput();
		$('#textField7').val(myCurrentDate);
		$('#textField9').val(WAF.directory.currentUser().fullName);
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		$("#errorDiv1").html("");
		WAF.sources.pTO_Request.save({
        	onSuccess: function(event) {
				updateUserAccountDisplay();
				$("#errorDiv1").html("PTO Request Saved.");
				//WAF.sources.pTO_Request.serverRefresh({forceReload: true});
			},
           	onError: function(error) {
           		$('#errorDiv1').html(error['error'][0].message + " (" + error['error'][0].errCode + ")");
           		//WAF.sources.pTO_Request.removeCurrent({onSuccess:function(event) {}});
           		//WAF.sources.pTO_Request.all();
				//WAF.sources.pTO_Request.serverRefresh({forceReload: true});
          	}
      	});
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		//logout
		$("#errorDiv1").html("");
		if (WAF.directory.logout()) {
			//WAF.sources.pTO_Request.all();
			WAF.sources.pTO_Request.setEntityCollection();
			disableInput();
			
			//hide logout stuff			//$("#richText2").css("top", "1035px");
			$$("richText2").hide();
			$$("button2").hide();
			
			//show login stuff
			$$("textField1").show();
			$$("textField2").show();
			$$("label1").show();
			$$("label2").show();
			$$("button1").show();
		}
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		//Login
		WAF.sources.statusArray.sync();
		
		$("#errorDiv1").html("");
		var loginName = $("#textField1").val();
		var thePassword = $("#textField2").val();
		
		if (WAF.directory.loginByPassword(loginName, thePassword)) {
			WAF.sources.pTO_Request.all();
			//hide login stuff.
			$$("textField1").hide();
			$$("textField2").hide();
			$$("label1").hide();
			$$("label2").hide();
			$$("button1").hide();
			
			
			//show the logoff stuff.
			$("#richText2").html(WAF.directory.currentUser().fullName);
			$$("richText2").show();
			$$("button2").show();
			
			//Load User Account Display
			updateUserAccountDisplay();
			
			//Load Holiday Display
			/**/
			var myHolidays = ds.Holiday.query("ID > 0");
			myHolidays.orderBy("date" , {onSuccess:function(event) {	
				var count = event.entityCollection.length; 
				var myHTML = '';
				if (count > 5) count = 5;
				for (var i = 0; i < count; i++) {
					event.entityCollection.getEntity(i,  {onSuccess:function(event) {				
						myHTML += '<p class="holiday">' + event.entity.name.getValue() + " : " + formatDate(event.entity.date.getValue()) + '</p>';
					}});
				}
				$('#container5').html('Upcoming 4D Holidays:  <br/><br/>' + myHTML);		
			}});	
			

		} else {
			$("#errorDiv1").html("Invalid login.");
		}
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock

		statusArray = [];
		statusArray.push({statusName: ''});
		statusArray.push({statusName: 'pending'});
		statusArray.push({statusName: 'approved'});
		statusArray.push({statusName: 'rejected'});
		statusArray.push({statusName: 'closed'});
		WAF.sources.statusArray.sync();
		
		
		$("#errorDiv1").html("");
		$("#richText2").hide();
		$("#button2").hide();
		$("#textField9").attr("disabled", true);
		
		
		/*
		$("#textField3").change(function () { 
			$("#textField4").val($("#textField3").val());
			$("#textField5").val(getNextWorkDay("#textField4"));
		}); 
		
		$("#textField4").change(function () { 
			$("#textField5").val(getNextWorkDay("#textField4"));
		}); 
		*/
		
		/**/
		$("#textField3").change(function () { 
			WAF.sources.pTO_Request.lastDayOff = new Date($("#textField3").val());
			WAF.sources.pTO_Request.autoDispatch();
			WAF.sources.pTO_Request.returnToWorkDate = new Date(getNextWorkDay("#textField4"));
			WAF.sources.pTO_Request.autoDispatch();
		}); 
		
		$("#textField4").change(function () { 
			WAF.sources.pTO_Request.returnToWorkDate = new Date(getNextWorkDay("#textField4"));
			WAF.sources.pTO_Request.autoDispatch();
		}); 
		
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button16", "click", button16.click, "WAF");
	WAF.addListener("button15", "click", button15.click, "WAF");
	WAF.addListener("button11", "click", button11.click, "WAF");
	WAF.addListener("button5", "click", button5.click, "WAF");
	WAF.addListener("button10", "click", button10.click, "WAF");
	WAF.addListener("button9", "click", button9.click, "WAF");
	WAF.addListener("dataGrid1", "onRowClick", dataGrid1.onRowClick, "WAF");
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
