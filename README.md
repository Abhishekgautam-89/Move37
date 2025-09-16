# 🗳 Real-Time Polling Backend

A Node.js + Express + Prisma + PostgreSQL backend for real-time polling.  
Supports user authentication with JWT, poll creation, voting (with change support), and live updates via WebSockets.

---

  Tech Stack
- Node.js + Express — API framework  
- Prisma ORM — Database access layer  
- PostgreSQL — Relational database  
- Socket.IO — WebSocket communication  
- JWT — Authentication  

---

Setup & Installation

 Clone the repository
   - git clone https://github.com/Abhishekgautam-89/Move37.git

   - cd Move37

Install dependencies

   - npm install

Configure environment variables

    Create a .env file in the project root:
        # PostgreSQL connection URL
        DATABASE_URL="postgresql://<username>:<password>@localhost:5432/pollingdb"

        # JWT secret key
        JWT_SECRET="supersecretkey"

        # Application port
        PORT=5000

        # Cookie-token expiry
        APITOKENEXPIRY= "30d"
        
        # Salt to hash password
        SALTROUND = 10

        # Token for front application
        DOMAIN=localhost

Setup database:

    npx prisma migrate dev --name init

Run the server:

  npm run dev

Rest API Endpoints

   User

    Method	    Endpoint	             Description	                           Body                         Auth Required 
    POST	      /user	                 Register a new user	                   name, email, password            NO
    POST	      /user/login	           Login & get token	                     email, password                  NO

   Polls

    Method	    Endpoint	             Description	                           Body                         Auth Required    
    POST	    /polls	                 Create a new poll (with options)	       question, options               YES
    GET	        /polls	               Get all polls	                                                         NO
    GET	        /polls/:id	           Get single poll with vote counts	                                       NO

   Voting 

    Method	    Endpoint	             Description	                           Body                         Auth Required  
    POST	    /votes	                 Cast vote in poll	                     optionId                      YES


WebSockets

  Clients connect via ws://localhost:5000

  Join a poll room:

    socket.emit("joinPoll", pollId);

  Listen for real-time updates:

    socket.on("pollUpdate", (results) => {
    console.log("Updated poll results:", results);
    });  