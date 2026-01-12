const person = {
  name: "Rohit"
};

function introduce(greeting, occupation) {
  console.log(`${greeting}! My name is ${this.name} and I am a ${occupation}.`);
}


// CAll
introduce.call(person, "Hello", "Software Engineer");
// Output: "Hello! My name is Rohit and I am a Software Engineer."

// apply
introduce.apply(person, ["Hi", "Full-stack Developer"]);
// Output: "Hi! My name is Rohit and I am a Full-stack Developer."

//bind
const greetRohit = introduce.bind(person, "Welcome");

// Later in the code...
greetRohit("CTO"); 
// Output: "Welcome! My name is Rohit and I am a CTO."