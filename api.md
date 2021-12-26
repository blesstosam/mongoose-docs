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