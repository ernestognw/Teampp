/* lexical grammar */
%lex

%%
[\s+]       {  }           	
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
"("					{ return 'OPEN_PARENTHESIS'; }
")"					{ return 'CLOSING_PARENTHESIS'; }
"{"					{ return 'OPEN_BRACKET'; }
"}"					{ return 'CLOSING_BRACKET'; }
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
([A-Za-z]|[0-9])		{ return 'CHAR'; }
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

program:
	PROGRAM ID SEMICOLON decclasses decvar modules body
	;

inheritance:
	INHERITS ID
	| {}
	;

decclasses:
	CLASS ID inheritance OPEN_BRACKET decvar modules CLOSING_BRACKET
	| {}
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
	;

lista_ids: 
	ID lista_ids_aux
	;

dimensions:
	LA expression RA
	| LA expression COMMA expression RA
	| {}
	;

decvar_aux: 
	lista_ids COLON type SEMICOLON
	| {}
	;

decvar:
	VARS lista_ids COLON type SEMICOLON decvar
	| {}
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
	return_type FUNCTION ID OPEN_PARENTHESIS params CLOSING_PARENTHESIS SEMICOLON decvar OPEN_BRACKET statements CLOSING_BRACKET
	| return_type FUNCTION ID OPEN_PARENTHESIS params CLOSING_PARENTHESIS SEMICOLON decvar OPEN_BRACKET CLOSING_BRACKET
	| {}
	;

body: 
	MAIN OPEN_PARENTHESIS CLOSING_PARENTHESIS OPEN_BRACKET statements CLOSING_BRACKET
	| MAIN OPEN_PARENTHESIS CLOSING_PARENTHESIS OPEN_BRACKET CLOSING_BRACKET
	| {}
	;

var_aux:
	POINT ID var_aux
	| {}
	;

var: 
	ID var_aux dimensions
	;

statements_aux:
	statements 
	| {}
	;

statements:
	assign statements_aux
	| call statements_aux
	| return statements_aux
	| read statements_aux
	| write statements_aux
	| condition statements_aux
	| while statements_aux
	| for statements_aux
	;

assign:
	var EQUAL expression SEMICOLON
	;
	
call_aux:
	expression COMMA call_aux
	| expression
	| {}
	;

call:
	var OPEN_PARENTHESIS call_aux CLOSING_PARENTHESIS SEMICOLON
	;

return:
	RETURN OPEN_PARENTHESIS expression CLOSING_PARENTHESIS SEMICOLON
	;

input_output_aux:
	var COMMA
	| var
	| {}
	;

read:
	READ OPEN_PARENTHESIS input_output_aux CLOSING_PARENTHESIS SEMICOLON
	;

writable:
	expression
	| STRING
	;

write:
	WRITE OPEN_PARENTHESIS input_output_aux CLOSING_PARENTHESIS SEMICOLON
	;

condition:
	IF OPEN_PARENTHESIS expression CLOSING_PARENTHESIS OPEN_BRACKET statements CLOSING_BRACKET ELSE OPEN_BRACKET statements CLOSING_BRACKET
	| IF OPEN_PARENTHESIS expression CLOSING_PARENTHESIS OPEN_BRACKET statements CLOSING_BRACKET ELSE OPEN_BRACKET CLOSING_BRACKET
	| IF OPEN_PARENTHESIS expression CLOSING_PARENTHESIS OPEN_BRACKET statements CLOSING_BRACKET
	| IF OPEN_PARENTHESIS expression CLOSING_PARENTHESIS OPEN_BRACKET CLOSING_BRACKET ELSE OPEN_BRACKET statements CLOSING_BRACKET
	| IF OPEN_PARENTHESIS expression CLOSING_PARENTHESIS OPEN_BRACKET CLOSING_BRACKET ELSE OPEN_BRACKET CLOSING_BRACKET
	;

while:
	WHILE OPEN_PARENTHESIS expression CLOSING_PARENTHESIS do OPEN_BRACKET statements CLOSING_BRACKET
	| WHILE OPEN_PARENTHESIS expression CLOSING_PARENTHESIS do OPEN_BRACKET CLOSING_BRACKET
	;

for_aux:
	expression TO expression do OPEN_BRACKET statements CLOSING_BRACKET
	| expression TO expression do OPEN_BRACKET CLOSING_BRACKET
	;

for:
	FOR ID dimensions for_aux
	;

factor:
	var
	| call
	| INT
	| FLOAT
	| CHAR
	| STRING
	| OPEN_PARENTHESIS expression CLOSING_PARENTHESIS
	;

term_aux:
	MULT term
	| DIV term
	| {}
	;

term: 
	factor term_aux
	;

sum_expression_aux:
	SUM sum_expression
	| SUB sum_expression
	| {}
	;

sum_expression:
	term sum_expression_aux
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
	AND expression_comp
	| OR expression_comp
	| {}
	;

expression:
	expression_comp bool_aux
	;

expression_epsilon:
	expression SEMICOLON
	| {}
	;
