program condition_test; 

vars a : float;
vars b, c, d : int;

int function example(a : int, c : float, x : int);
  vars any : char;
  vars y : char;
{
    any = 'a';
    write(any);
    y = 'b';
    write(y);
    write(x);
    write(b);
    a = b * a + c / d;
    return(a);
}

main(){
  a = 0.12;
  b = 3;
  c = 10;
  d = 13;
  a = a + b;

  a = example(c, a, 10 + 2);

  write(a);

  b = c * a;
}
