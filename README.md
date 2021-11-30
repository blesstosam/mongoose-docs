## 快速开始

1. ORM: Object Relation Mapping，把对数据库的操作都封装到对象中，操作了对象，就相当于操作了数据库
1. Schema：用于定义实体，mongoose 由 Schema 驱动

```javascript
const kittySchema = new mongoose.Schema({
  name: String
});
```

3. Model: 用来构造 document 的类，Model 由 Schema 编译成

```javascript
const Kitten = mongoose.model('Kitten', kittySchema);
```

4. document：mongodb 里的一条数据，使用 new Model() 生成

```javascript
// 生成一条document
const silence = new Kitten({ name: 'Silence' });
// 保存document
silence.save((err, silence) => {
  if (err) return console.error(err);
});
// 查找document
Kitten.find((err, kittens) => {
  if (err) return console.error(err);
  console.log(kittens);
});
```

总结：我的感觉是 schema 可以去掉，直接通过 `mongoose.model('Kitten', {name: String})` 更加方便，事实上，由 schema 转化为 model 调用的方法都一样，属于模板代码，没有自定义的逻辑。
我这种想法也被其他库实现了，比如 typegoose，就是直接定义 model。

## 教程

### Schemas

Moongoose 的一切从 Schema 开始，每个 schema 映射到一个 MongoDB 的集合（表）并定义表中文档的形状。schema 中每个 key 都代表文档中的一个属性，并会转化为其定义的类型。
schema 不仅可以定义文档的结构，还可以定义文档的**实例方法，静态 model 方法，索引和钩子函数（中间件）**。

```javascript
import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});
```

如果后面想加新的字段，可以调用 `Schema#add` 方法。
字段也可以设置成包含更深的 key/type 定义的嵌套对象，比如上面的 meta 字段。当字段的值为一个 `POJO` （普通 js 对象）时可以这么使用。

#### 允许定义的类型

- [String](https://mongoosejs.com/docs/schematypes.html#strings)
- [Number](https://mongoosejs.com/docs/schematypes.html#numbers)
- [Date](https://mongoosejs.com/docs/schematypes.html#dates)
- [Buffer](https://mongoosejs.com/docs/schematypes.html#buffers)
- [Boolean](https://mongoosejs.com/docs/schematypes.html#booleans)
- [Mixed](https://mongoosejs.com/docs/schematypes.html#mixed)
- [ObjectId](https://mongoosejs.com/docs/schematypes.html#objectids)
- [Array](https://mongoosejs.com/docs/schematypes.html#arrays)
- [Decimal128](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-Decimal128)
- [Map](https://mongoosejs.com/docs/schematypes.html#maps)

#### 创建 model

```javascript
const Blog = mongoose.model('Blog', blogSchema);
```

#### Ids

Mongoose 会默认给 schema 添加一个 \_id 属性，\_id 的类型为 ObjectId。你可以重写\_id 的类型，但是在调用 save 之前要设置 \_id 的值，否则 Mongoose 会报错

```javascript
const schema = new Schema({ _id: Number });
const Model = mongoose.model('Test', schema);

const doc = new Model();
await doc.save(); // Throws "document must have an _id before saving"

doc._id = 1;
await doc.save(); // works
```

#### 实例方法

指的是 document 的方法，document 是 Model 类的实例。document 有很多内置的方法，你也可以定义自己方法。自定义方法有 2 点需要注意：

- 重写内置方法可能会导致未知错误，需要慎重
- 不能使用箭头函数，因为无法使用 this 访问当前的 document

下面是例子:

```javascript
// define a schema
const animalSchema = new Schema({ name: String, type: String });

// assign a function to the "methods" object of our animalSchema
animalSchema.methods.findSimilarTypes = function (cb) {
  return mongoose.model('Animal').find({ type: this.type }, cb);
};

const Animal = mongoose.model('Animal', animalSchema);
const dog = new Animal({ type: 'dog' });

// 使用方法，就和使用find一样
dog.findSimilarTypes((err, dogs) => {
  console.log(dogs); // woof
});
```

#### 静态方法

你可以给 model 添加静态方法，通过 `schema.statics` 或者 `Schema#static` 函数。注意不能使用箭头函数因为无法使用 this 访问当前的 document。

```javascript
// Assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function (name) {
  return this.find({ name: new RegExp(name, 'i') });
};
// Or, equivalently, you can call `animalSchema.static()`.
animalSchema.static('findByBreed', function (breed) {
  return this.find({ breed });
});

const Animal = mongoose.model('Animal', animalSchema);
let animals = await Animal.findByName('fido');
animals = animals.concat(await Animal.findByBreed('Poodle'));
```

#### Query Helpers

query helpers 和实例方法类似但是用于查询。该方法可以在查询时使用链式语法调用。

```javascript
animalSchema.query.byName = function (name) {
  return this.where({ name: new RegExp(name, 'i') });
};

const Animal = mongoose.model('Animal', animalSchema);

Animal.find()
  .byName('fido')
  .exec((err, animals) => {
    console.log(animals);
  });

Animal.findOne()
  .byName('fido')
  .exec((err, animal) => {
    console.log(animal);
  });
```

#### 索引

MongoDB 支持 [索引](https://docs.mongodb.com/manual/indexes/)，你可以在 Schema 内的 path（属性）或 schema 级别上设置索引。当设置 [复合索引](https://docs.mongodb.com/manual/core/index-compound/) 时需要在 schema 级别上设置。

```javascript
const animalSchema = new Schema({
  name: String,
  type: String,
  tags: { type: [String], index: true } // field level
});

animalSchema.index({ name: 1, type: -1 }); // schema level
```

当应用启动，Mongoose 会自动为 schema 定义的每个 index 调用 createIndex 方法。Mongoose 会按顺序调用 createIndex 方法，当调用成功或失败都会触发一个 `index` 事件到 model。这个行为在开发阶段很好，但是在生产阶段会导致 [严重的性能问题](https://docs.mongodb.com/manual/core/index-creation/#index-build-impact-on-database-performance)，所以最好在生产阶段关闭这个行为。

```javascript
mongoose.connect('mongodb://user:pass@localhost:port/database', { autoIndex: false });
// or
mongoose.createConnection('mongodb://user:pass@localhost:port/database', { autoIndex: false });
// or
animalSchema.set('autoIndex', false);
// or
new Schema({..}, { autoIndex: false });
```

Mongoose 会触发一个 `index` 事件到 model，你可以监听该事件。

```javascript
// Will cause an error because mongodb has an _id index by default that
// is not sparse
animalSchema.index({ _id: 1 }, { sparse: true });
const Animal = mongoose.model('Animal', animalSchema);

Animal.on('index', (error) => {
  // "_id index cannot be sparse"
  console.log(error.message);
});
```

#### Virtuals

#### 别名

#### Options

- [autoIndex](#p3NLC)
- [autoCreate](#J0AYf)
- [bufferCommands](#EK5jM)
- [bufferTimeoutMS](#Fw2QB)
- [capped](#smzr0)
- [collection](#WDUvr)
- [discriminatorKey](#uAvYW)
- [id](#OGAcP)
- [\_id](#pwvJY)
- [minimize](#Fy56G)
- [read](#x9XNl)
- [writeConcern](#i57oR)
- [shardKey](#aNgRm)
- [strict](#wmsc0)
- [strictQuery](#IuE2F)
- [toJSON](#dhAOM)
- [toObject](#fwI99)
- [typeKey](#KMm6Y)
- [validateBeforeSave](#zaLXh)
- [versionKey](#xSpeR)
- [optimisticConcurrency](#dZgk7)
- [collation](#IIg39)
- [skipVersioning](#c9F59)
- [timestamps](#P6x3K)
- [useNestedStrict](#M9suj)
- [selectPopulatedPaths](#TpjZN)
- [storeSubdocValidationError](#LfAFD)

##### autoIndex

默认情况下，当在成功连接 MongoDB 后，Mongoose 的 `init()` 函数会通过调用 `Model.createIndexes` 方法创建你在 schema 里定义的所有索引。自动创建索引在开发和测试环境非常好，但是索引的构建对于生产数据库也会产生重大负载（significant load）。如果你想在生产中小心地管理索引，你可以将 `autoIndex` 设置为 false。

```javascript
const schema = new Schema({..}, { autoIndex: false });
const Clock = mongoose.model('Clock', schema);
Clock.ensureIndexes(callback);
```

也可以全局设置该属性 `mongoose.set('autoIndex', false)` 。

##### autoCreate

​

##### bufferCommands

##### bufferTimeoutMS

##### capped

Mongoose 支持**固定集合，**要设置一个集合为固定集合，添加 capped 选项并设置其大小，单位为 bytes

```javascript
new Schema({..}, { capped: 1024 });
```

##### collection

##### discriminatorKey

##### id

##### \_id

##### minimize

##### read

##### writeConcern

##### shardKey

##### strict

##### strictQuery

##### toJSON

##### toObject

##### typeKey

##### validateBeforeSave

##### versionKey

每一个 document 初次创建的时候会设置一个 versionKey。这个 key 的值包含了文档的内部版本。versionKey 选项是一个字符串，表示版本控制字段的路径。默认的路径是 `__v` 。如果和你的应用有冲突你可以这样设置：

```javascript
const schema = new Schema({ name: 'string' });
const Thing = mongoose.model('Thing', schema);
const thing = new Thing({ name: 'mongoose v3' });
await thing.save(); // { __v: 0, name: 'mongoose v3' }

// customized versionKey
new Schema({..}, { versionKey: '_somethingElse' })
const Thing = mongoose.model('Thing', schema);
const thing = new Thing({ name: 'mongoose v3' });
thing.save(); // { _somethingElse: 0, name: 'mongoose v3' }
```

请注意 Mongoose 默认的版本控制不是一个完整的 [optimistic concurrency](https://en.wikipedia.org/wiki/Optimistic_concurrency_control) 方案，其版本控制只作用于数组，如下所示。如果你需要 optimistic concurrency 支持，你可以设置 optimisticConcurrency 选项。

```javascript
// 2 copies of the same document
const doc1 = await Model.findOne({ _id });
const doc2 = await Model.findOne({ _id });

// Delete first 3 comments from `doc1`
doc1.comments.splice(0, 3);
await doc1.save();

// The below `save()` will throw a VersionError, because you're trying to
// modify the comment at index 1, and the above `splice()` removed that
// comment.
doc2.set('comments.1.body', 'new comment');
await doc2.save();
```

你还可以设置 versionKey 为 false 禁用版本控制。_**不要**禁用版本控制除非 _[_你知道你在做什么_](http://aaronheckmann.blogspot.com/2012/06/mongoose-v3-part-1-versioning.html)。

```javascript
new Schema({..}, { versionKey: false });
const Thing = mongoose.model('Thing', schema);
const thing = new Thing({ name: 'no versioning please' });
thing.save(); // { name: 'no versioning please' }
```

Mongoose 只会在你调用 `save()` 时更新这个 version key 的值。如果你使用 `update()`, `findOneAndUpdate`, etc，Mongoose 不会更新该值。针对此有一种解决方法，你可以使用下面的中间件。

```javascript
schema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate();
  if (update.__v != null) {
    delete update.__v;
  }
  const keys = ['$set', '$setOnInsert'];
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});
```

##### optimisticConcurrency

##### collation

##### skipVersioning

##### timestamps

##### useNestedStrict

##### selectPopulatedPaths

##### storeSubdocValidationError

### SchemaTypes

### Connections

### Models

Model 由 schema 编译而来，Model 实例被称为 document。Model 负责从数据库创建和读取 document。
​

#### 编译 model

```javascript
const schema = new mongoose.Schema({ name: 'string', size: 'string' });
const Tank = mongoose.model('Tank', schema);
```

model 方法的第一个参数应为集合名称的单数形式。Mongoose 会自动使用其**复数的并且小写的版本**作为集合的名称。比如上述 Tank 对应的数据库集合名称为 tanks。
Note：model 方法会复制一份 schema。要确保在调用该方法前将所有的属性和方法，包括钩子都加到 schema 上了。
​

#### 创建 document

#### 查询

#### 删除

#### 更新

#### Change Streams


## Documents

Mongoose 的 document 一对一的对应着 MongoDB 存储的 document。每个 document 都是它对应 Model 的实例。
​

### Documents vs Models

Documents 和 Models 在 Mongoose 里是不同的类。Model 是 Document 的子类，所以当你 new 一个 Model 的时候，实际上你创建了一个 document。

```javascript
const MyModel = mongoose.model('Test', new Schema({ name: String }));
const doc = new MyModel();

doc instanceof MyModel; // true
doc instanceof mongoose.Model; // true
doc instanceof mongoose.Document; // true
```

### 取回

当调用 Model 的静态方法比如 `findOne`，返回结果（要使用 await）是 document。

```javascript
const doc = await MyModel.findOne();

doc instanceof MyModel; // true
doc instanceof mongoose.Model; // true
doc instanceof mongoose.Document; // true
```

​

### 使用 save 方法更新

Mongoose document 会跟踪变化。你可以通过普通赋值来修改 document 的属性，调用 save 方法后 Mongoose 会转化成 MongoDB 的 update 操作。

```javascript
doc.name = 'foo';

// Mongoose sends an `updateOne({ _id: doc._id }, { $set: { name: 'foo' } })` to MongoDB
await doc.save();
```

save 方法返回 promise，成功结果通过 resolve 方法接收，抛错通过 catch 来接收。

### 使用 Queries 更新

更新文档一般会使用 save 方法，使用 save，你可以获得完整的 validation 和 middleware。
对于某些场景使用 save 不够灵活，所以 Mongoose 可以让你不执行 middleware 和使用有限的 validation 就可以完成文档的更新操作。

### Validating

文档在**保存**之前会被转换和校验。Mongoose 首先会将值转化为定义的类型然后在校验它们。从内部看，Mongoose 会在**保存**之前调用 validate 方法。

```javascript
const schema = new Schema({ name: String, age: { type: Number, min: 0 } });
const Person = mongoose.model('Person', schema);

let p = new Person({ name: 'foo', age: 'bar' });
// Cast to Number failed for value "bar" at path "age"
await p.validate();

let p2 = new Person({ name: 'foo', age: -1 });
// Path `age` (-1) is less than minimum allowed value (0).
await p2.validate();
```

对于更新操作，默认是不进行校验的，但是你可以设置 `runValidators: true` 来让其进行校验。

```javascript
// Cast to number failed for value "bar" at path "age"
await Person.updateOne({}, { age: 'bar' });

// Path `age` (-1) is less than minimum allowed value (0).
await Person.updateOne({}, { age: -1 }, { runValidators: true });
```

### Overwriting

## Subdocuments

## Queries

Mongoose 的 Models 提供了一些静态方法来做 CRUD 操作，每个方法都会返回一个 Query 对象。
query 的执行有两种方式，，一个是传递回调函数，一个是调用 then 方法（有 then 方法，但其并不 是 promise 对象）。
​

### Executing

传递回调函数的方式，可以传递一个对象。回调的范式和 NodeJs 一样，`callback(error, result)`

```javascript
const Person = mongoose.model('Person', yourSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err) return handleError(err);
  // Prints "Space Ghost is a talk show host".
  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation);
});
```

上面的调用方式和下面类似，并且可以使用链式调用方法

```javascript
// find each person with a last name matching 'Ghost'
const query = Person.findOne({ 'name.last': 'Ghost' })
  .select('name occupation')
  .exec(function (err, person) {
    if (err) return handleError(err);
    console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation);
  });
```

### Queries 不是 Promises

Queries 不是 promises，但是有 then 方法，所以可以使用 async/await 来获取结果。和 promises 不同的是，then 的每一次调用都会执行一次查询。
混合使用 promise（使用 await 方法）和回调函数会导致 query 执行两次，下面的代码会插入两条 tag 到数组里。

```javascript
const BlogPost = mongoose.model(
  'BlogPost',
  new Schema({
    title: String,
    tags: [String]
  })
);

// Because there's both `await` **and** a callback, this `updateOne()` executes twice
// and thus pushes the same string into `tags` twice.
const update = { $push: { tags: ['javascript'] } };
await BlogPost.updateOne({ title: 'Introduction to Promises' }, update, (err, res) => {
  console.log(res);
});
```

### References to other documents

MongoDB 里没有 join 操作，但是有 populate 方法可以达到类似效果。

### Streaming

### 对比 Aggregation

### Query Casting

第一个传递给 `Model.find(), Model.findOne(), Query#find()` 的参数被称为过滤器，或者叫查询条件。

```javascript
const query = Character.find({ name: 'Jean-Luc Picard' });
query.getFilter(); // `{ name: 'Jean-Luc Picard' }`

// Subsequent chained calls merge new properties into the filter
query.find({ age: { $gt: 50 } });
query.getFilter(); // `{ name: 'Jean-Luc Picard', age: { $gt: 50 } }`
```

### Lean Option

lean option 会让 Mongoose 跳过 document 和返回结果的混合，可以使查询更快更节省内存，但是返回结果是 `plain ordinary JavaScript objects (POJOs)`，而非 Mongoose document。
使用 lean 和不使用的区别

```javascript
const schema = new mongoose.Schema({ name: String });
const MyModel = mongoose.model('Test', schema);

await MyModel.create({ name: 'test' });

// Module that estimates the size of an object in memory
const sizeof = require('object-sizeof');

const normalDoc = await MyModel.findOne();
// To enable the `lean` option for a query, use the `lean()` function.
const leanDoc = await MyModel.findOne().lean();

sizeof(normalDoc); // approximately 600
sizeof(leanDoc); // 36, more than 10x smaller!

// In case you were wondering, the JSON form of a Mongoose doc is the same
// as the POJO. This additional memory only affects how much memory your
// Node.js process uses, not how much data is sent over the network.
JSON.stringify(normalDoc).length === JSON.stringify(leanDoc.length); // true
```

使用 lean 的时机，一般来说，只要不改变 docment，就可以使用 lean。即对于 Restful API 来说，get 方法可以使用 lean，而 post，put 等不能使用 lean。
使用 lean：

```javascript
// As long as you don't need any of the Person model's virtuals or getters,
// you can use `lean()`.
app.get('/person/:id', function (req, res) {
  Person.findOne({ _id: req.params.id })
    .lean()
    .then((person) => res.json({ person }))
    .catch((error) => res.json({ error: error.message }));
});
```

不使用 lean：

```javascript
// As long as you don't need any of the Person model's virtuals or getters,
// you can use `lean()`.
app.get('/person/:id', function (req, res) {
  Person.findOne({ _id: req.params.id })
    .lean()
    .then((person) => res.json({ person }))
    .catch((error) => res.json({ error: error.message }));
});
```

## Validation

## Middleware

## Populate

MongoDB 从 v3.2 开始有了 join-like 的 [$lookup](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/) 聚合操作。Mongoose 有个更强大的可替代的 `populate()` API，可以让你引用其他集合的文档。
Population 是一个自动替换文档中某个特定字段为其他集合文档的过程。我们可以 populate 单个文档，多个文档，一个普通的对象，多个对象或从 query 返回的所有对象。看下面的例子。

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);
```

目前为止我们创建了两个 Model。Person Model 有一个 stories 字段被设置成 ObjectId 的数组，ref 选项告诉 Mongoose 在 population 过程中使用哪个 model，在我们的例子中是 Story 这个 model。所有保存的 \_id 都必须是 Story model 创建的文档的 \_id。
请注意：ObjectId，Number，String 和 Buffer 都可以作为 refs。但是，你应该首选 ObjectId，除非你是高阶使用者并且你有足够的理由这么做。

- [Saving Refs](https://mongoosejs.com/docs/populate.html#saving-refs)
- [Population](https://mongoosejs.com/docs/populate.html#population)
- [Checking Whether a Field is Populated](https://mongoosejs.com/docs/populate.html#checking-populated)
- [Setting Populated Fields](https://mongoosejs.com/docs/populate.html#setting-populated-fields)
- [What If There's No Foreign Document?](https://mongoosejs.com/docs/populate.html#doc-not-found)
- [Field Selection](https://mongoosejs.com/docs/populate.html#field-selection)
- [Populating Multiple Paths](https://mongoosejs.com/docs/populate.html#populating-multiple-paths)
- [Query conditions and other options](https://mongoosejs.com/docs/populate.html#query-conditions)
- [Refs to children](https://mongoosejs.com/docs/populate.html#refs-to-children)
- [Populating an existing document](https://mongoosejs.com/docs/populate.html#populate_an_existing_mongoose_document)
- [Populating multiple existing documents](https://mongoosejs.com/docs/populate.html#populate_multiple_documents)
- [Populating across multiple levels](https://mongoosejs.com/docs/populate.html#deep-populate)
- [Populating across Databases](https://mongoosejs.com/docs/populate.html#cross-db-populate)
- [Dynamic References via `refPath`](https://mongoosejs.com/docs/populate.html#dynamic-ref)
- [Populate Virtuals](https://mongoosejs.com/docs/populate.html#populate-virtuals)
- [Populate Virtuals: The Count Option](https://mongoosejs.com/docs/populate.html#count)
- [Populating Maps](https://mongoosejs.com/docs/populate.html#populating-maps)
- [Populate in Middleware](https://mongoosejs.com/docs/populate.html#populate-middleware)

#### 保存 refs

保存 refs 和保存一个普通的属性一样，只需要你把值赋给 \_id：

```javascript
const author = new Person({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50
});

author.save(function (err) {
  if (err) return handleError(err);

  const story1 = new Story({
    title: 'Casino Royale',
    author: author._id // assign the _id from the person
  });

  story1.save(function (err) {
    if (err) return handleError(err);
    // that's it!
  });
});
```

#### Population

目前为止我们没做什么特别不同的事，我们只不过创建了一个 Persion 和 Story。现在我们来看看使用查询构建器填充 story 的 `author` 字段。

```javascript
Story.findOne({ title: 'Casino Royale' })
  .populate('author')
  .exec(function (err, story) {
    if (err) return handleError(err);
    console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"
  });
```

填充后的字段不再是之前的 \_id，**通过在返回结果之前执行一个单独的查询**，将它们的值替换为从数据库返回的 mongoose 文档。
refs 数组也是同样的工作方式。只需要调用 query 上的 populate 方法，之前的 \_ids 会被一个文档数组替换。

#### Setting Populated Fields

你可以通过将属性设置成文档来手工填充一个字段。这个文档必须是 ref 所引用的 model 的实例。

```javascript
Story.findOne({ title: 'Casino Royale' }, function (error, story) {
  if (error) {
    return handleError(error);
  }
  story.author = author;
  console.log(story.author.name); // prints "Ian Fleming"
});
```

#### 检查一个字段是否被填充

你可以调用 `populated()` 方法来检查一个字段是否被填充了。如果 `populated()` 返回 [truthy value](https://masteringjs.io/tutorials/fundamentals/truthy)，你就可以假定这个字段被填充了。

```javascript
story.populated('author'); // truthy

story.depopulate('author'); // Make `author` not populated anymore
story.populated('author'); // undefined
```

一个检查某个字段是否被填充的理由是为了获取其 \_id。然而，为了提供便利，Mongoose 给 ObjectId 的实例增加了一个 \_id 的 getter，所以你可以使用 `story.author._id` 不管 `author` 是否被填充.

```javascript
story.populated('author'); // truthy
story.author._id; // ObjectId

story.depopulate('author'); // Make `author` not populated anymore
story.populated('author'); // undefined

story.author instanceof ObjectId; // true
story.author._id; // ObjectId, because Mongoose adds a special getter
```

#### 如果没有 Foreign Document 呢？

Mongoose 的填充表现地不像传统的 [SQL joins](https://www.w3schools.com/sql/sql_join.asp) 那样，当没有文档的时候，`story.author` 会返回 null。这个和 SQL 的 [left join](https://www.w3schools.com/sql/sql_join_left.asp) 类似。

```javascript
await Person.deleteMany({ name: 'Ian Fleming' });

const story = await Story.findOne({ title: 'Casino Royale' }).populate('author');
story.author; // `null`
```

如果你的 StorySchema 有一个数组类型的 authors 字段，`populate()` 会返回一个空数组。

```javascript
const storySchema = Schema({
  authors: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  title: String
});

// Later

const story = await Story.findOne({ title: 'Casino Royale' }).populate('authors');
story.authors; // `[]`
```

#### 字段选择

如果我们只想要填充过的文档返回几个特定的字段呢？这可以通过将通常的 [字段名语法](https://mongoosejs.com/docs/api.html#query_Query-select) 作为第二个参数传递给 populate 方法来实现。

```javascript
Story.findOne({ title: /casino royale/i })
  .populate('author', 'name') // only return the Persons name
  .exec(function (err, story) {
    if (err) return handleError(err);

    console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"

    console.log('The authors age is %s', story.author.age);
    // prints "The authors age is null"
  });
```

#### 填充多个字段

如果我们想一次性填充多个字段呢？

```javascript
Story.
  find(...).
  populate('fans').
  populate('author').
  exec();
```

如果你使用同一个字段多次调用 `populate` 方法，只有最后一个才起作用。

```javascript
// The 2nd `populate()` call below overwrites the first because they
// both populate 'fans'.
Story.find().populate({ path: 'fans', select: 'name' }).populate({ path: 'fans', select: 'email' });
// The above is equivalent to:
Story.find().populate({ path: 'fans', select: 'email' });
```

#### 查询条件和其他选项

如果我们想根据 age 填充 fans 数组并只选择其 name 字段呢？

```javascript
Story.find()
  .populate({
    path: 'fans',
    match: { age: { $gte: 21 } },
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'name -_id'
  })
  .exec();
```

match 选项不会过滤掉 Story 文档。如果没有文档满足 match，你会获得带有空的 fans 数组的 Story 文档。
例如，假设你 `populate()` 一个 story 的 author 并且 author 没有满足 match，story 文档的 author 字段会是 null。

```javascript
const story = await Story.findOne({ title: 'Casino Royale' })
  .populate({ path: 'author', name: { $ne: 'Ian Fleming' } })
  .exec();
story.author; // `null`
```

一般情况下，你无法使得 `populate()` 基于 story 的 author 字段的属性去过滤 stories 。例如，下面的查询不会返回任何结果，即使 author 被填充了。

```javascript
const story = await Story.findOne({ 'author.name': 'Ian Fleming' }).populate('author').exec();
story; // null
```

如果你想根据 author 的 name 属性去过滤 stories，你应该使用 [denormalization](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-3)。
_注：这里的意思是经过尽量使用嵌套数据结构，而不是使用关联表。_

#### limit vs perDocumentLimit

Populate 支持 limit 选项，但是，为了向后兼容，它现在不会将 limit 作用于每个文档。例如，假设你有 2 个 stories：

```javascript
Story.create([
  { title: 'Casino Royale', fans: [1, 2, 3, 4, 5, 6, 7, 8] },
  { title: 'Live and Let Die', fans: [9, 10] }
]);
```

如果你要使用 limit 选项去 `populate()` ，你会发现第二个 story 的 fans 为 0。

```javascript
const stories = Story.find().populate({
  path: 'fans',
  options: { limit: 2 }
});

stories[0].name; // 'Casino Royale'
stories[0].fans.length; // 2

// 2nd story has 0 fans!
stories[1].name; // 'Live and Let Die'
stories[1].fans.length; // 0
```

这是因为，为了避免为了每个文档执行单独的查询，Mongoose 转而使用 `numDocuments * limit` 作为 limit 来对 fans 进行查询。如果你需要正确的 limit，你应该使用 perDocumentLimit 选项（自 Mongoose 5.9.0 起）。请记住 `populate()` 会为每个文档执行单独的查询，这会使 `populate()` 更慢。

```javascript
const stories = await Story.find().populate({
  path: 'fans',
  // Special option that tells Mongoose to execute a separate query
  // for each `story` to make sure we get 2 fans for each story.
  perDocumentLimit: 2
});

stories[0].name; // 'Casino Royale'
stories[0].fans.length; // 2

stories[1].name; // 'Live and Let Die'
stories[1].fans.length; // 2
```

#### Refs 到 children

我们会发现，如果使用 author 对象，我们无法获取 stories 列表。这是因为没有 story 对象被"pushed"到 `author.stories` 字段。
这里有两种观点，首先，你可能想知道哪些 stories 是属于这个 author 的。通常，你的 schema 应该通过在"多"方加一个父节点指针来处理一对多关系；但是，如果你有一个好的理由想获取一个子指针数组，你可以按下面展示的 `push()` 文档到数组里。

```javascript
author.stories.push(story1);
author.save(callback);
```

这使得我们可以去执行一个 `find` 和 `populate` 组合：

```javascript
Person.findOne({ name: 'Ian Fleming' })
  .populate('stories') // only works if we pushed refs to children
  .exec(function (err, person) {
    if (err) return handleError(err);
    console.log(person);
  });
```

让父子文档互相指向是有争议的，因为可能会让它们失去同步性。为此，我们可以跳过填充直接去 `find()` 我们感兴趣的 stoires。

```javascript
Story.find({ author: author._id }).exec(function (err, stories) {
  if (err) return handleError(err);
  console.log('The stories are an array: ', stories);
});
```

从 [query population](https://mongoosejs.com/docs/api.html#query_Query-populate) 返回的文档功能齐全，除非设置了 [lean](http://mongoosejs.net/docs/api.html#query_Query-lean) 选项，否则它就是可 remove，可 save 的。 不要把它们和 [sub docs](http://mongoosejs.net/docs/subdocs.html) 弄混了， 调用 remove 方法要小心，因为这样不只是从数组删除，还会从数据库删除它们。

#### 填充一个现成的文档

如果你有一个现成的文档并且想填充其一些字段，你可以使用 [Document#populate()](https://mongoosejs.com/docs/api.html#document_Document-populate) 方法。

```javascript
const person = await Person.findOne({ name: 'Ian Fleming' });

person.populated('stories'); // null

// Call the `populate()` method on a document to populate a path.
await person.populate('stories');

person.populated('stories'); // Array of ObjectIds
person.stories[0].name; // 'Casino Royale'
```

`Document#populate()` 方法不支持链式调用，你需要调用 `populate()` 多次，或者传递一个字段数组来填充多个字段。

```javascript
await person.populate(['stories', 'fans']);
person.populated('fans'); // Array of ObjectIds
```

#### 填充多个现成的文档

如果我们有一个或多个 mongoose 文档或者一个纯对象（_像 _[_mapReduce_](https://mongoosejs.com/docs/api.html#model_Model.mapReduce)_ 输出那样_），我们可以使用 [Model.populate()](https://mongoosejs.com/docs/api.html#model_Model.populate) 方法填充它们。这也是 `Document#populate()` 和 `Query#populate()` 填充文档使用的方法。

#### 多级填充

假设你有一个用户 schema 用来跟踪用户的朋友。

```javascript
const userSchema = new Schema({
  name: String,
  friends: [{ type: ObjectId, ref: 'User' }]
});
```

Populate 让你获取了用户的朋友列表，但是如果你还想获取朋友的朋友呢？指定 populate 选项告诉 mongoose 填充所有用户朋友的的 friends 数组：

```javascript
User.findOne({ name: 'Val' }).populate({
  path: 'friends',
  // Get friends of friends - populate the 'friends' array for every friend
  populate: { path: 'friends' }
});
```

#### 跨数据库填充

假设我们有一个 schema 来表示事件，另一个 schema 表示会话。每个事件绑定一个会话线程。

```javascript
const db1 = mongoose.createConnection('mongodb://localhost:27000/db1');
const db2 = mongoose.createConnection('mongodb://localhost:27001/db2');

const conversationSchema = new Schema({ numMessages: Number });
const Conversation = db2.model('Conversation', conversationSchema);

const eventSchema = new Schema({
  name: String,
  conversation: {
    type: ObjectId,
    ref: Conversation // `ref` is a **Model class**, not a string
  }
});
const Event = db1.model('Event', eventSchema);
```

在上述例子中，事件和会话被存储在不同的 MongoDB 数据库里。这种情况下 ref 为字符串将不起作用，因为 mongoose 假定字符串的 ref 指向相同连接的 model 名称。上述例子中，会话 model 注册在 db2，而非 db1。

```javascript
// Works
const events = await Event.find().populate('conversation');
```

这被称作"跨数据库填充"，因为它使你能够跨 MongoDB 数据库甚至跨 MongoDB 实例进行填充。
当你定义你的 `eventSchema` 时，如果你没有访问 model 实例的权限，你也可以在 `populate()` 的时候 [将 model 实例作为选项](https://mongoosejs.com/docs/api/model.html#model_Model.populate) 传递进去。

```javascript
const events = await Event.find()
  // The `model` option specifies the model to use for populating.
  .populate({ path: 'conversation', model: Conversation });
```

#### 通过 `refPath` 动态引用

Mongoose 也可以基于文档中某个属性的值从多个集合填充。假设你在创建一个存储评论的 schema，用户可以评论一篇博客，也可以评论一个产品。

```javascript
const commentSchema = new Schema({
  body: { type: String, required: true },
  on: {
    type: Schema.Types.ObjectId,
    required: true,
    // 不同于使用 ref 写死 model name，refPath 表示 mongoose 会查找 onModel 属性来获取正确的 model
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['BlogPost', 'Product']
  }
});

const Product = mongoose.model('Product', new Schema({ name: String }));
const BlogPost = mongoose.model('BlogPost', new Schema({ title: String }));
const Comment = mongoose.model('Comment', commentSchema);
```

`refPath` 相比 `ref` 更加复杂。如果 `ref` 仅仅是一个字符串，Mongoose 将总是查询相同的 model 去填充子文档。使用 `refPath`，你可以配置 Mongoose 会使用哪个 model。

```javascript
const book = await Product.create({ name: 'The Count of Monte Cristo' });
const post = await BlogPost.create({ title: 'Top 10 French Novels' });

const commentOnBook = await Comment.create({
  body: 'Great read',
  on: book._id,
  onModel: 'Product'
});

const commentOnPost = await Comment.create({
  body: 'Very informative',
  on: post._id,
  onModel: 'BlogPost'
});

// The below `populate()` works even though one comment references the
// 'Product' collection and the other references the 'BlogPost' collection.
const comments = await Comment.find().populate('on').sort({ body: 1 });
comments[0].on.name; // "The Count of Monte Cristo"
comments[1].on.title; // "Top 10 French Novels"
```

另一种方法是在 `commentSchema` 上分开定义 `blogPost` 和 `product`，然后 `populate()` 两个属性。

```javascript
const commentSchema = new Schema({
  body: { type: String, required: true },
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  blogPost: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'BlogPost'
  }
});

// ...

// The below `populate()` is equivalent to the `refPath` approach, you
// just need to make sure you `populate()` both `product` and `blogPost`.
const comments = await Comment.find().populate('product').populate('blogPost').sort({ body: 1 });
comments[0].product.name; // "The Count of Monte Cristo"
comments[1].blogPost.title; // "Top 10 French Novels"
```

分开定义 `blogPost` 和 `product` 属性适用于这个简单的例子。但是，如果你打算让用户也可以评论文章或其他评论，你需要添加更多的属性到 schema，并且你需要对所有的属性执行额外的 `populate()` 调用，除非你使用 [mongoose-autopopulate](https://www.npmjs.com/package/mongoose-autopopulate)。使用 `refPath` 意味着你只需要 2 个 schema 字段和一个 `populate()`，不管你的 `commentSchema`可以指向多少个 model。

#### 虚拟字段填充

目前为止你只基于 \_id 字段填充过，但有时候却不是正确的选择。例如，假设你有两个 model：`Author` 和 `BlogPost`。

```javascript
const AuthorSchema = new Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }]
});

const BlogPostSchema = new Schema({
  title: String,
  comments: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
      content: String
    }
  ]
});

const Author = mongoose.model('Author', AuthorSchema, 'Author');
const BlogPost = mongoose.model('BlogPost', BlogPostSchema, 'BlogPost');
```

上面是一个糟糕的 schema 设计例子。为什么？假设你有一个极其高产的作者写了超过 1 万篇博客，那这个 `author` 文档会变得很大，超过 12kb，并且大文档将会导致客户端和服务端的性能问题。[Principle of Least Cardinality](https://dev.to/swyx/4-things-i-learned-from-mastering-mongoose-js-25e#4-principle-of-least-cardinality) 说明了一对多关系，像作者对博客，应该存储到"多"方。换句话说，博客应该存储它们的 `author` ，作者不应该存储所有的 `posts` 。

```javascript
const AuthorSchema = new Schema({
  name: String
});

const BlogPostSchema = new Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  comments: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
      content: String
    }
  ]
});
```

不幸的是，这两个 schema，这么写的话，不支持填充一个作者的博客列表，这就是*虚拟填充*出现的原因。虚拟填充意味着在一个有 `ref` 选项的虚拟属性上调用 `populate()` ，如下所示。

```javascript
// Specifying a virtual with a `ref` property is how you enable virtual
// population
AuthorSchema.virtual('posts', {
  ref: 'BlogPost',
  localField: '_id',
  foreignField: 'author'
});

const Author = mongoose.model('Author', AuthorSchema, 'Author');
const BlogPost = mongoose.model('BlogPost', BlogPostSchema, 'BlogPost');
```

然后你可以 `populate()` 这个作者的 `posts` 。

```javascript
const author = await Author.findOne().populate('posts');

author.posts[0].title; // 第一个博客的title
```

要记住默认 `toJson()` 和 `toObject()` 的输出里默认不包含虚拟字段，如果你想要在如 Express 的 `res.json()` 或 `console.log` 的函数里让虚拟字段出现，请在 schema 里的 toJson 和 toObject 选项中将 virtuals 设置为 true。

```javascript
const authorSchema = new Schema(
  { name: String },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
  }
);
```

如果你要使用 populate projections, 确保 `foreignField` 包含在 projection 里。

```javascript
let authors = await Author.find({})
  // 不起作用因为 `author` 没有选到
  .populate({ path: 'posts', select: 'title' })
  .exec();

authors = await Author.find({})
  // 起作用因为 `author` 被选到
  .populate({ path: 'posts', select: 'title author' })
  .exec();
```

#### 虚拟填充：count 选项

虚拟填充还支持计算匹配 `foreignField` 的文档数量。在虚拟字段中设置 `count` 选项：

```javascript
const PersonSchema = new Schema({
  name: String,
  band: String
});

const BandSchema = new Schema({
  name: String
});
BandSchema.virtual('numMembers', {
  ref: 'Person', // The model to use
  localField: 'name', // Find people where `localField`
  foreignField: 'band', // is equal to `foreignField`
  count: true // And only get the number of docs
});

// Later
const doc = await Band.findOne({ name: 'Motley Crue' }).populate('numMembers');
doc.numMembers; // 2
```

#### 填充 Maps

Maps 是一种表示具有任意字符串作为键的对象的类型。例如下面的 schema，`members` 字段就是一个从字符串到 ObjectId 的 map。

```javascript
const BandSchema = new Schema({
  name: String,
  members: {
    type: Map,
    of: {
      type: 'ObjectId',
      ref: 'Person'
    }
  }
});
const Band = mongoose.model('Band', bandSchema);
```

这个 map 有一个 `ref`，这可以让你使用 `populate()` 来填充 map 上所有的 ObjectId。假设你有下面的 `band` 文档：

```javascript
const person1 = new Person({ name: 'Vince Neil' });
const person2 = new Person({ name: 'Mick Mars' });

const band = new Band({
  name: 'Motley Crue',
  members: {
    singer: person1._id,
    guitarist: person2._id
  }
});
```

你可以填充一个特殊的字段 `members.$*` 来 `populate()` map 上的每个元素。`$*` 是一个特殊的语法，或告诉 Mongoose 去查看 map 上的每个键。

```javascript
const band = await Band.findOne({ name: 'Motley Crue' }).populate('members.$*');

band.members.get('singer'); // { _id: ..., name: 'Vince Neil' }
```

你还可以使用 `$*` 填充 map 上的子文档字段。例如，假设你有下面的 librarySchema：

```javascript
const librarySchema = new Schema({
  name: String,
  books: {
    type: Map,
    of: new Schema({
      title: String,
      author: {
        type: 'ObjectId',
        ref: 'Person'
      }
    })
  }
});
const Library = mongoose.model('Library, librarySchema');
```

你可以使用 `populate()` 填充 `books.$*.author` 来获取每本书的作者。

```javascript
const libraries = await Library.find().populate('books.$*.author');
```

#### 在中间件中使用填充

你可以在 pre 或 post 勾子中使用填充。如果你总是想填充一个确定的字段，可以看看 [mongoose-autopopulate plugin](http://npmjs.com/package/mongoose-autopopulate)。

```javascript
// Always attach `populate()` to `find()` calls
MySchema.pre('find', function () {
  this.populate('user');
});
```

```javascript
// Always `populate()` after `find()` calls. Useful if you want to selectively populate
// based on the docs found.
MySchema.post('find', async function (docs) {
  for (let doc of docs) {
    if (doc.isPublic) {
      await doc.populate('user');
    }
  }
});
```

```javascript
// `populate()` after saving. Useful for sending populated data back to the client in an
// update API endpoint
MySchema.post('save', function (doc, next) {
  doc.populate('user').then(function () {
    next();
  });
});
```

## API
### Mongoose

### Schema

### Connection

### Document

### Model

#### Model()

参数：

- doc <Object> 初始值
- optional <[fileds]> object containing the fields that were selected in the query which returned this document. You do **not** need to set this parameter to ensure Mongoose handles your [query projection](https://mongoosejs.com/docs/api/api.html#query_Query-select).
- [skipId=false] boolean 默认为 false，如果为 true，mongoose 不会添加 \_id 到文档

Model 是你和 MongoDB 交互的主要工具类。Model 的实例被称作 document。
在 Mongoose 的世界里，"Model" 这个词指代的是 `mongoose.Model` 类的子类。你不应该直接使用 `mongoose.Model` 类。如下所示，`mongoose.model` 和 `connection.model` 函数会创建 `mongoose.Model` 类的子类。
例子：

```javascript
// `UserModel` is a "Model", a subclass of `mongoose.Model`.
const UserModel = mongoose.model('User', new Schema({ name: String }));

// You can use a Model to create new documents using `new`:
const userDoc = new UserModel({ name: 'Foo' });
await userDoc.save();

// You also use a model to create queries:
const userFromDb = await UserModel.findOne({ name: 'Foo' });
```

#### Model.aggregate()

#### Model.buildBulkWriteOperations()

#### Model.bulkSave()

参数：

- documents <Document>

接受一组文档，获取更改并根据文档是否是新文档或是否有更改将文档插入/更新到数据库中。
例子：
TODO

#### Model.bulkWrite()

参数：

- documents <Document>

### Query

## 快速查阅

### 常用操作符

|  操  作  符            | 描   述  |
|  ----------  | ----  |
| $eq         | 等于 |
| $or         | 或关系 |
| $nor         | 或关系 |
| $gt         | 大于 |
| $gte         | 大于等于 |
| $lt         | 小于 |
| $lte         | 小于等于 |
| $ne         | 不等于 |
| $in         | 在多个值范围内 |
| $nin         | 不在多个值范围内 |
| $all         | 匹配数组中多个值 |
| $regex         | 正则，用于模糊匹配 |
| $size         | 匹配数组大小 |
| $maxDistance	| 范围查询，距离（基于LBS）
| $mod	| 取模运算
| $near	| 邻域查询，查询附近的位置（基于LBS）
| $exists	| 字段是否存在
| $elemMatch	| 匹配内数组内的元素
| $within	| 范围查询（基于LBS）
| $box	| 范围查询，矩形范围（基于LBS）
| $center	| 范围醒询，圆形范围（基于LBS）
| $centerSphere	| 范围查询，球形范围（基于LBS）
| $slice	| 查询字段集合中的元素（比如从第几个之后，第N到第M个元素）

