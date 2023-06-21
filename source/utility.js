const { Dependency } = require("./dependency");
const { AdminModel, GroupModel } = require("./model");

const dependency = new Dependency();

class Utility {
    constructor() {
        this.isAdmin = async (value) => {
            const isExist = await AdminModel.exists({ contact: value });

            console.log(isExist);
            if (isExist != null) {
                return true;
            } else {
                return false;
            }
        };

        this.prefixIsValid = (value) => {
            return dependency.prefixArray.includes(value);
        };

        this.groupIsValid = async (value) => {
            const isExist = await GroupModel.exists({ remote: value });

            if (isExist != null) {
                return true;
            } else {
                return false;
            }
        };
    }
}

module.exports = { Utility };
