program condition_test; 

vars cache[50] : int;
vars cached[50] : boolean;
vars x, n, i : int;

int function fibonacciCached(number : int);
vars a, b, c, d : int;
{   
    if(cached[number]) {
      return(cache[number]);
    }

    if(number <= 1){
      cache[number] = number;
      cached[number] = true;
      return(number);
    }

    c = number - 1;
    d = number - 2;

    a = fibonacciCached(c);
    b = fibonacciCached(d);

    cache[c] = a;
    cached[c] = true;

    cache[d] = b;
    cached[d] = true;

    return(a + b);
}

main(){
  write("Escribe tu numero: ");
  read(n);
  x = fibonacciCached(n);

  write("Cache: ");
  for(i = 0; i < n; i = i + 1) {
    write(cache[i - 1]);
  }

  write("Result: ");
  write(x);
}
