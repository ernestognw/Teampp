program condition_test; 

vars a : int;

main(){
  a = 0;

	while(a < 10) do {
    write(a);
    a = a + 1;
  } 

  write("Finished");
}
