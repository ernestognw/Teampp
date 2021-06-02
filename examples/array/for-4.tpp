program array_test; 

vars a[2][4][5][10] : int;
vars one, two, three, four, i, j, k, l : int;

main(){
  one = 2;
  two = 4;
  three = 5;
  four = 10;

  for (i = 0; i < one; i = i + 1) {
    for (j = 0; j < two; j = j + 1) {
      for (k = 0; k < three; k = k + 1) {
        for (l = 0; l < four; l = l + 1) {
          a[i - 1][j - 1][k - 1][l - 1] = ((i - 1) * two * three * four) + ((j - 1) * three * four) + ((k - 1) * four) + (l - 1);
        }
      }
    }
  }
  
  for (i = 0; i < one; i = i + 1) {
    for (j = 0; j < two; j = j + 1) {
      for (k = 0; k < three; k = k + 1) {
        for (l = 0; l < four; l = l + 1) {
          write(a[i - 1][j - 1][k - 1][l - 1]);
        }
      }
    }
  }
}
