program object_test; 

class Person {
  vars age : int;

  void function greet();
  {
    write("Hello");
  }
}

vars person : Person;

main(){
  person.age = 10;
  write(person.age);
  person.greet();
}
