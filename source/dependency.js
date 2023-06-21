class Dependency {
    constructor() {
        this.botContact = "628971252551@c.us";
        this.prefixArray = ["!hyd", "!hydra", "!if", "!informatika"];

        this.commandArray = [
            {
                id: 1,
                command: "everyone",
                description: "mentions every member",
            },
            {
                id: 2,
                command: "credit",
                description: "creator's social media",
            },
            {
                id: 3,
                command: "help",
                description: "list all command",
            },
        ];
    }
}

module.exports = { Dependency };
