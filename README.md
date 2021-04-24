## Proyecto de compiladores en equipo  Languaje Team ++ 

### Semana # 1 "5-11" Diciembre:

* 1 definición de lexico con los tokens 

* 2 definicion de sintaxis con sus diagramas 

* 3 crear el repositorio de github 

### Semana # 2 "12-16" Diciembre:

* 1 Revision de lo anterior como diagramas
* 2 Revision Gramatica
* 3 Agregar Gramatica
* 4 Ajustar Gramatica a Jison
* 5 Tabla de consideraciones semanticas

#### 1 Cambios a diagramas : 

* Diagrama Factor: \(EXP\) a \(Hyper\) 
* Diagrama Termino: remover CTE 
* Diagrama Expresion dividido y renombrado exp suma
* Diagrama Agregado: Factor, ExpresionComp y Expresion
* Diagrama programa: se agrega ; --> < DEC ClASSES> 
* Diagrama Factor: se agrega id --> . --> id 
* Diagrama Factor: se agrega --> dimensiones
* Diagrama Asigna: se agrega de llamada --> ExpresionSuma
* Diagrama LETRERO: se elimina ;

#### 2 Cambios a gramatica: 

* Gramatica PROGRAMA: Agregar mas ramas
* Gramatica DECCLASSES: agregar class id inherits id {MODULES} |  class id {MODULES}
* Gramatica DECVAR:
* Gramatica LISTAIDS:
* Gramatica PARAMS:
* Gramatica ESTATUTO:
* Gramatica ASIGNA:
* Gramatica VARIABLE:
* Gramatica TERMINO:

#### 3 Gramaticas Agregadas: 

* Gramatica EXPRESIONSUMA
* Gramatica FACTOR
* Gramatica EXPRESION

### Semana # 3 "19-23" Diciembre:

* 1 Semantica de Variables: Directorio de Procedimientos
* 2 Semantica de Variables: Directorio de Variables


