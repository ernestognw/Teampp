# Team++

A javascript object oriented and highly typed programming language for beginners

## Requirements

Regardless if you're a compiler developer or only using Team++, you should need the following requirements in order to get things to work properly:

- NodeJS > 12

## Getting Started 🚀

Just go to our [Release page](https://github.com/ernestognw/Teampp/releases), download the attached `index.js` and use it via command line with your `.tpp` program like this:

```
node index.js path/to/your/program.tpp
```

An example of a simple program using Team++:

```
program teampp_test; 

vars a, b : int;

main(){
  write("Hello world!");
  read(a);
  read(b);
  write("The sum of a + b is: ");
  write(a + b);
}

```

You'll see an output showing the operations that the Team++ virtual machine performs along with the result like this:
```
┌─────────┬────┬───────┬───────┬───────┐
│ (index) │ 0  │   1   │   2   │   3   │
├─────────┼────┼───────┼───────┼───────┤
│    0    │ 17 │   1   │ null  │ null  │
│    1    │ 16 │ 25000 │ null  │ null  │
│    2    │ 15 │ 30000 │ null  │ null  │
│    3    │ 15 │ 30001 │ null  │ null  │
│    4    │ 16 │ 25001 │ null  │ null  │
│    5    │ 1  │ 30000 │ 30001 │ 90000 │
│    6    │ 16 │ 90000 │ null  │ null  │
└─────────┴────┴───────┴───────┴───────┘
Succesfully compiled with 11 lines of code
Hello world!
3
4
The sum of a + b is: 
7
```

In case you want to contribute to Team++, look at [**Installation**](#development) to know how to setup the entire project and start adding some capabilities.

## Installation 🔧

Once you've cloned the repo, you have to install Node dependencies so you can start testing the compiler

Just do

```
npm install
# or
yarn
```

Once you're set, you can start changing the functionality of the compiler and test it immediately similarly to how you'd run a normal `.tpp` program, but like this:

```
npm run test path/to/your/program.tpp
# or
yarn test path/to/your/program.tpp
```

Once you're done, you can build an executable file with webpack bundler. Check out [Build](#build) section

## Build ⚙️

To build the compiler and generate a new executable bundle, just:

```
npm run build
# or
yarn build
```

It'll create a new folder called `dist` with a single `index.js` file that you can further distribute

## Built with 🛠️

The whole project was built on top of:

* [Jison](http://zaa.ch/jison/) - The most popular Bison-like javascript parser generator

## Authors ✒️

This project was developed for the Compilers course at Monterrey Institute of Technology and Higher Education by:

* **Ernesto García** - [ernestognw](https://github.com/ernestognw)
* **Daniel Castro** - [dcastro0803](https://github.com/dcastro0803)

## License 📄

The MIT License (MIT)

Copyright (c) 2021 Ernesto García, Daniel Castro

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Was this helpful? 🎁

We know you're probably watching this as a guide for future compiler course projects. If you think this is a great example and want to invite us to hangout or have some beers, feel free to do so :)

Some things you can do to help other students

* Share or comment about this project 📢
* Buy a beer 🍺 or a coffe ☕ to someone of the team
* Publicly share and thank us 🤓.



---
⌨️ with ❤️ by [ernestognw](https://github.com/ernestognw) and [dcastro0803](https://github.com/dcastro0803) 😊
