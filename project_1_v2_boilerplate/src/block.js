/**
 *                          Block class
 *  The Block class is a main component into any Blockchain platform, 
 *  it will store the data and act as a dataset for your application.
 *  The class will expose a method to validate the data... The body of
 *  the block will contain an Object that contain the data to be stored,
 *  the data should be stored encoded.
 *  All the exposed methods should return a Promise to allow all the methods 
 *  run asynchronous.
 */

 const SHA256 = require('crypto-js/sha256');
 const hex2ascii = require('hex2ascii');
 
 class Block {
 
     // Constructor - argument data will be the object containing the transaction data
     constructor(data){
         this.hash = null;                                           // Hash of the block
         this.height = 0;                                            // Block Height (consecutive number of each block)
         this.body = Buffer.from(JSON.stringify(data)).toString('hex');   // Will contain the transactions stored in the block, by default it will encode the data
         this.time = 0;                                              // Timestamp for the Block creation
         this.previousBlockHash = null;                              // Reference to the previous Block Hash
     }
     
     /**
      *  validate() method will validate if the block has been tampered or not.
      *  Been tampered means that someone from outside the application tried to change
      *  values in the block data as a consecuence the hash of the block should be different.
      *  Steps:
      *  1. Return a new promise to allow the method be called asynchronous.
      *  2. Save the in auxiliary variable the current hash of the block (`this` represent the block object)
      *  3. Recalculate the hash of the entire block (Use SHA256 from crypto-js library)
      *  4. Compare if the auxiliary hash value is different from the calculated one.
      *  5. Resolve true or false depending if it is valid or not.
      *  Note: to access the class values inside a Promise code you need to create an auxiliary value `let self = this;`
      */
     validate() {
         let self = this;
         return new Promise((resolve, reject) => {
             try {
                 // Save in auxiliary variable the current block hash
                 const currentHash = self.hash;
                 self.hash = null;
                 // Recalculate the hash of the Block
                 const newHash = SHA256(JSON.stringify(self)).toString();
                 self.hash = currentHash;
                 // Comparing if the hashes changed and return true or false
                 if (currentHash == newHash) {
                     resolve(true)
                 } else {
                     resolve(false);
                 }
             } catch (err) {
                 reject(new Error(err));
             }
         });
     }
 
     
     getBData() {
         let self = this;
         return new Promise(async (resolve, reject) => {
             let encodedData = self.body;                                          
             let decodedData = hex2ascii(encodedData); 
             let parsedJsonData = JSON.parse(decodedData);
             
             if (self.height != 0 && self.height > 0) {
                 resolve(parsedJsonData);
             }
         });
     }
 
 }
 
 module.exports.Block = Block;                    // Exposing the Block class as a module