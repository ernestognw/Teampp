program condition_test; 

vars a, b, c, d : int;

main(){
	if(a + b > c * d) {
    a = b * c;
  } else {
    b = a - c;
  }

  b = c * a;
}
