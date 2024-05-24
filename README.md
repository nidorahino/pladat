# PlaceMint

## Introduction
PlaceMint for promising students benefit both students and employers tremendously. Students gain valuable experience, mentorship, and often financial incentive while employers improve their existing resources in personnel, help staff with mentoring and management, and hire potential long-term employees. Searching for these placements can be an anxious time in a student’s life. Employers similarly can find it difficult to find qualified candidates to fill these placements. Students looking to engage in placements with potential employers can use our service to “match” to these opportunities. Employers and students will both register with our service and provide details of placement opportunities and student capabilities. Our matching algorithm then will provide strong candidates for employers and suggested placements for students to review in order to find the match possible.


## How to run and test
1. To clone the project at your desire directory, open the terminal and run `git clone https://github.com/CSCI-49900-Fall-2020/project-pladat.git`
2. From the project root folder (not /client, just /pladat), run `npm run dev`
3. If you have any errors, run `npm install` in the root folder and run `yarn install` in client/my-app then go back to root folder, run `npm run dev` again. The browser tab with the PlaceMint landing page will be opened


## Development Environments
|  |  |
|------|------|
| Frontend | __HTML, CSS, JavaScript, React__ |
| Backend (Server Architecture) | __Node.js, Express.js, Passport.js, Jason Web Token, bcrypt, etc.__ |
| Backend (Database Schema Design) | __MongoDB, Mongoose__ |
| Matching Algorithm | __Simple CRON job using a worker app and queue system__ |
| Deployment | __Heroku, Docker__ |


## List of features
__Dynamic & Personal Profile Editing__:
Allow users to make changes to their profile at any time during the discover process 

__Previewing your Profile__:
Allow users to see how their profile appears before others see it

__Image Support__:
Allow users to add images to bolster their profile and show potential recruiters a personal touch

__Discover Views for Students and Employers__:
Both employers and students have their own curated discovery queue of potential matches

__Like & Dislike__:
Allows employers to “like” any candidates and any students to “like” any recruiters to have the chance to match with each other. They can also “dislike” to avoid matching.





## Test Plan
Fill the database with dummy data to see if the matching algorithm is working as intended. As well as also test both the student view and employer view to ensure that everything is behaving as expected. Filling out employer prompts from a student perspective as well as testing Premium by creating full profiles for mock students and employers to test the profile pages and like tabs. Then tweak some aspects of those profiles to have some controlled variables and multiple very similar accounts to ensure that the weighting on the algorithm is working as intended.

* Hosted application: mighty-fjord-37266.herokuapp.com

## Authors
* William Darko (williamliamdarko@gmail.com)
* Rahin Rahman (rahincr2@gmail.com)
* Francisco Ruiz (fruiz@g.hmc.edu)
* Atta Saleh (attasaleh95@gmail.com)
* Boyeong Yoon (boyeong.nancy.yoon@gmail.com)


## Wiki
* [Project Proposal](https://github.com/CSCI-49900-Fall-2020/project-pladat/wiki/Project-Proposal)
* [Group Authored](https://github.com/CSCI-49900-Fall-2020/project-pladat/wiki/Group-Authored)
* [Final Written Report](https://github.com/CSCI-49900-Fall-2020/project-pladat/wiki/Final-Written-Report)
