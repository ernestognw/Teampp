program condition_test; 

vars a, b, c, d : int;
vars result : boolean;

main(){
	if(a + b > c * d) {
    a = b * c;
  } 

  b = c * a;
}
