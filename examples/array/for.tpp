program array_test; 

vars a[2][4][5] : int;
vars one, two, three, i, j, k, l : int;

main(){
  one = 2;
  two = 4;
  three = 5;

  for (i = 0; i < one; i = i + 1) {
    for (j = 0; j < two; j = j + 1) {
      for (k = 0; k < three; k = k + 1) {
        l = ((i - 1) * two * three) + ((j - 1) * three) + (k - 1);
        a[i - 1][j - 1][k - 1] = l;
      }
    }
  }
  
  for (i = 0; i < one; i = i + 1) {
    for (j = 0; j < two; j = j + 1) {
      for (k = 0; k < three; k = k + 1) {
        write(a[i - 1][j - 1][k - 1]);
      }
    }
  }
}
