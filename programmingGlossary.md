## 🗺️ The Ultimate Programming Glossary & Self-Study Guide## 🧱 Stage 1: The Absolute Basics (Day 1–14)

Goal: Learn how to write basic scripts and communicate instructions clearly to a computer.

## Variable

* Technical Definition: A named memory container holding data that can change during program execution.
* Real-World Analogy: A cardboard moving box with a temporary Sharpie label written on the outside.
* Why It Matters: Without them, a program cannot remember any information from the previous line of code.
* Code Blueprint: let username = "Alice";

## Data Type

* Technical Definition: A classification defining what type of value a variable holds and how the computer can manipulate it.
* Real-World Analogy: Standard sorting slots for mail (e.g., packages vs. letters vs. magazines) that dictate how they are handled.
* Why It Matters: Tells the computer whether it should mathematically add things together or treat them as raw text.
* Code Blueprint: let score = 42; // Integer

## Syntax

* Technical Definition: The strict set of grammar, spelling, and structural formatting rules governing a programming language.
* Real-World Analogy: Basic punctuation rules in human writing. Forgetting a period or comma makes the message unreadable.
* Why It Matters: Missing even a single semicolon or closing parenthesis will cause the computer to crash instantly.
* Code Blueprint: function start() { print("Go"); }

## Function

* Technical Definition: A reusable, isolated block of source code designed to execute a specific task when called.
* Real-World Analogy: A kitchen blender button labeled "Smoothie". You throw in raw ingredients and press it to run a pre-set routine.
* Why It Matters: Prevents you from copying and pasting the exact same 20 lines of code across your codebase over and over.
* Code Blueprint: function calculateTax(total) { return total * 0.05; } [4, 5] 

## Conditionals

* Technical Definition: Control flow statements that let a program make logical choices based on true or false conditions.
* Real-World Analogy: A digital household thermostat. IF the temperature drops below 20°, turn the heater on. ELSE, keep it off.
* Why It Matters: Allows software to react dynamically to user actions instead of running blindly in a straight, unchanging line.
* Code Blueprint: if (user.isLoggedIn) { showDashboard(); }

## Loops

* Technical Definition: A structural statement that repeats a block of code continuously until a specific exit condition is met.
* Real-World Analogy: A factory assembly line conveyor belt that keeps moving items down the row until the daily quota is filled.
* Why It Matters: Automates massive, repetitive tasks instantly without forcing you to write duplicate lines of instructions.
* Code Blueprint: while (itemsInCart > 0) { shipItem(); }

## Variable Scope

* Technical Definition: The strict structural boundary determining exactly where a declared variable can be accessed inside code.
* Real-World Analogy: A company ID badge. A local badge lets you into one specific office building, while a global badge opens every corporate door.
* Why It Matters: Prevents unexpected bugs caused by isolated functions accidentally rewriting each other's data values.
* Code Blueprint: { let localValue = 10; } // localValue disappears out here

## Compiler

* Technical Definition: A system program that translates an entire human-readable source code file into machine code all at once before running.
* Real-World Analogy: Translating a classic English novel entirely into Japanese and printing the new book before anyone sits down to read it.
* Why It Matters: Produces incredibly fast executable files because the computer does not need to parse or read raw text while running. [6, 7] 
* Code Blueprint: gcc main.c -o my_program

## Interpreter

* Technical Definition: A system program that translates and executes source code dynamically line-by-line directly at runtime.
* Real-World Analogy: A live United Nations speech translator whispering translations into an earbud second-by-second.
* Why It Matters: Makes testing and coding fast because you can hit "Run" and modify logic immediately without waiting for long compile cycles.
* Code Blueprint: python main.py [8] 

## Debugging

* Technical Definition: The systematic, step-by-step engineering process of finding, tracking, and resolving source code errors.
* Real-World Analogy: A detective investigating a crime scene, looking through footprints and clues to find exactly where things went wrong.
* Why It Matters: Software never works perfectly the first time. Mastery of debugging tools is what separates real programmers from guessers.
* Code Blueprint: console.log(variableToCheck); // Simple debug step

------------------------------
## 📦 Stage 2: Organizing Code & The OOP Pillars (Month 1–2)
Goal: Stop writing messy scripts and start modeling the real world using structured, modular layouts.
## Array

* Technical Definition: A contiguous memory collection storing elements of the uniform data type indexed by integers starting at 0.
* Real-World Analogy: An egg carton or a numbered ice cube tray holding identical items in a fixed, predictable row.
* Why It Matters: Lets you store and organize a list of 10,000 items inside one single variable name.
* Code Blueprint: let highScores = [98, 87, 76];

## Class

* Technical Definition: An abstract template or architectural blueprint defining the structural properties and methods of an object.
* Real-World Analogy: An industrial blueprint for a sports car. The drawing details the dimensions, engine type, and seating layout.
* Why It Matters: Acts as the master factory configuration template for creating clean, uniform blocks of complex data.
* Code Blueprint: class Car { constructor(color) { this.color = color; } }

## Object

* Technical Definition: A concrete, active instance of a class containing real data properties and executable behaviors.
* Real-World Analogy: The physical, bright red sports car driven off the assembly line that was built directly using the paper blueprint.
* Why It Matters: Allows you to bundle messy variables and functional behaviors together into distinct, logical entities.
* Code Blueprint: let myCar = new Car("Red");

## Encapsulation

* Technical Definition: Hiding internal object data states and restricting direct external modification access to protect stability.
* Real-World Analogy: A bank ATM machine. You cannot reach inside to move physical money stacks; you must use safe, authorized buttons.
* Why It Matters: Prevents external modules from accidentally altering or breaking an object's internal settings.
* Code Blueprint: private let bankBalance = 5000;

## Inheritance

* Technical Definition: A structural mechanism where a child class automatically acquires the existing properties and behaviors of a parent class.
* Real-World Analogy: A smartphone. A modern iPhone inherits the core calling abilities of old basic phones but appends touch screens and app stores.
* Why It Matters: Eliminates duplicate work by letting you build specialized classes on top of general foundation classes.
* Code Blueprint: class SUV extends Car { has4WD = true; }

## Polymorphism

* Technical Definition: The structural ability of different underlying classes to be triggered through a single shared, uniform interface.
* Real-World Analogy: A universal "Play" button. Pressing it plays an audio file, a video track, or a retro video game. The button acts the same.
* Why It Matters: Allows your code to accept a variety of inputs without writing separate if/else checks for every single object type.
* Code Blueprint: shape.draw(); // Works whether shape is a Circle or Square

## Abstraction

* Technical Definition: Hiding complex underlying implementation details and showing only clean, essential management features to users.
* Real-World Analogy: Driving a car. You step on the gas pedal to move; you do not need to understand combustion ratios or alternator currents.
* Why It Matters: Keeps interfaces clean and simple, shielding programmers from drowning in the minutiae of low-level backend configurations.
* Code Blueprint: database.connect(); // Hides 500 lines of networking code [9] 

------------------------------
## 🌲 Stage 3: Data Structures & Algorithms (DSA) (Month 3–4)
Goal: Write high-performance, efficient code and learn how to clear technical engineering interview rounds.
## Linked List

* Technical Definition: A linear collection of elements called nodes, where each node explicitly points to the location of the next node.
* Real-World Analogy: A neighborhood treasure hunt. Every clue sheet you find tells you exactly which house to visit next to get the next clue.
* Why It Matters: Allows you to dynamically resize collection lengths inside computer memory instantly without moving existing data.
* Code Blueprint: node.next = nextNode;

## Stack

* Technical Definition: A sequential linear data structure following the strict Last-In, First-Out (LIFO) access workflow rule.
* Real-World Analogy: A stack of clean ceramic plates in a diner. The last plate placed on top is always the very first one lifted away.
* Why It Matters: Essential for tracking application undo histories and coordinating nesting function execution pathways.
* Code Blueprint: historyStack.push("page1"); historyStack.pop();

## Queue

* Technical Definition: A sequential linear data structure following the strict First-In, First-Out (FIFO) access workflow rule.
* Real-World Analogy: A ticket line outside a concert arena. The person who arrived first gets checked and allowed in first.
* Why It Matters: Critical for organizing shared system resource requests like print jobs, cloud requests, and network packets fairly.
* Code Blueprint: printQueue.enqueue(doc); printQueue.dequeue();

## Hash Table / Map

* Technical Definition: An indexed structure mapping unique keys to values utilizing a mathematical hashing algorithm.
* Real-World Analogy: A coat check room. You hand over a winter coat, get a specific number token, and use that token to retrieve your exact coat instantly later.
* Why It Matters: Provides near-instant lookup speeds, making it the absolute baseline tool for handling massive high-speed database indices.
* Code Blueprint: userMap.set("user_id_88", {name: "Sarah"});

## Binary Tree

* Technical Definition: A hierarchical node tree architecture where each parent element points to a maximum of two distinct child branches.
* Real-World Analogy: A corporate organizational chart. A manager sits at the top, delegating tasks directly down to two immediate assistants.
* Why It Matters: Drastically speeds up lookups by cutting searching areas cleanly in half with every downward branch step.
* Code Blueprint: let root = { value: 10, left: null, right: null }; [10] 

## Graph

* Technical Definition: A non-linear network of vertices connected together via distinct structural lines called edges.
* Real-World Analogy: Facebook's user network. Every person is a vertex, and their structural connection lines are "friend" pairings.
* Why It Matters: The mathematical backbone used to calculate flight routes, Google Map directions, and social media recommendation engines.
* Code Blueprint: adjacencyList["UserA"] = ["UserB", "UserC"];

## Big O Notation

* Technical Definition: A mathematical algebraic notation detailing how algorithm execution times scale as data input sizes grow.
* Real-World Analogy: Judging an office filing system. A perfect system finds any file in 5 seconds (O(1)), a bad system requires reviewing every single folder (O(n)).
* Why It Matters: Prevents servers from choking because it helps engineers catch and fix slow code before deployment to production.
* Code Blueprint: O(1) = Instant; O(n) = Linear Growth; O(n²) = Slow Crawl

## Recursion

* Technical Definition: A software programming design pattern where a function completes a task by systematically invoking itself.
* Real-World Analogy: Placing two mirrors directly opposite each other, creating an infinite corridor of reflections repeating deeper and deeper.
* Why It Matters: Simplifies the code needed to navigate complex nested layouts like deep file directories or hierarchical trees.
* Code Blueprint: function countdown(n) { if(n <= 0) return; countdown(n-1); }

## Binary Search

* Technical Definition: An optimized lookup algorithm that continually splits a sorted list in half to find a targeted value.
* Real-World Analogy: Guessing a number between 1 and 100. You guess 50, hear "higher", and instantly throw out numbers 1 through 49.
* Why It Matters: Incredibly fast. Can find one specific item out of 4 billion in fewer than 32 total guess steps.
* Code Blueprint: while (low <= high) { let mid = (low + high) / 2; }

## Dynamic Programming

* Technical Definition: An algorithmic optimization strategy that solves massive problems by caching overlapping sub-problem results.
* Real-World Analogy: Writing 1+1+1+1+1 on a chalkboard. Instead of counting all five strokes from scratch tomorrow, you look at the total and remember it's 5.
* Why It Matters: Saves immense computing power by forcing the processor to solve a repetitive calculation exactly once.
* Code Blueprint: if (memo[n] !== undefined) return memo[n];

------------------------------
## 🧬 Stage 4: Advanced Engineering & Core Patterns (Month 5+)
Goal: Master the advanced tools and configurations used to build flexible, industry-grade architectures.
## Metaprogramming

* Technical Definition: An advanced coding paradigm where an application treats other code files as raw data to inspect, manipulate, or rewrite itself.
* Real-World Analogy: An advanced factory robot designed to analyze, optimize, and safely re-wire its own circuit boards while actively operating.
* Why It Matters: The technical fuel behind modern frameworks. It allows you to build custom code shortcuts and decorators that write code automatically.
* Code Blueprint: @track_execution_time\ndef process_data(): pass

## Singleton

* Technical Definition: A creational design pattern that permanently restricts a class from instantiating more than one single active global object instance.
* Real-World Analogy: The single official steering wheel inside a bus. No matter how many passengers climb inside, only one steering wheel manages the direction.
* Why It Matters: Protects shared system configurations, like central logging systems or active database connection pools, from conflicting edits.
* Code Blueprint: if (!instance) { instance = this; }

## Factory Method

* Technical Definition: A design pattern providing a standard interface for object creation while leaving subclass selection entirely to internal logic.
* Real-World Analogy: A fast-food drive-thru ordering station. You say "Combo 1", and the kitchen figures out whether to cook beef, bake buns, or fry potatoes.
* Why It Matters: Completely decouples your main application logic from the messy, complex boilerplate configurations required to set up specific objects.
* Code Blueprint: let weapon = WeaponFactory.create("sword");

## Adapter

* Technical Definition: A structural pattern serving as a translation bridge allowing two totally incompatible programmatic interfaces to interact safely.
* Real-World Analogy: A physical multi-prong European travel adapter plug letting an American laptop draw electricity from a wall outlet in Paris.
* Why It Matters: Allows you to plug new third-party software updates and code libraries into old legacy setups without rebuilding your application.
* Code Blueprint: class LegacyAdapter { request() { return this.oldSystem.specificRequest(); } }

## Facade

* Technical Definition: A structural pattern offering a clean, heavily simplified outer interface masking a massive, deeply complex internal code subsystem.
* Real-World Analogy: The master power button on a home theater remote. One click secretly triggers amplifiers, turns on projectors, and dims smart lights.
* Why It Matters: Keeps frontend developers from losing hours trying to manage thousands of complicated, interwoven low-level backend library settings.
* Code Blueprint: SmartHomeFacade.activatePartyMode();

## Observer

* Technical Definition: A behavioral subscription pattern automatically broadcasting state updates to tracking listener modules.
* Real-World Analogy: Subscribing to a YouTube creator channel. The exact millisecond they post a new video, your phone automatically receives a notification.
* Why It Matters: Essential for building live, responsive applications (like real-time chat apps or live stock dashboards) without wasting processing power on loops.
* Code Blueprint: button.addEventListener("click", updateUI);

## Strategy

* Technical Definition: A behavioral pattern converting a family of algorithms into separate, interchangeable modules hot-swappable at runtime.
* Real-World Analogy: A checkout payment window. The user clicks a option button, and the app instantly swaps its internal logic between PayPal, Visa, or Apple Pay.
* Why It Matters: Eliminates massive, unreadable blocks of nested if/else checks whenever an application supports multiple operating modes.
* Code Blueprint: cart.setPaymentMethod(new CryptoPayment());

## Dependency Injection

* Technical Definition: An architectural pattern where necessary external helper configurations are passed directly into a module rather than being hardcoded inside.
* Real-World Analogy: A professional racing driver. They do not manufacture tires or refine fuel in their car; the pit crew pumps those resources in from the outside.
* Why It Matters: Makes your codebase modular and easy to test because you can swap out real production databases for dummy test databases instantly.
* Code Blueprint: constructor(databaseConnection) { this.db = databaseConnection; }

------------------------------
## 🌐 Stage 5: Systems Architecture & Distributed Networks
Goal: Understand how massive, enterprise-level web applications pass data and talk to each other across the global internet.
## API (Application Programming Interface)

* Technical Definition: A highly structured messaging layer letting totally independent software applications safely exchange information over a network.
* Real-World Analogy: A restaurant waiter. You read the menu, tell the waiter your order, they run to the kitchen, and bring you back cooked food.
* Why It Matters: Allows your software to draw on immense external resources like live weather feeds, Google maps, or credit card processing networks.
* Code Blueprint: fetch("https://weather.com");

## Monolith

* Technical Definition: A systems architecture layout packaging all functional software modules together inside one single application file.
* Real-World Analogy: A massive Swiss Army knife containing scissors, saws, magnifying glasses, and blades welded together into a single housing unit.
* Why It Matters: Perfect for small teams starting out because it is simple to build, test, and deploy to a server all at once.
* Code Blueprint: All frontend, backend, and database configurations sit inside one project repository. [11] 

## Microservices

* Technical Definition: An architecture splitting an application into a fleet of independent, mini-services communicating via lightweight network protocols.
* Real-World Analogy: A commercial construction site. Separate, specialized teams of plumbers, electricians, and painters coordinate independently.
* Why It Matters: Allows multi-national engineering firms to update or scale individual parts of an app (like the checkout system) without taking down the entire website.
* Code Blueprint: UserService talks to OrderService over HTTP network endpoints.

## REST

* Technical Definition: A standard architectural design style utilizing stateless operations and standard HTTP methods to handle data over the web.
* Real-World Analogy: A highly predictable vending machine. You click button GET to receive a soda, or button DELETE to clear out your selection.
* Why It Matters: The universal baseline language of the modern web, ensuring any platform can talk to any server without complex setups.
* Code Blueprint: GET /api/users/42 [12] 

## GraphQL

* Technical Definition: A flexible API data query language allowing client applications to request the exact fields they need.
* Real-World Analogy: A custom salad bar form. Instead of buying a pre-made chef salad, you check boxes to get exactly three tomatoes and one slice of cheese.
* Why It Matters: Drastically speeds up mobile applications by preventing data over-fetching over slow, cellular data networks.
* Code Blueprint: query { user(id: 42) { name, email } }

## MVC (Model-View-Controller)

* Technical Definition: An architectural pattern dividing code into three layers: Data logic (Model), Interface layouts (View), and Processing operations (Controller).
* Real-World Analogy: A modern restaurant setup. The kitchen storage holds raw ingredients (Model), the decorated dining tables host guests (View), and the chef processes orders (Controller).
* Why It Matters: Keeps code separate and organized so designers can overhaul the website looks without accidentally destroying the payment logic database.
* Code Blueprint: UserView renders data parsed out by UserController from UserModel.

------------------------------
## 💾 Stage 6: RAM, CPU & Hardware Interaction
Goal: Take off the training wheels and learn exactly how your software interacts with physical computer processors and memory chips.
## Stack Memory

* Technical Definition: Fast, strictly structured RAM memory automatically allocating temporary local function execution frames.
* Real-World Analogy: A desktop spike spindle spindle file for paper slips. You slide new assignments on top, and must pull them off the top to clean up.
* Why It Matters: Extremely efficient. The computer instantly wipes this entire zone clean the microsecond a function finishes executing, preventing junk pileups.
* Code Blueprint: Stores local basic variables like numbers and booleans automatically. [13, 14] 

## Heap Memory

* Technical Definition: A large, completely unstructured RAM memory zone dynamically allocating long-lived, complex application data objects.
* Real-World Analogy: A massive, open warehouse floor. Items are placed wherever room can be found, requiring a detailed tracking map to find them later.
* Why It Matters: Essential for storing massive, unpredictable items like uploaded image pixels, video arrays, or dynamic database logs.
* Code Blueprint: let largeArray = new Array(1000000); // Placed on Heap

## Garbage Collection

* Technical Definition: An automatic background memory management engine tracking and reclaiming unreachable memory allocations.
* Real-World Analogy: A garbage truck rolling through your neighborhood picking up old furniture left on the curb that nobody is using anymore.
* Why It Matters: Frees beginners from having to manually allocate and scrub every single byte of computer memory, preventing quick system crashes.
* Code Blueprint: Runs silently in languages like JavaScript, Java, and Python.

## Memory Leak

* Technical Definition: A severe software bug occurring when a program fails to release unneeded heap memory allocations back to the system.
* Real-World Analogy: Leaving the sink running while you leave for a week-long vacation, causing water to spill over and flood the house.
* Why It Matters: Chokes performance over time, causing applications to run slower and slower until the operating system forces a crash.
* Code Blueprint: setInterval(() => { leakArray.push(new Data()); }, 10); // Dangerous loop [15] 

## Concurrency

* Technical Definition: The system architecture capability to execute multiple logical tasks across overlapping timelines on a single CPU core.
* Real-World Analogy: A busy restaurant chef chopping onions, checking on a simmering sauce, and turning down an oven timer on a single stove.
* Why It Matters: Keeps application interfaces smooth and snappy by working on backend data downloads while users keep scrolling.
* Code Blueprint: Managed via event loops and time-slicing systems.

## Parallelism

* Technical Definition: The physical hardware capability to execute multiple distinct computational tasks simultaneously across separate multi-core processors.
* Real-World Analogy: Hiring four separate, professional chefs working side-by-side on independent stovetops to cook an entire party feast instantly.
* Why It Matters: Essential for heavy computational workloads like processing 4K video rendering packages, training neural networks, or running heavy 3D game engines.
* Code Blueprint: Utilizes multi-threading libraries to distribute chunks across independent CPU cores.

## Asynchronous Execution

* Technical Definition: An operational design model letting slow operations run independently without locking down the main execution thread.
* Real-World Analogy: Ordering food at a counter. They hand you a buzzer token, letting you sit down and check your phone until the food is ready.
* Why It Matters: Prevents web browsers from entirely freezing or hanging while fetching data records from slow servers thousands of miles away.
* Code Blueprint: let response = await fetch(url); [16] 

## Race Condition

* Technical Definition: A multi-threading hazard where final system execution results depend unpredictably on timing sequences.
* Real-World Analogy: Two people checking a bank account online at the exact same second with $100 left. Both click withdraw, and the system accidentally lets both transactions clear.
* Why It Matters: Causes random, catastrophic data corruption bugs that are incredibly difficult to replicate or fix during testing.
* Code Blueprint: Occurs when two threads read and write to one variable without a lock.

## Deadlock

* Technical Definition: A software freeze failure where concurrent operations wait indefinitely on each other's locked resources.
* Real-World Analogy: Two stubborn trucks meeting face-to-face on a single-lane bridge. Neither will back up, leaving traffic frozen forever.
* Why It Matters: Completely locks applications up, requiring an active system restart to clear out the frozen processes.
* Code Blueprint: ThreadA locks File1 and wants File2. ThreadB locks File2 and wants File1.

------------------------------
## ♾️ Stage 7: Team Git Workflows & Cloud DevOps
Goal: Learn how to collaborate smoothly inside professional engineering teams and deploy code safely to millions of active users.
## Git

* Technical Definition: A distributed version control system tracking source code structural history adjustments across multiple team repositories.
* Real-World Analogy: A multi-player Google Doc with a timeline slider. You can review exactly what line your coworker typed last Tuesday and reverse edits instantly.
* Why It Matters: The foundational tool for global tech work, letting thousands of software engineers edit the same files simultaneously without overwriting each other.
* Code Blueprint: git commit -m "Added checkout feature"

## Merge Conflict

* Technical Definition: An explicit filing system clash occurring when version control software cannot auto-combine overlapping code edits.
* Real-World Analogy: Two designers editing line 15 of the exact same document. The boss looks at both sheets and has to manually choose which design to keep.
* Why It Matters: Requires developers to communicate directly, review conflicting lines, and make careful decisions to avoid wiping out valid features.
* Code Blueprint: <<<<<<< HEAD \n code_A \n ======= \n code_B \n >>>>>>> main

## CI/CD Pipeline

* Technical Definition: Automated engineering workflows that compile, test, verify, and deploy software changes straight to live cloud systems.
* Real-World Analogy: An automotive testing track. A newly assembled car is auto-guided through safety crashes, paint inspections, and speed runs before shipping.
* Why It Matters: Allows engineering teams to push code updates to production servers multiple times a day with complete confidence that nothing is broken.
* Code Blueprint: Configured via files like YAML inside GitHub Actions or Jenkins workflows.

## Containerization

* Technical Definition: Virtualizing an entire software application alongside its operational environmental settings inside isolated packages.
* Real-World Analogy: A standard steel shipping cargo container. It holds electronics, furniture, or clothes, and fits perfectly on any cargo ship anywhere globally.
* Why It Matters: Eliminates the classic developer excuse: "Well, the application worked perfectly on my personal laptop, I don't know why it crashes on your machine!"
* Code Blueprint: docker build -t my_app_image .

## Infrastructure as Code (IaC)

* Technical Definition: Setting up, configuring, and managing enterprise cloud server infrastructure entirely via text files of code.
* Real-World Analogy: Instead of manually building a lego castle brick-by-brick, you write out a text file script that feeds into a 3D printer to print the castle.
* Why It Matters: Allows DevOps engineering teams to spin up 500 identical web servers, cloud databases, and firewalls across the globe in seconds using one script.
* Code Blueprint: resource "aws_instance" "web" { ami = "ami-12345" }

------------------------------


[1] [https://zapier.com](https://zapier.com/blog/beginner-ultimate-guide-markdown/)
[2] [https://swimm.io](https://swimm.io/learn/swimm-vs-notion/markdown-in-notion-quick-guide-and-reference)
[3] [https://www.thatcompany.com](https://www.thatcompany.com/markdown-language)
[4] [https://www.languagetrainers.com](https://www.languagetrainers.com/blog/tech-industry-english-vocabulary-for-software-engineers-developers-programmers/)
[5] [https://tex.stackexchange.com](https://tex.stackexchange.com/questions/663968/can-the-glossaries-package-print-unused-entries-with-automake)
[6] [https://medium.com](https://medium.com/@abhinay.work.1411/what-is-markdown-a-simple-explanation-for-beginners-0370757d0f6b)
[7] [https://www.ituonline.com](https://www.ituonline.com/tech-definitions/what-is-markdown/)
[8] [https://www.simplilearn.com](https://www.simplilearn.com/tutorials/programming-tutorial/software-terminologies)
[9] [https://codehs.com](https://codehs.com/glossary/)
[10] [https://scottnovis.medium.com](https://scottnovis.medium.com/getting-to-know-markdown-66252a21c4ef)
[11] [https://community.atlassian.com](https://community.atlassian.com/forums/App-Central-articles/The-Best-Way-to-Manage-Glossaries-in-Confluence-We-Compared-the/ba-p/3079954)
[12] [https://about.gitlab.com](https://about.gitlab.com/blog/gitlab-markdown-tutorial/)
[13] [https://www.embednotionpages.com](https://www.embednotionpages.com/guide/notion-to-markdown-in-5-minutes/)
[14] [https://learninglab.gitlabpages.inria.fr](https://learninglab.gitlabpages.inria.fr/mooc-rr/mooc-rr-ressources/module1/ressources/introduction_to_markdown.html)
[15] [https://www.youtube.com](https://www.youtube.com/watch?v=MUQTvPcxh_g)
[16] [https://developers.cloudflare.com](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
