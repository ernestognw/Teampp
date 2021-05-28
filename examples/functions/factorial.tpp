program condition_test; 

vars x, count : int;

int function factorial(number : int);
vars next : int;
{
    write(number);

    if(count > 0) {
      read(next);
    }
    
    if(number < 1) {
      return(1);
    }

    count = count + 1;

    next = number - 1;

    return (factorial(next));
}

main(){
  count = 0;
  x = factorial(5);
  write(x);
}
