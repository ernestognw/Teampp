program object_test; 

class Person {
  vars age : int;

  void function greet();
  {
    write("Hello");
  }
}

vars person, person2 : Person;

main(){
  person.age = 10;
  person2.age = 20;
  write(person.age);
  person.greet();
  write(person2.age);
}
