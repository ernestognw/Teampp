program condition_test; 

vars a, b : boolean;

main(){
  read(a);

	if(a) {
    write("If passed");
  } else {
    write("Else passed");
    read(b);
    if(b) {
      write("Else if passed");
    }
  }

  write("Write anyway");
}
