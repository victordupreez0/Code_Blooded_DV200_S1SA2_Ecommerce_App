## Code Blooded Summative Assessment 2
### Victor du Preez - Rikus Pretorius - David Golding 
#### Interactive Development, Second Year


https://github.com/victordupreez0/Code_Blooded_DV200_S1SA2_Ecommerce_App
> ## Billionaire$ Ecommerce
> Exclusive Acquisitions For The Discerning Few

##### [Demo Video]()

## Table of Contents

* [About the Project](#about-the-project)
  * [Project Description](#project-description)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [How to install](#how-to-install)
* [Features and Functionality](#features-and-functionality)
* [Concept Process](#concept-process)
   * [Ideation](#ideation)
   * [Wireframes](#wireframes)
   * [User-flow](#user-flow)
* [Development Process](#development-process)
   * [Implementation Process](#implementation-process)
        * [Highlights](#highlights)
        * [Challenges](#challenges)
   * [Reviews and Testing](#peer-reviews)
        * [Feedback from Reviews](#feedback-from-reviews)
        * [Unit Tests](#unit-tests)
   * [Future Implementation](#peer-reviews)
* [Final Outcome](#final-outcome)
    * [Mockups](#mockups)
    * [Video Demonstration](#video-demonstration)
* [Conclusion](#conclusion)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

## About the Project

![HomePage](./readmeImages/HomePage)

### Project Description

Billionaire$ is a premium eCommerce platform built for the elite. Designed with the ultra-wealthy in mind, our site allows users to upload and showcase their luxurious products through a custom dashboard experience. Whether it’s a diamond-studded yacht or a one-of-a-kind timepiece, Billionaire$ gives users the power to post, engage, and sell in a marketplace that speaks their language — luxury.

### Built With

[![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://www.javascript.com/)  
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)  
[![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en)  
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)  
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)  
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)  
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)  
[![Radix UI](https://img.shields.io/badge/Radix_UI-000000?style=for-the-badge&logo=radixui&logoColor=white)](https://www.radix-ui.com/)  

## Getting Started

The following instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)

## How to install


### Clone Repository 
Go to the GitHub Repository and clone to your local machine:
   ```sh
   https://github.com/victordupreez0/Code_Blooded_DV200_S1SA2_Ecommerce_App
   ```


### Install Dependencies 
Run the following in the command-line to install all the required dependencies:
   ```sh
   npm install
   ```
### Start Backend
Navigate to the backend folder:
   ```sh
   cd backend
   ```
Then run the following in the command-line to start the backend:
   ```sh
   npm run devStart
   ```
### Start Frontend
Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
Then run the following in the command-line to start the frontend:
   ```sh
   npm run dev
   ```
Finally, follow the localhost link provided by the Vite build manager.

## Features and Functionality

- User authentication (register, login)
- Product browsing and search
- Shopping cart functionality
- Product details and image gallery
- Responsive design with Tailwind CSS
- Modular React components and hooks

## Concept Process

The `Conceptual Process` is the set of actions, activities and research that was done when starting this project.


### Wireframes

![Wireframes](./readmeImages/Wireframes)


## Development Process

The `Development Process` is the technical implementations and functionality done in the frontend and backend of the application.

### Implementation Process

To support the scale and luxury of Billionaire$, our system architecture prioritises modularity, performance, and security:

#### Frontend
React with Vite for lightning-fast builds and dev experience
Tailwind CSS + Shad cn/ui for a rich, responsive UI with gold-accented luxury styling
Component-based structure for reusable and scalable UI elements
Client-side filtering and dynamic rendering for a smooth marketplace experience

#### Backend
Node.js server handles core business logic and routing
RESTful API design for clear separation between frontend and backend logic
Express for simplified route handling and middleware integration

#### Database
MongoDB stores user profiles, product listings, comments, flags, and cart data
Flexible schema design accommodates diverse product types and rich metadata

#### Authentication
Email/password login with secure password hashing
Session management ensures secure user access to dashboards and marketplace features



#### Highlights

- Users can upload, edit, and delete their own luxury products
- Products can be commented on, added to cart, and flagged
- Filtering system allows sorting by price range and product category


### Reviews & Testing

Throughout development, our team followed a collaborative testing approach to ensure a smooth and reliable experience for users.

#### Peer Testing
Team members regularly tested each other’s features during development
Feedback loops were quick and direct, allowing us to fix bugs and improve usability in real-time
Edge cases (e.g. empty form submissions, invalid inputs) were manually tested across core features

#### UI & UX Validation
The look and feel of the platform — especially the luxury aesthetic — was refined through constant peer review
We focused on ensuring product uploads, filtering, commenting, and cart functionality were intuitive and bug-free

#### Why This Worked
Allowed for rapid iteration and agile problem-solving
Ensured that every feature worked as intended across the team before final integration


### Future Implementation
We’ve laid a strong foundation for Billionaire$, and we’re excited to expand its features and scale the platform. Here’s what’s next:

#### Secure Payment Integration
Implement traditional payment processing (e.g. Stripe) to allow direct purchases
Add crypto payment support (e.g. Ethereum) for flexibility and global access
Add seller verification to protect high-value transactions

#### Advanced Filtering & Search
Improve discoverability by adding advanced filters like product tags, brand, seller reputation, and more
Implement fuzzy search* and sorting options (e.g. newest, most expensive, most liked)

***Note: Fuzzy search is a technique that finds matches even when the search query isn't a perfect match to the data.***

#### Formal Unit Testing
Introduce unit testing using Vitest or Jest to ensure reliability of critical features like cart management and product uploads
Add automated test coverage reports for code quality tracking

#### Media Optimization
Use services like Cloudinary or ImageKit to compress and serve high-resolution product images
Support for product videos or 360° views for high-end listings

#### AI-Powered Features
Smart product recommendations based on browsing history or user behavior
AI-assisted product description generation for sellers

## Final Outcome

### Mockups

![Mockup1](./readmeImages/Mockup1)
![Mockup2](./readmeImages/Mockup2)

### Video Demonstration

To see a run through of the application, click below:

[View Demo](path/to/video/demonstration)

## Authors

* **Victor du Preez 241250** - [GitHub Profile](https://github.com/victordupreez0)
* **Rikus Pretorius 241044** - [GitHub Profile](https://github.com/wrapperik)
* **David Golding 200238** - [GitHub Profile](https://github.com/DavidGolding200238)

## Acknowledgements

* [The Open Window Institute](https://www.openwindow.co.za/) - Our university.
* Tsungai Katsuro - Our lecturer.