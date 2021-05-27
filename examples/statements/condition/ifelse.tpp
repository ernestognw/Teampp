program condition_test; 

vars a : boolean;

main(){
  read(a);

	if(a) {
    write("If passed");
  } else {
    write("Else passed");
  }

  write("Write anyway");
}
