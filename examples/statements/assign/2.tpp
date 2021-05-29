program assign_test; 

vars a, b : int;
vars c, d : float;
vars e, f : boolean;

main(){
	a = 1;
	b = a;
  a = b + 2;
	c = 18.2332;
	d = a + c;
	d = a * c;
	d = a / c;
	e = false;
	f = !e && d > a;
	write(f);
}
