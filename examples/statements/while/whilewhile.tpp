program condition_test; 

vars a, b : int;

main(){
  a = 0;
  b = 0;

	while(a < 10) do {
    write(a);
    a = a + 1;
    while(b < 10) do {
      write(b);
      b = b + 1;
    }
    b = 0;
  } 

  write("Finished");
}
