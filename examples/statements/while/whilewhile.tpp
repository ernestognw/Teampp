program condition_test; 

vars a, b, c, e : int;

main(){
  a = b + c;

	while(a > b * c) do {
    a = b - c;
    b = b + e;
    while (a > b * c) do {
      a = b - c;
      b = b + e;
    } 
  } 

  c = a + b;
}
