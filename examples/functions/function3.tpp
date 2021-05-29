program function_test; 

vars d : int;
vars c : float;

float function zero(a : int, b : float);
{
    return(a + b);
}

float function uno(a : int, b : float);
{
    return(zero(a, b));
}

float function dos(a : int, b : float);
vars res : float;
{
    res = uno(a, b);
    return(res);
}

main(){
  write("Escribe c: ");
  read(c);
  write("Escribe d: ");
  read(d);

  write(dos(d, c));
}
