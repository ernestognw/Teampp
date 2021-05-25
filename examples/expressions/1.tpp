program expression_test; 

vars a, b, c, d, e, result : int;

main(){
	a = 1;
	b = 2;
	c = 3;
	d = 4;
	e = 4;

	result = a + b * c - d * e;

	write(result);
}
