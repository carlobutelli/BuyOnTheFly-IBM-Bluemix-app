# BuyOnTheFly Web Application

### Intro
The project has been made for a class of Developing Services for the Cloud at VU University and it would represent a simple web application made in **Node.js** and based on the **Express framework** (that provides a robust set of features for web and mobile applications). 

The web application, which basically is a simple online store, allows all the subscribed users to sell (and buy) items fastly and in their local area:

* An user (_seller_) who wants to give away old items, he will be able to sell them.
* An user (_buyer_) will be able to check all the available items (and their prices) in his local area and gets notified when a new item becomes available.

### Services
The application is developed on the [IBM Bluemix Cloud Platform][] and it uses a couple of its services:
* __Cloudant NoSQL DB__: used to store the items and users details
	1. User has to be registered in the system to be allowed to perform operation.
* __Single Sign On__: made by Google, Facebook and Cloud Directory just to provide a first authentication.
* __Internet of Things Foundation__: Send notifications based on the position of the delivery boxes. (This part has not been fully developed yet)


It also uses Gmail API:
* to send email to all the users in the same location when an item is available.
* to receive email when users want to contact an operator to ask something

### Link to the project

The application should still be running at [http://buyonthefly-group4.mybluemix.net/][]

[IBM Bluemix Cloud Platform]: http://www.ibm.com/cloud-computing/bluemix/
[http://buyonthefly-group4.mybluemix.net/]: http://buyonthefly-group4.mybluemix.net/

