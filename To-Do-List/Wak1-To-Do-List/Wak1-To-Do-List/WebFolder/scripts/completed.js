/*
	With version 1 of Wakanda, we don't have the automatic action "remove" for buttons
	bound to a datasource => we must write the code ourselves
*/


WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var menuItem1 = {};	// @menuItem
	var button3 = {};	// @button
	var login1 = {};	// @login
	var documentEvent = {};	// @document
// @endregion// @endlock

	function disableInterface() {
		$('#button3').attr("disabled", true);//Delete Button.
	}

	function enableInterface() {
		$('#button3').removeAttr('disabled'); //Delete Button.
	}

// eventHandlers// @lock

	menuItem1.click = function menuItem1_click (event)// @startlock
	{// @endlock
		window.location.href = 'index.html';
	};// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		WAF.sources.completedList.removeCurrent();
	};// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		$('#errorDiv1').html('');
		WAF.sources.completedList.query("complete is true");
		
		if (WAF.directory.currentUser() != null) {
			enableInterface();
		} else {
			disableInterface();
		}
	};// @lock

	login1.logout = function login1_logout (event)// @startlock
	{// @endlock
		$('#errorDiv1').html('');
		WAF.sources.completedList.query("complete is true");
		disableInterface();
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		WAF.sources.completedList.query("complete is true");
		if (WAF.directory.currentUser() != null) {
			enableInterface();
		} else {
			disableInterface();
		}
		// NOTICE : in v2, we're using a Tab widget => no need to higlight anything
		$$('menuItem2').setTextColor('blue');
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("menuItem1", "click", menuItem1.click, "WAF");
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("login1", "login", login1.login, "WAF");
	WAF.addListener("login1", "logout", login1.logout, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
