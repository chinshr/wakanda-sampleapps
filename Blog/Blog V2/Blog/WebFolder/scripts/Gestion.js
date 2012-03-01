
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button1 = {};	// @button
	var btn_removeArticle = {};	// @button
	var btn_index = {};	// @button
	var documentEvent = {};	// @document
	var btn_saveArticle = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		rpc.setBlogInfosAsync({onSuccess:function(evt){
			
		},onError:function(err){
			debugger;
		},params:[$$('blogName').getValue(),$$('bloogDescription').getValue()]});
        
        rpc.getBlogInfosAsync({onSuccess:function(evt){
			$$('headerText').setValue(evt.nom);
			$$('headerDescription').setValue(evt.description);
		}});
	};// @lock

	btn_removeArticle.click = function btn_removeArticle_click (event)// @startlock
	{// @endlock
		if(window.confirm("êtes-vous sur de vouloir supprimer cet article car cela supprimera tout ses commentaires?")){
			
			sources.article.removeCurrent();
		}
	};// @lock

	btn_index.click = function btn_index_click (event)// @startlock
	{// @endlock
		location.href = "index.html";
	};// @lock
	
	function slideUp(id,duration){
		$('#'+id).slideUp(duration);
	}
	

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		if(WAF.directory.currentUser() != null && WAF.directory.currentUserBelongsTo("admin") == true){
			$$("mainBody").show();
			$$('loginText').hide();
		}else{
			$$("mainBody").hide();
		}
		
		
		rpc.getBlogInfosAsync({onSuccess:function(evt){
			$$('headerText').setValue(evt.nom);
			$$('headerDescription').setValue(evt.description);
		}});
	};// @lock

	btn_saveArticle.click = function btn_saveArticle_click (event)// @startlock
	{// @endlock
		
		var article = sources.article.getCurrentElement();
		var dateNow = new Date();
		
		article.date.setValue(dateNow);
		
		article.save({onSuccess : function(evt){
			$('#errorDiv1').css("color","green");
			$('#errorDiv1').html("Article ajouté avec succes!");
			$('#errorDiv1').fadeIn(1000);
			setTimeout(slideUp,2000,'errorDiv1',500);
			
		},onError : function(err){
			$('#errorDiv1').css("color", "red");
			$('#errorDiv1').html("Problème durant la sauvegarde de l'article : "+err.error[0].message);
			$('#errorDiv1').fadeIn(1000);
			setTimeout(slideUp,6000,'errorDiv1',500);
		}});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("btn_removeArticle", "click", btn_removeArticle.click, "WAF");
	WAF.addListener("btn_index", "click", btn_index.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("btn_saveArticle", "click", btn_saveArticle.click, "WAF");
// @endregion
};// @endlock
