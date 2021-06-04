program condition_test; 

vars a : int;

int function patito(number : int);
{
  return(number * 3);
}

int function pelos(number : int);
{
  return(patito(number * 2));
}

int function factorial(number : int);
{   
    if(number <= 1) {
      return(1);
    }

    return (factorial(number - 1) * number);
}

main(){
  write(pelos(1));
  write(factorial(pelos(1)));
}
