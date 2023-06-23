const { Dependency } = require("./dependency");
const { AdminModel, GroupModel } = require("./model");

const dependency = new Dependency();

class Utility {
    constructor() {
        this.isAdmin = async (value) => {
            const isExist = await AdminModel.exists({ contact: value }).lean();

            if (isExist != null) {
                return true;
            } else {
                return false;
            }
        };

        this.prefixIsValid = async (remote, value) => {
            const groupObject = await GroupModel.findOne({ remote: remote }).select({ prefix: 1 }).lean();

            if (groupObject != null) {
                return dependency.prefixArray.includes(value) || groupObject.prefix.includes(value);
            } else {
                return dependency.prefixArray.includes(value);
            }
        };

        this.groupIsValid = async (value) => {
            const isExist = await GroupModel.exists({ remote: value }).lean();

            if (isExist != null) {
                return true;
            } else {
                return false;
            }
        };

        this.latestModelId = async (model) => {
            const modelObject = await model.findOne().select({ _id: 1 }).sort({ _id: -1 }).lean();

            if (modelObject != null) {
                return modelObject._id + 1;
            } else {
                return 1;
            }
        };

        this.randomNumber = (start, end) => {
            return Math.floor(Math.random() * (end - start) + start);
        };
    }
}

module.exports = { Utility };
