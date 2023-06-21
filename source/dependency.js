class Dependency {
    constructor() {
        this.botContact = "628971252551@c.us"
        this.adminArray = ["6281351419966@c.us"]
        this.prefixArray = ["!hyd", "!its", "!itk", "!if"]
        this.whitelistArray = ["120363160523723298@g.us"]

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
