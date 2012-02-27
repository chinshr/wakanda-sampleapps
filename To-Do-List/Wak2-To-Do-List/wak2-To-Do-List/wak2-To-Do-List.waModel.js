
guidedModel =// @startlock
{
	BaseToDoList :
	{
		events :
		{
			onValidate:function()
			{// @endlock
				if (currentUser() === null) {
					return {error: 05, errorMessage: "You must be signed in to create a To Do List item."};
				}
			},// @startlock
			onInit:function()
			{// @endlock
				if (currentUser() != null) {
					this.userID = currentUser().ID;
					this.priority = 2;
					this.createDate = new Date();
				}
			}// @startlock
		}
	}
};// @endlock
