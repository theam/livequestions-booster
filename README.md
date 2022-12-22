# Live Questions Booster BE

![256 png](https://user-images.githubusercontent.com/738853/205069300-7551a459-ed94-4c5e-80f1-36d3cb5b3066.jpeg)

This is the backend implementation of the Live Questions iOS app, which showcases the power and simplicity of using the Booster framework as a backend solution. 


## This project showcases
- **Event driven design:** 
The server is designed to process and respond to events rather than traditional requests, making it highly efficient as it can process multiple events concurrently and asynchronously.
- **Event sourcing and CQRS:** 
Stores all changes to the state of the backend as a sequence of events, like an event log, rather than in a traditional database, and use CQRS (Command and Query Responsibility Segregation) to separate the responsibilities of handling commands (inputs) and read models (outputs).
- **Domain-driven design:** 
Focus on defining the system in terms that are understandable by all stakeholders and breaking it down into small, cohesive components that represent different business entities and their relationships.
- **GraphQL API:** 
Booster generates a fully-working GraphQL API for your backend clients to use, without you worrying about writing resolvers or maintaining your GraphQL schema.
- **Scalability and reliability:** 
Booster offers scalability and reliability for high volume request and event handling, ensuring data consistency and availability through the use of cloud resources such as Lambdas, API Gateway, and DynamoDB.



## Booster Architecture

<img width="800" alt="Screenshot 2022-12-22 at 11 43 12" src="https://user-images.githubusercontent.com/738853/209127301-41972816-d5dd-4038-b116-772aecd1ef26.png">

## iOS App Repository
This is the GitHub repository for the iOS app Live Questions. [Live Questions iOS App](https://github.com/theam/livequestions-iOS)

## Articles
[Scalable Low-Code backends with Booster](https://medium.com/@juanSagasti/scalable-low-code-backends-with-booster-a32b9386dd27)

[From iOS Dev to full-stack in no time with Booster 🚀](https://medium.com/@juanSagasti/f2eda6463c40)


## License

Live Questions is released under the [MIT License](LICENSE).
