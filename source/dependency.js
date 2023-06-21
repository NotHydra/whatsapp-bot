class Dependency {
    constructor() {
        this.prefixArray = ["!its", "!itk", "!if"]
        
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
