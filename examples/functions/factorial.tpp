program condition_test; 

vars x : int;

int function factorial(number : int);
vars m : int;
{
    if(number < 1) {
      return(1);
    }

    m = factorial(number - 1);

    return (m);
}

main(){
  x = factorial(5);
  write(x);
}
