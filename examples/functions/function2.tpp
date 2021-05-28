program function_test; 

vars d : int;
vars c : float;

float function example(a : int, b : float);
{
    return(a + b);
}

main(){
  write("Escribe c: ");
  read(c);
  write("Escribe d: ");
  read(d);

  write(example(d, c));
  write(example(d, c));
  write(example(d, c));
  write(example(d, c));
  write(example(d, c));
  write(example(d, c));
  write(example(d, c));
  write(example(d, c));
}
