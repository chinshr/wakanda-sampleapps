
guidedModel =// @startlock
{
	RequestLineItem :
	{
		events :
		{
			onRemove:function()
			{// @endlock
				var err;
				var sessionRef = currentSession(); // Get session.
				var myCurrentUser = currentUser(); // Get the current user.
				var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
				
				//debugger;
				if (sessionRef.belongsTo("Administrator")) {
					err = { error : 5099, errorMessage: "The Administrator is not allowed to remove PTO Request Line Items."};
				
				} else if (sessionRef.belongsTo("Manager") && (this.ptoRequest.requestor.login !== myCurrentUser.name)) {	
					err = { error : 5095, errorMessage: "A Manager is only allowed to remove their own PTO Request Line Items."};
				
				} else if (sessionRef.belongsTo("Employee")) {
					
					
					
					if (this.compensation === "Floating Day") {
						var sessionRef = currentSession(); // Get session.
						var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
						//update the user account and put back the Floating Day.
						myUserV.floatingDays += 1;
						myUserV.save();
						sessionRef.unPromote(promoteToken); //put the session back to normal.
					}
					
					if (this.compensation === "Paid Time Off") {
						var sessionRef = currentSession(); // Get session.
						var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
						//update the user account and put back the Floating Day.
						myUserV.ptoHours += this.hoursRequested;
						myUserV.save();
						sessionRef.unPromote(promoteToken); //put the session back to normal.
					}
					
					
				} else {	
					err = { error : 5090, errorMessage: "You must sign in to remove PTO Request Line Items."};
				}
				
				return err;
				
			},// @startlock
			onValidate:function()
			{// @endlock
				var err;
				var sessionRef = currentSession(); // Get session.
				var myCurrentUser = currentUser(); // Get the current user.
				var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
				
					
				if (sessionRef.belongsTo("Administrator")) {
					err = { error : 5099, errorMessage: "The Administrator is not allowed to update PTO Request Line Items."};
				
				} else if (sessionRef.belongsTo("Manager") && (this.ptoRequest.requestor.login !== myCurrentUser.name)) {	
					err = { error : 5095, errorMessage: "A Manager is only allowed to update their own  PTO Request Line Items."};
				
				} else if (sessionRef.belongsTo("Employee")) {
					
					
				} else {	
					err = { error : 5090, errorMessage: "You must sign in to update PTO Request Line Items."};
				}
				
				//User wants to update their PTO Request.
				if (!this.isNew()) {
					var theClass = this.getDataClass(); //get the dataclass of the entity to save
					var theClassName = theClass.getName(); //get the dataclass name
					var oldEntity = theClass(this.getKey()); //find the same entity on disk	
					
					//Did compensation method change?
					//debugger;
					if (this.compensation !== oldEntity.compensation) {
						if (this.compensation === "Floating Day") {
							if (myUserV.floatingDays < 1) {
								err = { error : 5070, errorMessage: "You do not have any Floating Days left in your bank."};
							}
						}
					}
					
					
					if (this.hoursRequested !== oldEntity.hoursRequested) {
						if (this.compensation === "Floating Day") {
								err = { error : 5050, errorMessage: "You don't need to request hours for Floating Days."};
						}
					}
					
					if ((this.hoursRequested < 1) || (this.hoursRequested > 7)) {
						err = { error : 5052, errorMessage: "You cannot request hours less than 1 or greater than 8."};
					} else {
						//check if we have enough hours.
						if ((this.hoursRequested > myUserV.ptoHours) && (this.hoursRequested > oldEntity.hoursRequested)){
							err = { error : 5054, errorMessage: "You do not have enough hours in your bank for this request."};
						}
					}
				} //(!this.isNew())
				
				
				return err;
			},// @startlock
			onSave:function()
			{// @endlock
				if (!this.isNew()) {
					var sessionRef = currentSession(); // Get session.
					var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
					
					var theClass = this.getDataClass(); //get the dataclass of the entity to save
					var theClassName = theClass.getName(); //get the dataclass name
					var oldEntity = theClass(this.getKey()); //find the same entity on disk
				
					var myCurrentUser = currentUser(); // Get the current user
					var myUser = ds.User.find("ID = :1", myCurrentUser.ID); // Load their user entity.
					
					if (this.hoursRequested < oldEntity.hoursRequested) {
						myUser.ptoHours += oldEntity.hoursRequested - this.hoursRequested;
					}
					
					if (this.hoursRequested > oldEntity.hoursRequested) {
						myUser.ptoHours -= this.hoursRequested;
					}
					
					if (this.compensation !== oldEntity.compensation) {
						if (this.compensation === "Paid Time Off") {
							//Return Floating Day
							myUser.floatingDays += 1;
						}
					}
					
					myUser.save();
					sessionRef.unPromote(promoteToken); //put the session back to normal.
					
					//return {error: 5000, errorMessage: "Just a test."};
				}
				
			}// @startlock
		}
	},
	PTO_Request :
	{
		events :
		{
			onRestrictingQuery:function()
			{// @endlock
				var result = ds.PTO_Request.createEntityCollection();
					
				if (currentUser().name === "Admin") {
					result = ds.PTO_Request.all();
				
				} else {
					//Load User entity.
					var myCurrentUser = currentUser(); // Get the current user
					var myUser = ds.User.find("ID = :1", myCurrentUser.ID); // Load their user entity.
					if (myUser !== null) {
						if (myUser.accessLevel < 4) {
							result = ds.PTO_Request.query("requestor.myManager.login = :1", myCurrentUser.name);
							theManagerPTOs = ds.PTO_Request.query("requestor.login = :1", currentUser().name);
							result = result.add(theManagerPTOs);
							
						} else {
							result = ds.PTO_Request.query("requestor.login = :1", myCurrentUser.name);
						}
					}
				}
				
				return result;
			},// @startlock
			onSave:function()
			{// @endlock
				//debugger;
				//var sessionRef = currentSession(); // Get session.
				//var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
				
				//If there are any existing line items for this request delete them first.
				//We need to add code to do this.
				
				var myCurrentUser = currentUser(); // Get the current user
				var myUser = ds.User.find("ID = :1", myCurrentUser.ID); // Load their user entity.
				var the4DHolidays = ds.Holiday.all();
				var numberOf4DHolidays = the4DHolidays.length;
				var myDayPointer = this.firstDayOff;
				var myLastDay = this.lastDayOff;
				var theDayNumber;
				var hours;
				
				
				if ((myUser !== null) && (this.isNew())) {
					if (myLastDay != null) {
						while (myDayPointer <= myLastDay) { // Loop thru the requested days off.
							theDayNumber = myDayPointer.getDay();
						 	if ((theDayNumber > 0) && (theDayNumber < 6) && (!is4DHoliday(myDayPointer))){
						 		addPTOLineItem(this, myUser, myDayPointer);
							}
							myDayPointer.setDate(myDayPointer.getDate()+1); // Go to next requested day off.
						}
					} else { //Requesting One Day Off.
						theDayNumber = myDayPointer.getDay();
						if ((theDayNumber > 0) && (theDayNumber < 6) && (!is4DHoliday(myDayPointer))){
								addPTOLineItem(this, myUser, myDayPointer);
						}
					} //(myLastDay != null)
				}//(myUser !== null)				
				
				//sessionRef.unPromote(promoteToken); //put the session back to normal.
			},// @startlock
			onInit:function()
			{// @endlock
				//debugger;
				var sessionRef = currentSession(); // Get session.
				var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
				var err;
				var myCurrentDate = new Date(); // we get the current date.
				var myCurrentUser = currentUser(); // we get the user of the current session.
				var myUser = ds.User.find("ID = :1", myCurrentUser.ID);
    			
				if ((myCurrentUser !== null) && (myUser !== null)) {//if a user is logged in.
        			this.dateEntered = myCurrentDate;
        			this.requestor = myUser;  //New
        			this.status = "pending";
        		} else {
        			err = { error : 4, errorMessage: "Your request is invalid. Have Human Resources check your User record." };
				} //if (user != null)
				
				sessionRef.unPromote(promoteToken); //put the session back to normal.	
				
				if (err != null) {
					return err;
				}//if (err != null)
							
			},// @startlock
			onValidate:function()
			{// @endlock
				//var sessionRef = currentSession(); // Get session.
				//var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
				
				var err;
				
				/**/
				//Employee cannot edit authorization.
				var theClass = this.getDataClass(); //get the dataclass of the entity to save
				var theClassName = theClass.getName(); //get the dataclass name
				var oldEntity = theClass(this.getKey()); //find the same entity on disk
				var sessionRef = currentSession(); // Get session.
				var myCurrentUser = currentUser(); // Get the current user.
				var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
				
				if (sessionRef.belongsTo("Administrator")) {
					err = { error : 3099, errorMessage: "The Administrator is not allowed to update PTO requests."};
					return err;
					
					
				} else if (sessionRef.belongsTo("Manager") && (this.requestor.login !== myCurrentUser.name)) {
					//err = { error : 8888, errorMessage: "I am being a manager."};
					//return err;
						
					/*
					var myCurrentUser = currentUser(); // Get the current user.
					var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
					
					//Is Manager looking at their own PTO request or an employee's PTO request?
					if (this.requestor.login === myCurrentUser.name) {
						//It's the managers PTO request.
						err = { error : 9999, errorMessage: "This is your request."};
						return err;
						
					} else {
						//It is an employee's request.
						err = { error : 9998, errorMessage: "This is your employee's request."};
						return err;
						
					}
					*/
					
					
					/**/
					if (this.firstDayOff === null) {
						err = { error : 4010, errorMessage: "You do not have permission to update the First Day Off field value."};
						return err;	
					}
					
					if (this.lastDayOff === null) {
						err = { error : 4015, errorMessage: "You do not have permission to update the Last Day Off field value."};
						return err;	
					}
					
					if (this.returnToWorkDate === null) {
						err = { error : 4020, errorMessage: "You do not have permission to update the Return To Work field value."};
						return err;	
					}
					
					if (this.firstDayOff.toString() != oldEntity.firstDayOff.toString()) {
						err = { error : 4030, errorMessage: "You do not have permission to update the First Day Off field."};	
						return err;	
					}

					if (this.lastDayOff.toString() != oldEntity.lastDayOff.toString()) {
						err = { error : 4040, errorMessage: "You do not have permission to update the Last Day Off field."};
						return err;		
					}
					
					if (this.returnToWorkDate !== null) {
						if (this.returnToWorkDate.toString() != oldEntity.returnToWorkDate.toString()) {
							err = { error : 4050, errorMessage: "You do not have permission to update the Return To Work field."};	
							return err;	
						}
					}
					
					if (this.notes != oldEntity.notes) {
						err = { error : 4060, errorMessage: "You do not have permission to update the Notes field."};
						return err;		
					}
					
					
					

						
				} else if (sessionRef.belongsTo("Employee")) {
					//err = { error : 8889, errorMessage: "I am  a manager being an employee."};
					//return err;	
					
					if (this.firstDayOff === null) {
						err = { error : 2002, errorMessage: "You must enter a First Day Off."};
						return err;
					}
					
					if (this.lastDayOff === null) {
						err = { error : 2003, errorMessage: "You must enter a Last Day Off."};
						return err;
					}
					
					if (this.returnToWorkDate === null) {
						err = { error : 2004, errorMessage: "You must enter a Return To Work Date."};
						return err;
					}
					
					
					var firstDayOff = this.firstDayOff;
					var lastDayOff = this.lastDayOff;
					var currentDate = new Date;
					//var myCurrentUser = currentUser(); // Get the current user.
					//var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
					
					if ((this.authorized !== null) && (oldEntity.authorized !== null)) {
						if (this.authorized !== oldEntity.authorized) {
							err = { error : 2005, errorMessage: "You do not have permission to change the authorization."};
							return err;	
						}
					}
					
					if (this.status !== oldEntity.status) {
						err = { error : 2007, errorMessage: "You do not have permission to change the status."};
						return err;	
					}
					
					
					if (this.authorized) {
							err = { error : 2010, errorMessage: "You do not have permission to authorize PTO requests."};
							return err;	
					}	
					
					
					//You cannot update certain fields of a current request
					if (!this.isNew()) {
					 	//This is an existing PTO rquest.
					 	if (this.firstDayOff === null) {
							err = { error : 2012, errorMessage: "You cannot update the First Day Off field of an existing request."};
							return err;	
						}
					
						if (this.lastDayOff === null) {
							err = { error : 2015, errorMessage: "You cannot update the Last Day Off field of an existing request."};
							return err;	
						}
					
						if (this.returnToWorkDate === null) {
							err = { error : 2020, errorMessage: "You cannot update the Return To Work field of an existing request."};
							return err;	
						}
					
						if (this.firstDayOff.toString() != oldEntity.firstDayOff.toString()) {
							err = { error : 2030, errorMessage: "You cannot update the First Day Off of an existing request."};	
							return err;	
						}

						if (this.lastDayOff.toString() != oldEntity.lastDayOff.toString()) {
							err = { error : 2040, errorMessage: "You cannot update the Last Day Off of an existing request."};
							return err;		
						}
					
						if (this.returnToWorkDate !== null) {
							if (this.returnToWorkDate.toString() != oldEntity.returnToWorkDate.toString()) {
								err = { error : 2050, errorMessage: "You cannot update the Return To Work field of an existing request."};	
								return err;	
							}
						}
						
					} //This is an existing request - end.
					
					
					//Has the first day requested already past?
					dateCompare = dates.compare(firstDayOff, currentDate);
					if (dateCompare < 0) {
						err = { error : 2064, errorMessage: "Your request is invalid. The requested dates have already passed." };
						return err;	
					}
					
					
					if (lastDayOff !== null) {
						//Has the last day requested already past?
						dateCompare = dates.compare(lastDayOff, currentDate);
						if ((dateCompare < 0)  & (err == null)) {
							err = { error : 2072, errorMessage: "Your request is invalid. The requested dates have already past." };
							return err;	
						}
						
						//Is the last day requested before the first day requested?
						dateCompare = dates.compare(lastDayOff, firstDayOff);
						if ((dateCompare < 0) & (err == null)) {
							err = { error : 2078, errorMessage: "Your request is invalid. The last day off is before the first day off." };
							return err;	
						}
					}
					
					//Does the user have enough hours?
					//Only check this for new requests
					if (this.isNew()) {
						if (lastDayOff != null) {
							var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
							var daysRequested = daysOffRequested(firstDayOff, lastDayOff);
						} else {
							daysRequested = 1;
						}
						var theNumberOfElapsedPayPeriods = elapsedPayPeriods(myUserV);
						var currentPTOHoursV = myUserV.ptoHours + (theNumberOfElapsedPayPeriods * myUserV.ptoAccrualRate);
						currentPTOHoursV = Math.floor(currentPTOHoursV);
						var ptoDaysRemaining = Math.floor(currentPTOHoursV/8);
						var floatingDays = myUserV.floatingDays;
						var myTotalDays = ptoDaysRemaining + floatingDays;
						if ((myTotalDays < daysRequested)  & (err == null)) { //floatingDays + ptoDaysRemaining	
							if ((currentPTOHoursV > 0) && (myTotalDays === daysRequested - 1)) {
								// no error
							} else {
								err = { error : 2088, errorMessage: "You have requested " + daysRequested + " days off. You do not have enough PTO/Floating Holidays for this request." };
								return err;	
							}
						}
					}
					
					
					
					//Duplicate request?
					if (this.isNew()) {
						if (duplicatePTORequest(this, myUserV)) {
							err = { error : 2089, errorMessage: "This request conflicts with a previous request." };
							return err;	
						}
					}
							
				
						
				} else {
					//This session does not belong to any authorized group.
					err = { error : 3096, errorMessage: "You are not authorized to update this PTO request."};
					return err;	
				}
				
				
				
				/*
				if (!this.isNew()) {
					//No one can update the Date Entered field.
					if (this.dateEntered.toString() !== oldEntity.dateEntered.toString()) {
							err = { error : 2015, errorMessage: "You do not have permission to update the Date Entered field."};
							return err;	
					}	
					
					
					if (oldEntity.authorizationDate !== null) {
						if  (this.authorizationDate.toString() !== oldEntity.authorizationDate.toString()) {
							err = { error : 2015, errorMessage: "You do not have permission to update the Authorization Date field."};
							return err;	
						}	
					} else {
						if (this.authorizationDate !== null) {
							err = { error : 2017, errorMessage: "You do not have permission to update the Authorization Date field."};
							return err;	
						}
					}
				}
				*/
				//return err;

				
								
			}// @startlock
		}
	},
	User :
	{
		events :
		{
			onRestrictingQuery:function()
			{// @endlock
				var result = ds.User.createEntityCollection();
				
				if (currentSession().belongsTo("Administrator")) {
					result = ds.User.all();
				
				} else if (currentSession().belongsTo("Manager")) {
					//screencast
					result =  ds.User.query("myManager.login = :1", currentUser().name);
					theManager = ds.User.find("login = :1", currentUser().name);
					result = result.add(theManager);
					
					//result = ds.User.all();
				} else if (currentSession().belongsTo("Employee")) {
					result = ds.User.query("login = :1", currentUser().name);
				}
				
				return result;
			},// @startlock
			onSave:function()
			{// @endlock
				// Add your code here
				//Reset the seed values.
//				var theNumberOfElapsedPayPeriods = elapsedPayPeriods(this);
//				var currentPTOHours = this.ptoHours + (theNumberOfElapsedPayPeriods * this.ptoAccrualRate);
//				this.ptoHours = currentPTOHours;
//				this.ptoSeedDate = new Date();
				
				//end
			}// @startlock
		},
		entityMethods :
		{// @endlock
			validatePassword:function(password) //only use the password.
			{// @lock
				var ha1 = directory.computeHA1(this.ID, password);
				return (ha1 === this.HA1Key); //true if validated, false otherwise.
			}// @startlock
		},
		password :
		{
			onSet:function(value)
			{// @endlock
				this.HA1Key = directory.computeHA1(this.ID, value);
				//we use the ID to compute the HA1 key.
				//I need to check password compliance here - not blank, number of chars.
			},// @startlock
			onGet:function()
			{// @endlock
				return "*****"; //could also return Null.
			}// @startlock
		}
	}
};// @endlock
