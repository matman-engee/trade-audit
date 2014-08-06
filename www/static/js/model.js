function Audit(data){
	//console.log("Audit:");
	//console.log(data);

	var self = this; 

	self.id 		= ko.observable(data.id);
	self.auditer_id = ko.observable(data.auditer_id);
	self.branch_id 	= ko.observable(data.branch_id);
	self.created 	= ko.observable(data.created);
	self.manager_id = ko.observable(data.manager_id);
	self.poll_id 	= ko.observable(data.poll_id);
	self.state_id 	= ko.observable(data.state_id);
	self.observation = ko.observable(data.observation);

	self.prepare = function(){
		return JSON.stringify({
			id: self.id()
		});
	}
}

function AuditCategory(data){
	//console.log("AuditCategory:");
	//console.log(data);

	var self = this;

	self.id = ko.observable( data.id );
	self.name = ko.observable( data.name );

	self.audit_id = ko.observable( data.audit_id );
	self.category = ko.observable( new Category( data.Category ) );
	self.category_id 	= ko.observable( data.category_id );
	self.completed 		= ko.observable( data.completed	  );
	self.observation 	= ko.observable( data.observation );

	self.open = function(){
		console.log("open");
		if ( typeof(Storage) !== "undefined" ){
			console.log( self.id() );
			localStorage.setItem( "audit_category_id", self.id() );
			window.location = "category.html";
		}else{
			console.log( "LocalStorage not supported" );
			alert("error");
		}
	};

	self.prepare = function(){
		return JSON.stringify({
			id : self.id(),
			observation : self.observation(),
			Category : JSON.parse( self.category().prepare() )
		})
	}
}

function AuditResponse(data, question){
	var self = this;

	console.log(data.value);

	self.id 		= ko.observable( data.id );
	self.audit_id 	= ko.observable( data.audit_id );
	self.category_question_id = ko.observable( data.category_question_id );
	self.value	= ko.observable( data.value || null );
	//self.date = ko.observable( data.date );

	if ( question().question_type().type() == "SELECT" ){
		self.selectedOptionId = ko.observable( data.value );
		self.selectedOption = ko.computed(function(){
			return $.map( question().options(), function(data){
						if ( data.id() == self.selectedOptionId() ){
							return data;
						}
					});
		});
		// sobreescribo el value del elemento
		self.value = self.selectedOptionId;
	}

	self.selectCheck = function(){
		console.log( "selectCheck" );
	}

	self.valueArray = ko.observableArray();

	self.prepare = function(){
		return JSON.stringify({
			id: self.id(),
			value: self.value()
		});
	}
}

function Branch(data){
	this.id 	= ko.observable(data.id);
	this.name 	= ko.observable(data.name);

	this.address = ko.observable(data.address);
	this.code = ko.observable(data.code);
	this.email = ko.observable(data.email);
	this.managers = ko.observableArray( $.map( data.Manager || [], function(data){return new Manager(data)}) );
	this.phone = ko.observable(data.phone);
}

function Category( data ){
	var self = this;
	self.id 	= ko.observable( data.id );
	self.name 	= ko.observable( data.category );

	self.icon 		= ko.observable( data.icon || "home" );
	self.poll_id 	= ko.observable( data.poll_id );
	self.position 	= ko.observable( data.position );

	self.categoryQuestions = ko.observableArray( $.map( data.CategoryQuestion || [], 
														function(data){return new CategoryQuestion(data)}) );

	self.prepare = function(){
		return JSON.stringify({
			id : self.id(),
			CategoryQuestion: $.map( self.categoryQuestions(), 
									 function(categoryQuestion){
										return JSON.parse( categoryQuestion.prepare() ) 
									}) 
		});
	}
}

function CategoryQuestion(data){
	//console.log("CategoryQuestion:");
	//console.log(data);

	var self = this;
	self.id = ko.observable( data.id );

	self.question_id = ko.observable( data.question_id );
	self.category_id = ko.observable( data.category_id );
	self.required = ko.observable( data.required );
	self.position = ko.observable( data.position );
	self.question = ko.observable( new Question( data.Question ) );
	self.auditResponse = ko.observable( new AuditResponse( data.AuditResponse, self.question ) );
	
	self.templateName = ko.computed( function(){
		return self.question().question_type().type().toLowerCase()+'-template';
	});

	self.prepare = function(){
		return JSON.stringify({
			id: self.id(),
			AuditResponse: JSON.parse ( self.auditResponse().prepare() ),
			Question: JSON.parse( self.question().prepare() )
		})
	}

	self.remove = function(){
		self.auditResponse().value( null );
	}

	/*
	self.templateName = function(){
		return self.question().question_type().type().toLowerCase()+'-template';
	};
	*/
}

function Manager(data){
	this.id 	= ko.observable(data.id);
	this.name 	= ko.observable(data.name || data.id);

	this.branch_id 	= ko.observable(data.branch_id);
	this.user_id 	= ko.observable(data.user_id);
}

function Option(data){
	//console.log("Option:");
	//console.log(data);

	var self 	= this;
	self.id 	= ko.observable( data.id );
	self.name 	= ko.observable( data.name );	
}

function Poll(data){
	//console.log("Poll:");
	//console.log(data);

	var self 	= this;	
	self.id 	= ko.observable(data.id);
	self.name 	= ko.observable(data.name || data.id);

	self.date_created 	= ko.observable(data.date_created);
	self.poll_type_id 	= ko.observable(data.poll_type_id);
	self.state_id 		= ko.observable(data.state_id);
}

function Question(data){
	//console.log("Question:");
	//console.log(data);

	var self = this;
	self.id 		= ko.observable( data.id );
	self.question 	= ko.observable( data.question );
	self.poll_id 	= ko.observable( data.poll_id );
	self.required	= ko.observable( data.required );
	self.question_type_id = ko.observable( data.question_type_id );
	self.question_type = ko.observable( new QuestionType( data.QuestionType ) );
	self.options	= ko.observableArray( $.map( data.options || [ { id: 1, name: "Argentina"}, { id: 2, name: "Brasil"}, {id: 3, name: "Uruguay" }], 
												 function(data){return new Option(data)}) );
	self.prepare = function(){
		return JSON.stringify({
			id: self.id(),
			question_type_id: self.question_type_id()
		})
	}
}

function QuestionType(data){
	var self = this;

	self.id = ko.observable( data.id );
	self.type = ko.observable( data.type );
}

function Region(data){
	this.id 	= ko.observable(data.id);
	this.name 	= ko.observable(data.name);
	
	this.branches = ko.observableArray( $.map( data.Branch || [], function(data){return new Branch(data)}) );
}
