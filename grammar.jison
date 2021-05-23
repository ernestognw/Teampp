/* lexical grammar */
%lex

%{
	if(!yy.started) {
		yy.started = true

		const Semantics = require('../../classes/semantics.js');

		yy.semantics = new Semantics(this);
	} else {
		yy.semantics.parentCtx = this;
	}
%}

%%
\s+		      {  }           	
"+"					{ return 'PLUS'; }
"/"					{ return 'DIV'; }
"*"					{ return 'MULT'; }
"-"					{ return 'MINUS'; }
"!="				{ return 'NOT_EQUAL'; }
"=="				{ return 'EQUAL_EQUAL'; }
">="				{ return 'GTE'; }
"<="				{ return 'LTE'; }
">"					{ return 'GT'; }
"<"					{ return 'LT'; }
"&&"				{ return 'AND'; }
"||"				{ return 'OR'; }
"!"					{ return 'NOT'; }
"("					{ return 'OPEN_PARENTHESIS'; }
")"					{ return 'CLOSE_PARENTHESIS'; }
"{"					{ return 'OPEN_BRACKET'; }
"}"					{ return 'CLOSE_BRACKET'; }
"["					{ return 'LA'; }
"]"					{ return 'RA'; }
int 				{ return 'INT_TYPE'; }
float 			{ return 'FLOAT_TYPE'; }
char 				{ return 'CHAR_TYPE'; }
bool 				{ return 'BOOL_TYPE'; }
if 					{ return 'IF'; }
else				{ return 'ELSE'; }
","					{ return 'COMMA'; }
"."					{ return 'POINT'; }
";"					{ return 'SEMICOLON'; }
":"					{ return 'COLON'; }
"="					{ return 'EQUAL'; }
void				{ return 'VOID'; }
vars				{ return 'VARS'; }
read				{ return 'READ'; }
write				{ return 'WRITE'; }
main				{ return 'MAIN'; }
function		{ return 'FUNCTION'; }
return			{ return 'RETURN'; }
while				{ return 'WHILE'; }
for					{ return 'FOR'; }
to					{ return 'TO'; }
do					{ return 'DO'; }
program			{ return 'PROGRAM'; }
class				{ return 'CLASS'; }
inherits    { return 'INHERITS'; }

[0-9]+\.[0-9]+ 		  			{ return 'FLOAT'; }
[0-9]+            				{ return 'INT'; }
(true|false)							{ return 'BOOLEAN'; }
[A-Za-z_][A-Za-z0-9_]*		{ return 'ID'; }
\'([A-Za-z]|[0-9])\'			{ return 'CHAR'; }
\".*\"				      			{ return 'STRING'; }
[\n]           		 			 	{ }
.                	  			{ }

/lex

/* operator associations and precedence */

%start init

%% /* language grammar */

init: 
	program { 
		// const directory = yy.semantics.removePreviousDirectories(yy.semantics.main)
		// console.log(JSON.stringify(directory));
		console.log(yy.semantics.quadruples.intermediateCode)
		// console.log(yy.semantics.quadruples.operationsStack)
    console.log(`Succesfully compiled with ${this._$.last_line} lines of code`)
  }
	;

programid: 
	PROGRAM ID {
		yy.semantics.addVar({
			id: $2, 
			type: yy.semantics.genericTypes.PROGRAM,
			addNextLevel: true
		})
	}
	;

program:
	programid SEMICOLON decclasses decvar modules body
	;

inheritance:
	INHERITS ID {
		yy.semantics.validateId({
			id: $2, 
			expectedType: yy.semantics.genericTypes.CLASS,
		})
	}
	| {}
	;

classid: 
	CLASS ID {
		yy.semantics.addVar({
			id: $2, 
			type: yy.semantics.genericTypes.CLASS,
			addNextLevel: true
		})
	}
	;

closeblock:
	CLOSE_BRACKET {
		yy.semantics.backDirectory()
	}
	;

decclasses:
	classid inheritance OPEN_BRACKET decvar modules closeblock decclasses
	| {}
	;

inttype: 
	INT_TYPE {
		yy.semantics.currentType = yy.semantics.genericTypes.INT
	}
	;

floattype: 
	FLOAT_TYPE {
		yy.semantics.currentType = yy.semantics.genericTypes.FLOAT
	}
	;

chartype: 
	CHAR_TYPE {
		yy.semantics.currentType = yy.semantics.genericTypes.CHAR
	}
	;

booleantype: 
	BOOL_TYPE {
		yy.semantics.currentType = yy.semantics.genericTypes.BOOLEAN
	}
	;

classtype: 
	ID {
		yy.semantics.currentType = $1
	}
	;

type: 
	inttype
	| floattype
	| chartype
	| booleantype
	| classtype
	;

list_ids_aux:
	COMMA list_id list_ids_aux
	| dimensions list_id list_ids_aux
	| dimensions
	;

list_id:
	ID {
		yy.semantics.pushToPendingVars({ name: $1 })
	}
	;

list_ids: 
	list_id list_ids_aux
	;

dimension:
	LA expression RA {
		yy.semantics.addDimensionToLastPendingVar()
	}
	;

dimensions:
	dimension dimensions
	| {}
	;

decvar_aux: 
	list_ids COLON type SEMICOLON
	| {}
	;

closedecvar: 
	COLON type SEMICOLON {
		yy.semantics.addPendingVars({ type: $2 })
	}
	;

decvar:
	VARS list_ids closedecvar decvar
	| {}
	;

voidtype: 
	VOID {
		yy.semantics.currentType = yy.semantics.genericTypes.VOID
	}
	;

return_type:
	type 
	| voidtype
	;

param_dec: 
	ID COLON type {
		yy.semantics.addVar({
			id: $1,
			type: $3
		})
	}
	;

params:
	param_dec COMMA params
	| param_dec
	| {}
	;

module_dec:
	return_type FUNCTION ID {
		yy.semantics.addFunction({ 
			id: $3
		})
	}
	;

module_header: 
	 module_dec OPEN_PARENTHESIS params CLOSE_PARENTHESIS SEMICOLON decvar
	;

modules: 
	module_header OPEN_BRACKET statements closeblock modules
	| module_header OPEN_BRACKET closeblock modules
	| {}
	;

body: 
	MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_BRACKET statements CLOSE_BRACKET
	| MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_BRACKET CLOSE_BRACKET
	| {}
	;

dimension_check:
	LA expression RA {
		yy.semantics.addDimensionToCheck();
	}
	;

dimensions_check:
	dimension_check dimensions_check
	| {}
	;

var_usage: 
	ID {
		yy.semantics.setCurrentVariable({ id: $1 });
	}
	;

point: 
	POINT {
		yy.semantics.searchForSubvariable();
	}
	;

var_aux:
	point var_usage var_aux
	| {}
	;

var: 
	var_usage var_aux dimensions_check {
		yy.semantics.quadruples.pushToOperationsStack({ 
			value: yy.semantics.getCurrentVariable().name, 
			type: yy.semantics.getCurrentVariable().type
		});
		yy.semantics.resetCurrentVariable();
	}
	;

statements_aux:
	statements 
	| {}
	;

statements:
	assign SEMICOLON statements_aux
	| call SEMICOLON statements_aux
	| return SEMICOLON statements_aux
	| read SEMICOLON statements_aux
	| write SEMICOLON statements_aux
	| condition statements_aux
	| while statements_aux
	| for statements_aux
	;

equal:
	EQUAL {
		yy.semantics.quadruples.operatorsStack.push($1)
	}
	;

assign:
	var equal expression {
		yy.semantics.quadruples.checkOperation({ priority: -2 });
	}
	;
	
call_aux:
	expression COMMA call_aux
	| expression
	| {}
	;

call:
	var OPEN_PARENTHESIS call_aux CLOSE_PARENTHESIS
	;

return:
	RETURN OPEN_PARENTHESIS expression CLOSE_PARENTHESIS
	;

read_op:
	READ {
		yy.semantics.quadruples.operatorsStack.push($1);
	}
	;

read:
	read_op OPEN_PARENTHESIS var CLOSE_PARENTHESIS {
		yy.semantics.quadruples.checkOperation({ priority: -3 });
	}
	;

output_aux:
	expression COMMA
	| expression
	| {}
	;

writable:
	STRING {
		yy.semantics.quadruples.pushToOperationsStack({
			value: $1,
			type: 'string'
		})
	}
	| expression
	;

write_op:
	WRITE {
		yy.semantics.quadruples.operatorsStack.push($1);
	}
	;

write:
	write_op OPEN_PARENTHESIS writable CLOSE_PARENTHESIS {
		yy.semantics.quadruples.checkOperation({ priority: -3 });
	}
	;

condition_header:
	IF OPEN_PARENTHESIS expression CLOSE_PARENTHESIS {
		yy.semantics.quadruples.operatorsStack.push('gotof');
		yy.semantics.quadruples.checkOperation({ priority: -3 });
	}
	;

condition_body:
	OPEN_BRACKET statements CLOSE_BRACKET
	| OPEN_BRACKET CLOSE_BRACKET
	;

else: 
	ELSE {
		yy.semantics.quadruples.operatorsStack.push('goto');
		yy.semantics.quadruples.checkOperation({ priority: -3 });
	}
	;

condition:
	condition_header condition_body else condition_body {
		yy.semantics.quadruples.fillPendingJump();
	}
	| condition_header condition_body {
		yy.semantics.quadruples.fillPendingJump();
	}
	;

while_header: 
	WHILE OPEN_PARENTHESIS expression CLOSE_PARENTHESIS DO OPEN_BRACKET
	;

while:
	while_header statements CLOSE_BRACKET
	| while_header CLOSE_BRACKET
	;

for_aux:
	statements CLOSE_BRACKET
	| CLOSE_BRACKET
	;

for:
	FOR var EQUAL expression TO expression DO OPEN_BRACKET for_aux
	;

factor_open_parenthesis:
	OPEN_PARENTHESIS {
		yy.semantics.quadruples.operatorsStack.push($1) // Add fake bottom
	}
	;
	
factor_close_parenthesis:
	CLOSE_PARENTHESIS {
		yy.semantics.quadruples.operatorsStack.pop(); // Remove fake bottom
	}
	;

not: 
	NOT {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 });
	}
	;

int: 
	INT {
		yy.semantics.quadruples.pushToOperationsStack({ 
			value: $1, 
			type: yy.semantics.quadruples.types.INT 
		})
	}
	;

float:
	FLOAT {
		yy.semantics.quadruples.pushToOperationsStack({ 
			value: $1, 
			type: yy.semantics.quadruples.types.FLOAT 
		})
	}
	;

char: 
	CHAR {
		yy.semantics.quadruples.pushToOperationsStack({ 
			value: $1, 
			type: yy.semantics.quadruples.types.CHAR 
		})
	}
	;

boolean: 
	BOOLEAN {
		yy.semantics.quadruples.pushToOperationsStack({ 
			value: $1, 
			type: yy.semantics.quadruples.types.BOOLEAN 
		})
	}
	;

factor:
	var
	| not var {
		yy.semantics.quadruples.checkOperation({ priority: -1 });
	}
	| call
	| int
	| float
	| char
	| not boolean {
		yy.semantics.quadruples.checkOperation({ priority: -1 });
	}
	| boolean
	| not factor_open_parenthesis expression factor_close_parenthesis {
		yy.semantics.quadruples.checkOperation({ priority: -1 });
	}
	| factor_open_parenthesis expression factor_close_parenthesis
	;

mult: 
	MULT {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

div: 
	DIV {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

term_aux:
	mult term
	| div term
	| {}
	;

factor_check: 
	factor {
		yy.semantics.quadruples.checkOperation({ priority: 1 });
	}
	;

term: 
	factor_check term_aux
	;

plus: 
	PLUS {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

minus: 
	MINUS {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

sum_expression_aux:
	plus sum_expression
	| minus sum_expression
	| {}
	;

term_check:
	term {
		yy.semantics.quadruples.checkOperation({ priority: 2 });
	}
	;

sum_expression:
	term_check sum_expression_aux
	;

lt: 
	LT {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

gt: 
	GT {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

lte: 
	LTE {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

GTE: 
	GTE {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

not_equal: 
	NOT_EQUAL {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

equal_equal: 
	EQUAL_EQUAL {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

expression_comp_aux:
	lt expression_comp
	| lte expression_comp
	| gt expression_comp
	| gte expression_comp
	| not_equal expression_comp
	| equal_equal expression_comp
	| {}
	;

sum_expression_check: 
	sum_expression {
		yy.semantics.quadruples.checkOperation({ priority: 3 });
	}
	;

expression_comp:
	sum_expression_check expression_comp_aux
	;

and: 
	AND {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

or: 
	OR {
		yy.semantics.quadruples.pushToOperatorsStack({ operator: $1 })
	}
	;

expression_comp_check: 
	expression_comp {
		yy.semantics.quadruples.checkOperation({ priority: 4 });
	}
	;

bool_aux:
	and expression
	| or expression
	| {}
	;

expression:
	expression_comp_check bool_aux
	;
