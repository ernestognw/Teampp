program expression_test; 

vars a, b, c, d, e, f, g, h, i, j, k, l : int;
vars result : boolean;

main(){
	a = 1;
	b = 2;
	c = 3;
	d = 4;
	e = 5;
	f = 6;
	g = 7;
	h = 8;
	i = 10;
	j = 11;
	k = 12;
	l = 13;

	result = ((a * b - c * d) > c + d * e / f) && (g * h - j > l - a) && b + c > d * f;

	write(result);
}
