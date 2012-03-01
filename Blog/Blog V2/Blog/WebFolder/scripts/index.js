
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var login1 = {};	// @login
	var btn_register = {};	// @button
	var btn_gestion = {};	// @button
	var btn_prevArticle = {};	// @button
	var btn_nextArticle = {};	// @button
	var btn_saveComment = {};	// @button
	var btn_showComment = {};	// @button
	var btn_addComment = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

function setArticleComments(){
	ds.Commentaire.query('nomArticle = :1',{onSuccess:function(evt){
			$$('divComment').hide();
			sources.commentaire1.setEntityCollection(evt.entityCollection);
		},onError:function(err){
			$$('divComment').hide();
		},params:[sources.article.getCurrentElement().nom.getValue()]});
}

function slideUp(id,duration){
	$('#'+id).slideUp(duration);
}

// eventHandlers// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		$$('btn_register').hide();
		if(WAF.directory.currentUserBelongsTo('admin') == true){
			$$('btn_gestion').show();
		}
	};// @lock

	login1.logout = function login1_logout (event)// @startlock
	{// @endlock
		$$('btn_register').show();
		if(WAF.directory.currentUserBelongsTo('admin') == false){
			$$('btn_gestion').hide();
		}
	};// @lock

	btn_register.click = function btn_register_click (event)// @startlock
	{// @endlock
		$$('compRegister').loadComponent();
	};// @lock

	btn_gestion.click = function btn_gestion_click (event)// @startlock
	{// @endlock
		location.href = "Gestion.html";
	};// @lock

	btn_prevArticle.click = function btn_prevArticle_click (event)// @startlock
	{// @endlock
		setArticleComments();
	};// @lock

	btn_nextArticle.click = function btn_nextArticle_click (event)// @startlock
	{// @endlock
		setArticleComments();
	};// @lock

	btn_saveComment.click = function btn_saveComment_click (event)// @startlock
	{// @endlock
		var commentaire = sources.commentaire.getCurrentElement();
		
		commentaire.date.setValue(new Date());
		commentaire.article.setValue(sources.article.getCurrentElement());
		
		commentaire.save({onSuccess : function(evt){
			$('#errorDiv1').css("color","green");
			$('#errorDiv1').html("Commentaire ajouté avec succes!");
			$('#errorDiv1').fadeIn(1000);
			setTimeout(slideUp,3000,'errorDiv1',500);
			
		},onError : function(err){
			$('#errorDiv1').css("color", "red");
			$('#errorDiv1').html("Problème durant l'ajout de commentaire : "+err.error[0].message);
			$('#errorDiv1').fadeIn(1000);
			setTimeout(slideUp,6000,'errorDiv1',500);
		}});
	};// @lock

	btn_showComment.click = function btn_showComment_click (event)// @startlock
	{// @endlock
		$$('matrixComment').show();
		setArticleComments();
		

	};// @lock

	btn_addComment.click = function btn_addComment_click (event)// @startlock
	{// @endlock
		if(WAF.directory.currentUser() != null ){
			$$('matrixComment').hide();
			$$('divComment').show();
		}else if(WAF.directory.currentUser() == null){
			$$('login1').showLoginDialog();
		}
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		//debugger;
		if(WAF.directory.currentUser() != null && WAF.directory.currentUserBelongsTo('admin') == false){
			$$('btn_register').hide();
			$$('btn_gestion').hide();
		}else if(WAF.directory.currentUserBelongsTo('admin') == false){
			$$('btn_gestion').hide();
		}
		$$('matrixComment').hide();
		$$('divComment').hide();
		
		rpc.getBlogInfosAsync({onSuccess:function(evt){
			$$('headerText').setValue(evt.nom);
			$$('headerDescription').setValue(evt.description);
		}});
		
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("login1", "login", login1.login, "WAF");
	WAF.addListener("login1", "logout", login1.logout, "WAF");
	WAF.addListener("btn_register", "click", btn_register.click, "WAF");
	WAF.addListener("btn_gestion", "click", btn_gestion.click, "WAF");
	WAF.addListener("btn_prevArticle", "click", btn_prevArticle.click, "WAF");
	WAF.addListener("btn_nextArticle", "click", btn_nextArticle.click, "WAF");
	WAF.addListener("btn_saveComment", "click", btn_saveComment.click, "WAF");
	WAF.addListener("btn_showComment", "click", btn_showComment.click, "WAF");
	WAF.addListener("btn_addComment", "click", btn_addComment.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
