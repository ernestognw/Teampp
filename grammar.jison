/* lexical grammar */
%lex

%%
[\s+]               {  }           	
"/"					{ return 'DIV'; }
"*"					{ return 'MULT'; }
"+"					{ return 'SUM'; }
"-"					{ return 'SUB'; }
"!="				{ return 'NOT_EQUAL'; }
"=="				{ return 'EQUAL_EQUAL'; }
">="				{ return 'GTE'; }
"<="				{ return 'LTE'; }
">"					{ return 'GT'; }
"<"					{ return 'LT'; }
">"					{ return 'GT'; }
"<"					{ return 'LT'; }
"&&"				{ return 'AND'; }
"||"				{ return 'OR'; }
"!"					{ return 'NOT'; }
"("					{ return 'LP'; }
")"					{ return 'RP'; }
"{"					{ return 'LB'; }
"}"					{ return 'RB'; }
"["					{ return 'LA'; }
"]"					{ return 'RA'; }
int 				{ return 'INT_TYPE'; }
float 			{ return 'FLOAT_TYPE'; }
char 				{ return 'CHAR_TYPE'; }
if 					{ return 'IF'; }
else				{ return 'ELSE'; }
","					{ return 'COMMA'; }
"."					{ return 'POINT'; }
";"					{ return 'SEMICOLON'; }
":"					{ return 'COLON'; }
"="					{ return 'EQUAL'; }
void				{ return 'VOID'; }
vars				{ return 'VARS'; }
print				{ return 'PRINT'; }
read				{ return 'READ'; }
write				{ return 'WRITE'; }
main				{ return 'MAIN'; }
function		{ return 'FUNCTION'; }
return			{ return 'RETURN'; }
while				{ return 'WHILE'; }
for					{ return 'FOR'; }
program			{ return 'PROGRAM'; }
class				{ return 'CLASS'; }
inherits    { return 'INHERITS'; }

[0-9]+\.[0-9]+ 		  { return 'FLOAT'; }
[0-9]+            	{ return 'INT'; }
[A-z0-9]+    	      { return 'ID'; }
\".*\"				      { return 'STRING'; }
[\n]           		  { }
.                	  { }

/lex

/* operator associations and precedence */

%start init

%% /* language grammar */

init: 
	program { 
    console.log(`Succesfully compiled with ${this._$.last_line} lines of code`)
  }
	;

program_header: 
	PROGRAM ID SEMICOLON
	;

program:
	program_header body
	| program_header decclasses decvar modules body
	| program_header decclasses decvar body
	| program_header decclasses modules body
	| program_header decclasses body
	| program_header decvar body
	| program_header modules body
	;

decclasses_header:
	CLASS ID
	;

decclasses_inherits:
	INHERITS ID
	;

decclasses_body: 
	decvar modules
	| modules
	| {}
	;

decclasses:
	decclasses_header decclasses_inherits LB decclasses_body RB
	| decclasses_header LB decclasses_body RB
	;

type: 
	INT_TYPE
	| FLOAT_TYPE
	| CHAR_TYPE
	| ID
	;

lista_ids_aux:
	COMMA ID lista_ids_aux
	| dimensions ID lista_ids_aux
	| dimensions
	| {}
	;

lista_ids: 
	ID lista_ids_aux
	;

dimensions:
	LA expression RA
	| LA expression COMMA expression RA
	;

decvar_aux: 
	lista_ids COLON type SEMICOLON
	| {}
	;

decvar:
	VARS lista_ids COLON type SEMICOLON decvar_aux
	;

return_type:
	type 
	| VOID
	;

params:
	type ID COMMA params
	| type ID
	| {}
	;

modules: 
	return_type FUNCTION ID LP params RP SEMICOLON decvar LB statements RB
	;

body: 
	MAIN LP RP LB statements RB
	;

var: 
	ID POINT ID dimensions
	| ID POINT ID
	| ID dimensions
	| ID
	;

statements:
	assign
	| call
	| return
	| read
	| write
	| condition
	| while
	| for
	| expression
	| statements
	| {}
	;

assign:
	var EQUAL expression SEMICOLON
	| var EQUAL call sum_expression SEMICOLON
	| var EQUAL call SEMICOLON
	;
	
call_aux:
	expression COMMA
	| expression
	| {}
	;

call:
	ID POINT ID LP call_aux RP SEMICOLON
	ID LP call_aux RP SEMICOLON
	;

return:
	RETURN LP expression RP
	;

input_output_aux:
	var COMMA
	| var
	| {}
	;

read:
	READ LP input_output_aux RP
	;

writable:
	expression
	| STRING
	;

write:
	WRITE LP input_output_aux RP
	;

condition:
	IF LP expression RP LB statements RB ELSE LB statements RB
	| IF LP expression RP LB statements RB
	;

while:
	WHILE LP expression RP do LB statements RB
	;

for_aux:
	expression TO expression do LB statements RB
	;

for:
	FOR ID dimensions for_aux
	| FOR ID for_aux
	;

factor:
	ID dimensions
	| ID POINT ID
	| ID
	| LP expression RP
	;

term: 
	factor MULT
  | factor DIV
	| factor
	;

sum_expression:
	term SUM
	| term SUB
	| term
	;

expression_comp_aux:
	LT sum_expression
	| LTE sum_expression
	| GT sum_expression
	| GTE sum_expression
	| NOT_EQUAL sum_expression
	| EQUAL_EQUAL sum_expression
	| {}
	;

expression_comp:
	sum_expression expression_comp_aux
	;

bool_aux:
	AND
	| OR
	| {}
	;

expression:
	expression_comp bool_aux
	;
