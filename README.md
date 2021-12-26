## 快速开始

Mongoose 是一款使用 Javascript 操作 MongoDB 的 ORM 框架（ORM: Object Relation Mapping，把对数据库的操作都封装到对象中，操作了对象，就相当于操作了数据库）。  

首先，确保你安装了 [MongoDB](http://www.mongodb.org/downloads) 和 [NodeJs](https://nodejs.org/en/)。
然后在命令行中使用 npm 安装 Mongoose：

```shell
$ npm install mongoose --save

```

现在假设我们喜欢毛茸茸的小猫，并且想把每个遇到的小猫记录到 MongoDB 里。我们需要做的第一件事是将 mongoose 引入到我们的项目里，然后开启一个连接到本地运行的 MongoDB 实例上的 `test` 数据库。

```javascript
// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
}
```

为简便起见，我们假定下面的代码都在 `main` 函数里。
 
在 Mongoose 里, 一切都起源于 [Schema](#Schemas)。我们来查看一下然后定义我们的小猫。

```javascript
const kittySchema = new mongoose.Schema({
  name: String
});
```

目前为止一切正常。我们得到了一个拥有一个属性的 schema，name 是一个字符串。下一步是将我们的 schema 编译成一个 Model。
```javascript
const Kitten = mongoose.model('Kitten', kittySchema);
```

model 是用来构造 document 的类。此例中，每个文档都是一个拥有我们声明的 schema 中属性和行为的小猫。让我们来创建一个文档来表示我们刚刚在外面人行道上遇到的小猫。

```javascript
const silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'
```

小猫会喵喵叫，所以让我们来看看怎么添加 "speak" 方法到我们的文档上：

```javascript
// 提示: 方法必须要在被 mongoose.model() 编译之前添加到 schema 上
kittySchema.methods.speak = function speak() {
  const greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
};

const Kitten = mongoose.model('Kitten', kittySchema);
```

添加到 schema 的 methods 属性上的函数被编译到 Model 的原型，并被暴露在每个文档的实例上：

```javascript
const fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"
```

我们有了会说话的小猫！但是我们还没有保存任何东西到 MongoDB。每个文档可以调用自身的 save 方法来保存到数据库中。如果有任何错误发生，回调的第一个参数将是一个 error。

```javascript
await fluffy.save();
fluffy.speak();
```

时光流逝，我们想展示遇到的所有小猫，那么我们可以通过 Kitten model 访问所有的小猫文档。

```javascript
const kittens = await Kitten.find();
console.log(kittens);
```

我们刚在控制台打印了所有的小猫。如果我们想使用小猫的名字过滤，Mongoose 支持 MongoDB 的丰富的查询语法。

```javascript
await Kitten.find({ name: /^fluff/ });
```

这会查询名字以 "fluff" 开头的所有文档并且返回一个小猫的数组到回调中。

恭喜

快速开始到此为止。我们使用 Mongoose 创建了一个 schema，添加了一个自定义方法，在 MongoDB 里保存和查询了小猫。去 [指南](#指南) 和 [API 文档](#api) 获取更多信息。



## 指南

Mongoose guides provide detailed tutorials on Mongoose's core concepts and integrating Mongoose with external tools and frameworks.

Mongoose Core Concepts

- [Schemas](#schemas)
- [SchemaTypes](#schematypes)
- [Connections](#连接)
- [Models](#models)
- [Documents](#documents)
- [Subdocuments](#subdocuments)
- [Queries](#queries)
- [Validation](#validation)
- [Middleware](#中间件)
- [Populate](#populate)
- [Discriminators](#鉴别器)
- [Plugins](#插件)
- [Faster Mongoose Queries With Lean](https://mongoosejs.com/docs/tutorials/lean.html)
- [Query Casting](https://mongoosejs.com/docs/tutorials/query_casting.html)
- [findOneAndUpdate](https://mongoosejs.com/docs/tutorials/findoneandupdate.html)
- [Getters and Setters](https://mongoosejs.com/docs/tutorials/getters-setters.html)
- [Virtuals](https://mongoosejs.com/docs/tutorials/virtuals.html)

Advanced Topics

- [Working with Dates](https://mongoosejs.com/docs/tutorials/dates.html)
- [Custom Casting For Built-in Types](https://mongoosejs.com/docs/tutorials/custom-casting.html)
- [Custom SchemaTypes](https://mongoosejs.com/docs/customschematypes.html)

Integrations

- [Promises](https://mongoosejs.com/docs/promises.html)
- [AWS Lambda](https://mongoosejs.com/docs/lambda.html)
- [Browser Library](https://mongoosejs.com/docs/browser.html)
- [GeoJSON](https://mongoosejs.com/docs/geojson.html)
- [Transactions](https://mongoosejs.com/docs/transactions.html)
- [MongoDB Driver Deprecation Warnings](https://mongoosejs.com/docs/deprecations.html)
- [Testing with Jest](https://mongoosejs.com/docs/jest.html)
- [SSL Connections](https://mongoosejs.com/docs/tutorials/ssl.html)


Migration Guides

- [Mongoose 5.x to 6.x](https://mongoosejs.com/docs/migrating_to_6.html)
- [Mongoose 4.x to 5.x](https://mongoosejs.com/docs/migrating_to_5.html)
- [Mongoose 3.x to 4.x](https://mongoosejs.com/docs/migration.html)

### Schemas


如果你还没看过 [快速开始](#快速开始)，请花个 1 分钟时间看一下，然后你会了解 Mongoose 是如何工作的。如果你准备从 5.x 迁移到 6.x，请花点时间看看 [迁移指导](https://mongoosejs.com/docs/migrating_to_6.html)。

- [定义你的 schema](#定义你的-schema)
- [创建 Model](#创建-model)
- [Ids](#ids)
- [实例方法](#实例方法)
- [静态方法](#静态方法)
- [Query Helpers](#query-helpers)
- [索引](#索引)
- [虚拟字段](#虚拟字段)
- [别名](#别名)
- [选项](#选项)
- [使用 ES6 类](#使用-es6-类)
- [插件化](#插件化)
- [延伸阅读](#延伸阅读)

#### 定义你的 schema

Moongoose 的一切从 Schema 开始，每个 schema 映射到一个 MongoDB 的集合（表）并定义表中文档的形状。schema 中每个 key 都代表文档中的一个属性，并会转化为其定义的类型。
schema 不仅可以定义文档的结构，还可以定义文档的**实例方法，静态 model 方法，索引和钩子函数（中间件）**。

```javascript
import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String, // String 是 {type: String} 的简写
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


允许定义的类型:

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

为了使用 schema，我们需要将 blogSchema 转化为可以使用的 Model。为此，我们将它传递到 `mongoose.model(modelName, schema)` ：


```javascript
const Blog = mongoose.model('Blog', blogSchema);
// 准备好了！
```

#### Ids

Mongoose 会默认给 schema 添加一个 \_id 属性，\_id 的类型为 ObjectId。你可以重写\_id 的类型，但是在调用 save 之前要设置 \_id 的值，否则 Mongoose 会报错

```javascript
const schema = new Schema({ _id: Number });
const Model = mongoose.model('Test', schema);

const doc = new Model();
await doc.save(); // 抛出 "document must have an _id before saving" 的错误

doc._id = 1;
await doc.save(); // works
```

#### 实例方法

指的是 document 的方法，document 是 Model 类的实例。document 有很多内置的方法，你也可以定义自己方法。自定义方法有 2 点需要注意：

- 重写内置方法可能会导致未知错误，需要慎重
- 不能使用箭头函数，因为无法使用 this 访问当前的 document

下面是例子:

```javascript
// 定义一个 schema
const animalSchema = new Schema({ name: String, type: String });

// 给 animalSchema 的 "methods" 对象赋值一个函数 
animalSchema.methods.findSimilarTypes = function (cb) {
  return mongoose.model('Animal').find({ type: this.type }, cb);
};

const Animal = mongoose.model('Animal', animalSchema);
const dog = new Animal({ type: 'dog' });

// 使用方法，就和使用 find 一样
dog.findSimilarTypes((err, dogs) => {
  console.log(dogs); // woof
});
```

#### 静态方法

你可以给 model 添加静态方法，通过 `schema.statics` 或者 `Schema#static` 函数。注意不能使用箭头函数因为无法使用 this 访问当前的 document。

```javascript
// 给 animalSchema 的 "statics" 对象赋值一个函数 
animalSchema.statics.findByName = function (name) {
  return this.find({ name: new RegExp(name, 'i') });
};
// 或者，同样地, 你可以调用 `animalSchema.static()`
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
  tags: { type: [String], index: true } // 字段级别
});

animalSchema.index({ name: 1, type: -1 }); // schema 级别
```

当应用启动，Mongoose 会自动为 schema 定义的每个 index 调用 createIndex 方法。Mongoose 会按顺序调用 createIndex 方法，当调用成功或失败都会触发一个 `index` 事件到 model。这个行为在开发阶段很好，但是在生产阶段会导致 [严重的性能问题](https://docs.mongodb.com/manual/core/index-creation/#index-build-impact-on-database-performance)，所以最好在生产阶段关闭这个行为。

```javascript
mongoose.connect('mongodb://user:pass@localhost:port/database', { autoIndex: false });
// 或
mongoose.createConnection('mongodb://user:pass@localhost:port/database', { autoIndex: false });
// 或
animalSchema.set('autoIndex', false);
// 或
new Schema({..}, { autoIndex: false });
```

Mongoose 会触发一个 `index` 事件到 model，你可以监听该事件。

```javascript
// 会导致错误因为 mongodb 有一个 _id 索引默认不是稀疏的
animalSchema.index({ _id: 1 }, { sparse: true });
const Animal = mongoose.model('Animal', animalSchema);

Animal.on('index', (error) => {
  // "_id 索引不是稀疏的"
  console.log(error.message);
});
```

#### 虚拟字段

[虚拟字段](https://mongoosejs.com/docs/api.html#schema_Schema-virtual) 是可以获取和设置但不会持久化到 MongoDB 的文档属性。getters 用于格式化或组合字段，而 setters 用于将单个值分解为多个值存储。

```javascript
  // 定义一个 schema
  const personSchema = new Schema({
    name: {
      first: String,
      last: String
    }
  });

  // 编译到 model
  const Person = mongoose.model('Person', personSchema);

  // 创建一个文档
  const axl = new Person({
    name: { first: 'Axl', last: 'Rose' }
  });
```

假设你想打印 person 的全名。你可以自己手动做：

```javascript
console.log(axl.name.first + ' ' + axl.name.last); // Axl Rose
```
 
但是每次 [连接](https://masteringjs.io/tutorials/fundamentals/string-concat) 姓和名会变得很麻烦，比如你想在姓名上做一些额外的操作，比如 [删除变音符号](https://www.npmjs.com/package/diacritics) 呢？[virtual property getter](https://mongoosejs.com/docs/api.html#virtualtype_VirtualType-get) 允许你定义一个不会持久化到 MongoDB 的 `fullName` 属性。

```javascript
personSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
});
```

现在，mongoose 会在你每次访问 `fullName` 属性的时候调用 getter 函数：


```javascript
console.log(axl.fullName); // Axl Rose
```

如果你使用 `toJSON()` 或 `toObject()`，mongoose 默认不会包含 virtuals，在 Mongoose 文档上调用 `JSON.stringify()` 也是如此，因为 [`JSON.stringify()` 会调用 `toJSON()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description)。请传递 `{ virtuals: true }` 给 `toObject()` 或 `toJSON()`。

你还可以给虚拟字段添加一个自定义 setter 使得你可以通过 `fullName` 这个虚拟字段同时设置姓氏和名字。

```javascript
personSchema.virtual('fullName').
  get(function() {
    return this.name.first + ' ' + this.name.last;
    }).
  set(function(v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1);
  });

axl.fullName = 'William Rose'; // 现在 `axl.name.first` 为 "William"
```

虚拟字段 setters 在其他 validation 之前被调用。所以当  `first` and `last` 两个字段为必需时，上面的例子仍然正常工作。

只有非虚拟字段可以作为查询和字段选择的一部分，因为虚拟虚拟不存储在 MongoDB 中，你不能用它们来查询。

[你可以在这里了解更多关于虚拟字段的知识](https://masteringjs.io/tutorials/mongoose/virtuals).


#### 别名

别名是一种特殊类型的虚拟字段，其 getter 和 setter 可以无缝地获取和设置另一个属性。这对于节省网络带宽非常方便，因此你可以将存储在数据库中的短属性名称转换为更长的名称，以提高代码的可读性。

```javascript
const personSchema = new Schema({
  n: {
    type: String,
    // Now accessing `name` will get you the value of `n`, and setting `name` will set the value of `n`
    alias: 'name'
  }
});

// 设置 `name` 会传导给 `n`
const person = new Person({ name: 'Val' });
console.log(person); // { n: 'Val' }
console.log(person.toObject({ virtuals: true })); // { n: 'Val', name: 'Val' }
console.log(person.name); // "Val"

person.name = 'Not Val';
console.log(person); // { n: 'Not Val' }
```

你还可以给嵌套的字段声明一个别名。使用嵌套 schema 和 [子文档](#subdocuments) 更容易，但你也可以内联声明嵌套路径别名，只要使用完整嵌套路径 `nested.myProp` 作为别名。

```javascript
const childSchema = new Schema({
  n: {
    type: String,
    alias: 'name'
  }
}, { _id: false });

const parentSchema = new Schema({
  // 如果在 schema 里，别名不需要包含完整路径
  c: childSchema,
  name: {
    f: {
      type: String,
      // 如果使用内联声明，别名需要包含完整嵌套路径
      alias: 'name.first'
    }
  }
});
```

#### 选项

- [autoIndex](#autoindex)
- [autoCreate](#autocreate)
- [bufferCommands](#buffercommands)
- [bufferTimeoutMS](#buffertimeoutms)
- [capped](#capped)
- [collection](#collection)
- [discriminatorKey](#discriminatorkey)
- [id](#id)
- [\_id](#_id)
- [minimize](#minimize)
- [read](#read)
- [writeConcern](#writeconcern)
- [shardKey](#shardkey)
- [strict](#strict)
- [strictQuery](#strictquery)
- [toJSON](#tojson)
- [toObject](#toobject)
- [typeKey](#typekey)
- [validateBeforeSave](#validatebeforesave)
- [versionKey](#versionkey)
- [optimisticConcurrency](#optimisticconcurrency)
- [collation](#collation)
- [timeseries](#timeseries)
- [skipVersioning](#skipversioning)
- [timestamps](#timestamps)
- [useNestedStrict](#usenestedstrict)
- [selectPopulatedPaths](#selectpopulatedpaths)
- [storeSubdocValidationError](#storesubdocvalidationerror)

##### autoIndex

默认情况下，当在成功连接 MongoDB 后，Mongoose 的 `init()` 函数会通过调用 `Model.createIndexes` 方法创建你在 schema 里定义的所有索引。自动创建索引在开发和测试环境非常好，但是索引的构建对于生产数据库也会产生重大负载（significant load）。如果你想在生产中小心地管理索引，你可以将 `autoIndex` 设置为 false。

```javascript
const schema = new Schema({..}, { autoIndex: false });
const Clock = mongoose.model('Clock', schema);
Clock.ensureIndexes(callback);
```

也可以全局设置该属性 `mongoose.set('autoIndex', false)` 。

##### autoCreate

如果 autoCreate 设置为 true，在 Mongoose 构建索引之前，它会先调用 `Model.createCollection()` 在 MongoDB 中创建集合。调用 `createCollection()` 时会根据 [collation 选项](#collation) 来 [设置集合的默认排序规则](https://thecodebarbarian.com/a-nodejs-perspective-on-mongodb-34-collations)，如果设置了[`capped` schema 选项](#capped)，则将该集合建立为固定集合。和 `autoIndex` 一样，将 `autoCreate` 设置为 true 对于开发和测试环境很有用。

不幸的是，`createCollection()` 不能更改现有的集合。例如，如果你在 schema 里添加 `capped: 1024` 并且现有的集合不是固定的，那么  `createCollection()` 会抛出一个错误。通常来说，生产环境下 `autoCreate` 应该为 `false`。

```javascript
const schema = new Schema({..}, { autoCreate: true, capped: 1024 });
const Clock = mongoose.model('Clock', schema);
// Mongoose 会为你创建固定集合
```

和 `autoIndex` 不一样的是, `autoCreate` 默认为 `false`。你可以通过设置 `mongoose.set('autoCreate', true);` 来修改它。

##### bufferCommands

默认情况下, mongoose 会在连接失效的时候缓存操作，直到驱动重新连接。要禁用缓存，请设置 `bufferCommands` 为 `false`.

```javascript
const schema = new Schema({..}, { bufferCommands: false });
```

schema 里的 `bufferCommands` 选项会覆盖全局的 `bufferCommands` 选项。

```javascript
mongoose.set('bufferCommands', true);
// 如果设置了 schema 选项，下面的 Schema 选项会覆盖上面的
const schema = new Schema({..}, { bufferCommands: false });
```

##### bufferTimeoutMS

如果开启了 `bufferCommands` ，该选项设置 Mongoose 缓存在抛出错误之前等待的最大时间。如果没有指定，Mongoose 会使用 10000 (10 秒)。

```javascript
// 如果一个操作缓存超过 1 秒，将会抛出错误
const schema = new Schema({..}, { bufferTimeoutMS: 1000 });
```

##### capped

Mongoose 支持**固定集合**，要设置一个集合为固定集合，添加 capped 选项并设置其大小，单位为 bytes

```javascript
new Schema({..}, { capped: 1024 });
```

`capped` 选项可以设置成对象，如果你想传递额外的选项如 [max](http://www.mongodb.org/display/DOCS/Capped+Collections#CappedCollections-max) 或 [autoIndexId](https://docs.mongodb.com/manual/core/capped-collections/#CappedCollections-autoIndexId)。这种情况下，你必须显式传递必需的 `size` 选项。

```javascript
new Schema({..}, { capped: { size: 1024, max: 1000, autoIndexId: true } });
```

##### collection

默认情况下，Mongoose 通过将 model 名传递给 [utils.toCollectionName](https://mongoosejs.com/docs/api.html#utils_exports.toCollectionName) 方法来生成一个集合名称，该方法会将名称改为复数形式。如果你需要一个不同的名称，请设置该选项。

```javascript
const dataSchema = new Schema({..}, { collection: 'data' });
```

##### discriminatorKey

当你定义一个 [鉴别器](#鉴别器) 时， Mongoose 会添加一个字段到 schema，用来存储文档实例是哪个鉴别器。默认情况下，Mongoose 会添加一个 `__t` 属性，但是你可以设置 `discriminatorKey` 来覆盖默认值。

```javascript
const baseSchema = new Schema({}, { discriminatorKey: 'type' });
const BaseModel = mongoose.model('Test', baseSchema);

const personSchema = new Schema({ name: String });
const PersonModel = BaseModel.discriminator('Person', personSchema);

const doc = new PersonModel({ name: 'James T. Kirk' });
// 没有 `discriminatorKey` 的话， Mongoose 会将鉴别器存储在 `__t` 属性上，而不是 `type`
doc.type; // 'Person'
```

##### id

Mongoose 默认为每个 schemas 分配一个 `id` 虚拟 getter，它返回转化为字符串的 `_id` 字段，或者返回其 hexString，如果是 ObjectIds 的情况下。如果你不想在 schema 上添加 `id` getter，你可以在初始化 schema 的时候传递选项来禁用这个功能。

```javascript
// 默认行为
const schema = new Schema({ name: String });
const Page = mongoose.model('Page', schema);
const p = new Page({ name: 'mongodb.org' });
console.log(p.id); // '50341373e894ad16347efe01'

// 禁用 id
const schema = new Schema({ name: String }, { id: false });
const Page = mongoose.model('Page', schema);
const p = new Page({ name: 'mongodb.org' });
console.log(p.id); // undefined
```

##### \_id

如果没有选项传递给 [Schema 构造函数](https://mongoosejs.com/docs/api.html#schema-js)，mongoose 默认为每个 schemas 分配一个 `_id` 字段，分配的类型是一个 [ObjectId](https://mongoosejs.com/docs/api.html#schema_Schema.Types)，以符合 MongoDB 的默认行为。如果你不想在 schema 上添加 `_id` 字段，你可以使用这个选项来禁用。

你只能在子文档里使用这个选项。Mongoose 不能在不知道文档 id 的情况下保存文档，所以没有 `_id` 的文档在保存时你会得到一个报错。

```javascript
// 默认 behavior
const schema = new Schema({ name: String });
const Page = mongoose.model('Page', schema);
const p = new Page({ name: 'mongodb.org' });
console.log(p); // { _id: '50341373e894ad16347efe01', name: 'mongodb.org' }

// 禁用 _id
const childSchema = new Schema({ name: String }, { _id: false });
const parentSchema = new Schema({ children: [childSchema] });

const Model = mongoose.model('Model', parentSchema);

Model.create({ children: [{ name: 'Luke' }] }, (error, doc) => {
  // doc.children[0]._id 将会是 undefined
});
```

##### minimize

默认情况下，mongoose 会移除空对象来 "最小化" schemas。

```javascript
const schema = new Schema({ name: String, inventory: {} });
const Character = mongoose.model('Character', schema);

// 如果不是空对象，将会存储 `inventory` 字段
const frodo = new Character({ name: 'Frodo', inventory: { ringOfPower: 1 }});
await frodo.save();
let doc = await Character.findOne({ name: 'Frodo' }).lean();
doc.inventory; // { ringOfPower: 1 }

// 如果是空对象，将不会存储 `inventory` 字段
const sam = new Character({ name: 'Sam', inventory: {}});
await sam.save();
doc = await Character.findOne({ name: 'Sam' }).lean();
doc.inventory; // undefined
```
该行为可以通过设置 `minimize` 选项为 `false` 来重写，然后它就可以存储空对象了。

```javascript
const schema = new Schema({ name: String, inventory: {} }, { minimize: false });
const Character = mongoose.model('Character', schema);

// 当是空对象时，将会存储 `inventory`
const sam = new Character({ name: 'Sam', inventory: {} });
await sam.save();
doc = await Character.findOne({ name: 'Sam' }).lean();
doc.inventory; // {}
```
要检测一个对象是否是空对象，你可以使用 `$isEmpty()` 帮助方法；

```javascript
const sam = new Character({ name: 'Sam', inventory: {} });
sam.$isEmpty('inventory'); // true

sam.inventory.barrowBlade = 1;
sam.$isEmpty('inventory'); // false
```
##### read

允许在 schema 级别上设置 [query#read](https://mongoosejs.com/docs/api.html#query_Query-read) 选项，为我们提供了一种将默认的 [ReadPreferences](http://docs.mongodb.org/manual/applications/replication/#replica-set-read-preference) 应用于所有 model 上派生查询的方法。

```javascript
const schema = new Schema({..}, { read: 'primary' });            // also aliased as 'p'
const schema = new Schema({..}, { read: 'primaryPreferred' });   // aliased as 'pp'
const schema = new Schema({..}, { read: 'secondary' });          // aliased as 's'
const schema = new Schema({..}, { read: 'secondaryPreferred' }); // aliased as 'sp'
const schema = new Schema({..}, { read: 'nearest' });            // aliased as 'n'
```

每个 pref 的别名也是允许的，因此为了不必键入 'secondaryPreferred' 而得到拼写错误，我们可以简单地传递 'sp'。

read 选项也允许我们指定 _tag sets_，它会告诉 [驱动](https://github.com/mongodb/node-mongodb-native/) 要读副本集的哪个成员。在 [这里](http://docs.mongodb.org/manual/applications/replication/#tag-sets) 和 [这里](http://mongodb.github.com/node-mongodb-native/driver-articles/anintroductionto1_1and2_2.html#read-preferences) 获取 tag sets 的更多信息。

_注意：你还可以在连接数据库时指定驱动读 pref 的 [策略](https://mongodb.github.com/node-mongodb-native/api-generated/replset.html?highlight=strategy) 选项：_

```javascript
//定期 ping 副本集成员以跟踪网络延迟
const options = { replset: { strategy: 'ping' }};
mongoose.connect(uri, options);

const schema = new Schema({..}, { read: ['nearest', { disk: 'ssd' }] });
mongoose.model('JellyBean', schema);
```

##### writeConcern

允许在 schema 级别上设置 [write concern](https://docs.mongodb.com/manual/reference/write-concern/)。

```javascript
const schema = new Schema({ name: String }, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  }
});
```

##### shardKey

`shardKey` 选项用于 [分片 MongoDB 架构](http://docs.mongodb.org/manual/core/sharding)。每个分片集合都会分配一个必须存在于所有插入/更新操作中的分片键（shard key）。我们只需要将这个 schema 选项设置为相同的分片键（shard key），就可以全部设置好了。

```javascript
new Schema({ .. }, { shardKey: { tag: 1, name: 1 }})
```

注意 mongoose 不会为你发送 `shardcollection` 命令。你必须自己配置你的分片。

##### strict

`strict` 选项，(默认启用)，可以确保传递给 model 构造函数的值中没有在 schema 中指定的部分不会保存到数据库里。

```javascript
const thingSchema = new Schema({..})
const Thing = mongoose.model('Thing', thingSchema);
const thing = new Thing({ iAmNotInTheSchema: true });
thing.save(); // iAmNotInTheSchema 不会保存到数据库

// 设置为 false..
const thingSchema = new Schema({..}, { strict: false });
const thing = new Thing({ iAmNotInTheSchema: true });
thing.save(); // iAmNotInTheSchema 现在保存到数据库了！！
```

该选项同样会影响使用 `doc.set()` 来设置一个属性。

```javascript
const thingSchema = new Schema({..})
const Thing = mongoose.model('Thing', thingSchema);
const thing = new Thing;
thing.set('iAmNotInTheSchema', true);
thing.save(); // iAmNotInTheSchema 不会保存到数据库
```

该值可以通过在模型实例上传递第二个布尔参数被覆盖：

```javascript
const Thing = mongoose.model('Thing');
const thing = new Thing(doc, true);  // 启用 strict 模式
const thing = new Thing(doc, false); // 禁用 strict 模式
```

`strict` 选项也可以设置为 `"throw"`，这将导致产生错误，而不是删除坏数据。

_注意：无论是什么样的 schema 选项，在实例上设置的任何不存在于模式中的 key/val 都会被忽略。_

```javascript
const thingSchema = new Schema({..})
const Thing = mongoose.model('Thing', thingSchema);
const thing = new Thing;
thing.iAmNotInTheSchema = true;
thing.save(); // iAmNotInTheSchema 不会保存到数据库
```

##### strictQuery

Mongoose 支持一个单独的 `strictQuery` 选项来避免查询过滤器使用严格模式。这是因为空的查询过滤器会导致 mongoose 返回模型中的所有文档，这可能会导致问题。

```javascript
const mySchema = new Schema({ field: Number }, { strict: true });
const MyModel = mongoose.model('Test', mySchema);
//  因为 `strict: true`，mongoose 会过滤掉 `notInSchema: 1`，意味着该查询会返回 'tests' 集合中的所有文档
MyModel.find({ notInSchema: 1 });
```

`strict` 选项会对更新操作有影响，而 `strictQuery` 选项只针对查询过滤器。

```javascript
// 如果 `strict` 不为 `false`，mongoose 将从更新操作中删除掉 `notInSchema`
MyModel.updateMany({}, { $set: { notInSchema: 1 } });
```

Mongoose 有一个单独的 `strictQuery` 选项来切换查询的 `filter` 参数是否使用严格模式。

```javascript
const mySchema = new Schema({ field: Number }, {
  strict: true,
  strictQuery: false // 关闭查询过滤器的严格模式
});
const MyModel = mongoose.model('Test', mySchema);
// 因为 `strictQuery` 为 false，mongoose 将删除 `notInSchema: 1` 
MyModel.find({ notInSchema: 1 });
```

通常来说，我们不建议将用户定义的对象作为查询过滤器传递:

```javascript
// 不要这么做
const docs = await MyModel.find(req.query);

// 这样做：
const docs = await MyModel.find({ name: req.query.name, age: req.query.age }).setOptions({ sanitizeFilter: true });
```

在 Mongoose 6 中，`strictQuery` 默认等同于 `strict`。 但是，你可以全局的修改该行为：

```javascript
// 设置 `strictQuery` 为 `false`，这样 Mongoose 默认不会删除不在 schema 中的查询过滤器属性
// 这样做 **不会** 影响 `strict`
mongoose.set('strictQuery', false);
```

##### toJSON

和 [toObject](#toobject) 选项完全一样但是仅仅在 [`toJSON` 方法](https://thecodebarbarian.com/what-is-the-tojson-function-in-javascript.html) 被调用的时候才起作用。

```javascript
const schema = new Schema({ name: String });
schema.path('name').get(function (v) {
  return v + ' is my name';
});
schema.set('toJSON', { getters: true, virtuals: false });
const M = mongoose.model('Person', schema);
const m = new M({ name: 'Max Headroom' });
console.log(m.toObject()); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom' }
console.log(m.toJSON()); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom is my name' }
// 因为我们知道当一个对象被 stringified 的时候 toJSON 会被调用
console.log(JSON.stringify(m)); // { "_id": "504e0cd7dd992d9be2f20b6f", "name": "Max Headroom is my name" }
```

要查看所有的 `toJSON/toObject` 选项，请读 [这个](https://mongoosejs.com/docs/api.html#document_Document-toObject)。

##### toObject

Documents 有一个 [toObject](https://mongoosejs.com/docs/api.html#document_Document-toObject) 方法，它将 mongoose 文档转换成一个普通的 JavaScript 对象。 该方法接收一些选项， 为了避免在每个文档基础（basis）上应用这些选项，我们可以在 schema 级别声明这些选项，并在默认情况下将它们应用于 schema 的所有文档。

要让所有的虚拟字段在 `console.log` 中输出，请设置 `toObject` 选项为 `{ getters: true }`：

```javascript
const schema = new Schema({ name: String });
schema.path('name').get(function(v) {
  return v + ' is my name';
});
schema.set('toObject', { getters: true });
const M = mongoose.model('Person', schema);
const m = new M({ name: 'Max Headroom' });
console.log(m); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom is my name' }
```

要查看所有的 `toObject` 选项，请读 [这个](https://mongoosejs.com/docs/api.html#document_Document-toObject).

##### typeKey

默认情况下，如果你的 schema 中有一个对象的属性有 'type'，mongoose 会将其理解为类型声明。

```javascript
// Mongoose 理解为 'loc 是一个字符串'
const schema = new Schema({ loc: { type: String, coordinates: [Number] } });
```

但是，对于像 [geoJSON](http://docs.mongodb.org/manual/reference/geojson/) 这样的应用程序，'type' 属性很重要。如果你想控制 mongoose 使用哪个键来查找类型声明，请设置 'typeKey' schema 选项。

```javascript
const schema = new Schema({
  // Mongoose 理解为 'loc 是一个对象，有两个键， type 和 coordinates'
  loc: { type: String, coordinates: [Number] },
  // Mongoose 理解为 'name 是一个字符串'
  name: { $type: String }
}, { typeKey: '$type' }); // '$type' 键表示该对象为类型声明
```

##### validateBeforeSave

默认情况下，文档会在保存到数据库之前自动被校验。这是为了防止保存非法的文档，如果你想手动处理校验，并且能够保存未通过校验的对象，你可以将 `validatebeforeave` 设置为 false。

```javascript
const schema = new Schema({ name: String });
schema.set('validateBeforeSave', false);
schema.path('name').validate(function (value) {
  return value != null;
});
const M = mongoose.model('Person', schema);
const m = new M({ name: null });
m.validate(function(err) {
  console.log(err); // 会告诉你 null 是不允许的
});
m.save(); // 尽管非法，也会成功
```

##### versionKey

每一个 document 初次创建的时候会设置一个 versionKey。这个 key 的值包含了文档的内部版本。versionKey 选项是一个字符串，表示版本控制字段的路径。默认的路径是 `__v` 。如果和你的应用有冲突你可以这样设置：

```javascript
const schema = new Schema({ name: 'string' });
const Thing = mongoose.model('Thing', schema);
const thing = new Thing({ name: 'mongoose v3' });
await thing.save(); // { __v: 0, name: 'mongoose v3' }

// 定制 versionKey
new Schema({..}, { versionKey: '_somethingElse' })
const Thing = mongoose.model('Thing', schema);
const thing = new Thing({ name: 'mongoose v3' });
thing.save(); // { _somethingElse: 0, name: 'mongoose v3' }
```

请注意 Mongoose 默认的版本控制不是一个完整的 [optimistic concurrency](https://en.wikipedia.org/wiki/Optimistic_concurrency_control) 方案，其版本控制只作用于数组，如下所示。如果你需要 optimistic concurrency 支持，你可以设置 optimisticConcurrency 选项。

```javascript
// 同一个文档的 2 份拷贝
const doc1 = await Model.findOne({ _id });
const doc2 = await Model.findOne({ _id });

// 从 `doc1` 删除 3 个评论
doc1.comments.splice(0, 3);
await doc1.save();

// 下面的 `save()` 会抛出一个 VersionError，因为你试图修改索引为 1 的评论，而上面的 `splice()` 删掉了它
doc2.set('comments.1.body', 'new comment');
await doc2.save();
```

你还可以设置 versionKey 为 false 禁用版本控制。**不要**禁用版本控制除非 [_你知道你在做什么_](http://aaronheckmann.blogspot.com/2012/06/mongoose-v3-part-1-versioning.html)。

```javascript
new Schema({..}, { versionKey: false });
const Thing = mongoose.model('Thing', schema);
const thing = new Thing({ name: 'no versioning please' });
thing.save(); // { name: 'no versioning please' }
```

Mongoose 只会在你调用 `save()` 时更新这个 version key 的值。如果你使用 `update()`, `findOneAndUpdate` 等，mongoose 不会更新该值。针对此有一种解决方法，你可以使用下面的中间件。

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

[Optimistic concurrency](https://en.wikipedia.org/wiki/Optimistic_concurrency_control) 是一种策略，可以确保在使用`find()` 或 `findOne()` 加载文档和使用 `save()` 更新文档之间，你正在更新的文档不会发生变化。

例如，假设你有一个 `House` model，其中包含一个 `photos` 列表和一个 `status`，该 `status` 表示这个房子是否在搜索中出现。假设至少有两张 `photos` 的房子才有 `'APPROVED'` 的状态 。您可能如下所示地实现批准 house document 的逻辑：

```javascript
async function markApproved(id) {
  const house = await House.findOne({ _id });
  if (house.photos.length < 2) {
    throw new Error('House must have at least two photos!');
  }
  
  house.status = 'APPROVED';
  await house.save();
}
```

`markApproved()` 函数看起来是独立的，但可能有一个潜在的问题：如果另一个函数在 `findOne()` 调用和 `save()` 调用之间删除了房子的照片呢？例如，下面的代码将会成功：

```javascript
const house = await House.findOne({ _id });
if (house.photos.length < 2) {
  throw new Error('House must have at least two photos!');
}

const house2 = await House.findOne({ _id });
house2.photos = [];
await house2.save();

// 将 house 标记为 'APPROVED' 即使它没有照片了
house.status = 'APPROVED';
await house.save();
```

如果你在 `House` model 的 schema 里设置了 `optimisticConcurrency` 选项，上面的脚本会抛错

```javascript
const House = mongoose.model('House', Schema({
  status: String,
  photos: [String]
}, { optimisticConcurrency: true }));

const house = await House.findOne({ _id });
if (house.photos.length < 2) {
  throw new Error('House must have at least two photos!');
}

const house2 = await House.findOne({ _id });
house2.photos = [];
await house2.save();

// 抛出 'VersionError: No matching document found for id "..." version 0'
house.status = 'APPROVED';
await house.save();
```

##### collation

为每次 query 和 aggregation 设置一个默认的 [排序](https://docs.mongodb.com/manual/reference/collation/)。[下面是对初学者友好的排序概述](http://thecodebarbarian.com/a-nodejs-perspective-on-mongodb-34-collations)。

```javascript
const schema = new Schema({
  name: String
}, { collation: { locale: 'en_US', strength: 1 } });

const MyModel = db.model('MyModel', schema);

MyModel.create([{ name: 'val' }, { name: 'Val' }]).
  then(() => {
    return MyModel.find({ name: 'val' });
  }).
  then((docs) => {
    // `docs` 会返回2个文档，因为 `strength: 1` 表示 MongoDB 匹配时将忽略大小写
  });
```

#####  timeseries

如果你在 schema 上设置 `timeseries` 选项，Mongoose 会从该 schema 创建的任何模型创建一个 [timeseries 集合](https://docs.mongodb.com/manual/core/timeseries-collections/)。

```javascript
const schema = Schema({ name: String, timestamp: Date, metadata: Object }, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours'
  },
  autoCreate: false,
  expireAfterSeconds: 86400
});

// `Test` 集合会是一个 timeseries 集合
const Test = db.model('Test', schema);
```

##### skipVersioning

`skipVersioning` 允许从版本控制中排除属性(即，即使这些属性被更新，内部版本也不会增加)。除非你知道自己在做什么，否则**不要**这样做。对于子文档，使用完全限定路径将其包含在父文档中（include this on the parent document using the fully qualified path）。


```javascript
new Schema({..}, { skipVersioning: { dontVersionMe: true } });
thing.dontVersionMe.push('hey');
thing.save(); // version 不会增加
```

##### timestamps

`timestamps` 选项会告诉 mongoose 分配 `createdAt` 和 `updatedAt` 字段给你的 schema，分配的类型为 [Date](https://mongoosejs.com/docs/api.html#schema-date-js)。

默认情况下，字段名为 `createdAt` 和 `updatedAt`。可以通过设置 `timestamps.createdAt` 和 `timestamps.updatedAt` 来定制字段名称。

```javascript
const thingSchema = new Schema({..}, { timestamps: { createdAt: 'created_at' } });
const Thing = mongoose.model('Thing', thingSchema);
const thing = new Thing();
await thing.save(); // `created_at` & `updatedAt` 将被包括在内

// 更新操作下，Mongoose 会将 `updatedAt` 添加到 `$set`
await Thing.updateOne({}, { $set: { name: 'Test' } });

// 如果你设置了 upsert: true, Mongoose 也会将 `created_at` 添加到 `$setOnInsert`
await Thing.findOneAndUpdate({}, { $set: { name: 'Test2' } });

// Mongoose 也会在 bulkWrite() 操作中添加时间戳
// 查看 https://mongoosejs.com/docs/api.html#model_Model.bulkWrite
await Thing.bulkWrite([
  insertOne: {
    document: {
      name: 'Jean-Luc Picard',
      ship: 'USS Stargazer'
      // Mongoose 会添加`created_at` 和 `updatedAt`
    }
  },
  updateOne: {
    filter: { name: 'Jean-Luc Picard' },
    update: {
      $set: {
        ship: 'USS Enterprise'
        // Mongoose 会添加 `updatedAt`
      }
    }
  }
]);
```

默认情况下，Mongoose 使用 `new Date()` 来获取当前时间。如果你想覆盖 Mongoose 用来获取当前时间的函数，你可以设置 `timestamps.currentTime` 选项，Mongoose 会调用 `timestamps.currentTime` 函数，当它需要获取当前时间时。

```javascript
const schema = Schema({
  createdAt: Number,
  updatedAt: Number,
  name: String
}, {
  // 使 Mongoose 使用 Unix 事件 (seconds since Jan 1, 1970)
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
});
```

##### useNestedStrict

像 `update()`，`updateOne()`，`updateMany()`，和 `findOneAndUpdate()` 这样的写操作只检查顶级 schema 的 strict 模式设置。

```javascript
const childSchema = new Schema({}, { strict: false });
const parentSchema = new Schema({ child: childSchema }, { strict: 'throw' });
const Parent = mongoose.model('Parent', parentSchema);
Parent.update({}, { 'child.name': 'Luke Skywalker' }, (error) => {
  // 抛错，因为 `parentSchema` 设置了 `strict: throw`，即使 `childSchema` 设置了 `strict: false`
});

const update = { 'child.name': 'Luke Skywalker' };
const opts = { strict: false };
Parent.update({}, update, opts, function(error) {
  // 能正常工作，因为传递 `strict: false` 给 `update()` 重写了父 schema
});
```

如果你设置 `useNestedStrict` 为 true，mongoose 将使用子 schema 的 `strict` 选项来强制执行更新。

```javascript
const childSchema = new Schema({}, { strict: false });
const parentSchema = new Schema({ child: childSchema },
  { strict: 'throw', useNestedStrict: true });
const Parent = mongoose.model('Parent', parentSchema);
Parent.update({}, { 'child.name': 'Luke Skywalker' }, error => {
  // 正常工作
});
```

##### selectPopulatedPaths

默认情况下，Mongoose 会自动为你 `select()` 任何填充的字段，除非你明确地排除它们。

```javascript
const bookSchema = new Schema({
  title: 'String',
  author: { type: 'ObjectId', ref: 'Person' }
});
const Book = mongoose.model('Book', bookSchema);

// 默认情况下，Mongoose 会将 `author` 添加到 `select()`.
await Book.find().select('title').populate('author');

// 换句话说，下面的查询和上面等同
await Book.find().select('title author').populate('author');
```

要默认不选择填充字段，请在你的 schema 中将 `selectPopulatedPaths` 设置为 `false`。

```javascript
const bookSchema = new Schema({
  title: 'String',
  author: { type: 'ObjectId', ref: 'Person' }
}, { selectPopulatedPaths: false });
const Book = mongoose.model('Book', bookSchema);

// 因为 `selectPopulatedPaths` 为 false，下面的文档将 **不会** 包含任何 `author` 属性
const doc = await Book.findOne().select('title').populate('author');
```

##### storeSubdocValidationError

因为遗留的原因，当单个嵌套 schema 的子路径中存在校验错误时，Mongoose 会记录单个嵌套 schema 路径中也存在验证错误。例如:

```javascript
const childSchema = new Schema({ name: { type: String, required: true } });
const parentSchema = new Schema({ child: childSchema });

const Parent = mongoose.model('Parent', parentSchema);

// 将同时包含 'child.name' 和 'child' 的错误
new Parent({ child: {} }).validateSync().errors;
```

在子 schema 中将 `storeSubdocValidationError` 设置为 `false`，可以让 Mongoose 只报告父 schema 的错误。 

```javascript
const childSchema = new Schema({
  name: { type: String, required: true }
}, { storeSubdocValidationError: false }); // <-- 在子 schema 中设置
const parentSchema = new Schema({ child: childSchema });

const Parent = mongoose.model('Parent', parentSchema);

// 将只包含 'child.name' 的错误
new Parent({ child: {} }).validateSync().errors;
```

#### 使用 ES6 类

Schemas 有一个 [`loadClass()` 方法](https://mongoosejs.com/docs/api/schema.html#schema_Schema-loadClass)，你可以用它从 [ES6 类](https://thecodebarbarian.com/an-overview-of-es6-classes) 来创建一个 Mongoose schema：

- [ES6 类方法](https://masteringjs.io/tutorials/fundamentals/class#methods) 变成 [Mongoose 实例方法](#实例方法)
- [ES6 类静态方法](https://masteringjs.io/tutorials/fundamentals/class#statics) 变成 [Mongoose 静态方法](#静态方法)
- [ES6 getters 和 setters](https://masteringjs.io/tutorials/fundamentals/class#getterssetters) 变成 [Mongoose 虚拟字段](#virtuals)

这里有一个使用 `loadClass()` 从ES6 类来创建 schema 的例子：

```javascript
class MyClass {
  myMethod() { return 42; }
  static myStatic() { return 42; }
  get myVirtual() { return 42; }
}

const schema = new mongoose.Schema();
schema.loadClass(MyClass);

console.log(schema.methods); // { myMethod: [Function: myMethod] }
console.log(schema.statics); // { myStatic: [Function: myStatic] }
console.log(schema.virtuals); // { myVirtual: VirtualType { ... } }
```

#### 插件化

Schemas 也支持 [插件化](https://mongoosejs.com/docs/plugins.html) 来让我们将可重用的功能打包到插件中，这些插件可以在社区里分享或者仅仅在你的项目里共用。

#### 延伸阅读

这里是 [另一个对 Mongoose schemas 的介绍](https://masteringjs.io/tutorials/mongoose/schema)。

为了充分利用 MongoDB，你需要学习 MongoDB schema 设计的基础知识。SQL schema 设计(第三种标准形式)旨在最小化存储成本，而MongoDB 模式设计旨在使常见查询能尽可能地快。[MongoDB 模式设计的 6 条经验法则博客系列](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1) 是一个使你的查询变快的基本规则的优秀学习资源。

想要在 Node.js 中掌握 MongoDB schema 设计的用户应该看看 Christian Kvalheim 的 [The Little MongoDB Schema Design Book](http://bit.ly/mongodb-schema-design)，他也是  [MongoDB Node.js driver](http://npmjs.com/package/mongodb) 的最初作者。这本书向您展示了如何为一系列用例实现高性能的 schemas，包括电子商务、wiki 和预约。

### SchemaTypes

SchemaTypes 处理字段 [defaults](#), [validation](#), [getters](#), [setters](#), [查询的默认选择字段](#)，和其他 Mongoose 文档属性的一般特征。

- [SchemaTypes 是什么?](#schematypes-是什么)
- [`type` 属性](#type-属性)
- [SchemaType 选项](#schematype-选项)
- [使用说明](#使用说明)
- [Getters](#getters)
- [Schemas](#schemas-1)
- [创建自定义类型](#创建自定义类型)
- [`schema.path()` 函数](#schema-path-函数)
- [延伸阅读](#延伸阅读)

#### SchemaTypes 是什么?
你可以将 Mongoose schema 看作是 Mongoose model 的配置对象，然后 SchemaType 是单个属性的配置对象。SchemaType 会告诉给定字段应该是什么类型，它是否有任何 getters/setters，以及哪些值是合法的。

```javascript
const schema = new Schema({ name: String });
schema.path('name') instanceof mongoose.SchemaType; // true
schema.path('name') instanceof mongoose.Schema.Types.String; // true
schema.path('name').instance; // 'String'
```

SchemaType 不同于 type。换句话说，`mongoose.ObjectId !== mongoose.Types.ObjectId` 。SchemaType 只是 Mongoose 的一个配置对象，`mongoose.ObjectId` SchemaType 的实例实际上不会创建 MongoDB ObjectIds，它仅仅是 schema 中一个属性的配置。

下面是 Mongoose 里所有合法的 SchemaTypes。Mongoose 插件也可以添加自定义的 SchemaTypes，比如 [int32](#)。去 [Mongoose's plugins search](#) 查找插件。

- [String](#)
- [Number](#)
- [Date](#)
- [Buffer](#)
- [Boolean](#)
- [Mixed](#)
- [ObjectId](#)
- [Array](#)
- [Decimal128](#)
- [Map](#)
- [Schema](#)

##### 例子

```javascript
const schema = new Schema({
  name:    String,
  binary:  Buffer,
  living:  Boolean,
  updated: { type: Date, default: Date.now },
  age:     { type: Number, min: 18, max: 65 },
  mixed:   Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  decimal: Schema.Types.Decimal128,
  array: [],
  ofString: [String],
  ofNumber: [Number],
  ofDates: [Date],
  ofBuffer: [Buffer],
  ofBoolean: [Boolean],
  ofMixed: [Schema.Types.Mixed],
  ofObjectId: [Schema.Types.ObjectId],
  ofArrays: [[]],
  ofArrayOfNumbers: [[Number]],
  nested: {
    stuff: { type: String, lowercase: true, trim: true }
  },
  map: Map,
  mapOfString: {
    type: Map,
    of: String
  }
})

// example use

const Thing = mongoose.model('Thing', schema);

const m = new Thing;
m.name = 'Statue of Liberty';
m.age = 125;
m.updated = new Date;
m.binary = Buffer.alloc(0);
m.living = false;
m.mixed = { any: { thing: 'i want' } };
m.markModified('mixed');
m._someId = new mongoose.Types.ObjectId;
m.array.push(1);
m.ofString.push("strings!");
m.ofNumber.unshift(1,2,3,4);
m.ofDates.addToSet(new Date);
m.ofBuffer.pop();
m.ofMixed = [1, [], 'three', { four: 5 }];
m.nested.stuff = 'good';
m.map = new Map([['key', 'value']]);
m.save(callback);
```

#### `type` 属性

`type` 是 Mongoose schemas 里一个特殊的属性。当 Mongoose 在 schema 中找到一个名称为 `type` 的嵌套属性，Mongoose 假定其需要使用给定的 type 定义其 SchemaType。

```javascript
// 3 个 string SchemaTypes: 'name', 'nested.firstName', 'nested.lastName'
const schema = new Schema({
  name: { type: String },
  nested: {
    firstName: { type: String },
    lastName: { type: String }
  }
});
```

因此，[你需要做一些额外的工作去定义 schema 中一个名为](https://mongoosejs.com/docs/faq.html#type-key) `type` 的属性。例如，假设你要开发一个股票投资组合的应用，然后你想保存资产的 `type` （股票，债券，ETF，等等)。 你可能会天真地这么去定义：

```javascript
const holdingSchema = new Schema({
  // 你可能会期待 `asset` 会是一个拥有 2 个属性的对象
  // 但是不幸的是 `type` 在 Mongoose 里是很特殊的，其会将这个 schema 解释为 `asset` 是一个字符串
  asset: {
    type: String,
    ticker: String
  }
});
```

但是，当 Mongoose 看到 `type: String` ， 其会假定 `asset` 应该是一个字符串，而不是一个具有 `type` 属性的对象。正确的方式去定义一个具有 `type` 属性的对象如下所示：

```javascript
const holdingSchema = new Schema({
  asset: {
    // 解决方案是确保 Mongoose 知道 `asset` 是一个对象和 `asset.type` 是一个字符串，
    // 而不是以为 `asset` 是字符串
    type: { type: String },
    ticker: String
  }
});
```

#### SchemaType 选项

你可以直接使用 type 定义一个 schema 类型，或者使用一个具有 `type` 属性的对象。

```javascript
const schema1 = new Schema({
  test: String // `test` 是一个字符串属性
});

const schema2 = new Schema({
  // `test` 对象包含了 "SchemaType options"
  test: { type: String } // `test` 是一个字符串属性
});
```


除了 `type` 属性，你还可以指定其他属性。例如：你想在保存之前将字符串转化为小写：

```javascript
const schema2 = new Schema({
  test: {
    type: String,
    lowercase: true // 总是将 `test` 转化为小写
  }
});
```

你可以将任何属性添加到 SchemaType 选项里，有很多插件依赖自定义的 SchemaType 选项。例如，[mongoose-autopopulate](http://plugins.mongoosejs.io/plugins/autopopulate) 插件会自动填充在 SchemaType 选项里设置为 `autopopulate: true` 的字段。 Mongoose 内置支持了一些 SchemaType 选项，比如上例中的 `lowercase`。

`lowercase` 选项只适用于字符串。有些选项适用于所有的 schema types，有些只适用于特定的 schema types。

##### 所有的Schema Types

- `required` ：布尔或函数类型，如果为 true 会给该属性添加一个 [required validator](#)
- `default` ：任何值类型或函数类型，给字段设置一个默认值。如果这个值是函数，函数返回值就作为默认值
- `select` ：布尔值，制定查询结果的默认 [projections](#)
- `validate` ：函数类型，给该属性添加一个 [validator function](#)
- `get` ：函数类型，使用 `Object.defineProperty()` 给该属性定义一个自定义 getter
- `set` ：函数类型，使用 `Object.defineProperty()` 给该属性定义一个自定义 setter
- `alias` ：字符串类型，mongoose >= 4.10.0 增加，使用给定的名称定义一个 [virtual](#) 用来 gets/sets 该字段
- `immutable` ：布尔值，定义一个字段为不可改变的，Mongoose 会阻止你更改该字段，除非其父文档有 `isNew: true` 选项
- `transform` ：函数类型, 当你在调用 `Document#toJSON()` 函数和在使用 `JSON.stringify()` 来格式化一个文档的时候，Mongoose 会调用该函数

```javascript
const numberSchema = new Schema({
  integerOnly: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i'
  }
});

const Number = mongoose.model('Number', numberSchema);

const doc = new Number();
doc.integerOnly = 2.001;
doc.integerOnly; // 2
doc.i; // 2
doc.i = 3.001;
doc.integerOnly; // 3
doc.i; // 3
```

##### Indexes

你还可以使用 schema type 选项来定义 MongoDB 的索引 

- `index` ：布尔类型，是否在该属性上定义一个索引
- `unique` ：布尔类型，是否在该属性上定义一个唯一索引
- `sparse` ：布尔类型，是否在该属性上定义一个稀疏索引

```javascript
const schema2 = new Schema({
  test: {
    type: String,
    index: true,
    unique: true // 唯一索引，如果你设置`unique: true`
    // 如果你设置了 `unique: true`，那么 `index: true` 就是可选的
  }
});
```

##### String

- `lowercase` ：布尔类型，是否总是对该值调用 `.toLowerCase()`
- `uppercase` ：布尔类型，是否总是对该值调用 `.toUpperCase()`
- `trim` ：布尔类型，是否总是对该值调用 `.trim()`
- `match` ：RegExp 类型，创建一个 [validator](#) 来检查该值是否匹配给定的正则表达式
- `enum` ：数组类型，创建一个 [validator](#) 来检查该值是否在给定的数组内存在
- `minLength` ：数字类型，创建一个 [validator](#) 来检查该值的长度是否不小于给的的数字
- `maxLength` ：数字类型，创建一个 [validator](#) 来检查该值的长度是否不大于给的的数字
- `populate` ：对象类型，设置默认的 [populate options](#查询条件和其他选项)

##### Number
- `min` ：数字类型，创建一个 [validator](#) 来检查该值是否大于或等于给定的最小值
- `max` ：数字类型，创建一个 [validator](#) 来检查该值是否小于或等于给定的最大值
- `enum` ：数组类型，创建一个 [validator](#) 来检查该值是否和给定数组里的某个值严格相等
- `populate` ：对象类型，设置默认的 [populate options](#查询条件和其他选项)

##### Date

- `min` ：Date 类型
- `max` ：Date 类型

##### ObjectId

- `populate` ：对象类型, 设置默认的 [populate options](#查询条件和其他选项)

#### 使用说明

##### String

将字段声明为字符串类型，你可以使用全局构造函数 `String` 或 `'String'` 字符串。

```javascript
const schema1 = new Schema({ name: String }); // name 会转化为 string
const schema2 = new Schema({ name: 'String' }); // 等同

const Person = mongoose.model('Person', schema2);
```
如果你传递一个具有 `toString()` 函数的元素，Mongoose 会调用它，除非该元素是一个数组或者 `toString()` function 严格等于 `Object.prototype.toString()`。 

```javascript
new Person({ name: 42 }).name; // "42" as a string
new Person({ name: { toString: () => 42 } }).name; // "42" 是一个字符串

// "undefined", 会得到一个 cast error 当你 `save()` 该文档的时候
new Person({ name: { foo: 42 } }).name;
```

##### Number

将字段声明为数字类型，你可以使用全局构造函数 `Number` 或 `'Number'` 字符串。

```javascript
const schema1 = new Schema({ age: Number }); // age 会被转化为数字
const schema2 = new Schema({ age: 'Number' }); // 等同

const Car = mongoose.model('Car', schema2);
```

有几种类型的值会被成功转化为数字

```javascript
new Car({ age: '15' }).age; // 15 as a Number
new Car({ age: true }).age; // 1 as a Number
new Car({ age: false }).age; // 0 as a Number
new Car({ age: { valueOf: () => 83 } }).age; // 83 as a Number
```

如果你传入一个具有 `valueOf()` 函数并且函数返回值为数字的对象，Mongoose 会调用它并将其返回值赋给该字段。


`null` 和 `undefined` 两个值不会被转化。

NaN，转化为 NaN 的字符串，数组和对象，这些没有 `valueOf()` 函数的类型一旦被校验，都会产生一个 [CastError](#)， 意味着其不会在初始化的时候抛出，而是在校验的时候。

##### Dates

[内置的](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) `Date` 方法 [没有集成到](#https://github.com/Automattic/mongoose/issues/1598) mongoose 的修改跟踪逻辑，在英语中意思就是当你在 document 上使用 `Date` 并且使用如 `setMonth()` 的方法修改它，mongoose 不会感知到这个修改，并且 `doc.save()` 不会保持这个改变。如果你使用内置方法修改了 `Date` 类型的字段，在保存文档之前请使用  `doc.markModified('pathToYourDate')` 告诉 mongoose 这个改变。

```javascript
const Assignment = mongoose.model('Assignment', { dueDate: Date });
Assignment.findOne(function (err, doc) {
  doc.dueDate.setMonth(3);
  doc.save(callback); // 这样不会保持改变

  doc.markModified('dueDate');
  doc.save(callback); // 有效
})
```

##### Buffer

将字段声明为 Buffer 类型，你可以使用全局构造函数 `Buffer` 或 `'Buffer'` 字符串。

```javascript
const schema1 = new Schema({ binData: Buffer }); // binData 会转化为 Buffer
const schema2 = new Schema({ binData: 'Buffer' }); // 等同

const Data = mongoose.model('Data', schema2);
```

Mongoose 会将下列值转化为 buffers。

```javascript
const file1 = new Data({ binData: 'test'}); // {"type":"Buffer","data":[116,101,115,116]}
const file2 = new Data({ binData: 72987 }); // {"type":"Buffer","data":[27]}
const file4 = new Data({ binData: { type: 'Buffer', data: [1, 2, 3]}}); // {"type":"Buffer","data":[1,2,3]}
```

##### Mixed

一个“可以是任何东西”的 SchemaType。Mongoose 不会对 mixed 字段对任何转化。你可以使用 `Schema.Types.Mixed` 定义一个 mixed 字段或者传递一个空的对象字面量，下面的写法都是等同的。

```javascript
const Any = new Schema({ any: {} });
const Any = new Schema({ any: Object });
const Any = new Schema({ any: Schema.Types.Mixed });
const Any = new Schema({ any: mongoose.Mixed });
```

因为 Mixed 是一个 schema-less 的类型，你可以将值改成任何你想要的样子，但是 Mongoose 会失去自动检查改变和保存的能力。
为了告诉 Mongoose 一个 Mixed 类型的值被修改了，你需要调用 `doc.markModified(path)`，将你刚刚修改的 Mixed 字段名 传进去。

为了避免这些副作用，可以使用 [Subdocument](#) 类型的字段作为替代。

```javascript
person.anything = { x: [3, 4, { y: "changed" }] };
person.markModified('anything');
person.save(); // Mongoose 会保存这些修改到 `anything`
```

##### ObjectIds

ObjectId 是一个特殊的类型，通常作为唯一标识符。下面是如何声明一个具有 ObjectId 类型的 driver 字段的 schema：

```javascript
const mongoose = require('mongoose');
const carSchema = new mongoose.Schema({ driver: mongoose.ObjectId }); 
```

`ObjectId` 是一个类，然后 ObjectIds 是对象。但是, 它们通常表示为字符串。当你使用 toString() 将 ObjectId 转化为一个字符串的时候，你会得到一个 24 位的十六进制字符串：

```javascript
const Car = mongoose.model('Car', carSchema);

const car = new Car();
car.driver = new mongoose.Types.ObjectId();

typeof car.driver; // 'object'
car.driver instanceof mongoose.Types.ObjectId; // true

car.driver.toString(); // Something like "5e1a0651741b255ddda996c4"
```

##### Boolean

Mongoose 中的布尔值是 [纯 JavaScript 布尔值](https://www.w3schools.com/js/js_booleans.asp)。默认情况下，Mongoose 会将以下值转化为 `true`：

- `true`
- '`true`'
- `1`
- `'1'`
- `'yes'`

Mongoose 会将以下值转化为 `false`:

- `false`
- `'false'`
- `0`
- `'0'`
- `'no'`


任何其他值都会导致 [CastError](https://mongoosejs.com/docs/validation.html#cast-errors)。你可以使用 `convertToTrue` and `convertToFalse` 属性来修改哪些值可以被 Mongoose 转化为 true 或 false，这两个属性是 [JavaScript sets](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

```javascript
const M = mongoose.model('Test', new Schema({ b: Boolean }));
console.log(new M({ b: 'nay' }).b); // undefined

// Set { false, 'false', 0, '0', 'no' }
console.log(mongoose.Schema.Types.Boolean.convertToFalse);

mongoose.Schema.Types.Boolean.convertToFalse.add('nay');
console.log(new M({ b: 'nay' }).b); // false
```

##### Arrays

Mongoose 支持 [SchemaTypes](https://mongoosejs.com/docs/api.html#schema_Schema.Types) 数组和 [子文档](https://mongoosejs.com/docs/subdocs.html) 数组。SchemaTypes 数组也被称作原始数组，子文档数组也被称作文档数组。


```javascript
const ToySchema = new Schema({ name: String });
const ToyBoxSchema = new Schema({
  toys: [ToySchema],
  buffers: [Buffer],
  strings: [String],
  numbers: [Number]
  // ... 等等
});
```

数组类型是特殊的，因为其隐式地具有一个默认值 `[]` (空数组)。

```javascript
const ToyBox = mongoose.model('ToyBox', ToyBoxSchema);
console.log((new ToyBox()).toys); // []
```

要覆盖此默认值，你需要将默认值设置为 `undefined`

```javascript
const ToyBoxSchema = new Schema({
  toys: {
    type: [ToySchema],
    default: undefined
  }
});
```

注意：制定一个空数组和 `Mixed` 等同。下面都是创建了 `Mixed` 数组：

```javascript
const Empty1 = new Schema({ any: [] });
const Empty2 = new Schema({ any: Array });
const Empty3 = new Schema({ any: [Schema.Types.Mixed] });
const Empty4 = new Schema({ any: [{}] });
```

##### Maps

_Mongoose 5.1.0 新增_

`MongooseMap` 是 JavaScript `Map` [类](http://thecodebarbarian.com/the-80-20-guide-to-maps-in-javascript.html) 的子类，在该文档中，我们会交替使用术语 `'map'` 和 `MongooseMap`。 在 Mongoose 中，maps 是创建带有任意键的嵌套文档的方式。

注意: 在 Mongoose Maps 里，键必须是字符串以便其能存储到 MongoDB。

```javascript
const userSchema = new Schema({
  // `socialMediaHandles` 是一个值为字符串的 map，map 的键都是字符串
  // 使用' of '指定值的类型
  socialMediaHandles: {
    type: Map,
    of: String
  }
});

const User = mongoose.model('User', userSchema);
// Map { 'github' => 'vkarpov15', 'twitter' => '@code_barbarian' }
console.log(new User({
  socialMediaHandles: {
    github: 'vkarpov15',
    twitter: '@code_barbarian'
  }
}).socialMediaHandles);
```
上面的例子不会显式的声明 `github` 或 `twitter` 作为字段，但是因为 `socialMediaHandles` 是一个 map，你可以存储任意的 键/值对，同时，你必须使用 `.get()` 来获取一个键的值，使用 `.set()` 来设置一个键的值。

```javascript
const user = new User({
  socialMediaHandles: {}
});

// Good
user.socialMediaHandles.set('github', 'vkarpov15');
// Works too
user.set('socialMediaHandles.twitter', '@code_barbarian');
// Bad, the `myspace` property will **not** get saved
user.socialMediaHandles.myspace = 'fail';

// 'vkarpov15'
console.log(user.socialMediaHandles.get('github'));
// '@code_barbarian'
console.log(user.get('socialMediaHandles.twitter'));
// undefined
user.socialMediaHandles.github;

// 将不会保存 'github' 和 'twitter' 属性
user.save();
```

Map 类型会使用 [MongoDB 的 BSON 对象 ](https://en.wikipedia.org/wiki/BSON#Data_types_and_syntax) 存储。BSON 对象的键是有序的，所以这意味着 map 属性的 [插入顺序](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#description) 保留了下来。

Mongoose 支持一个特殊的语法 `$*` 来 [填充](#populate) map 中的所有元素。例如，假设你的 `socialMediaHandles` map 包含一个 `ref`：

```javascript
const userSchema = new Schema({
  socialMediaHandles: {
    type: Map,
    of: new Schema({
      handle: String,
      oauth: {
        type: ObjectId,
        ref: 'OAuth'
      }
    })
  }
});
const User = mongoose.model('User', userSchema);
```

要填充每个 `socialMediaHandles` 记录的 `oauth` 属性，你应该填充 `socialMediaHandles.$*.oauth`：

```javascript
const user = await User.findOne().populate('socialMediaHandles.$*.oauth');
```

#### Getters

Getters 和 schema 中定义的字段的 virtuals 类似。例如，假设你想将用户头像的图片存储成相对路径，然后想在应用里加上主机名。下面可能是你构造 `userSchema` 的方式：

```javascript
const root = 'https://s3.amazonaws.com/mybucket';

const userSchema = new Schema({
  name: String,
  picture: {
    type: String,
    get: v => `${root}${v}`
  }
});

const User = mongoose.model('User', userSchema);

const doc = new User({ name: 'Val', picture: '/123.png' });
doc.picture; // 'https://s3.amazonaws.com/mybucket/123.png'
doc.toObject({ getters: false }).picture; // '/123.png'
```

通常来说，你只会在原始类型的字段上使用 getters，而非数组或子文档上。因为 getters 会重写访问 Mongoose 字段返回的值，在一个对象上声明 getter 可能会移除 Mongoose 对该字段的修改跟踪逻辑。


```javascript
const schema = new Schema({
  arr: [{ url: String }]
});

const root = 'https://s3.amazonaws.com/mybucket';

// 不好，不要这么做
schema.path('arr').get(v => {
  return v.map(el => Object.assign(el, { url: root + el.url }));
});

// Later
doc.arr.push({ key: String });
doc.arr[0]; // 'undefined' 因为每个 `doc.arr` 表达式会创建一个新的数组！
```

不和如上展示的那样在 array 上声明一个 getter，你应该像下面展示的那样，在 `url` 字符串上声明一个 getter。如果你想在一个嵌套的文档或者数组上声明 getter，要非常小心！

```javascript
const schema = new Schema({
  arr: [{ url: String }]
});

const root = 'https://s3.amazonaws.com/mybucket';

// Good，这样做，而不是在 `arr` 上声明 getter
schema.path('arr.0.url').get(v => `${root}${v}`);
```

#### Schemas

声明一个字段为其他 [schema](#schemas)，设置 `type` 为 子schema 的实例。

要根据 子schema 的形状设置一个默认值，只需给 default 设置一个值，然后该值会在文档创建之前根据 子schema 的定义去转化。

```javascript
const subSchema = new mongoose.Schema({
  // 一些 schema 定义
});

const schema = new mongoose.Schema({
  data: {
    type: subSchema
    default: {}
  }
});
```

#### 创建自定义类型

Mongoose 还可以使用 [自定义 SchemaTypes](https://mongoosejs.com/docs/customschematypes.html) 来拓展。查询这些 [插件](https://plugins.mongoosejs.io/) 网站来找到合适的类型比如 [mongoose-long](https://github.com/mongoosejs/mongoose-long)，[mongoose-int32](https://github.com/vkarpov15/mongoose-int32)，和 [其他类型](https://github.com/OpenifyIt/mongoose-types)。

获取更多信息，请查看 [custom SchemaTypes here](https://mongoosejs.com/docs/customschematypes.html)。

#### `schema.path()` 函数

`schema.path()` 函数会返回给定字段实例化后的 schema 类型。

```javascript
const sampleSchema = new Schema({ name: { type: String, required: true } });
console.log(sampleSchema.path('name'));
// 输出如下：
/**
 * SchemaString {
 *   enumValues: [],
  *   regExp: null,
  *   path: 'name',
  *   instance: 'String',
  *   validators: ...
  */
```
你可以使用该函数检查给定字段是什么 schema 类型，包括其有什么校验器，本身是什么类型。

#### 延伸阅读

- [Mongoose SchemaTypes 的介绍](https://masteringjs.io/tutorials/mongoose/schematype)
- [Mongoose Schema Types](https://kb.objectrocket.com/mongo-db/mongoose-schema-types-1418)

### 连接

你可以使用 `mongoose.connect()` 连接到 MongoDB。

```javascript
mongoose.connect('mongodb://localhost:27017/myapp');
```

这是连接到运行在本地默认端口(27017)的 `myapp` 数据库的最小配置。如果连接失败，请使用 `127.0.0.1` 来代替 `localhost` 。

你可以在 `uri` 上 指定更多的参数：

```javascript
mongoose.connect('mongodb://username:password@host:port/database?options...');
```

请查看 [mongodb connection string spec](https://docs.mongodb.com/manual/reference/connection-string/) 获取更多信息。

- [操作缓存](#操作缓存)
- [错误处理](#错误处理)
- [选项](#选项)
- [回调函数](#回调函数)
- [连接字符串选项](#连接字符串选项)
- [连接事件](#连接事件)
- [关于 keepAlive 的说明](#关于-keepalive-的说明)
- [副本集连接](#副本集连接)
- [副本集主机名](#副本集主机名)
- [Server Selection](#server-selection)
- [多 mongos 支持](#多-mongos-支持)
- [多个连接](#多个连接)
- [连接池](#连接池)

#### 操作缓存

Mongoose 让你可以立即使用 models，而不用等待 mongoose 成功连接到 MongoDB。

```javascript
mongoose.connect('mongodb://localhost:27017/myapp');
const MyModel = mongoose.model('Test', new Schema({ name: String }));
// 正常工作
MyModel.findOne(function(error, result) { /* ... */ });
```

这是因为 mongoose 内部会缓存你的函数调用，这类缓存是很方便的，但也是一个常见的困惑来源。默认情况下，如果你未连接数据库而使用 model，Mongoose 不会抛出任何错误。

```javascript
const MyModel = mongoose.model('Test', new Schema({ name: String }));
// 会挂起直到 mongoose 成功连接
MyModel.findOne(function(error, result) { /* ... */ });

setTimeout(function() {
  mongoose.connect('mongodb://localhost:27017/myapp');
}, 60000);
```
要禁用缓存，可以在 schema 里关掉 [bufferCommands option](#buffercommands)。如果你开启 `bufferCommands` 那么你的连接会挂起，尝试关闭 `bufferCommands` 来检查你是否正确地开启了连接。你也可以全局禁用 `bufferCommands` ：

```javascript
mongoose.set('bufferCommands', false);
```

注意，如果开启了 [autoCreate option](#autocreate)，缓存还会一直等待，直到 Mongoose 创建集合。要禁用缓存，你还应该禁用 `autoCreate` 选项，并且使用 `createCollection()` 创建 [固定集合](#capped) 或 [collections with collations](#collation)。

```javascript
const schema = new Schema({
  name: String
}, {
  capped: { size: 1024 },
  bufferCommands: false,
  autoCreate: false // 禁用 `autoCreate` 因为 `bufferCommands` 为 false

const Model = mongoose.model('Test', schema);
// 在使用之前显式创建集合
await Model.createCollection();
```

#### 错误处理

Mongoose 连接可能会出现两类错误。

- 初始连接的错误。如果初始连接失败了，Mongoose 会抛出一个 'error' 事件，`mongoose.connect()` 返回的 promise 会变成 reject 状态。 但是，Mongoose 不会自动重连。
- 初始连接建立之后的错误。Mongoose 会尝试重连，并且会抛出一个 'error' 事件。

要处理初始连接错误，你应该使用  `.catch()` 或者和 async/await 一起使用 `try/catch` 。


```javascript
mongoose.connect('mongodb://localhost:27017/test').
  catch(error => handleError(error));

// 或：
try {
  await mongoose.connect('mongodb://localhost:27017/test');
} catch (error) {
  handleError(error);
}
```

要处理初始连接建立后的错误，你应该在 connection 上监听 error 事件，但是你仍然需要处理如上所示的初始连接错误。

```javascript
mongoose.connection.on('error', err => {
  logError(err);
});
```

请注意，如果 Mongoose 失去了和 MongoDB 的连接，它不一定会抛出 'error' 事件。你应该监听 `disconnected` 事件，这样当 Mongoose 失去和 MongoDB 的连接后会报告。

#### 选项

#### 回调函数

`connect()` 函数还支持接收一个回调函数的参数，并且会返回一个 [promise](https://mongoosejs.com/docs/promises.html).

```javascript
mongoose.connect(uri, options, function(error) {
  // 在初始连接的时候检查 error，该回调没有第二个参数
});

// 或使用 promises
mongoose.connect(uri, options).then(
  () => { /** 可以使用了。The `mongoose.connect()` promise resolves to mongoose instance. */ },
  err => { /** 处理初始连接 error */ }
);
```

#### 连接字符串选项

您还可以在连接字符串中指定驱动选项，作为 URI 的 [查询字符串](https://en.wikipedia.org/wiki/Query_string) 中的参数。这只适用于传递给 MongoDB 驱动的选项，你不能在查询字符串里设置 Mongoose 专有的选项比如 `bufferCommands`。

```javascript
mongoose.connect('mongodb://localhost:27017/test?connectTimeoutMS=1000&bufferCommands=false&authSource=otherdb');
// 上面等同于：
mongoose.connect('mongodb://localhost:27017/test', {
  connectTimeoutMS: 1000
  // 注意 mongoose **不会** 使用查询字符串里的 `bufferCommands`
});
```

将选项放到查询字符串里的缺点是更难读懂，优点是你只需要一个配置项，URI，而不是将配置项分离成 `socketTimeoutMS`，`connectTimeoutMS` ，等等。最佳实践是将开发和生产之间可能不同的选项，如 `replicaSet` 或 `ssl` ，放在连接字符串中，并将应该保持不变的选项，如 `connectTimeoutMS` 或 `maxPoolSize` ，放在选项对象中。

MongoDB 文档有关于 [supported connection string options](https://docs.mongodb.com/manual/reference/connection-string/) 的一个完整列表。下面是一些连接字符串中常用的选项，因为它们和主机及身份验证信息密切相关。

- `authSource` - 使用 `user` 和 `pass` 验证身份使用的数据库。在 MongoDB 里，[用户被限定在一个数据库里](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/)。如果遇到意外的登录失败，可能需要设置此选项。

- `family` - 使用 IPv4 还是 IPv6 连接。这个选项会传递给 [Node.js](https://nodejs.org/api/dns.html#dns_dns_lookup_hostname_options_callback) 的 `dns.lookup()` 函数。如果你没有指定该选项，MongoDB 会 优先使用 IPv6，如果 IPv6 失败了再使用 IPv4。 如果你的 `mongoose.connect(uri)` 调用花费了很长时间，请使用 `mongoose.connect(uri, { family: 4 })`

#### 连接事件

Connections 继承自 [Node.js](https://nodejs.org/api/events.html#events_class_eventemitter) `EventEmitter` 类，并当连接发生事件时触发事件，比如失去和 MongoDB 服务器的连接。下面是 connection 会触发的事件列表。

- `connecting`: 当 Mongoose 开始和 MongoDB 服务器建立初始连接的时候触发
- `connected`: 当 Mongoose 和 MongoDB 服务器成功完成初始连接，或 Mongoose 在失去连接后重连成功的时候触发
- `open`:  和 `connected` 等同
- `disconnecting`: 你的应用调用了 `Connection#close()` 来和 MongoDB 断连
- `disconnected`: 当 Mongoose 失去了和 MongoDB 服务器的连接时触发。该事件可能是由于你的代码显式地关闭连接，数据库服务器崩溃，或者网络连接问题。
- `close`: 在调用 `Connection#close()` 成功地关闭连接之后触发。如果你调用 `conn.close()` ，你会获得 'disconnected' 和 'close' 总共 2 个事件。
- `reconnected`: 如果 Mongoose 失去和 MongoDB 的连接并且成功重连后触发。当 Mongoose 失去和数据库的连接后，其会尝试自动重连。
- `error`: 当连接发生错误时触发，比如由于错误的数据或 payload 大于 [16MB](https://docs.mongodb.com/manual/reference/limits/#BSON-Document-Size) 导致的 `parseError`。
- `fullsetup`: 当你准备连接到一个副本集并且 Mongoose 成功连接了主服务器和至少一台从服务器的时候触发。
- `all`: 当你准备连接到一个副本集并且 Mongoose 成功连接了连接字符串里指定的所有服务器。
- `reconnectFailed`: 当你连接到一台独立的服务器并且 Mongoose 用完了 `reconnectTries` 的时候触发。 在该事件触发后，[MongoDB driver](http://npmjs.com/package/mongodb) 将不会尝试重连。如果你连接到一个副本集，该事件将永远不会触发。

当你准备连接到一个单独的 MongoDB 服务器（"standalone"），Mongoose 将在和单独的服务器断连后触发 'disconnected'，在成功连接后触发 'connected'。在副本集里，Mongoose 将在和副本集主服务器断连后触发 'disconnected'，和副本集主服务器重连后触发 'connected'。


#### 关于 keepAlive 的说明

对于长期运行的应用，通常谨慎的做法是使用若干毫秒来启用 `keepAlive` 。没有启用的话，一段时间后你可能会无缘无故地得到 `"connection closed"` 的报错，如果发生了，[阅读这个](https://tldp.org/HOWTO/TCP-Keepalive-HOWTO/overview.html) 后，你可能会决定启用 `keepAlive`：

```javascript
mongoose.connect(uri, { keepAlive: true, keepAliveInitialDelay: 300000 });
```

`keepAliveInitialDelay` 是 socket 上启动 `keepAlive` 之前等待的毫秒数。 自 mongoose 5.2.0 起 `keepAlive` 默认为 true。

#### Replica Set Connections

要连接到一个复制集，需要传递一个用逗号分隔的主机列表，而不是单个主机。

```javascript
mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options]);
```

例如：

```javascript
mongoose.connect('mongodb://user:pw@host1.com:27017,host2.com:27017,host3.com:27017/testdb');
```

要连接到副本集的单个节点，请指定 `replicaSet` 选项。

```javascript
mongoose.connect('mongodb://host1:port1/?replicaSet=rsName');
```

#### Replica Set Host Names

MongoDB 副本集依赖于能够可靠地找出每个成员的域名。在 Linux 和 OSX 系统上，MongoDB 服务器使用 [hostname command](https://linux.die.net/man/1/hostname) 输出的结果来找出域名报告给副本集。当你准备连接到一个报告 `hostname` 为 `localhost` 机器上的远程副本集时，这可能会导致一些令人困惑的报错。

```javascript
// 即使连接字符串上都没有包含 `localhost` 都可能就得到这个报错
// 如果 `rs.conf()` 报告副本集成员的主机名为 `localhost`
failed to connect to server [localhost:27017] on first connect
```

如果你正在经历相似的报错，使用 `mongo`  连接到副本集，然后使用 `rs.conf()` 命令来检查每个副本集成员的主机名。参照 [如何更改副本集成员主机名的说明](https://docs.mongodb.com/manual/tutorial/change-hostnames-in-a-replica-set/#change-hostnames-while-maintaining-replica-set-availability).

#### Server Selection

在 MongoDB 驱动之下使用了一个被称为 [server selection](https://github.com/mongodb/specifications/blob/master/source/server-selection/server-selection.rst) 的进程去连接 MongoDB 并且发送操作到 MongoDB。如果在 MongoDB 驱动不能找到发送操作的服务器超过 `serverSelectionTimeoutMS` 后，你会得到以下报错：

```javascript
MongoTimeoutError: Server selection timed out after 30000 ms
```

你可以在 `mongoose.connect()` 的时候使用 `serverSelectionTimeoutMS` 选项来配置超时时间。

```javascript
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000 // 5s 后超时，替代 30s
});
```

`MongoTimeoutError` 有一个`reason` 属性解释为什么 server selection 会超时。例如，如果你使用错误的密码连接到一个单独的服务器， `reason` 会包含一个 "Authentication failed" 的报错。

```javascript
const mongoose = require('mongoose');

const uri = 'mongodb+srv://username:badpw@cluster0-OMITTED.mongodb.net/' +
  'test?retryWrites=true&w=majority';
// 打印 "MongoServerError: bad auth Authentication failed."
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));
```

#### 多 mongos 支持

您还可以连接到多个 [mongos](https://docs.mongodb.com/manual/reference/program/mongos/) 实例，以在分片集群中获得高可用性。在 mongoose 5.x 中，你在连接多个 mongos 实例的时候 [不需要传递任何特殊选项](http://mongodb.github.io/node-mongodb-native/3.0/tutorials/connect/#connect-to-sharded-cluster)。
```javascript
// 连接到 2 个 mongos 服务器
mongoose.connect('mongodb://mongosA:27501,mongosB:27501', cb);
```

#### 多个连接

So far we've seen how to connect to MongoDB using Mongoose's default connection. Mongoose creates a default connection when you call mongoose.connect(). You can access the default connection using mongoose.connection.

You may need multiple connections to MongoDB for several reasons. One reason is if you have multiple databases or multiple MongoDB clusters. Another reason is to work around slow trains. The mongoose.createConnection() function takes the same arguments as mongoose.connect() and returns a new connection.

```javascript
const conn = mongoose.createConnection('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]', options);
```

This connection object is then used to create and retrieve models. Models are always scoped to a single connection.

```javascript
const UserModel = conn.model('User', userSchema);
```

If you use multiple connections, you should make sure you export schemas, not models. Exporting a model from a file is called the export model pattern. The export model pattern is limited because you can only use one connection.

```javascript
const userSchema = new Schema({ name: String, email: String });

// The alternative to the export model pattern is the export schema pattern.
module.exports = userSchema;

// Because if you export a model as shown below, the model will be scoped
// to Mongoose's default connection.
// module.exports = mongoose.model('User', userSchema);
```

If you use the export schema pattern, you still need to create models somewhere. There are two common patterns. First is to export a connection and register the models on the connection in the file:

```javascript
// connections/fast.js
const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.MONGODB_URI);
conn.model('User', require('../schemas/user'));

module.exports = conn;

// connections/slow.js
const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.MONGODB_URI);
conn.model('User', require('../schemas/user'));
conn.model('PageView', require('../schemas/pageView'));

module.exports = conn;
```

Another alternative is to register connections with a dependency injector or another inversion of control (IOC) pattern.

```javascript
const mongoose = require('mongoose');

module.exports = function connectionFactory() {
  const conn = mongoose.createConnection(process.env.MONGODB_URI);

  conn.model('User', require('../schemas/user'));
  conn.model('PageView', require('../schemas/pageView'));

  return conn; 
};
```

#### 连接池

每个 `connection`，不管是通过 `mongoose.connect` 还是 `mongoose.createConnection` 创建的，都被纳入内部可配置的默认最大数为 100 的连接池。可以使用连接选项调整连接池的数量： 
```javascript
// 使用对象选项
mongoose.createConnection(uri, { maxPoolSize: 10 });

// 使用字符串带参数
const uri = 'mongodb://localhost:27017/test?maxPoolSize=10';
mongoose.createConnection(uri);
```


#### SSL Connections

#### SSL Validation


### Models

Model 由 schema 编译而来，Model 实例被称为 document。Model 负责从数据库创建和读取 document。

#### 编译 model

```javascript
const schema = new mongoose.Schema({ name: 'string', size: 'string' });
const Tank = mongoose.model('Tank', schema);
```

model 方法的第一个参数应为集合名称的单数形式。Mongoose 会自动使用其**复数的并且小写的版本**作为集合的名称。比如上述 Tank 对应的数据库集合名称为 tanks。
Note：model 方法会复制一份 schema。要确保在调用该方法前将所有的属性和方法，包括钩子都加到 schema 上了。

#### 创建 document

#### 查询

#### 删除

#### 更新

#### Change Streams


### Documents

Mongoose 的 document 一对一的对应着 MongoDB 存储的 document。每个 document 都是它对应 Model 的实例。

- [Documents vs Models](#documents-vs-models)
- [取回](#取回)
- [Updating Using `save()`](#使用-save-更新)
- [Updating Using Queries](#使用-queries-更新)
- [Validating](#validating)
- [Overwriting](#overwriting)

#### Documents vs Models

Documents 和 Models 在 Mongoose 里是不同的类。Model 是 Document 的子类，所以当你 new 一个 Model 的时候，实际上你创建了一个 document。


```javascript
const MyModel = mongoose.model('Test', new Schema({ name: String }));
const doc = new MyModel();

doc instanceof MyModel; // true
doc instanceof mongoose.Model; // true
doc instanceof mongoose.Document; // true
```


#### 取回

当调用 Model 的静态方法比如 `findOne`，返回结果（要使用 await）是 document。

```javascript
const doc = await MyModel.findOne();

doc instanceof MyModel; // true
doc instanceof mongoose.Model; // true
doc instanceof mongoose.Document; // true
```

#### 使用 `save()` 更新

Mongoose document 会跟踪变化。你可以通过普通赋值来修改 document 的属性，调用 save 方法后 Mongoose 会转化成 MongoDB 的 update 操作。

```javascript
doc.name = 'foo';

// Mongoose 会发送一个 `updateOne({ _id: doc._id }, { $set: { name: 'foo' } })` 到 MongoDB
await doc.save();
```

save 方法返回 promise，成功结果通过 resolve 方法接收，抛错通过 catch 来接收。

#### 使用 Queries 更新

更新文档一般会使用 save 方法，使用 save，你可以获得完整的 validation 和 middleware。
对于某些场景使用 save 不够灵活，所以 Mongoose 可以让你不执行 middleware 和使用有限的 validation 就可以完成文档的更新操作。

#### Validating

文档在**保存**之前会被转换和校验。Mongoose 首先会将值转化为定义的类型然后在校验它们。从内部看，Mongoose 会在**保存**之前调用 validate 方法。

```javascript
const schema = new Schema({ name: String, age: { type: Number, min: 0 } });
const Person = mongoose.model('Person', schema);

let p = new Person({ name: 'foo', age: 'bar' });
// 在字段上 "age" 将值 "bar" 转化为 Number 失败 
await p.validate();

let p2 = new Person({ name: 'foo', age: -1 });
// 字段 `age` (-1) 比允许的最小值(0) 要小
await p2.validate();
```

对于更新操作，默认是不进行校验的，但是你可以设置 `runValidators: true` 来让其进行校验。

```javascript
// 在字段上 "age" 将值 "bar" 转化为 Number 失败 
await Person.updateOne({}, { age: 'bar' });

// 字段 `age` (-1) 比允许的最小值(0) 要小
await Person.updateOne({}, { age: -1 }, { runValidators: true });
```

#### Overwriting

### Subdocuments

Subdocuments are documents embedded in other documents. In Mongoose, this means you can nest schemas in other schemas. Mongoose has two distinct notions of subdocuments: arrays of subdocuments and single nested subdocuments.

```javascript
const childSchema = new Schema({ name: 'string' });

const parentSchema = new Schema({
  // Array of subdocuments
  children: [childSchema],
  // Single nested subdocuments. Caveat: single nested subdocs only work
  // in mongoose >= 4.2.0
  child: childSchema
});
```

Aside from code reuse, one important reason to use subdocuments is to create a path where there would otherwise not be one to allow for validation over a group of fields (e.g. dateRange.fromDate <= dateRange.toDate).

- [What is a Subdocument?]()
- [Subdocuments versus Nested Paths]()
- [Subdocument Defaults]()
- [Finding a Subdocument]()
- [Adding Subdocs to Arrays]()
- [Removing Subdocs]()
- [Parents of Subdocs]()
- [Alternate declaration syntax for arrays]()
- [Alternate declaration syntax for single subdocuments]()

#### What is a Subdocument?

#### Subdocuments versus Nested Paths

#### Subdocument Defaults

#### Finding a Subdocument

#### Adding Subdocs to Arrays

#### Removing Subdocs

#### Parents of Subdocs

#### Alternate declaration syntax for arrays

#### Alternate declaration syntax for single nested subdocuments


### Queries

Mongoose 的 Models 提供了一些静态方法来做 CRUD 操作，每个方法都会返回一个 Query 对象。
query 的执行有两种方式，，一个是传递回调函数，一个是调用 then 方法（有 then 方法，但其并不 是 promise 对象）。

#### Executing

传递回调函数的方式，可以传递一个对象。回调的范式和 NodeJs 一样，`callback(error, result)`

```javascript
const Person = mongoose.model('Person', yourSchema);

// 找到名字为 'Ghost' 的每个文档并选择 `name` 和 `occupation` 字段
Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err) return handleError(err);
  // 打印 "Space Ghost is a talk show host".
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

#### Queries 不是 Promises

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

// 因为同时存在 `await` **和** 回调函数, 这个 `updateOne()` 会执行 2 次
// 因此会把相同的字符串 push 到 `tags` 2 次
const update = { $push: { tags: ['javascript'] } };
await BlogPost.updateOne({ title: 'Introduction to Promises' }, update, (err, res) => {
  console.log(res);
});
```

#### References to other documents

MongoDB 里没有 join 操作，但是有 populate 方法可以达到类似效果。

#### Streaming

#### 对比 Aggregation

#### Query Casting

第一个传递给 `Model.find(), Model.findOne(), Query#find()` 的参数被称为过滤器，或者叫查询条件。

```javascript
const query = Character.find({ name: 'Jean-Luc Picard' });
query.getFilter(); // `{ name: 'Jean-Luc Picard' }`

// 
// 后续的链式调用会合并新的属性到过滤器
query.find({ age: { $gt: 50 } });
query.getFilter(); // `{ name: 'Jean-Luc Picard', age: { $gt: 50 } }`
```

#### findOneAndUpdate()

#### Lean Option

lean option 会让 Mongoose 跳过 document 和返回结果的混合，可以使查询更快更节省内存，但是返回结果是 `plain ordinary JavaScript objects (POJOs)`，而非 Mongoose document。

使用 lean 和不使用的区别
```javascript
const schema = new mongoose.Schema({ name: String });
const MyModel = mongoose.model('Test', schema);

await MyModel.create({ name: 'test' });

// 估计内存对象尺寸的模块
const sizeof = require('object-sizeof');

const normalDoc = await MyModel.findOne();
// 使用 `lean()` 函数在查询中开启 `lean` 选项
const leanDoc = await MyModel.findOne().lean();

sizeof(normalDoc); // 约 600
sizeof(leanDoc); // 36, 比原来小 10 倍多！


// 假设你想知道的话，JSON 形式的 Mongoose 文档和 POJO 是一样的。
// 额外的内存只会影响 Node.js 进程使用多少内存，而不是通过网络发送的数据大小
JSON.stringify(normalDoc).length === JSON.stringify(leanDoc.length); // true
```

使用 lean 的时机，一般来说，只要不改变 docment，就可以使用 lean。即对于 Restful API 来说，get 方法可以使用 lean，而 post，put 等不能使用 lean。
使用 lean：

```javascript
// 只要你不需要 Persion model 的任何虚拟字段或 getters，就可以使用 `lean()`
app.get('/person/:id', function (req, res) {
  Person.findOne({ _id: req.params.id })
    .lean()
    .then((person) => res.json({ person }))
    .catch((error) => res.json({ error: error.message }));
});
```

不使用 lean：

```javascript
// 这个路由 **不应该** 使用 `lean()`, 因为 lean 意味着不能使用 `save()`
app.put('/person/:id', function(req, res) {
  Person.findOne({ _id: req.params.id }).
    then(person => {
      assert.ok(person);
      Object.assign(person, req.body);
      return person.save();
    }).
    then(person => res.json({ person })).
    catch(error => res.json({ error: error.message }));
});
```

### Validation

Before we get into the specifics of validation syntax, please keep the following rules in mind:

- Validation is defined in the [SchemaType](#schematypes)
- Validation is [middleware](#中间件). Mongoose registers validation as a `pre('save')` hook on every schema by default.
- You can disable automatic validation before save by setting the [validateBeforeSave option](https://mongoosejs.com/docs/guide.html#validateBeforeSave)
- You can manually run validation using `doc.validate(callback)` or `doc.validateSync()`
- You can manually mark a field as invalid (causing validation to fail) by using `doc.invalidate(...)`
- Validators are not run on undefined values. The only exception is the `required` [validator](https://mongoosejs.com/docs/api.html#schematype_SchemaType-required).
- Validation is asynchronously recursive; when you call [Model#save](https://mongoosejs.com/docs/api.html#model_Model-save), sub-document validation is executed as well. - If an error occurs, your [Model#save](https://mongoosejs.com/docs/api.html#model_Model-save) callback receives it
- Validation is customizable

```javascript
const schema = new Schema({
  name: {
    type: String,
    required: true
  }
});
const Cat = db.model('Cat', schema);

// This cat has no name :(
const cat = new Cat();
cat.save(function(error) {
  assert.equal(error.errors['name'].message,
    'Path `name` is required.');

  error = cat.validateSync();
  assert.equal(error.errors['name'].message,
    'Path `name` is required.');
});
```

#### Built-in Validators

#### Custom Error Messages

#### The unique Option is Not a Validator


#### Custom Validators

#### Async Custom Validators

#### Validation Errors

#### Cast Errors

#### Required Validators On Nested Objects

#### Update Validators

#### Update Validators and this


#### The context option

#### Update Validators Only Run On Updated Paths

#### Update Validators Only Run For Some Operations


### 中间件

中间件（也叫 pre 和 post 钩子）是在执行异步函数时传递控制的函数。中间件在 scheme 级别上指定，对写 [插件](#插件) 非常有用。

- [中间件类型](#中间件类型)
- [Pre](#Pre)
- [Pre 钩子的报错](#pre-钩子的报错)
- [Post 中间件](#post-中间件)
- [异步 Post 钩子](#异步-post-钩子)
- [编辑 Models 之前定义中间件](#编辑-Models-之前定义中间件)
- [保存/校验钩子](#保存校验钩子)
- [命名冲突](#命名冲突)
- [注意 findAndUpdate() 和 Query 中间件](#注意-findandupdate-和-query-中间件)
- [中间件错误处理](#中间件错误处理)
- [Aggregation 钩子](#aggregation-钩子)
- [同步钩子](#)

#### 中间件类型

Mongoose 有 4 种中间件：document 中间件，model 中间件，aggregate 中间件，query 中间件。以下 document 函数可以使用 document 中间件。在 document 中间件函数里，`this` 指向文档对象。

- [validate](#)
- [save](#)
- [remove](#)
- [updateOne](#)
- [deleteOne](#)
- [init](3) (note: init hooks are [synchronous](#))

以下 Model 和 Query 函数可以使用 query 中间件。在 query 中间件函数里, `this` 指向 query 对象。

- [count](#)
- [countDocuments](#)
- [deleteMany](#)
- [deleteOne](#)
- [estimatedDocumentCount](#)
- [find](#)
- [findOne](#)
- [findOneAndDelete](#)
- [findOneAndRemove](#)
- [findOneAndReplace](#)
- [findOneAndUpdate](#)
- [remove](#)
- [replaceOne](#)
- [update](#)
- [updateOne](#)
- [updateMany](#)

Aggregate 中间件用于 `MyModel.aggregate()`。当在 aggregate 对象上调用 `exec()` 时会执行 aggregate 中间件。在 aggregate 中间件里, `this` 指向 aggregation 对象。

- [aggregate](#)

以下  model 函数可以使用 model 中间件。在 model 中间件函数里，`this` 指向 model 对象。

- [insertMany](#)

所有中间件类型都支持 pre 和 post 钩子。下面会详细介绍 pre 和 post 钩子是怎样工作的。

注意：如果你指定 `schema.pre('remove')`， Mongoose 会默认将该中间件注册到 `doc.remove()` 上，如果你想让中间件运行在 `Query.remove()` 上，请使用  `schema.pre('remove', { query: true, document: false }, fn)`。

注意：和 `schema.pre('remove')` 不同的是，Mongoose 默认会将 `updateOne` and `deleteOne` 中间件注册到 `Query#updateOne()` 和 `Query#deleteOne()`上。 这意味着 `doc.updateOne()` 和 `Model.updateOne()` 都会触发 `updateOne` 钩子，但是 `this` 指向 query 对象，而不是文档对象。要将 `updateOne` or `deleteOne` 中间件注册成 document 中间件，请使用 `schema.pre('updateOne', { document: true, query: false })`。

注意：`create()` 函数会触发 `save()` 钩子。


#### Pre
 
当每个中间件调用 `next` 方法时，pre 中间件函数会一个接一个地执行。

```javascript
const schema = new Schema(..);
schema.pre('save', function(next) {
  // 做些什么
  next();
});
```

在 mongoose 5.x 里，除了手动调用 `next()` 方法外，你还可以使用一个返回 promise 的函数。具体来说，你可以使用 `async/await` 。

```javascript
schema.pre('save', function() {
  return doStuff().
    then(() => doMoreStuff());
});

// Or, in Node.js >= 7.6.0:
schema.pre('save', async function() {
  await doStuff();
  await doMoreStuff();
});
```
如果你使用 `next()`， `next()` 调用不会阻止你中间件函数里剩余代码的执行。你可以使用 [the early `return` pattern](https://www.bennadel.com/blog/2323-use-a-return-statement-when-invoking-callbacks-especially-in-a-guard-statement.htm) 来阻止中间件函数里剩余代码的执行。


```javascript
const schema = new Schema(..);
schema.pre('save', function(next) {
  if (foo()) {
    console.log('calling next!');
    // `return next();` 会让剩余代码无法执行
    /*return*/ next();
  }
  // 除非像上面那样注释掉 `return`，否则 'after next' 会打印
  console.log('after next');
});
```

用例

中间件对于原子化模型逻辑很有用。以下是一些其他的想法：

- 复杂校验
- 删除依赖文档 (删除用户并且删除用户所有的博客)
- 异步默认操作
- 特定动作触发的异步任务


#### Pre 钩子的报错

如果任何 pre 钩子报错了，mongoose 将不会执行后续的中间件或被钩住的函数。取而代之地，mongoose 会传递一个 error 给回调函数或者返回一个 reject 的 promise。在中间件里，有几种方法来报告一个错误：

```javascript
schema.pre('save', function(next) {
  const err = new Error('something went wrong');
  // 如果你调用 `next()` 并传递一个参数，这个参数被假定为一个 error
  next(err);
});

schema.pre('save', function() {
  // 你也可以返回一个 reject 的 promise
  return new Promise((resolve, reject) => {
    reject(new Error('something went wrong'));
  });
});

schema.pre('save', function() {
  // 你也可以抛出一个同步错误
  throw new Error('something went wrong');
});

schema.pre('save', async function() {
  await Promise.resolve();
  // 你也可以在 `async` 函数里抛出一个错误
  throw new Error('something went wrong');
});

// 然后...

// 更改将不会被持久化到MongoDB，因为预钩子报错了
myDoc.save(function(err) {
  console.log(err.message); // 发生了一些错误
});
```

多次调用 `next()` 是无效的。如果你使用 `err1` 调用 `next()`，然后再抛出 `err2`，mongoose 将会报告 `err1`。


#### Post 中间件

[post](https://mongoosejs.com/docs/api.html#schema_Schema-post) 中间件将在被钩住方法和其所有 `pre` 中间件完成之后再执行。

```javascript
schema.post('init', function(doc) {
  console.log('%s has been initialized from the db', doc._id);
});
schema.post('validate', function(doc) {
  console.log('%s has been validated (but not saved yet)', doc._id);
});
schema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});
schema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});
```

#### 异步 Post 钩子

如果你的 post 钩子函数接收至少两个参数，mongoose 会假定第二个参数是你将会用来触发队列中下一个中间件的 `next()` 函数。

```javascript
// 接收 2 参数：这是一个异步 post 钩子
schema.post('save', function(doc, next) {
  setTimeout(function() {
    console.log('post1');
    // 启动第二个 post 钩子
    next();
  }, 10);
});

// 直到第一个中间件调用 `next()` 才执行
schema.post('save', function(doc, next) {
  console.log('post2');
  next();
});
```

#### 在编译 Models 之前定义中间件


在 [编译一个 model](https://mongoosejs.com/docs/models.html#compiling) 之后调用 `pre()` 或 `post()` 在 mongoose 里通常不会起作用。例如：下面的 `pre('save')` 中间件不会触发。

```javascript
const schema = new mongoose.Schema({ name: String });

// 用 schema 编译一个 model
const User = mongoose.model('User', schema);

// Mongoose 不会调用这个中间件函数，因为其是在 model 编译之后定义的
schema.pre('save', () => console.log('Hello from pre save'));

new User({ name: 'test' }).save();
```
这意味着你必须在调用 `mongoose.model()` 之前加上所有的中间件和 [插件](#插件) 。下面的脚步会打印 "Hello from pre save"：

```javascript
const schema = new mongoose.Schema({ name: String });
// Mongoose 会调用该中间件函数，因为脚步在编译 model 之前添加了中间件
schema.pre('save', () => console.log('Hello from pre save'));

// 用 schema 编译一个 model
const User = mongoose.model('User', schema);

new User({ name: 'test' }).save();
```

因此，要注意从定义 schema 的同一个文件里导出 Mongoose models 这种行为，如果你选择使用这种范式，你必须在 model 文件里调用 `require()` 之前定义好 [全局插件](https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-plugin)。

```javascript
const schema = new mongoose.Schema({ name: String });

// 一旦你 `require()` 该文件，你将不能再添加任何中间件到该 schema
module.exports = mongoose.model('User', schema);
```

#### 保存/校验钩子


`save()` 函数会触发 `validate()` 钩子，因为 mongoose 内置了一个 `pre('save')` 钩子会调用 `validate()`。这意味着所有 `pre('validate')` 和 `post('validate')` 钩子会在任何 `pre('save')` 钩子之前被调用。

```javascript
schema.pre('validate', function() {
  console.log('this gets printed first');
});
schema.post('validate', function() {
  console.log('this gets printed second');
});
schema.pre('save', function() {
  console.log('this gets printed third');
});
schema.post('save', function() {
  console.log('this gets printed fourth');
});
```

#### 命名冲突

Mongoose 同时有 `remove()` 操作的 query 和 document 钩子。

```javascript
schema.pre('remove', function() { console.log('Removing!'); });

// 打印 "Removing!"
doc.remove();

// 不会打印 "Removing!"。 `remove` 的 query 中间件默认不会执行
Model.remove();
```
你可以传递选项给 `Schema.pre()` 和 `Schema.post()` 来切换是在 `Document.remove()` 上还是在 `Model.remove()` 上调用 `remove()` 钩子。请注意，你需要在传递对象里同时设置 `document` 和 `query` 属性：

```javascript
// 只在 document 中间件上
schema.pre('remove', { document: true, query: false }, function() {
  console.log('Removing doc!');
});

// 只在 query 中间件上，这将在 `Model.remove()` 时调用， `doc.remove()` 则不会
schema.pre('remove', { query: true, document: false }, function() {
  console.log('Removing!');
});
```

#### 注意 findAndUpdate() 和 Query 中间件

Pre 和 post 的 `save()` 钩子不会在  `update()`, `findOneAndUpdate()` 等几个方法上执行。你可以在 [this GitHub issue](http://github.com/Automattic/mongoose/issues/964) 里查看更多讨论细节。 Mongoose 4.0 为这些函数引入了不同的钩子。

```javascript
schema.pre('find', function() {
  console.log(this instanceof mongoose.Query); // true
  this.start = Date.now();
});

schema.post('find', function(result) {
  console.log(this instanceof mongoose.Query); // true
  // 打印返回的文档
  console.log('find() returned ' + JSON.stringify(result));
  // 打印查询花费的毫秒数
  console.log('find() took ' + (Date.now() - this.start) + ' millis');
});
```

Query 中间件 和 document 中间件有着细微但重要的区别： 在 document 中间件里，`this` 指向要更新的文档。在 query 中间件里，mongoose 不一定有（doesn't necessarily have）对要更新文档的引用，所以 `this` 指向查询对象而不是要更新的文档。

例如，如果你想在每次 `updateOne()` 调用时添加一个 `updatedAt` 时间戳，你应该使用以下 pre 钩子。

```javascript
schema.pre('updateOne', function() {
  this.set({ updatedAt: new Date() });
});
```
你不能在 `pre('updateOne')` 或 `pre('findOneAndUpdate')` 的 query 中间件里访问要被更新的文档，如果你想访问要更新的文档，你需要做一个显式的文档查询。

```javascript
schema.pre('findOneAndUpdate', async function() {
  const docToUpdate = await this.model.findOne(this.getQuery());
  console.log(docToUpdate); // `findOneAndUpdate()` 要修改的文档
});
```
但是，如果你定义了 `pre('updateOne')` 的 document 中间件，`this` 则是要被更新的文档。这是因为 `pre('updateOne')` 钩入了 `Document#updateOne()` 而不是 `Query#updateOne()`。

```javascript
schema.pre('updateOne', { document: true, query: false }, function() {
  console.log('Updating');
});
const Model = mongoose.model('Test', schema);

const doc = new Model();
await doc.updateOne({ $set: { name: 'test' } }); // 打印 "Updating"

// 不会打印 "Updating", 因为 `Query#updateOne()` 没有触发 document 中间件
await Model.updateOne({}, { $set: { name: 'test' } });
```

#### 中间件错误处理

_4.5.0 新增_

中间件执行通常在第一次调用 `next()` 报错时停止。然而，有一种特殊的 post 中间件称为 “错误处理中间件”，它专门在错误发生时执行。错误处理中间件在报告错误和提高报错信息的可读性非常有用。

错误处理中间件被定义为带有一个额外参数的中间件：作为函数的第一个参数的 'error' 。然后，错误处理中间件可以按照你的意愿对错误进行转换。


```javascript
const schema = new Schema({
  name: {
    type: String,
    // 会触发一个 11000 状态码的 MongoServerError 当你保存一个重复的 name
    unique: true
  }
});

// 处理程序要接收3个参数： 发生的错误，有问题的文档和 `next()` 函数
schema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});

// 会触发 `post('save')` 错误处理程序
Person.create([{ name: 'Axl Rose' }, { name: 'Axl Rose' }]);
```

错误处理中间件也可以与 query 中间件一起工作。你可以定义一个 post `update()` 钩子来捕获 MongoDB 的重复键错误。

```javascript
// 当你调用 `update()` 时，同样会发生 E11000 报错
// 该函数必须接收3个参数，如果你使用了 `passRawResult` 函数，该函数必须接收4个参数
schema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // `update()` 调用依然会报错
  }
});

const people = [{ name: 'Axl Rose' }, { name: 'Slash' }];
Person.create(people, function(error) {
  Person.update({ name: 'Slash' }, { $set: { name: 'Axl Rose' } }, function(error) {
    // `error.message` 会是 "There was a duplicate key error"
  });
});
```

错误处理中间件可以转换错误，但不能删除错误。即使如上所示不使用 error 调用 `next()`，函数调用仍然会报错。

#### Aggregation 钩子

你还可以为 [`Model.aggregate()` 函数](https://mongoosejs.com/docs/api.html#model_Model.aggregate) 定义钩子。在 aggregation 中间件里, `this` 指向 [Mongoose Aggregate 对象](https://mongoosejs.com/docs/api.html#Aggregate)。例如，假设你正在 `Customer` model 上通过添加一个 `isDeleted` 属性来实现软删除，要确保 `aggregate()` 调用只会查找没有被软删除的 customers，你可以使用以下中间件在 [aggregation pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/) 开头添加一个 [`$match` stage](https://mongoosejs.com/docs/api.html#aggregate_Aggregate-match) 。

```javascript
customerSchema.pre('aggregate', function() {
  // 在每个 pipeline 开头添加一个 $match state 
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});
```

[`Aggregate#pipeline()` 函数](https://mongoosejs.com/docs/api.html#aggregate_Aggregate-pipeline) 让你可以访问 Mongoose 将会发送给 MongoDB 服务器的 MongoDB aggregation pipeline。这对于使用中间件在 pipeline 开头添加 stages 非常有作用。

#### 同步钩子

某些 Mongoose 钩子是同步的，这意味着它们不支持返回 promise 或接收 `next()` 回调。目前为止，只有 `init` 勾子是同步的，因为
[`init()` 函数](https://mongoosejs.com/docs/api.html#document_Document-init) 是同步的。下面是使用 pre 和 post init 钩子的示例。

```javascript
const schema = new Schema({ title: String, loadedAt: Date });

schema.pre('init', pojo => {
  assert.equal(pojo.constructor.name, 'Object'); // init 之前是纯对象
});

const now = new Date();
schema.post('init', doc => {
  assert.ok(doc instanceof mongoose.Document); // init 之后是 mongoose 文档
  doc.loadedAt = now;
});

const Test = db.model('Test', schema);

return Test.create({ title: 'Casino Royale' }).
  then(doc => Test.findById(doc)).
  then(doc => assert.equal(doc.loadedAt.valueOf(), now.valueOf()));
```

要在 init 钩子中报告错误，你必须抛出同步错误。与所有其他中间件不同，init 中间件不处理 promise rejections。

```javascript
const schema = new Schema({ title: String });

const swallowedError = new Error('will not show');
// init 钩子不处理异步错误或任何类型的异步行为
schema.pre('init', () => Promise.reject(swallowedError));
schema.post('init', () => { throw Error('will show'); });

const Test = db.model('Test', schema);

return Test.create({ title: 'Casino Royale' }).
  then(doc => Test.findById(doc)).
  catch(error => assert.equal(error.message, 'will show'));
```

### Populate

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

- [保存 Refs](#保存-refs)
- [Population](#population)
- [设置被填充字段](#设置被填充字段)
- [检查一个字段是否被填充](#检查一个字段是否被填充)
- [如果没有 Foreign Document 呢](#如果没有-foreign-document-呢)
- [字段选择](#字段选择)
- [填充多个字段](#填充多个字段)
- [查询条件和其他选项](#查询条件和其他选项)
- [Refs 到 children](#refs-到-children)
- [填充一个现成的文档](#填充一个现成的文档)
- [填充多个现成的文档](#填充多个现成的文档)
- [多级填充](#多级填充)
- [跨数据库填充](#跨数据库填充)
- [通过 refPath 动态引用](#通过-refpath-动态引用)
- [虚拟字段填充](#虚拟字段填充)
- [虚拟填充：count 选项](#虚拟填充：count-选项)
- [填充 Maps](#填充-maps)
- [在中间件中使用填充](#在中间件中使用填充)

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
    author: author._id // 使用 person 的 _id 赋值
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
    // 打印 "The author is Ian Fleming"
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
  console.log(story.author.name); // 打印 "Ian Fleming"
});
```

#### 检查一个字段是否被填充

你可以调用 `populated()` 方法来检查一个字段是否被填充了。如果 `populated()` 返回 [truthy value](https://masteringjs.io/tutorials/fundamentals/truthy)，你就可以假定这个字段被填充了。

```javascript
story.populated('author'); // truthy

story.depopulate('author'); // 不再填充 `author`
story.populated('author'); // undefined
```

一个检查某个字段是否被填充的理由是为了获取其 \_id。然而，为了提供便利，Mongoose 给 ObjectId 的实例增加了一个 \_id 的 getter，所以你可以使用 `story.author._id` 不管 `author` 是否被填充.

```javascript
story.populated('author'); // truthy
story.author._id; // ObjectId

story.depopulate('author'); // 不再填充 `author`
story.populated('author'); // undefined

story.author instanceof ObjectId; // true
story.author._id; // ObjectId, 因为 Mongoose 添加了一个特殊的 getter
```

#### 如果没有 Foreign Document 呢

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
  .populate('author', 'name') // 只返回 Persons name
  .exec(function (err, story) {
    if (err) return handleError(err);

    console.log('The author is %s', story.author.name);
    // 打印 "The author is Ian Fleming"

    console.log('The authors age is %s', story.author.age);
    // 打印 "The authors age is null"
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
// 后面的 `populate()` 或覆盖前面的，因为都填充了 `fans`
Story.find().populate({ path: 'fans', select: 'name' }).populate({ path: 'fans', select: 'email' });
// 上面的相当于：
Story.find().populate({ path: 'fans', select: 'email' });
```

#### 查询条件和其他选项

如果我们想根据 age 填充 fans 数组并只选择其 name 字段呢？

```javascript
Story.find()
  .populate({
    path: 'fans',
    match: { age: { $gte: 21 } },
    // 显示地排除 `_id`，请看 https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
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
_注：这里的意思是尽量使用嵌套数据结构，而不是使用关联表。_

#### limit vs perDocumentLimit

填充支持 limit 选项，但是，为了向后兼容，它现在不会将 limit 作用于每个文档。例如，假设你有 2 个 stories：

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

// 第二个 story 有 0 个粉丝
stories[1].name; // 'Live and Let Die'
stories[1].fans.length; // 0
```

这是因为，为了避免为了每个文档执行单独的查询，Mongoose 转而使用 `numDocuments * limit` 作为 limit 来对 fans 进行查询。如果你需要正确的 limit，你应该使用 perDocumentLimit 选项（自 Mongoose 5.9.0 起）。请记住 `populate()` 会为每个文档执行单独的查询，这会使 `populate()` 更慢。

```javascript
const stories = await Story.find().populate({
  path: 'fans',
  // 这个特殊的选项会告诉 Mongoose 为每个 `story` 执行单独的查询
  // 确保我们可以从每个 story 获取 2 个 fans
  perDocumentLimit: 2
});

stories[0].name; // 'Casino Royale'
stories[0].fans.length; // 2

stories[1].name; // 'Live and Let Die'
stories[1].fans.length; // 2
```

#### Refs 到 children

我们会发现，如果使用 author 对象，我们将无法获取 stories 列表。这是因为没有 story 对象被 "pushed" 到 `author.stories` 字段。  
这里有两种观点，首先，你可能想知道哪些 stories 是属于这个 author 的。通常，你的 schema 应该通过在 "多" 方加一个父节点指针来处理一对多关系；但是，如果你有一个好的理由想获取一个子指针数组，你可以按下面展示的将文档 `push()` 到数组里。

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

// 在 document 上调用`populate()` 方法来填充一个字段
await person.populate('stories');

person.populated('stories'); // ObjectIds 数组
person.stories[0].name; // 'Casino Royale'
```

`Document#populate()` 方法不支持链式调用，你需要调用 `populate()` 多次，或者传递一个字段数组来填充多个字段。

```javascript
await person.populate(['stories', 'fans']);
person.populated('fans'); // ObjectIds 数组
```

#### 填充多个现成的文档

如果我们有一个或多个 mongoose 文档或者一个纯对象（像 _[_mapReduce_](https://mongoosejs.com/docs/api.html#model_Model.mapReduce) 输出那样_），我们可以使用 [Model.populate()](https://mongoosejs.com/docs/api.html#model_Model.populate) 方法填充它们。这也是 `Document#populate()` 和 `Query#populate()` 填充文档使用的方法。

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
  // 获取朋友的朋友 - 为每个 friend 填充 'friends'
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
    ref: Conversation // `ref` 是 **Model class**, 而非字符串
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
  // `model` 选项指定了填充要使用的 model
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


// 尽管一条评论引用了 'Product' 集合，另一个引用 'BlogPost' 集合，`populate()` 也可以工作
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


// 下面的`populate()` 相当于 `refPath` 方式
// 你只需要确保同时 `populate()` 了 `product` and `blogPost`
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
// 使用 `ref` 属性指定一个虚拟字段，可以开启虚拟填充
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
    toJSON: { virtuals: true }, // 这样 `res.json()` 和其他 `JSON.stringify()` 函数会包含虚拟字段
    toObject: { virtuals: true } // 这样 `console.log()` 和其他使用 `toObject()` 的函数会包含虚拟字段
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
  ref: 'Person', // 使用的 model
  localField: 'name', // 找到 `localField`
  foreignField: 'band', // 和`foreignField` 相等的人
  count: true // 只获取文档的数量
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

你可以在 pre 或 post 钩子中使用填充。如果你总是想填充一个确定的字段，可以看看 [mongoose-autopopulate plugin](http://npmjs.com/package/mongoose-autopopulate)。

```javascript
// 在 `find()` 上绑定 `populate()`
MySchema.pre('find', function () {
  this.populate('user');
});
```

```javascript
// 在 `populate()` 后绑定 `find()`，如果你想选择性的填充找到的文档，这会很有用
MySchema.post('find', async function (docs) {
  for (let doc of docs) {
    if (doc.isPublic) {
      await doc.populate('user');
    }
  }
});
```

```javascript
// 在保存之后 `populate()`，如果想在更新 API 结束之后返回填充后的数据，这会很有用
MySchema.post('save', function (doc, next) {
  doc.populate('user').then(function () {
    next();
  });
});
```

### 鉴别器

#### `model.discriminator()` 函数

Discriminators are a schema inheritance mechanism. They enable you to have multiple models with overlapping schemas on top of the same underlying MongoDB collection.

Suppose you wanted to track different types of events in a single collection. Every event will have a timestamp, but events that represent clicked links should have a URL. You can achieve this using the `model.discriminator()` function. This function takes 3 parameters, a model name, a discriminator schema and an optional key (defaults to the model name). It returns a model whose schema is the union of the base schema and the discriminator schema.

```javascript
const options = { discriminatorKey: 'kind' };

const eventSchema = new mongoose.Schema({ time: Date }, options);
const Event = mongoose.model('Event', eventSchema);

// ClickedLinkEvent is a special type of Event that has
// a URL.
const ClickedLinkEvent = Event.discriminator('ClickedLink',
  new mongoose.Schema({ url: String }, options));

// When you create a generic event, it can't have a URL field...
const genericEvent = new Event({ time: Date.now(), url: 'google.com' });
assert.ok(!genericEvent.url);

// But a ClickedLinkEvent can
const clickedEvent = new ClickedLinkEvent({ time: Date.now(), url: 'google.com' });
assert.ok(clickedEvent.url);
```

#### Discriminators save to the Event model's collection

Suppose you created another discriminator to track events where a new user registered. These `SignedUpEvent` instances will be stored in the same collection as generic events and `ClickedLinkEvent` instances.

```javascript
const event1 = new Event({ time: Date.now() });
const event2 = new ClickedLinkEvent({ time: Date.now(), url: 'google.com' });
const event3 = new SignedUpEvent({ time: Date.now(), user: 'testuser' });


await Promise.all([event1.save(), event2.save(), event3.save()]);
const count = await Event.countDocuments();
assert.equal(count, 3);
```

#### Discriminator keys

The way mongoose tells the difference between the different discriminator models is by the 'discriminator key', which is `__t` by default. Mongoose adds a String path called `__t` to your schemas that it uses to track which discriminator this document is an instance of.

```javascript
const event1 = new Event({ time: Date.now() });
const event2 = new ClickedLinkEvent({ time: Date.now(), url: 'google.com' });
const event3 = new SignedUpEvent({ time: Date.now(), user: 'testuser' });

assert.ok(!event1.__t);
assert.equal(event2.__t, 'ClickedLink');
assert.equal(event3.__t, 'SignedUp');
```

### 插件

Schemas 是支持插件的，也就是说，它们允许注册预先打包好的的功能来扩展它们的能力，这是一个非常强大的功能。

- [示例](#示例)
- [全局插件](#全局插件)
- [在编译模型之前注册插件](#)
- [官方支持插件](#官方支持插件)
- [社区](#社区)

#### 示例

Plugins are a tool for reusing logic in multiple schemas. Suppose you have several models in your database and want to add a `loadedAt` property to each one. Just create a plugin once and apply it to each `Schema`:

```javascript
// loadedAt.js
module.exports = function loadedAtPlugin(schema, options) {
  schema.virtual('loadedAt').
    get(function() { return this._loadedAt; }).
    set(function(v) { this._loadedAt = v; });

  schema.post(['find', 'findOne'], function(docs) {
    if (!Array.isArray(docs)) {
      docs = [docs];
    }
    const now = new Date();
    for (const doc of docs) {
      doc.loadedAt = now;
    }
  });
};

// game-schema.js
const loadedAtPlugin = require('./loadedAt');
const gameSchema = new Schema({ ... });
gameSchema.plugin(loadedAtPlugin);

// player-schema.js
const loadedAtPlugin = require('./loadedAt');
const playerSchema = new Schema({ ... });
playerSchema.plugin(loadedAtPlugin);
```

We just added last-modified behavior to both our `Game` and `Player` schemas and declared an index on the `lastMod` path of our Games to boot. Not bad for a few lines of code.

#### 全局插件

Want to register a plugin for all schemas? The mongoose singleton has a `.plugin()` function that registers a plugin for every schema. For example:

```javascript
const mongoose = require('mongoose');
mongoose.plugin(require('./loadedAt'));

const gameSchema = new Schema({ ... });
const playerSchema = new Schema({ ... });
// `loadedAtPlugin` gets attached to both schemas
const Game = mongoose.model('Game', gameSchema);
const Player = mongoose.model('Player', playerSchema);
```

#### 在编译模型之前注册插件

Because many plugins rely on [middleware](#中间件), you should make sure to apply plugins before you call `mongoose.model()` or `conn.model()`. Otherwise, [any middleware the plugin registers won't get applied](#在编译-models-之前定义中间件).

#### 官方支持插件

The Mongoose team maintains several plugins that add cool new features to Mongoose. Here's a couple:

- [mongoose-autopopulate](https://plugins.mongoosejs.io/plugins/autopopulate): Always `populate()` certain fields in your Mongoose schemas.
- [mongoose-lean-virtuals](http://plugins.mongoosejs.io/plugins/lean-virtuals): Attach virtuals to the results of Mongoose queries when using `.lean()`.
- [mongoose-cast-aggregation](https://www.npmjs.com/package/mongoose-cast-aggregation)

You can find a full list of officially supported plugins on [Mongoose's plugins search site](https://plugins.mongoosejs.io/).


#### 社区

Not only can you re-use schema functionality in your own projects, but you also reap the benefits of the Mongoose community as well. Any plugin published to [npm](https://www.npmjs.com/) and with 'mongoose' as an [npm keyword](https://docs.npmjs.com/cli/v8/configuring-npm/package-json/) will show up on our [search results page](https://plugins.mongoosejs.io/).


### Transactions

### TypeScript

Mongoose introduced [officially supported TypeScript bindings in v5.11.0](https://thecodebarbarian.com/working-with-mongoose-in-typescript.html). Mongoose's index.d.ts file supports a wide variety of syntaxes and strives to be compatible with @types/mongoose where possible. This guide describes Mongoose's recommended approach to working with Mongoose in TypeScript.

#### Creating Your First Document

To get started with Mongoose in TypeScript, you need to:

1.Create an interface representing a document in MongoDB.  
2.Create a [Schema](#schemas) corresponding to the document interface.  
3.Create a Model.  
4.[Connect to MongoDB](#connections).  

```javascript
import { Schema, model, connect } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface User {
  name: string;
  email: string;
  avatar?: string;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String
});

// 3. Create a Model.
const UserModel = model<User>('User', schema);

run().catch(err => console.log(err));

async function run(): Promise<void> {
  // 4. Connect to MongoDB
  await connect('mongodb://localhost:27017/test');

  const doc = new UserModel({
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png'
  });
  await doc.save();

  console.log(doc.email); // 'bill@initech.com'
}
```

You as the developer are responsible for ensuring that your document interface lines up with your Mongoose schema. For example, Mongoose won't report an error if `email` is `required` in your Mongoose schema but optional in your document interface.

The `UserModel()` constructor returns an instance of `HydratedDocument<User>`. `User` is a document interface, it represents the raw object structure that `User` objects look like in MongoDB. `HydratedDocument<User>` represents a hydrated Mongoose document, with methods, virtuals, and other Mongoose-specific features.

```javascript
import { HydratedDocument } from 'mongoose';

const doc: HydratedDocument<User> = new UserModel({
  name: 'Bill',
  email: 'bill@initech.com',
  avatar: 'https://i.imgur.com/dM7Thhn.png'
});
```

#### Using `extends Document`

Alternatively, your document interface can extend Mongoose's `Document` class. Many Mongoose TypeScript codebases use the below approach.

```javascript
import { Document, Schema, model, connect } from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  avatar?: string;
}
```

This approach works, but we recommend your document interface not extend `Document`. Using `extends Document` makes it difficult for Mongoose to infer which properties are present on [query filters](#queries), [lean documents](#lean-option), and other cases.

We recommend your document interface contain the properties defined in your schema and line up with what your documents look like in MongoDB. Although you can add [instance methods](#实例方法) to your document interface, we do not recommend doing so.

#### Using Custom Bindings

If Mongoose's built-in `index.d.ts` file does not work for you, you can remove it in a postinstall script in your `package.json` as shown below. However, before you do, please [open an issue on Mongoose's GitHub](https://github.com/Automattic/mongoose/issues/new) page and describe the issue you're experiencing.

```javascript
{
  "postinstall": "rm ./node_modules/mongoose/index.d.ts"
}
```



