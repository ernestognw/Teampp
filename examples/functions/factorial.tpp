program condition_test; 

vars x, n : int;

int function factorial(number : int);
vars next : int;
{   
    if(number <= 1) {
      return(1);
    }

    next = number - 1;

    return (number * factorial(next));
}

main(){
  read(n);
  x = factorial(n);
  write(x);
}
