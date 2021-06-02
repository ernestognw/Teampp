program condition_test; 

vars x, n : int;

int function fibonacci(number : int);
vars a, b : int;
{   
    if(number <= 1) {
      return(number);
    }

    a = fibonacci(number - 1);
    b = fibonacci(number - 2);

    return (a + b);
}

main(){
  write("Escribe tu numero: ");
  read(n);
  x = fibonacci(n);
  write(x);
}
