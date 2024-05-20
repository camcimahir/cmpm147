// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // create an instance of the class
  const fillers = {
    protagonist: ["The Emporer", "my child", "THIEF", "Soldier", "Old man", "No One", "Professor", "Chosen One"],
    places: ["Demacia", "The United States of America", "land far far away", "the spirit world", "your dreams", "your past", "your future", "Planet Mars", "the ministry of defense representing our universe"],
    land: ["Demacia", "The United States of America", "land far far away", "the spirit world", "your dreams", "your past", "your future", "Planet Mars", "Santa Cruz", "The Universe", "The World", "UCSC", "your friend"],
    quest: ["save the slugs", "defeat the dark lord", "break the curse", "Fix the housing prices", "restore peace", "graduate college", "convince my father", "find the legendary treasure", "find the last airbender"],
    reward: ["1000 dollars", "trip to Six Flags", "2012 Honda Civic", "riches beyond imgination", "eternal youth", "ultimate knowledge", "unlimited wishes", "free housing in Santa Cruz for a year", "the heart's deepest desire"],
  };
  
  const template = `Hello there, $protagonist!
  
  I come from $places. There are huge catastrophes awaiting $land, and it is your faith and yours only to embark on this ques to $quest. 
  
  Ofcourse success of your mission will result in the best reward anyone could ask for: $reward.
  `;
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  

  // call a method on the instance
  myInstance.myMethod();
}

// let's get this party started - uncomment me
main();