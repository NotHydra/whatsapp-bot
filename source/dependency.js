class Dependency {
    constructor() {
        this.commandArray = [
            {
                id: 1,
                command: "everyone",
                description: "mentions every member",
            },
            {
                id: 2,
                command: "hi",
                description: "reply with hello",
            },
            {
                id: 3,
                command: "hello",
                description: "reply with hi",
            },
            {
                id: 4,
                command: "credit",
                description: "creator's social media",
            },
            {
                id: 5,
                command: "help",
                description: "list all command",
            },
        ];
    }
}

module.exports = { Dependency }