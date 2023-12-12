# BlogApp-main

MODULES NEEDED:

```
npm i

npm node-forge

npm openssl

npm mongodb

```

k3s (see demo - downloaded)

__**run node generateCert.js to generate certificates before running - this should be handled through package.json by simply doing npm start**__

# EC2 Instance Link(s):

Site link: https://54.235.56.126:8080

EC2 Public IPv4 DNS: ec2-54-242-24-233.compute-1.amazonaws.com

Instance ID: i-072181c6f742ec1d6

# Dockerhub Link:

https://hub.docker.com/repository/docker/fikofoxx/private-repo/general

Most recent Docker image publicly accessible as "fikofoxx/private-repo:latest"

# Challenges:

- My methodology going into this was that I'd be able to test changes locally before moving to AWS, so that I can look at changes instantly. It became apparent that the project that came as-is did not function by itself. While doing dockerization tasks was easy, I had to locally install MongoDB for the blog to function (This was before I figured out you can just use MongoDB across the web via Atlas).

- Was not really familiar with how MongoDB worked going into this assignment. Took a bit to setup both local and cloud instances, and finding out that the link that was built in app.js does not function. Final link comes from generated MongoDB Atlas database.

- General unfamiliarity with JavaScript conventions and structuring made it a bit confusing to understand what the code is doing underneath. AI helped(?) in understanding what certain functions do, but I'm also very wary of trusting an AI to tell me a correct answer in one shot, and I can only correct it if I knew about the "thing" beforehand.

- I spent half a day trying to find where the secrets are stored to better understand where certain values were being drawn from. I couldn't find it. I guess they were really secret.

- Moving onto an EC2 instance, I had trouble getting the site to run. Connecting to the hosted site after updating the appropriate security group rules, the site would constantly redirect to HTTPS instead of HTTP (probably because of a default browser setting), the site formatting was broken, and form submission (such as login, registration, etc.) did not function, with the web console giving an explanation that basically says it refused to send a form due to a CSP rule violation. Using a bit of searching and ChatGPT generations, I was able to implement a script that generates a self-signing OpenSSL certificate for the site, enabling the use of HTTPS and clearing all of the aformentioned errors.

# Buggy/Unimplemented:

- **Kubernetes Deployment**: I initially attempted to deploy the K3s demo that was linked onto the first EC2 instance I had up. Upon deploying the first command, and then trying to configure the YAML files from the demo, I got hit with a permissions error. With tips send from the Discord server, I ran a slightly modified command that enabled editing permissions on the relevant file, and was able to add the YAML files to the K3s configuration. However, as I was running on t2.micro instances to stay within AWS Free Tier, I was constantly having resource overload problems, and the instances I deployed quickly became impossible to work on. Though monitoring from the EC2 dashboard did not show any obvious problems, the status checks for reachability constantly failed, and looking at the Process List in the Cloud9 IDE attached to the EC2 instance did not show any process taking up more than 5% of the CPU load. However, when I used the Linux command `top -i`, I learned that a process called "k3s-server" was taking between 60-80% of the resources in my instance at a given moment. I decided to go full send and move off of free tier to a t3.small instance, which solved lots of the site's performance problems, however I then learned after going through the demo that I was unable to port-forward the kubernetes deployment, because there was no pod that was started, and when I did force a pod start, the pod would stay on "Pending" indefinitely. I did not know how to solve this problem, despite searching Google.

- **Parameter Store replacing environment variables / mongoDB password / secrets / etc.etc.**: My first challenge with this was going through the IAM role and policy attached to the EC2 instance to allow access to Parameter Store. The IAM policy wanted the Parameter Store's ARN, so I went to create the Parameter Store through AWS. However, I was confused when it asked me for a value, because I thought Parameter Store stores values, so I didn't expect to have to enter an unknown value beforehand. Also, the naming structure for Parameter Store confused me. Additionally, I didn't know where to put the provided code into the webapp, and suggestions from the Discord suggest that I have to put almost the entirety of app.js into an async block in order to call Parameter Store. Because I was not able to get Parameter Store running, the IAM roles and policies remain unchanged. Attempted to implement the suggestion from Discord, but confusion on how to initialize Parameter Store in the first place, and how to use it to replace Secrets/Env variables, etc. were abandoned as I had to start prioritizing time to studying for finals for a class the next day.

- **DynamoDB blogpost storage**: I feel like this would have been the easiest to implement out of all of the things that didn't end up getting implemented. I had prior experience configuring and hooking up DynamoDB functionality in a previous assignment, but I attempted to push this to the end because I was told this would take the most time to implement. I see now that this would actually have been quite the opposite. In the end, no attempts were made to implement DynamoDB.

- I learned that there was a GitHub workflow implemented in the program that automatically updates/generates a dockerfile. I tried to update the relevant files to have it work, but I couldn't get the workflow to run properly. So for now, it constantly fails because GitHub tries to run `npm test` but can't access the webserver that was created, even though the test function works perfectly fine when run on the EC2 instance.

- **Database Issues**: Current implementation means that if you try and post more than one blog post per account, the site will crash, because the database starts crying about the primary key (a user's username) being the same as a previous blog post, so the data can't be entered. Additionally, registration considers a user's email to be the unique component, not the username. When registration fails, no message pops up, and the site will not redirect the user off of the redirect page to tell them that registration failed for some reason.

# Video:

https://youtu.be/X9RQnm9jR1c

There may be some things I left out of the video, but they should otherwise be contained on this README doc.