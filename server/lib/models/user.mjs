import mongoose from 'mongoose';
import Schema from mongoose.Schema;
import bcrypt from 'bcryptjs';

const RequiredString = {
  type: String,
  required: true
};

const schema = new Schema({
  name: RequiredString,
  hash: RequiredString,
  gameLog: []
});

schema.static('exists', function(query){
  return.this.find(query)
  .count()
  .then(count => (count > 0));
});

schema.method('generateHash', function(password) {
  this.hash = bcrypt.hashSync(password, 7);
});

schema.method('comparePassword', function(password) {
  return bcrypt.compareSync(password, this.hash);
});

module.exports = mongoose.model('User', schema)