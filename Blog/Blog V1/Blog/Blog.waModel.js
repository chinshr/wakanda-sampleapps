model = {};

model.Article = {};
model.Article.events = {};
model.Article.entityMethods = {};

model.Commentaire = {};
model.Commentaire.events = {};

model.Article.entityMethods.getCommentLength = function(){
	debugger;
	return this.allCommentaires.length;
}

model.Article.events.onRemove = function(){
	if(this.allCommentaires.length > 0){
		this.allCommentaires.remove();
	}
}

model.Article.events.onValidate = function(){
	this.auteur = ds.currentUser().ID;
	this.nomAuteur = ds.currentUser().fullName;
}

model.Commentaire.events.onValidate = function(){
	this.personne = ds.currentUser().ID;
	this.nomPersonne = ds.currentUser().fullName;
}
