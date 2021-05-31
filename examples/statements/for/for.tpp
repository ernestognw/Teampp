program condition_test; 

vars i : int;

main(){
  for (i = 0; i < 3 + 5 + 1 - 2; i = i + 1) {
    write(i);
  } 

  for (i = 0; i < 10; i = i + 1) {
    write(i);
  } 

  write("Finished");
}
