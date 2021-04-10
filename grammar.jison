/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%%

"+"					{ return 'PLUS'; }
"-"					{ return 'MINUS'; }
"*"					{ return 'TIMES'; }
"/"					{ return 'DIVIDES'; }
"<>"				{ return 'NOT_EQUAL'; }
"<"					{ return 'LT'; }
">"					{ return 'GT'; }
"="					{ return 'EQUAL'; }
"("					{ return 'OPEN_PARENTHESIS'; }
")"					{ return 'CLOSE_PARENTHESIS'; }
"{"					{ return 'OPEN_BRACKET'; }
"}"					{ return 'CLOSE_BRACKET'; }
","					{ return 'COMMA'; }
";"					{ return 'SEMICOLON'; }
":"					{ return 'COLON'; }
if 					{ return 'IF'; }
else				{ return 'ELSE'; }
var					{ return 'VAR'; }
int 				{ return 'INT_TYPE'; }
float 			{ return 'FLOAT_TYPE'; }
print				{ return 'PRINT'; }
program			{ return 'PROGRAM'; }

[0-9]+\.[0-9]+ 		  { return 'FLOAT'; }
[0-9]+            	{ return 'INT'; }
[A-z0-9]+    	      { return 'ID'; }
\".*\"				      { return 'STRING'; }
[\n]           		  { }
.                	  { }

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'

%start program

%% /* language grammar */

program:
	PROGRAM ID SEMICOLON a block { 
    console.log(`Cuack cuack! Succesfully compiled with ${this._$.last_line} lines of code`)
  }
	;

a:
	vars
	| {}
	;

block:
	OPEN_BRACKET b CLOSE_BRACKET
	;

b:
	statement b
	| {}
	;

vars:
	VAR c COLON type SEMICOLON q
	;

c:
	ID d
	;

d:
	COMMA ID d
	| {}
	;

type:
	e
	;

e:
	INT_TYPE
	| FLOAT_TYPE
	;

statement:
	f
	;

f:
	asignment
	| condition
	| writing
	;

asignment:
	ID EQUAL expression SEMICOLON
	;

expression:
	exp g
	;

g:
	GT h
	| LT h
	| NOT_EQUAL h
	| {}
	;

h:
	exp
	;

writing:
	PRINT OPEN_PARENTHESIS i CLOSE_PARENTHESIS SEMICOLON
	;

i:
	expression j
	| STRING j
	;

j:
	COMMA i
	| {}
	;

exp:
	term k
	;

k:
	PLUS term k
	| MINUS term k
	| {}
	;

term:
	factor l
	;

l:
	TIMES factor l
	| DIVIDES factor l
	| {}
	;

condition:
	IF OPEN_PARENTHESIS expression CLOSE_PARENTHESIS block m SEMICOLON
	;

m:
	ELSE block
	| {}
	;

varcte:
	n
	;

n:
	ID
	| INT {}
	| FLOAT {}
	;

factor:
	o
	;

o:
	OPEN_PARENTHESIS expression CLOSE_PARENTHESIS
	| p varcte
	;

p:
	PLUS
	| MINUS
	| {}
	;

q:
	c COLON type SEMICOLON q
	| {}
	;
