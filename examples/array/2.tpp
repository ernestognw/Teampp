program array_test; 

vars x[2][5] : int;

main(){
  x[0][0] = 0;
  x[0][1] = 1;
  x[0][2] = 2;
  x[0][3] = 3;
  x[0][4] = 4;
  x[1][0] = 5;
  x[1][1] = 6;
  x[1][2] = 7;
  x[1][3] = 8;
  x[1][4] = 9;
 
  write(x[0][0]);
  write(x[0][1]);
  write(x[0][2]);
  write(x[0][3]);
  write(x[0][4]);
  write(x[1][0]);
  write(x[1][1]);
  write(x[1][2]);
  write(x[1][3]);
  write(x[1][4]);
}
