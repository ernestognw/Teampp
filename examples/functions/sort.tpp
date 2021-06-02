program find_test; 

vars i, max, qty : int;
vars array[100] : int;

void function readArray(length : int);
vars i : int;
{
  for(i = 0; i < length; i = i + 1) {
    read(array[i]);
  }
}

void function printArray(length : int);
vars i : int;
{
  for(i = 0; i < length; i = i + 1) {
    write(array[i]);
  }
}

void function swap(x : int, y : int);
vars tmp1, tmp2 : int;
{
  tmp1 = array[x];
  tmp2 = array[y];
  array[y] = tmp1;
  array[x] = tmp2;
}

void function bubbleSort(size : int);
vars i, j, a, b, c, tmp : int;
{   
  for(i = -1; i < size - 1; i = i + 1){
    for(j = -1; j < size - i - 1; j = j + 1){
      c = j + 1;
      a = array[j];
      b = array[c];

      if(a > b){
        swap(j, c);
      }
    }
  }
}

main(){
  max = 100;

  write("¿Cuántos números quieres?: ");
  read(qty);

  if(qty > max) {
    write("Error: El número máximo de números es:");
    write(max);
  } else {
    readArray(qty);
    bubbleSort(qty);
    write("Resultado: ");
    printArray(qty);
  }
}
