/* lexical grammar */
%lex

%{
	if(!yy.started) {
		yy.started = true

		yy.varsDirectory = {};
		yy.currentDirectory = yy;
		yy.genericTypes = {
			PROGRAM: 'program',
			CLASS: 'class',
			INT: 'int',
			FLOAT: 'float',
			CHAR: 'char',
		};
		yy.currentType = '';
		yy.pendingVars = [];
		yy.globalDirectory;

		yy.addToDirectory = ({ 
			id, 
			type,
			addNextLevel = false,
			isGlobal = false
		}) => {
			yy.a++;

			yy.currentDirectory.varsDirectory[id] = {
				name: id,
				type,
				varsDirectory: {}
			}

			if(addNextLevel) {
				yy.prevDirectory = yy.currentDirectory;
				yy.currentDirectory = yy.currentDirectory.varsDirectory[id];
			}
			
			if(isGlobal) {
				if(yy.globalDirectory) throw new Error('Cannot define global directory twice');
				yy.globalDirectory = yy.currentDirectory.varsDirectory;
			}
		}


		yy.getAndValidateFromCurrentDirectory = ({
			id,
			expectedType, 
			line, 
			column
		}) => {
			let toCheck = yy.currentDirectory[id]
			const scope = yy.currentDirectory.name

			if(!toCheck) {
				// Try global scope
				toCheck = yy.globalDirectory[id]
			}

			if(!toCheck) {
				throw new Error(`at line ${line}, column: ${column}. Identifier ${id} not declared in scope: ${scope} or global`)
			}

			if(toCheck?.type !== expectedType) {
				throw new Error(`at line ${line}, column: ${column}. Identifier ${id} is not of type ${expectedType}, but is ${toCheck.type}`)
			}
		}

		yy.pushToPendingVars = ({ name }) => {
			yy.pendingVars.push({ name })
		}

		yy.registerPendingVars = ({ type }) => {
			yy.pendingVars.forEach(({ name }) => {
				yy.addToDirectory({ 
					id: name, 
					type,
				})
			})
			yy.pendingVars = []
		}

		yy.backDirectory = () => {
			yy.currentDirectory = yy.prevDirectory;
		}
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

[0-9]+\.[0-9]+ 		  			{ return 'FLOAT'; }
[0-9]+            				{ return 'INT'; }
[A-Za-z_][A-Za-z0-9_]*		{ return 'ID'; }
([A-Za-z]|[0-9])					{ return 'CHAR'; }
\".*\"				      			{ return 'STRING'; }
[\n]           		 			 	{ }
.                	  			{ }

/lex

/* operator associations and precedence */

%start init

%% /* language grammar */

init: 
	program { 
		console.log(JSON.stringify(yy.varsDirectory));
    console.log(`Succesfully compiled with ${this._$.last_line} lines of code`)
  }
	;

programid: 
	PROGRAM ID {
		yy.addToDirectory({
			id: $2.toString(), 
			type: yy.genericTypes.PROGRAM,
			addNextLevel: true,
			isGlobal: true,
		})
	}
	;

program:
	programid SEMICOLON decclasses decvar modules body
	;

inheritance:
	INHERITS ID {
		yy.getAndValidateFromCurrentDirectory({
			id: $2.toString(), 
			expectedType: yy.genericTypes.CLASS, 
			line: this._$.last_line, 
			column: this._$.last_column
		})
	}
	| {}
	;

classid: 
	CLASS ID {
		yy.addToDirectory({
			id: $2.toString(), 
			type: yy.genericTypes.CLASS,
			addNextLevel: true
		})
	}
	;

closeblock:
	CLOSING_BRACKET {
		yy.backDirectory()
	}
	;

decclasses:
	classid inheritance OPEN_BRACKET decvar modules closeblock decclasses
	| {}
	;

inttype: 
	INT_TYPE {
		yy.currentType = yy.genericTypes.INT
	}
	;

floattype: 
	FLOAT_TYPE {
		yy.currentType = yy.genericTypes.FLOAT
	}
	;

chartype: 
	CHAR_TYPE {
		yy.currentType = yy.genericTypes.CHAR
	}
	;

classtype: 
	ID {
		yy.currentType = $1
	}
	;

type: 
	inttype
	| floattype
	| chartype
	| classtype
	;

list_ids_aux:
	COMMA list_id list_ids_aux
	| dimensions list_id list_ids_aux
	| dimensions
	;

list_id:
	ID {
		yy.pushToPendingVars({ name: $1 })
	}
	;

list_ids: 
	list_id list_ids_aux
	;

dimensions:
	LA expression RA
	| LA expression COMMA expression RA
	| {}
	;

decvar_aux: 
	list_ids COLON type SEMICOLON
	| {}
	;

closedecvar: 
	COLON type SEMICOLON {
		yy.registerPendingVars({ type: $2 })
	}
	;

decvar:
	VARS list_ids closedecvar decvar
	| {}
	;

return_type:
	type 
	| VOID
	;

params:
	ID COLON type COMMA params
	| ID COLON type
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
	expression COMMA
	| expression
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
	PLUS sum_expression
	| MINUS sum_expression
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
