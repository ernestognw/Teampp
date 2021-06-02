program condition_test; 

vars cache[1000] : int;
vars cached[1000] : boolean;
vars x, n : int;

int function fibonacciCached(number : int);
vars a, b, c, d : int;
{   
    if(number <= 1) {
      return(number);
    }

    c = number - 1;
    d = number - 2;

    if(cached[c]){
      a = cache[c];
    } else {
      a = fibonacciCached(c);
      cache[c] = a;
      cached[c] = true;
    }

    if(cached[d]){
      b = cache[d];
    } else {
      b = fibonacciCached(d);
      cache[d] = b;
      cached[d] = true;
    }

    return (a + b);
}

main(){
  write("Escribe tu numero: ");
  read(n);
  x = fibonacciCached(n);
  write(x);
}
