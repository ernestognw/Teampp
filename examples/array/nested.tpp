program array_test; 

vars array[5] : int;
vars vector[5] : int;

main(){
  vector[0] = 0;
  vector[1] = 1;
  vector[2] = 2;
  vector[3] = 3;
  vector[4] = 4;

  array[vector[0]] = 0;
  array[vector[1]] = 1;
  array[vector[2]] = 2;
  array[vector[3]] = 3;
  array[vector[4]] = 4;

  write(array[0]);
  write(array[1]);
  write(array[2]);
  write(array[3]);
  write(array[4]);
}
