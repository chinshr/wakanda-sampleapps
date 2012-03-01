
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock


var articleHTML = '<div id="divArticles">';



function getHTMLArticles(){
	
	

	ds.Article.query('nom = @ order by date desc',{onSuccess:function(evt){
			
		evt.entityCollection.forEach({onSuccess:function(evt){
						
			articleHTML += '<div><span class="nomArticle">'+evt.entity.nom.value+'</span></div>';
			
			var dateArticle = new Date(evt.entity.date.value);
			
			articleHTML += '<div><span class="dateArticle">Le '+dateArticle.getDate()+' du '+(dateArticle.getMonth()+1)+' '+dateArticle.getFullYear()+' à '+dateArticle.getHours()+':'+dateArticle.getMinutes()+'</span>&nbsp;&nbsp;&nbsp; Par <span class="nomAuteurArticle">'+evt.entity.nomAuteur.value+'</span></div>';
			articleHTML += '<div><span class="contenuArticle">'+evt.entity.contenu.value+'</span></div>';
			
			articleHTML += '<hr class="articleSeparator"/>';
			
			
																			
			
		},atTheEnd:function(){
			articleHTML += '<div id="footer">&nbsp;</div></div>';
			$('#elemDesign1').after(articleHTML);
		}});
	}});
}



// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		var blogInfos = rpc.getBlogInfos();
		$('#headerText').html(blogInfos.nom);
		$('#headerDescription').html(blogInfos.description);		
		getHTMLArticles();
		
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
