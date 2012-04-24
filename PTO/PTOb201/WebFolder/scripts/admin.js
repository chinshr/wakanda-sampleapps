
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button20 = {};	// @button
	var button18 = {};	// @button
	var button9 = {};	// @button
	var button14 = {};	// @button
	var button13 = {};	// @button
	var button4 = {};	// @button
	var combobox1 = {};	// @combobox
	var button6 = {};	// @button
	var documentEvent = {};	// @document
	var button5 = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	//Choose Manager
	button20.click = function button20_click (event)// @startlock
	{// @endlock
		$('#dialog2').css("top", 200);
		WAF.widgets['dialog2'].displayDialog();
	};// @lock

	button18.click = function button18_click (event)// @startlock
	{// @endlock
		$$('dialog2').closeDialog(); //ok button
	};// @lock


	//Delete
	button9.click = function button9_click (event)// @startlock
	{// @endlock
		var userName = WAF.sources.user.fullName;
		$('#errorDiv2').html("Are you sure you want to delete " + userName);
		$('#dialog1').css("top", 200);
		WAF.widgets['dialog1'].displayDialog();
	};// @lock

	button14.click = function button14_click (event)// @startlock
	{// @endlock
		$$('dialog1').closeDialog(); //cancel button
	};// @lock

	button13.click = function button13_click (event)// @startlock
	{// @endlock
		$$('dialog1').closeDialog(); //ok button
		//Red Alert red Alert - Move this logic to the server!!!!!!!!!!!!!!!!!
		switch (WAF.sources.user.accessLevel) {
			case 3: //Manager
			var employeeCount;
			var employeeCollection = WAF.ds.User.query("myManager.ID = " + WAF.sources.user.ID, {
				onSuccess: function(event) {
					employeeCount = event.entityCollection.length;
					if (employeeCount > 0) {
						$("#errorDiv1").html("Check " + WAF.sources.user.ID + " for employees. Count: " + employeeCount);
					} else {
						//Check for PTO requests.
						var ptoCount;
						var currentUserPTOCollection = WAF.ds.PTO_Request.query("requestor.ID = " + WAF.sources.user.ID, {
							onSuccess: function(event) {
								ptoCount = event.entityCollection.length;
								$("#errorDiv1").html("Check " + WAF.sources.user.ID + " for Manager PTO Requests. Count: " + ptoCount);
							},
							onError: function(error) {
				
							}
						});

					}
					
				}
			});
			break;
			
			case 4: //Employee
			var ptoCount;
			var currentUserPTOCollection = WAF.ds.PTO_Request.query("requestor.ID = " + WAF.sources.user.ID, {
				onSuccess: function(event) {
					ptoCount = event.entityCollection.length;
					if (ptoCount > 0) {
						$("#errorDiv1").html("The account for " + WAF.sources.user.fullName + " has not been removed. This user has PTO Requests on file.");
					} else {
						WAF.sources.user.removeCurrent();
						$("#errorDiv1").html("The account for " + WAF.sources.user.fullName + " has been removed.");
					}
					//$("#errorDiv1").html("Check " + WAF.sources.user.ID + " for PTO Requests. Count: " + ptoCount);
				},
				onError: function(error) {
				
				}
			});
			break;
			
			default:
			
		} //End switch	
		
		//WAF.sources.user.removeCurrent();
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		WAF.sources.user.save({
			onSuccess: function(event) {
				$("#errorDiv1").html("Save successful on server.");
			},
			onError: function(error) {
				var myError = error['error'][0];
				$("#errorDiv1").html(myError.message);
			}	
		});
	};// @lock

	combobox1.change = function combobox1_change (event)// @startlock
	{// @endlock
		var managerName = WAF.sources.user1.fullName;
		WAF.sources.user.myManager.set(WAF.sources.user1);
		$("#textField13").val(WAF.sources.user1.fullName);
	};// @lock

	button6.click = function button6_click (event)// @startlock
	{// @endlock
		if (WAF.directory.logout()) {
			//hide logout stuff
			//$("#richText1").css("top", "40px");
			$("#richText1").hide();
			
			//$("#button6").css("top", "40px");
			$("#button6").hide();
			
			//show login stuff
			$("#textField11").show();
			$("#textField12").show();
			$("#label11").show();
			$("#label12").show();
			$("#button5").show();
			
			WAF.sources.user.query("ID < 0");
			WAF.sources.user1.query("ID < 0");
			WAF.sources.holiday.query("ID < 0");
		}
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$("#richText1").hide();
		$("#button6").hide();
	};// @lock

	button5.click = function button5_click (event)// @startlock
	{// @endlock
		var loginName = $("#textField11").val();
		var thePassword = $("#textField12").val();
		
		if (WAF.directory.loginByPassword(loginName, thePassword)) {
			WAF.sources.user.all();
			WAF.sources.holiday.all();
			//WAF.sources.user1.all();
			WAF.sources.user1.query("accessLevel = 3");
			
			//hide login stuff
			$("#textField11").hide();
			$("#textField12").hide();
			$("#label11").hide();
			$("#label12").hide();
			$("#button5").hide();
			
			$("#richText1").html(WAF.directory.currentUser().fullName);
			//$("#richText1").css("top", "35px");
			$("#richText1").show();
			
			//$("#button6").css("top", "35px");
			$("#button6").show();	
		} else {
			$("#errorDiv1").html("Invalid login.");
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button20", "click", button20.click, "WAF");
	WAF.addListener("button18", "click", button18.click, "WAF");
	WAF.addListener("button9", "click", button9.click, "WAF");
	WAF.addListener("button14", "click", button14.click, "WAF");
	WAF.addListener("button13", "click", button13.click, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("combobox1", "change", combobox1.change, "WAF");
	WAF.addListener("button6", "click", button6.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("button5", "click", button5.click, "WAF");
// @endregion
};// @endlock
