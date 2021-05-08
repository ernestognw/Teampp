program intensive; 

class Person {
  vars age : int;
  vars name[30] : char;

  int function example(x : int, y : float);
    vars another[100] : char;
    vars example, example2 : char; 
  {
    read(another[3]);
    write(1 / 31 + 14 * 223 < (276 * 22231 + (age / 10)) - 2123 * 1.23);
    return(example);
  }
}

class SpecialPerson inherits Person {
  vars age : int;
  vars name[30][400][100] : char;

  int function example(x : int, y : float);
    vars another[100] : char;
    vars example, example2 : char; 
  {
    read(another[3]);
    age = 10;
    write(1 / 31 + 14 * 223 > 276 * age - 2123 * 1.23);
    write("Hello world");
    return(example);
  }

  boolean function truable();
  {
    return(true);
  }
}

vars one, two, three : int;
vars four, five : float;
vars six : char;
vars seven, eight, nine, ten : boolean;

vars person : Person;
vars specialPerson : SpecialPerson;

int function something();
  vars any : char;
{
  any = 'b';
  return(any);
}

main(){
  one = 2;
  eight = specialPerson.truable();
  seven = 'f';
	person.example();
  specialPerson.name[0][2][3] = 21;
  specialPerson.name[three + 1][2][3] = 21;
  specialPerson.name[three + 1][2][3 + one] = 21;
  specialPerson.name[
    specialPerson.name[
      specialPerson.name[
        3 + specialPerson.name[443 * 123 - 12 * 13][1][13]
      ][1][3]
    ][1][2]
  ][person.age + 2][3 + one] = 79;

  if(seven) {
    person.example();
  } else {
    seven = false;
    if(eight) {
      for one = 10 + 2 to 20 do {}
      for one = 10 + 2 to 20 do {
        three = three + 1;
      }
      while(!ten) do {
        one = one + 1;
        if(one > 10) {
          ten = true;
        }
      }
      while(nine) do {}
    }
  }
  
  for specialPerson.name[0][0][2] = 0 to 100 do {
    person.name[specialPerson.name[0][0][2]] = 0;
  }

  one = person.age();

  while(ten && 10 < (3 + person.age) && specialPerson.truable()) do {
   one = one + 1;
   if(one > 10) {
     ten = true;
   }
  }
}
