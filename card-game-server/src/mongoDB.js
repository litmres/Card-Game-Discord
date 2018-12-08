module.exports = class DataBase{
    constructor(client, dbName, url){
        this.client = client;
        this.collectionObj = {};
        this.url = url;
        this.dbName = dbName;
        this.connectedDB = null;
        this.connect();
    }
    getCollectionObj(){
        return this.collectionObj;
    }
    getCollectionObjAsArray(){
        const array = [];
        for(const key in this.getCollectionObj()){
            if(key !== "_id"){
                const obj = {};
                obj.id = key;
                obj.card = this.collectionObj[key];
                array.push(obj);
            }
        }
        return array;
    }
    insertDocuments(callback) {
        const collection = this.connectedDB.collection('documents');
        collection.insertOne({_id:'discordMembers'}).catch();
    };
    updateDocuments(id, obj, name, callback) {
        const collection = this.connectedDB.collection('documents');
        collection.update({_id:id},{$set:{[name]:obj}},{upsert:true}).catch()
    };
    getAllDocuments(){
        this.collectionObj = {};
        const collection = this.connectedDB.collection('documents');
    
        collection.findOne({}, (err, result) => {
            if(err){
                console.log(err);
            }
            for(const key in result){
                if(key !== "_id"){
                    this.collectionObj[key] = result[key];
                }
            }
            console.log("updated collectionObj");
        });
    }
    connect(){
        this.client.connect(this.url, (err, client) => {
            if(err) {
                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
            }
            console.log("Connected successfully to db");
        
            this.connectedDB = client.db(this.dbName);
        
            this.getAllDocuments(this.connectedDB);
        });
    }
}

