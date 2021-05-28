/* lexical grammar */
%lex

%{
	if(!yy.started) {
		yy.started = true

		const Memory = require('../../classes/memory.js');
		const Semantics = require('../../classes/semantics.js');
		const VirtualMachine = require('../../classes/virtual-machine.js');

    yy.memory = new Memory();
		yy.virtualMachine = new VirtualMachine(yy.memory);
		yy.semantics = new Semantics(this, yy.memory);
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
		// console.log(JSON.stringify(yy.semantics.main));
		console.log(yy.semantics.quadruples.intermediateCode);
    console.log(`Succesfully compiled with ${this._$.last_line} lines of code`);
		yy.virtualMachine.setCode(yy.semantics.quadruples.intermediateCode);
		yy.virtualMachine.exec();
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
			type: $3,
			addToParams: true
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

module_close:
	closeblock {
		yy.semantics.quadruples.pushToOperatorsStack({ operator:yy.semantics.quadruples.operators.ENDFUNC })
		yy.semantics.quadruples.checkOperation({ priority: -3 });
	}
	;

modules: 
	module_header OPEN_BRACKET statements module_close modules
	| module_header OPEN_BRACKET module_close modules
	| {}
	;

main:
	MAIN {
		yy.semantics.quadruples.jumpStack.push(yy.semantics.quadruples.intermediateCode.length);
		yy.semantics.quadruples.jumpStack.push(0);
	}
	;

main_close:
	CLOSE_BRACKET {
		yy.semantics.quadruples.fillPendingJump({ usePop: true });
	}
	;

body: 
	main OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_BRACKET statements main_close
	| main OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_BRACKET main_close 
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

call_expression: 
	expression {
		yy.semantics.validateParam();
		yy.semantics.quadruples.operationsStack.pop();
	}
	;
	
call_aux:
	call_expression COMMA call_aux
	| call_expression
	| {}
	;

var_call:
	var OPEN_PARENTHESIS {
		yy.semantics.advanceToDirectory({ name: $1 });	
		yy.semantics.quadruples.pushToOperationsStack({
			value: yy.semantics.currentDirectory.address,
			type: yy.semantics.currentDirectory.type
		})
		yy.semantics.quadruples.operatorsStack.push(yy.semantics.quadruples.operators.ERA);
		yy.semantics.quadruples.checkOperation({ priority: -3 });
		yy.semantics.quadruples.operationsStack.pop();
	}
	;

call:
	var_call call_aux CLOSE_PARENTHESIS {
		const functionName = yy.semantics.quadruples.getLastOperation().value
		yy.semantics.validateId({ 
			id: functionName, 
			expectFunction: true
		});
		yy.semantics.addGoSub({
			functionName
		});
		yy.semantics.resetParamPointer();
		yy.semantics.backDirectory();
	}
	;

return:
	RETURN OPEN_PARENTHESIS expression CLOSE_PARENTHESIS {
		// yy.semantics.validateReturn({
		// 	func: yy.semantics.currentDirectory,
		// 	returnType: yy.semantics.quadruples.getLastOperation().type
		// })
		yy.semantics.quadruples.pushToOperationsStack({
			value: yy.semantics.quadruples.getLastOperation().value	,
			type: yy.semantics.quadruples.getLastOperation().type
		})
		yy.semantics.quadruples.operatorsStack.push(yy.semantics.quadruples.operators.RETURN);
		yy.semantics.quadruples.checkOperation({ priority: -3 });
		// yy.semantics.quadruples.operationsStack.pop();
	}
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
		const string = $1.substring(1, $1.length - 1);

		// yy.semantics.quadruples.pushToOperationsStack({
		// 	value: string,
		// 	type: yy.semantics.quadruples.types.STRING 
		// });

		yy.semantics.setConstant({ 
			value: string, 
			type: yy.semantics.quadruples.types.STRING 
		});
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

close_parenthesis_gotof:
	CLOSE_PARENTHESIS {
		yy.semantics.quadruples.operatorsStack.push(yy.semantics.quadruples.operators.GOTOF);
		yy.semantics.quadruples.checkOperation({ priority: -3 });
	}
	;

condition_header:
	IF OPEN_PARENTHESIS bool_expression close_parenthesis_gotof
	;

condition_body:
	OPEN_BRACKET statements CLOSE_BRACKET
	| OPEN_BRACKET CLOSE_BRACKET
	;

else: 
	ELSE {
		yy.semantics.quadruples.operatorsStack.push(yy.semantics.quadruples.operators.GOTO);
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

while_start:
	WHILE {
		yy.semantics.quadruples.jumpStack.push(yy.semantics.quadruples.intermediateCode.length);
	}
	;

bool_expression:
	expression {
		yy.semantics.quadruples.validateLastOperation({ 
			expectedType: yy.semantics.quadruples.types.BOOLEAN  
		});
	}
	;

while_condition:
	OPEN_PARENTHESIS bool_expression close_parenthesis_gotof
	;

while_header: 
	while_start while_condition DO OPEN_BRACKET
	;

while_close:
	CLOSE_BRACKET {
		yy.semantics.quadruples.operatorsStack.push(yy.semantics.quadruples.operators.GOTO);
		yy.semantics.quadruples.checkOperation({ priority: -3 });
		yy.semantics.quadruples.fillPendingJump({ usePop: true });
	}
	;

while:
	while_header statements while_close
	| while_header while_close
	;

close_bracket_goto:
	CLOSE_BRACKET {
		yy.semantics.quadruples.operatorsStack.push(yy.semantics.quadruples.operators.GOTO);
		yy.semantics.quadruples.checkOperation({ priority: -3 });
		yy.semantics.quadruples.fillPendingJump({ usePop: true });
	}
	;

for_aux:
	statements close_bracket_goto
	| close_bracket_goto
	;

for_expression:
	expression {
		yy.semantics.quadruples.validateLastOperation({ 
			expectedType: yy.semantics.quadruples.types.BOOLEAN  
		});
		yy.semantics.quadruples.operatorsStack.push(yy.semantics.quadruples.operators.GOTOF);
		yy.semantics.quadruples.checkOperation({ priority: -3 });
	}
	;

for_first_semicolon:
	SEMICOLON {
		yy.semantics.quadruples.jumpStack.push(yy.semantics.quadruples.intermediateCode.length + 1);
	}
	;

for:
	FOR OPEN_PARENTHESIS assign for_first_semicolon for_expression SEMICOLON assign CLOSE_PARENTHESIS OPEN_BRACKET for_aux
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
		yy.semantics.setConstant({ 
			value: Number($1), 
			type: yy.semantics.quadruples.types.INT 
		})
	}
	;

float:
	FLOAT {
		yy.semantics.setConstant({ 
			value: Number($1), 
			type: yy.semantics.quadruples.types.FLOAT 
		})
	}
	;

char: 
	CHAR {
		const char = $1.substring(1, $1.length - 1);

		yy.semantics.setConstant({ 
			value: char, 
			type: yy.semantics.quadruples.types.CHAR 
		})
	}
	;

boolean: 
	BOOLEAN {
		yy.semantics.setConstant({ 
			value: $1 == 'true', 
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
