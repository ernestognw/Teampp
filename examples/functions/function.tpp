program condition_test; 

vars a : float;
vars b, c, d : int;

int function example(a : int, c : float, x : int);
  vars any : char;
  vars y : char;
{
    write(any);
    write(y);
    write(x);
    a = b * a + c / d;
    return(a);
}

main(){
  a = 0.12;
  b = 3;
  c = 10;
  a = a + b;

  write(example(c, a, 1 + 4));

  b = c * a;
}
