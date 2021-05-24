program condition_test; 

vars a, b, c, d, i : int;

main(){
  for (i = 0; i < 3 + 5; i = i + 1) {
    a = b - c;
    b = b + d;
  } 

  c = a + b;
}
