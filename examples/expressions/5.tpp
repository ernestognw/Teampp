program expression_test; 

vars result : boolean;

vars a, c, d, f, g, i, k : int;
vars b, e, h, j : float;

main(){
	a = 1;
	b = 2.1;
	c = 3;
	d = 4;
	e = 5.1;
	f = 6;
	g = 7;
	h = 8.1;
	i = 9;
	j = 10.1;
	k = 11;

	result = (a + b) * c / (d + e) - f * g > h * (i + j) - k;

	write(result);
}
