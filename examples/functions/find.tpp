program find_test; 

vars i, max, qty, search, result : int;
vars array[100] : int;

int function findIndexOf(number : int, length : int);
{   
    for(i = 0; i < length; i = i + 1) {
      if(array[i] == number) {
        return(i - 1);
      }
    }

    return(-1);
}

void function readArray(length : int);
vars i : int;
{
  for(i = 0; i < length; i = i + 1) {
    read(array[i]);
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

    write("¿Qué número quieres buscar?: ");
    read(search);

    result = findIndexOf(search, qty);
    write("El número está en el índice: ");
    write(result);
  }
}
