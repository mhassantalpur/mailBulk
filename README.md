# Table of Contents

1.) [Introduction](#introduction) <br />
2.) [How to Use](#howToUse) <br />
3.) [Tech Stack](#techStack) <br />
4.) [Application General Architecture](#generalArch) <br />
5.) [Express Overview](#expressOverview) <br />
6.) [Express Infrastructure](#expressInfrastructure) <br />
7.) [User Flow](#userFlow) <br />
8.) [User Login State](#userLoginState) <br />
9.) [General OAuth Flow](#OAuthFlow) <br />
10.) [Cookie Based OAuth](#cookieOAuthFlow) <br />
11.) [User Cookie Authentication](#userCookieAuth) <br />
12.) [Mailer Object](#mailerSetup) <br />
13.) [Handling Mailer Requests](#mailerReq) <br />


<a name="introduction"></a>
## Introduction
Mail Bulk is a boilerplate demo application created by me to practice complex full stack concepts such as:
* Learning the architectural considerations of building a full stack app <br />
* Connecting a front-end Create-React-App server to a NodeJS and Express backend <br />
* Communicate data from your Mongo database to a React application <br />
* Understand how to route user requests on the front end with React Router and on the backend with Express <br />
* Build reusable user inputs with Redux Form, complete with navigation <br />
* Handle credit cards and receive payments from your users with Stripe <br />
* Engage users with automated emails <br />
* Enhance authentication flows in an app with Google OAuth authentication <br />
* Separate production and development resources with advanced API key handling techniques <br />


<a name="howToUse"></a>
## How to Use
1. Navigate to https://peaceful-plateau-53924.herokuapp.com/ <br />
2. Click Google Sign in at top right <br />
3. Add credits (no real information needed) <br />
4. Use DEMO stripe information: <br />
   * email: any email (example@email.com works!) <br />
   * card number: 4242 4242 4242 4242 <br />
   * date: any future MM/YY <br />
   * cvc: any 3 digit number <br />
5. Click red plus at bottom right to create survey <br />
6. Fill out survey form <br />

<a name="techStack"></a>
## Tech Stack
<p align="center">
    <img src="images/techStack.png" width="600" />
</p>

<a name="generalArch"></a>
## Application General Architecture
<p align="center">
    <img src="images/generalArchitecture.png" width="600" />
</p>

<a name="expressOverview"></a>
## Express Overview
<p align="center">
    <img src="images/expressOverview.png" width="600" />
</p>

<a name="expressInfrastructure"></a>
## Express Infrastructure
<p align="center">
    <img src="images/expressInfrastructure.png" width="600" />
</p>

<a name="userFlow"></a>
## User Flow
<p align="center">
    <img src="images/userFlow.png" width="600" />
</p>

<a name="userLoginState"></a>
## User Login State
<p align="center">
    <img src="images/userLoginState.png" width="600" />
</p>

<a name="OAuthFlow"></a>
## General OAuth Flow
<p align="center">
    <img src="images/OAuthFlow.png" width="750" />
</p>

<a name="cookieOAuthFlow"></a>
## Cookie Based OAuth
<p align="center">
    <img src="images/cookieOAuthFlow.png" width="750" />
</p>

<a name="userCookieAuth"></a>
## User Cookie Authentication
<p align="center">
    <img src="images/userCookieAuth.png" width="750" />
</p>

<a name="mailerSetup"></a>
## Mailer Object
<p align="right">
    <p align="left">
      This picture represents a Mailer Object. Mailer object is created as a class. The properties of the object will be subject and recipients (which both come from our survey object). Next the body of the mailer comes from our email template which gets properties passed in from our survey object. Finally, the from_email property is the "from" address specified in an email. In order to set these properties we create a function to.JSON() to translate our mailer object into json data. Finally, we take the json and send it to SendGrid to author and send off the actual email.
    </p>
    <img src="images/mailerSetup.png" width="750" />
</p>

<a name="mailerReq"></a>
## Handling Mailer Requests
<p align="left">
    In the approach illustrated below, we could create a seperate mailer object for every email recipient. This would overload requests for just a single survey. For example, if a user creates a survey for feedback from 1,000 recipients, then that request would create a seperate mailer for each recipient and communicate it to SendGrid in 1,000 seperate http requests. This would severly slow down our application. 
</p>
<p align="left">
  <img src="images/badMailer.png" width="650" />
</p>
<p align="left">
  Alternatively, we could do a batch operation by creating just one mailer object for all recipients. This would send an identical email template to all recipients. Since every recipient gets the same Mailer Object we need to identify unique users so our data is not manipulated. This is where SendGrid comes into play. SendGrid allocates their own metrics by using the links provided in the email. So if a user clicks the "no" link, they are sent to a SendGrid server to allocate metric data, before being routed to the "no" links destination. SendGrid then sends a messege to our server telling us about a user clicking a link. We use the 'token' provided by SendGrid in the messege to differentiate unique users. 
</p>
<p align="left">
  <img src="images/goodMailer.png" width="650" />
</p>
