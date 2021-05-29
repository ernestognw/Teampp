program condition_test; 

vars x, n : int;

int function factorial(number : int);
{   
    if(number <= 1) {
      return(1);
    }

    return (factorial(number - 1) * number);
}

main(){
  write("Escribe tu numero: ");
  read(n);
  x = factorial(n);
  write(x);
}
