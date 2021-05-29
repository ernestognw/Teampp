program condition_test; 

vars x, n : int;

int function factorial(number : int);
vars next, res : int;
{   
    write(number);
    if(number <= 1) {
      return(1);
    }

    next = number - 1;

    res = factorial(next);

    return (number * res);
}

main(){
  write("Escribe tu numero: ");
  read(n);
  x = factorial(n);
  write(x);
}
