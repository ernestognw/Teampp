program expression_test; 

vars a, b, c, d, f, g, result : int;

main(){
	a = 1;
	b = 2;
	c = 3;
	d = 4;
	f = 5;
	g = 6;

	result = a + (b * c - d) * f + g;

	write(result);
}
