
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'register';
	// @endregion// @endlock

	this.load = function (data) {// @lock

	// @region namespaceDeclaration// @startlock
	var button2 = {};	// @button
	var button1 = {};	// @button
	// @endregion// @endlock

	$$($comp.id+'_errorDivUserName').hide();
	$$($comp.id+'_errorDivFullName').hide();
	$$($comp.id+'_errorDivPassword').hide();
	$$($comp.id+'_errorDivRPassword').hide();
	
	// eventHandlers// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		$comp.removeComponent();
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		
		var bothPassFill = 0,
			allOk = 0;
		
		if($$($comp.id+'_userName').getValue() == ""){
			$$($comp.id+'_errorDivUserName').show();
			$$($comp.id+'_userName').setErrorMessage({message : "Please enter a user name.", tooltip : false} )
		}else{
			allOk++;
			$$($comp.id+'_errorDivUserName').hide();
		}
		
		if($$($comp.id+'_fullName').getValue() == ""){
			$$($comp.id+'_errorDivFullName').show();
			$$($comp.id+'_fullName').setErrorMessage({message : "Please enter a full name.", tooltip : false} )
		}else{
			allOk++;
			$$($comp.id+'_errorDivFullName').hide();
		}
		
		if($$($comp.id+'_password').getValue() == ""){
			$$($comp.id+'_errorDivPassword').show();
			$$($comp.id+'_password').setErrorMessage({message : "Please enter a password.", tooltip : false} )
		}else{
			allOk++;
			bothPassFill++;
			$$($comp.id+'_errorDivPassword').hide();
		}
		
		if($$($comp.id+'_rPassword').getValue() == ""){
			$$($comp.id+'_errorDivRPassword').show();
			$$($comp.id+'_rPassword').setErrorMessage({message : "Please repeat the password.", tooltip : false} )
		}else{
			allOk++;
			bothPassFill++;
			$$($comp.id+'_errorDivRPassword').hide();
		}
		
		if($$($comp.id+'_rPassword').getValue() != $$($comp.id+'_password').getValue() && bothPassFill == 2){
			$$($comp.id+'_errorDivPassword').show();
			$$($comp.id+'_password').setErrorMessage({message : "The 2 password are not equal.", tooltip : false} )
			
			$$($comp.id+'_errorDivRPassword').show();
			$$($comp.id+'_rPassword').setErrorMessage({message : "The 2 password are not equal.", tooltip : false} )
		}else{
			allOk++;
		}
		
		if(allOk==5){
			rpc.createUserAsync({onSuccess:function(evt){
				$$($comp.id+'_successRegister').setValue('Registration complete, you can now log in!');
			},onError:function(err){
				$$($comp.id+'_successRegister').setValue('An error was happend during your registration!');
			},params:[$$($comp.id+'_userName').getValue(),$$($comp.id+'_fullName').getValue(),$$($comp.id+'_password').getValue()]});
		}
		
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_button2", "click", button2.click, "WAF");
	WAF.addListener(this.id + "_button1", "click", button1.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
