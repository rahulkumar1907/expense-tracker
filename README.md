# expense-tracker

to track expenses

# Points 1 : - WHAT IS PACKAGE JSON FILE

package.json file you provided is a configuration file used in Node.js projects.
It includes important metadata about the project, as well as its dependencies and scripts
name: "expense-tracker" - This is the name of your project. It should be unique if you plan to publish it to a package registry.

version: "1.0.0" - This specifies the version of your project, following semantic versioning (major.minor.patch).

description: "" - A brief description of your project. It’s currently empty but can be filled in to give more context.

main: "index.js" - This indicates the entry point of your application. When someone requires your package, this file will be loaded first.

scripts:

This section defines command-line scripts that can be run using npm run <script-name>.
In this case, there’s a test script: "test": "echo \"Error: no test specified\" && exit 1" which simply outputs an error message indicating that no tests are defined yet and exits with a non-zero status.
keywords: [] - This is an array of keywords related to your project, which can help others discover it. It's empty in this example.

author: "" - This field is for specifying the author of the project. It’s currently empty.

license: "ISC" - This indicates the license under which the project is distributed. The ISC license is a permissive open-source license.

dependencies:

This section lists the packages that your project depends on to run.
In this example, it includes "express": "^4.21.1", which means your project depends on version 4.21.1 of the Express framework or any compatible version that is greater than or equal to 4.21.1 but less than 5.0.0.

# Point 2. WHAT IS MONGOOSE

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward way to interact with MongoDB databases by allowing developers to define schemas for their data, create models based on those schemas, and perform various database operations such as querying, updating, and deleting records.

Key Features of Mongoose:
Schema Definition: Mongoose allows you to define a schema for your data, specifying the structure and data types for each field. This helps enforce data consistency.

Model Creation: Once a schema is defined, you can create a model that represents a collection in your MongoDB database. This model can be used to create, read, update, and delete documents.

Validation: Mongoose provides built-in validation for schema fields, allowing you to ensure that data meets specific criteria before it's saved to the database.

Middleware: You can define middleware functions that can run before or after certain operations, such as validation or saving documents. This is useful for tasks like logging or modifying data.

Querying: Mongoose provides a rich query API that allows you to perform complex queries easily, including filtering, sorting, and pagination.

Population: Mongoose supports population, which allows you to reference documents in other collections and automatically replace the references with the actual documents.

Plugins: Mongoose supports plugins, which enable you to extend its functionality with reusable features.

# Point 3. WHY WE USE ENV FILE

Benefits of Using an .env File
Security: Environment variables can store sensitive information such as API keys, database connection strings, and passwords. By keeping these values in an .env file, you avoid hardcoding them into your source code, reducing the risk of exposing sensitive data.

Configuration Management: An .env file allows you to easily manage configuration settings for different environments (e.g., development, testing, production). You can have different .env files for each environment and load them as needed.

Ease of Use: Using dotenv makes it easy to load environment variables into your application. This simplifies configuration and ensures that the application behaves consistently across different environments.

Separation of Concerns: It helps separate application logic from configuration details, making your code cleaner and more maintainable.

Benefits of Using .gitignore for node_modules and .env
Prevent Sensitive Data Exposure: By adding your .env file to .gitignore, you ensure that it is not tracked by Git and thus not pushed to your version control system. This helps protect sensitive information from being exposed in public repositories.

Reduce Repository Size: The node_modules directory can be very large, containing all the dependencies of your project. By ignoring it, you keep your repository lightweight. Instead, you can use package.json and package-lock.json to manage dependencies.

Environment Consistency: When developers clone your repository, they can run npm install to install the required packages listed in package.json, ensuring that everyone is working with the same dependencies without needing to include the actual node_modules folder.

Simplified Collaboration: With .gitignore, team members won’t accidentally commit local configurations or unnecessary files. This helps maintain a clean and consistent codebase.

# Point 4. WHAT IS PACKAGE LOCK JSON

The package-lock.json file is an automatically generated file that is created when you run npm install in a Node.js project that uses npm (Node Package Manager). It serves several important purposes:

Key Features of package-lock.json
Dependency Locking: The package-lock.json file locks the versions of your project's dependencies and their dependencies (transitive dependencies). This ensures that everyone working on the project (or any deployment environments) uses the exact same versions of each package, preventing inconsistencies that could lead to bugs.

Faster Installations: When you run npm install, npm can use the package-lock.json file to install dependencies more quickly. It does this by skipping the version resolution step, as it already knows the exact versions to install.

Detailed Dependency Tree: The file contains a detailed structure of the dependency tree, including the resolved versions of each package, the package source (e.g., registry URL), and any package integrity checks (hashes) to ensure the packages haven't been tampered with.

Automatic Creation and Updates: The package-lock.json file is created automatically when you first install dependencies and is updated whenever you add or update packages with npm. You should avoid manually editing this file.

# Point 5. DIFFRENCE B/W VERSION TILDE AND CARAT SYMBOL IN DEPENDENCY IN PACKAGE JSON FILE

Tilde (~)
Example: "~2.1.34"
What it means: You can update to newer versions that only fix bugs. So, it allows versions like 2.1.35 but not 2.2.0.
Caret (^)
Example: "^16.4.5"
What it means: You can update to newer versions that add new features or fix bugs. So, it allows versions like 16.4.6 and 16.5.0, but not 17.0.0.
Quick Summary
~: Only small updates (like fixing bugs).
^: Small and medium updates (like adding new features).
Use ~ for safety and ^ for more options!

# Point 6 DIFFRENCE B/W COMMONJS AND ECMASCRIPT MODULE

CommonJS Modules
Syntax: Uses require() for importing and module.exports for exporting.
Loading: Synchronous loading; modules are loaded when the code is executed.
Usage: Primarily used in Node.js environments.
File Extension: Typically uses .js extension.
Scope: Each module has its own scope; no global scope pollution.
Dynamic: Can use variables in require() calls for dynamic imports.
ECMAScript Modules
Syntax: Uses import and export statements.
Loading: Asynchronous loading; designed for use in both browsers and Node.js.
Usage: Standardized in JavaScript and can be used in both client-side and server-side code.
File Extension: Often uses .mjs or .js (with "type": "module" in package.json).
Scope: Each module has its own scope, preventing global namespace pollution.
Static Structure: Imports must be at the top level, allowing for static analysis and tree-shaking.
Key Differences
Loading Method: CommonJS is synchronous; ES modules are asynchronous.
Import/Export Syntax: Different keywords and structure for defining modules.
Use Cases: CommonJS is mainly for Node.js; ES modules are for both browsers and Node.js.
Dynamic Import: CommonJS allows dynamic imports, while ES modules use import() for asynchronous loading.

# Point 7 CSRF ATTACK Cross-Site Request Forgery (CSRF)

Cross-Site Request Forgery (CSRF) is a type of attack where a malicious actor tricks a user into performing unwanted actions on a web application in which they are authenticated. In a CSRF attack, the attacker exploits the trust that a web application has in the user's browser.

Here's a more detailed breakdown:

How CSRF Works:
User Authentication: The user is logged in to a web application (e.g., a banking app, social media site) and has an active session, typically stored in cookies.
Malicious Request: The attacker tricks the user into clicking a malicious link, loading an image, or submitting a form that makes an unintended request to the target web application.
This request is made from the user’s browser without their knowledge but uses the user’s authenticated session (cookies) to carry out an action on the target website.
Execution: The web application processes the malicious request because it appears to come from an authenticated user, and performs actions like transferring money, changing account settings, etc.
Example of a CSRF Attack:
Imagine you're logged into a banking application, and you have an active session (your session is identified by a cookie stored in your browser).

An attacker sends you an email or gets you to visit a website that contains a malicious <img> tag, like this:

html
Copy code
<img src="https://banking-app.com/transfer?amount=1000&toAccount=attacker_account" />
Your browser automatically sends this request, and because you’re logged into your banking app, it includes your session cookie with the request.

The banking application sees the valid session and processes the transaction, transferring money to the attacker's account.

Why CSRF is Dangerous:
No user interaction needed: The attacker doesn’t need the user to do anything other than visit a malicious website or click on a link. This makes the attack relatively easy to carry out.
Exploits the trust of the web application in the user: Since the web application trusts that the requests made by the user are legitimate (based on the session), it doesn't distinguish between legitimate and malicious requests made by the attacker.
How to Prevent CSRF Attacks:
There are several ways to mitigate CSRF attacks in web applications:

1. Use Anti-CSRF Tokens:
   CSRF tokens are unique, secret values generated by the server and included in every form or request that modifies data (e.g., submitting a form, making a POST request).

When a user submits a form, the server checks if the token provided matches the one it generated, ensuring the request originated from the legitimate application and not from a malicious third-party site.

For example, a hidden field might be added to a form with a unique token like this:

html
Copy code

<form action="/update-profile" method="POST">
  <input type="hidden" name="csrf_token" value="unique-token-value" />
  <!-- other form fields -->
</form>
2. SameSite Cookies:
Set the SameSite attribute on cookies to Strict or Lax. This prevents the browser from sending cookies along with cross-site requests, blocking attackers from using cookies (like session cookies) for cross-origin requests.
SameSite: Strict: Cookies are only sent in requests originating from the same site (i.e., no cookies will be sent on cross-site requests).
SameSite: Lax: Cookies are sent with same-site requests, and some cross-site requests like GET (e.g., navigation) are allowed to include cookies.
javascript
Copy code
res.cookie('session', 'cookie-value', { sameSite: 'Strict' });
3. Ensure All Sensitive Actions Are Protected by POST Requests:
CSRF attacks are often performed via GET requests (e.g., visiting a URL that causes an action like transferring funds). Make sure any sensitive actions that modify data (e.g., submitting forms, changing account details) are only allowed through POST, PUT, or DELETE HTTP methods.
CSRF attacks are harder to execute against methods that are meant to be non-idempotent (like POST).
4. Check Referer and Origin Headers:
Validate the Referer and Origin headers of incoming requests. These headers can help determine where the request originated and can be used to ensure that the request is coming from the expected site.
While not a foolproof solution on its own, this can provide an additional layer of protection.
Example:

javascript
Copy code
if (req.headers.origin !== 'https://yourdomain.com') {
return res.status(403).send('Forbidden');
} 5. Multi-factor Authentication (MFA):
For actions that have high security risks (e.g., changing passwords or making financial transactions), use multi-factor authentication to ensure that the user explicitly authorizes the action.
Even if a CSRF attack manages to trigger a request, the attacker would still need to pass an additional layer of authentication (e.g., a code sent to the user's phone).

# Point 8 DDoS Attack
What is a DDoS Attack?
A DDoS (Distributed Denial of Service) attack aims to disrupt a service by overwhelming it with a flood of traffic from multiple sources. The goal is to exhaust the target's resources (bandwidth, CPU, or memory), causing it to become slow or unavailable.

Types of DDoS Attacks:
Volumetric Attacks: Flooding with massive traffic (e.g., UDP floods).
Protocol Attacks: Exploiting protocol weaknesses (e.g., SYN floods).
Application Layer Attacks: Overloading web applications (e.g., HTTP floods).
How DDoS Attacks Work:
Botnets: Attackers control a network of infected devices (botnets) to send traffic to the target.
Amplification: Attacks can use techniques to amplify traffic volume (e.g., DNS amplification).
DDoS Impact:
Service downtime: Makes websites or services unavailable.
Financial loss: Costs from downtime, recovery, and reputation damage.
Operational disruption: Requires manual intervention or third-party services to mitigate.
Preventing DDoS Attacks:
Rate Limiting: Restrict the number of requests per client within a time window.

Example (Express):
javascript
Copy code
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Max requests per minute
  message: 'Too many requests. Try again later.',
});
app.use(limiter);
Traffic Monitoring & Anomaly Detection: Monitor traffic patterns to detect unusual spikes.

Web Application Firewall (WAF): Filters malicious traffic at the application layer.

CDN (Content Delivery Network): Distributes traffic across multiple servers, reducing load on the origin server.

Geofencing: Block traffic from regions not relevant to your user base.

Auto-scaling: Automatically scale resources in response to increased traffic.

Blackhole Routing & Traffic Filtering: Drop malicious traffic before it reaches your servers.

Anycast Network: Routes traffic to multiple servers globally, dispersing DDoS traffic.

# Point 9 CLUSTERING IN NODEJS
Node.js runs in a single-threaded event loop, meaning it can handle multiple requests simultaneously but only on one thread. This works well for I/O-heavy operations (e.g., web servers, databases), but for CPU-intensive tasks (e.g., heavy computation, data processing), a single-threaded model can be a bottleneck.

To leverage multi-core systems and make full use of your server's hardware, Node.js clustering allows you to spawn multiple child processes (workers), each of which runs on a separate CPU core, while the master process acts as the coordinator.

This approach allows your application to handle more requests concurrently by distributing the workload across multiple processes, effectively scaling your app without needing to deploy it across multiple machines.

How Clustering Works in Node.js
Master Process: This is the main process. It runs the application, but it does not handle the requests itself. Instead, it forks multiple worker processes.
Worker Processes: Each worker is a copy of the main application and runs in its own thread. Each worker handles requests independently, taking advantage of multi-core systems.
Load Balancing: The OS’s load balancer automatically distributes incoming requests to the worker processes, which can run on different CPU cores.

import express from "express";
import cluster from "cluster";
import os from "os";
import mongoose from "mongoose";

const numCPUs = os.cpus().length; // Get the number of CPU cores

if (cluster.isMaster) {
  // Master process: Fork workers for each CPU core
  console.log(`Master process is running on pid ${process.pid}`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // Creates a worker process
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // If a worker dies, fork a new one
    cluster.fork();
  });
} else {
  // Worker process: Set up the app to handle requests
  const app = express();

  // Basic route
  app.get("/", (req, res) => {
    res.send("Hello from Worker!");
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Worker process ${process.pid} is running on port ${PORT}`);
  });
}
Explanation:
cluster.isMaster: This check determines if the current process is the master process. If it is, the master process will fork worker processes for each CPU core available (using cluster.fork()).

Forking Worker Processes: Each worker process is an instance of your Express app, and they handle requests independently. Each worker process listens on the same port.

Master Process Responsibilities:

It forks worker processes to run on multiple cores.
It listens for exit events to restart workers if they crash, ensuring high availability.
Worker Process Responsibilities:

Each worker runs the same Express app.
Workers handle the HTTP requests and return responses.
How Load Balancing Works
In a clustered environment:

The operating system’s load balancer automatically distributes incoming requests between the available workers.
Each worker runs in its own process, so each can independently handle incoming requests.
Since there are multiple processes, your app can handle more requests at once, especially if the server has multiple CPU cores.
Benefits of Clustering:
Increased Throughput: Multiple workers running on different CPU cores can handle more requests concurrently.
Fault Tolerance: If a worker crashes, the master process can spawn a new worker to replace it, ensuring the app remains up and running.
Better Performance: By distributing tasks to multiple processes, Node.js can handle both I/O-bound and CPU-bound tasks more effectively.

# Point 10 APPLICATION LEVEL AND ROUTE LEVEL MIDDLEWARE 

Application-Level Middleware
This type of middleware applies globally to all routes in the application. It’s used for tasks like logging, body parsing, and error handling.

Example:
javascript
Copy code
const express = require('express');
const app = express();

// Application-level middleware (logs all requests)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Body parser middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => console.log('Server running on port 3000'));
Route-Level Middleware
This middleware is applied to specific routes. It’s useful for tasks like authentication or validation for certain endpoints.

Example:
javascript
Copy code
const express = require('express');
const app = express();

// Route-level middleware for authentication
function isAuthenticated(req, res, next) {
  if (req.headers['authorization'] === 'secret') {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

// Only the /protected route uses the isAuthenticated middleware
app.get('/protected', isAuthenticated, (req, res) => {
  res.send('Protected Route');
});

app.listen(3000, () => console.log('Server running on port 3000'));
Key Points:
Application-Level Middleware: Runs for every request (app.use()).
Route-Level Middleware: Runs for specific routes (app.get(), app.post(), etc.).

# Point 11 EXPRESS ROUTER 

In Express, a router is an object that is used to define and manage routes separately from the main application. It allows you to organize your routes into smaller, modular pieces. Each router can handle requests for specific paths and HTTP methods (GET, POST, etc.).

Key Points:
Modular Routing: Instead of defining all routes in a single file, you can use routers to group related routes together.
Mountable: Routers can be mounted on specific paths, making them reusable across different parts of the application.
