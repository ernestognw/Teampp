program condition_test; 

vars i : int;

main(){
  for (i = 0; i < 3 + 5; i = i + 1) {
    write(i);
  } 

  write("Finished");
}
