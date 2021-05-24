program condition_test; 

vars a : float;
vars b, c : int;

int function example(a : int, b : float);
{
    a = b * a;
    return(a);
}

main(){
  a = a + b;

  example(c, a);

  b = c * a;
}
