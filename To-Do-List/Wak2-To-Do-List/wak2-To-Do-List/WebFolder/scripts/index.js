
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var login1 = {};	// @login
	var menuItem2 = {};	// @menuItem
	var menuItem1 = {};	// @menuItem
	var button2 = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

function disableInterface() {
	$('#button1').attr("disabled", true);//Create Button.
	$('#button2').attr("disabled", true);//Save Button
}

function enableInterface() {
	$('#button1').removeAttr('disabled'); //Create Button.
	$('#button2').removeAttr('disabled'); //Save Button.
}
// eventHandlers// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		$('#errorDiv1').html('');
		WAF.sources.toDoList.query("complete = null Order By priority");
		WAF.sources.completedList.query("complete is true");
		enableInterface();
	};// @lock

	login1.logout = function login1_logout (event)// @startlock
	{// @endlock
		$('#errorDiv1').html('');
		WAF.sources.toDoList.query("complete = null Order By priority");
		WAF.sources.completedList.query("complete is true");
		disableInterface();
	};// @lock

	menuItem2.click = function menuItem2_click (event)// @startlock
	{// @endlock
		WAF.sources.completedList.query("complete is true");
		$('#errorDiv1').html('');
	};// @lock

	menuItem1.click = function menuItem1_click (event)// @startlock
	{// @endlock
		WAF.sources.toDoList.query("complete = null Order By priority");
		$('#errorDiv1').html('');
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		if (WAF.directory.currentUser() != null) {
			WAF.sources.toDoList.completeDate = new Date();
			WAF.sources.toDoList.save({
				onSuccess: function(event) {
					WAF.sources.toDoList.query("complete = null Order By priority");
					if (event.dataSource.complete != null) {
						$('#errorDiv1').html('"' + event.dataSource.title + '"' + ' has been moved to the completed list.');
					}
				},
			
				onError: function(error) {
					var myErrorObject = error['error'][0];
					$('#errorDiv1').html(myErrorObject.message);
				}
			});
		}  else {
			$('#errorDiv1').html('You must be signed in to save an item.');
		}//(WAF.directory.currentUser() != null) 
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		WAF.sources.toDoList.query("complete = null Order By priority");
		WAF.sources.completedList.query("complete is true");
		disableInterface();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("login1", "login", login1.login, "WAF");
	WAF.addListener("login1", "logout", login1.logout, "WAF");
	WAF.addListener("menuItem2", "click", menuItem2.click, "WAF");
	WAF.addListener("menuItem1", "click", menuItem1.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
