program array_test; 

vars array[5] : int;
vars a, b, c, d, e : int;

main(){
  a = 0;
  b = 1;
  c = 2;
  d = 3;
  e = 4;

  array[a] = a;
  array[b] = b;
  array[c] = c;
  array[d] = d;
  array[e] = e;

  write(array[a]);
  write(array[b]);
  write(array[c]);
  write(array[d]);
  write(array[e]);
}
