program condition_test; 

vars x, n : int;

int function factorial(number : int);
vars result, i : int;
{   
    result = 1;

    for(i = 1; i < number; i = i + 1) {
      result = result * i;
    }

    return (result);
}

main(){
  write("Escribe tu numero: ");
  read(n);
  x = factorial(n);
  write(x);
}
