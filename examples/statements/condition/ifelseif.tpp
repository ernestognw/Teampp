program condition_test; 

vars a, b, c, d : int;
vars result : boolean;

main(){
	if(a + b > c * d) {
    a = b * c;
  } else {
    if(a + b > c * d)  {
      a = b * c;
    }
    b = a - c;
  }

  b = c * a;
}
