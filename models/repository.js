import fs from "fs";
import * as utilities from "../utilities.js";
let jsonFilesPath = "jsonFiles";
// res object wrapper
export default class Repository {
    constructor(model) {
        this.objectsList = null;
        this.model = model;
        this.objectsName = model.getClassName() + "s";
        this.objectsFile = `./${jsonFilesPath}/${this.objectsName}.json`;
    }

    objects() {
        if (this.objectsList == null) this.read();
        return this.objectsList;
    }
    read() {
        try {
            let rawdata = fs.readFileSync(this.objectsFile);
            this.objectsList = JSON.parse(rawdata);
            return true;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                this.objectsList = [];
                console.log(`The file ${this.objectsFile} does not exist, it will be created.`)
            } else
                console.log(error);
        }
        return false;
    }
    write() {
        try {
            fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
            return true;
        }
        catch (error) {
            console.log(error);
        }
        return false;
    }
    nextId() {
        let maxId = 0;
        for (let object of this.objects()) {
            if (object.Id > maxId) {
                maxId = object.Id;
            }
        }
        return maxId + 1;
    }
    checkConflict(instance) {
        let conflict = false;
        if (this.model.key)
            conflict = this.findByField(this.model.key, instance[this.model.key], instance.Id);
        if (conflict) {
            this.model.addError(`Unicity conflict on [${this.model.key}]...`);
            this.model.state.inConflict = true;
        }
        return conflict;
    }
    add(object) {
        delete object.Id;
        object = {"Id": 0, ... object};
        this.model.validate(object);
        if (this.model.state.isValid) {
            this.checkConflict(object);
            if (!this.model.state.inConflict) {
                object.Id = this.nextId();
                this.model.handleAssets(object);
                this.objectsList.push(object);
                this.write();
            }
        }
        return object;
    }
    update(id, objectToModify) {
        delete objectToModify.Id;
        objectToModify = {Id: id, ...objectToModify};
        this.model.validate(objectToModify);
        if (this.model.state.isValid) {
            let index = this.indexOf(objectToModify.Id);
            if (index > -1) {
                this.checkConflict(objectToModify);
                if (!this.model.state.inConflict) {
                    this.model.handleAssets(objectToModify, this.objectsList[index]);
                    this.objectsList[index] = objectToModify;
                    this.write();
                } 
            } else {
                this.model.addError(`The ressource [${objectToModify.Id}] does not exist.`);
                this.model.state.notFound = true;
            }
        }
        return objectToModify;
    }
    remove(id) {
        let index = 0;
        for (let object of this.objects()) {
            if (object.Id === id) {
                this.model.removeAssets(object)
                this.objectsList.splice(index, 1);
                this.write();
                return true;
            }
            index++;
        }
        return false;
    }
    getAll() {
        let objectsList = this.objects();
        let bindedDatas = [];
        if (objectsList)
            for (let data of objectsList) {
                bindedDatas.push(this.model.bindExtraData(data));
            };
        return bindedDatas;
    }
    get(id) {
        for (let object of this.objects()) {
            if (object.Id === id) {
                return this.model.bindExtraData(object);
            }
        }
        return null;
    }
    removeByIndex(indexToDelete) {
        if (indexToDelete.length > 0) {
            utilities.deleteByIndex(this.objects(), indexToDelete);
            this.write();
        }
    }
    findByField(fieldName, value, excludedId = 0) {
        if (fieldName) {
            let index = 0;
            for (let object of this.objects()) {
                try {
                    if (object[fieldName] === value) {
                        if (object.Id != excludedId) return this.objectsList[index];
                    }
                    index++;
                } catch (error) { break; }
            }
        }
        return null;
    }
    indexOf(id) {
        let index = 0;
        for (let object of this.objects()) {
            if (object.Id === id) return index;
            index++;
        }
        return -1;
    }
}
