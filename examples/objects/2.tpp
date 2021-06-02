program object_test; 

class Person {
  vars age : int;

  void function greet();
  vars a : int;
  {
    a = 987;
    write("Hello inside");
    write(a);
  }
}

vars person : Person;
vars a, b, c, d : int;

void function greet();
vars a : int;
{
  a = 432;
  write("Hello outside");
  write(a);
}

main(){
  a = 1;
  b = 2;
  c = 3;
  d = 4;

  person.age = 10;
  write(person.age);
  greet();
  person.greet();
  
  write(a);
  write(b);
  write(c);
  write(d);
}
