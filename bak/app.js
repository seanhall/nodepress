
/**
 * Module dependencies.
 */

var express = require('express'),
    app = module.exports = express.createServer(),
    mongoose = require('mongoose'),
    fs = require('fs'),
    //db,
    db = mongoose.connect('mongodb://localhost/nodepad'),
    //routes = require('./routes');
    Document;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser({uploadDir:'./public/images/uploads'}));
  app.use(express.methodOverride());
  app.use(express.compiler( { src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('test', function(){
  //db = mongoose.connect('mongodb://localhost/nodepad-test');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('development', function(){
  //db = mongoose.connect('mongodb://localhost/nodepad-development');
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  //db = mongoose.connect('mongodb://localhost/nodepad-production');
  app.use(express.logger());
  app.use(express.errorHandler());
});

app.Post      = Post      = require('./models.js').Post(db);
app.Page      = Page      = require('./models.js').Page(db);
app.Media     = Media     = require('./models.js').Media(db);
app.Link      = Link      = require('./models.js').Link(db);
app.Comment   = Comment   = require('./models.js').Comment(db);
app.Feedback  = Feedback  = require('./models.js').Feedback(db);
app.Category  = Category  = require('./models.js').Category(db);
app.Tag       = Tag       = require('./models.js').Tag(db);
app.User      = User      = require('./models.js').User(db);
app.Setting   = Setting   = require('./models.js').Setting(db);

var montharray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

app.get('/', function(req, res){
  Post.count({}, function(err, d){
    Page.count({}, function(err, f){
      Category.count({}, function(err, g){
        Tag.count({}, function(err, h){
          Comment.count({}, function(err, i){
            Comment.count({approved: true}, function(err, j){
              Comment.count({approved: false}, function(err, k){
                Comment.count({spam: true}, function(err, l){
                  Post.find({}, ['body']).sort('created',-1).limit(1).execFind(function(err, m){
                    Post.find({published: false}).sort('created',-1).limit(1).execFind(function(err, n){
                      res.render('index.jade', {
                        locals: { title: 'Your CMS', count: d, count2: f, count3: g, count4: h, count5: i, count6: j, count7: k, count8: l, recentposts: m, recentdrafts: n, montharray: montharray }
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Posts
/*app.get('/posts', function(req, res){
  getItems(Post,'posts',['id','title','body','tags'],res);
});*/

app.get('/posts', function(req,res){
  Post.find({trashed: false}, function(err, documents){
    var postcomments = [];
    for(var i in documents){
      Comment.count({id: documents[i].id}, function(err, f){
        postcomments.push(f);
      });
    }
    res.render('posts/index.jade', {
      locals: { documents: documents, montharray: montharray, postcomments: postcomments }
    });
  });
});

app.get('/posts/new', function(req,res){
  Category.find(function(err, f){
    res.render('posts/new.jade', {
      locals: { d: new Post, f: f }
    });
  });
});

app.post('/posts.:format?', function(req, res){
  createNewItem(Post,'posts',req,res);
});

app.get('/posts/:id.:format?', function(req,res){
  readItem(Post,'posts',req,res);
});

app.get('/posts/:id.:format?/edit', function(req, res){
  Post.findById(req.params.id, function(err, d){
    Category.find(function(err, f){
      res.render('posts/edit.jade', {
        locals: { d: d, f: f }
      });
    });
  });
});

app.put('/posts/:id.:format?', function(req, res){
  saveEdit(Post,'posts',req,res);
});

app.del('/posts/:id.:format?', function(req, res){
  deleteItem(Post,'posts',req,res);
});
// end Posts

// Pages
app.get('/pages', function(req, res){
  Page.find(function(err, documents){
    var pagecomments = [];
    for(var i in documents){
      Comment.count({id: documents[i].id}, function(err, f){
        pagecomments.push(f);
      });
    }
    res.render('pages/index.jade', {
      locals: { documents: documents, montharray: montharray, pagecomments: pagecomments }
    });
  });
});

app.get('/pages/new', function(req,res){
  Page.find(function(err, f){
    res.render('pages/new.jade', {
      locals: { d: new Page, f: f }
    });
  });
});

app.get('/pages/copy', function(req,res){
  Page.find(function(err,d){
    res.render('pages/copy.jade', {
      locals: { d: d }
    });
  });
});

app.post('/pages/:id.:format?/copy', function(req, res){
  Page.findById(req.params.id, function(err,d){console.log(d);
    for(var i in d){
      console.log(d[i]);
      //d[i] = document[i];
    }
    var document = new Page(req.body['document']);
    /*for(var i in req.body.document){
      d[i] = req.body.document[i];
    }*/
    document.save(function(){
      switch(req.params.format){
        case 'json':
          res.send(document.__doc);
        break;

        default:
          res.redirect('/pages');
      }
    });
  });
});

app.post('/pages.:format?', function(req, res){
  createNewItem(Page,'pages',req,res);
});

app.get('/pages/:id.:format?', function(req,res){
  readItem(Page,'pages',req,res);
});

app.get('/pages/:id.:format?/edit', function(req, res){
  Page.findById(req.params.id, function(err, d){
    Page.where('_id').ne(d._id).exec(function(err, f){console.log(f);
      res.render('pages/edit.jade', {
        locals: { d: d, f: f }
      });
    });
  });
});

app.put('/pages/:id.:format?', function(req, res){
  saveEdit(Page,'pages',req,res);
});

app.del('/pages/:id.:format?', function(req, res){
  deleteItem(Page,'pages',req,res);
});
// end Pages

// Media

app.get('/media', function(req, res){
  Media.find(function(err, documents){
    var mediacomments = [];
    for(var i in documents){
      Comment.count({id: documents[i].id}, function(err, f){
        mediacomments.push(f);
      });
    }
    res.render('media/index.jade', {
      locals: { documents: documents, montharray: montharray, mediacomments: mediacomments }
    });
  });
});

app.get('/media/new', function(req,res){
  startNewItem(Media,'media',res);
});

app.get('/media/:id.:format?/edit', function(req, res){
  startEdit(Media,'media',req,res);
});

app.post('/media/upload', function(req,res){
  var tmp_path = req.files.thumbnail.path;
  var target_path = './public/images/uploads/' + req.body.document.name;
  fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      fs.unlink(tmp_path, function() {
          if (err) throw err;
          //res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
      });
  });
  var document = new Media(req.body['document']);
  document.filename = target_path;
  document.save(function(){
    switch(req.params.format){
      case 'json':
        res.send(document.__doc);
      break;

      default:
        res.redirect('/media');
    }
  });
});

app.del('/media/:id.:format?', function(req, res){
  deleteItem(Media,'media',req,res);
});

// end Media

// Links

app.get('/links', function(req, res){
  getItems(Link,'links',req,res);
});

app.get('/links/new', function(req,res){
  startNewItem(Link,'links',res);
});

app.post('/links.:format?', function(req, res){
  createNewItem(Link,'links',req,res);
});

app.get('/links/:id.:format?/edit', function(req, res){
  startEdit(Link,'links',req,res);
});

app.put('/links/:id.:format?', function(req, res){
  saveEdit(Link,'links',req,res);
});

// end Links

// Comments

/*app.get('/comments', function(req, res){
  getItems(Comment,'comments',req,res);
});*/

// end Comments

// Feedback

/*app.get('/feedback', function(req, res){
  getItems(Feedback,'feedback',req,res);
});*/

// end Feedback

// Categories

/*app.get('/categories', function(req,res){
  Category.find(function(err, documents){
    res.render('categories/index.jade', {
      locals: { documents: documents }
    });
  });
});*/

app.get('/categories', function(req, res){
  getItems(Category,'categories',req,res);
});

/*app.get('/categories', function(req, res){  
  Category.find(function(err, documents){
    for(var i in req.body){
      documents[i] = req.body[i];
    }
    res.render('categories/index.jade', {
      locals: { documents: documents }
    });
  });
});*/

app.post('/categories.:format?', function(req, res){
  createNewItem(Category,'categories',req,res);
});

app.get('/categories/:id.:format?/edit', function(req, res){
  Category.find(function(err, d){
    Category.findById(req.params.id, function(err, f){
      res.render('categories/edit.jade', {
        locals: { d: d, f: f }
      });
    });
  });
});

app.put('/categories/:id.:format?', function(req, res){
  saveEdit(Category,'categories',req,res);
});

app.del('/categories/:id.:format?', function(req, res){
  deleteItem(Category,'categories',req,res);
});

// end Categories

// Tags

app.get('/tags', function(req, res){
  getItems(Tag,'tags',req,res);
});

app.post('/tags.:format?', function(req, res){
  createNewItem(Tag,'tags',req,res);
});

app.get('/tags/:id.:format?/edit', function(req, res){
  startEdit(Tag,'tags',req,res);
});

app.put('/tags/:id.:format?', function(req, res){
  saveEdit(Tag,'tags',req,res);
});

app.del('/tags/:id.:format?', function(req, res){
  deleteItem(Tag,'tags',req,res);
});

// end Tags

// Users

/*app.get('/users', function(req, res){
  getItems(User,'users',req,res);
});*/

// end Users

// Settings

app.get('/settings/general', function(req, res){
  Setting.findOne({}, function(err, documents){
    if(!documents){
      res.render('settings/general/index.jade', {
        locals: { d: new Setting }
      });      
    }
    else{
      res.render('settings/general/index.jade', {
        locals: { d: documents }
      });
    }
  });
});

app.put('/settings/general/save', function(req, res){
  Setting.update({}, { $set: {'general.sitetitle': req.body.document.sitetitle, 'general.tagline':req.body.document.tagline, 'general.email':req.body.document.email}}, {upsert: true}, function (err, numberAffected, raw) {
    if (err) return handleError(err);
    //console.log('The number of updated documents was %d', numberAffected);
    //console.log('The raw response from Mongo was ', raw);
    res.redirect('/settings/general');
  });
});

app.get('/settings/writing', function(req, res){
  Setting.findOne({}, function(err, documents){
    if(!documents){
      res.render('settings/general/index.jade', {
        locals: { d: new Setting }
      });      
    }
    else{
      Category.find(function(err,f){
        Link.find(function(err,g){
          res.render('settings/writing/index.jade', {
            locals: { d: documents, f: f, g: g }
          });
        });
      });
    }
  });
});

app.put('/settings/writing/save', function(req, res){
  Setting.update({}, { $set: {'writing.def_post_cat': req.body.document.def_post_cat, 'writing.def_post_format':req.body.document.def_post_format, 'writing.def_link_cat':req.body.document.def_link_cat}}, {upsert: true}, function (err, numberAffected, raw) {
    if (err) return handleError(err);
    //console.log('The number of updated documents was %d', numberAffected);
    //console.log('The raw response from Mongo was ', raw);
    res.redirect('/settings/writing');
  });
});

app.get('/settings/reading', function(req, res){
  Setting.findOne({}, function(err, documents){
    Page.find(function(err,f){
      if(!documents){
        res.render('settings/reading/index.jade', {
          locals: { d: new Setting, f: f }
        });      
      }
      else{
        res.render('settings/reading/index.jade', {
          locals: { d: documents, f: f }
        });
      }
    });
  });
});

app.put('/settings/reading/save', function(req, res){
  Setting.update({}, { $set: {'reading.fpage_display': req.body.document.fpage_display, 'reading.fpage':req.body.document.fpage, 'reading.ppage':req.body.document.ppage, 'reading.num_posts':req.body.document.num_posts}}, {upsert: true}, function (err, numberAffected, raw) {
    if (err) return handleError(err);
    //console.log('The number of updated documents was %d', numberAffected);
    //console.log('The raw response from Mongo was ', raw);
    res.redirect('/settings/reading');
  });
});

// end Settings

// Functions

/*var getItems = function getItems(obj,dir,fields,res){
  obj.find(function(err, documents){
    documents = documents.map(function(d){
      var fieldset = {};
      for(i=0;i<fields.length;i++){
        var field = fields[i];
        if(field === 'id'){
          fieldset[field] = d._id;
        }
        else{
          fieldset[field] = d[field];
        }
      }
      //console.log(fieldset);
      return fieldset;
    });
    res.render(dir + '/index.jade', {
      locals: { documents: documents }
    });
  });
};*/

var getItems = function getItems(obj,dir,req,res){
  obj.find(function(err, documents){
    for(var i in req.body){
      documents[i] = req.body[i];
    }
    res.render(dir + '/index.jade', {
      locals: { documents: documents }
    });
  });
};

// read item
var readItem = function readItem(obj,dir,req,res){
  obj.findById(req.params.id, function(err, d){
    res.render(dir + '/view.jade', {
      locals: { d: d }
    });
  });
};

// new item
var startNewItem = function startNewItem(obj,dir,res){
  res.render(dir + '/new.jade', {
    locals: { d: new obj }
  });
};

// create new item
var createNewItem = function createNewItem(obj,dir,req,res){
  var document = new obj(req.body['document']);
  document.save(function(){
    switch(req.params.format){
      case 'json':
        res.send(document.__doc);
      break;

      default:
        res.redirect('/' + dir);
    }
  });
};

// edit item
var startEdit = function startEdit(obj,dir,req,res){
  obj.findById(req.params.id, function(err, d){
    res.render(dir + '/edit.jade', {
      locals: { d: d }
    });
  });
};

// update item
var saveEdit = function saveEdit(obj,dir,req,res){
  obj.findById(req.params.id, function(err,d){
    for(var i in req.body.document){
      d[i] = req.body.document[i];
    }
    d.save(function (err) {
     switch(req.params.format){
      case 'json':
        res.send(d.__doc);
      break;

      default:
        res.redirect('/' + dir);
      }
    });
  });
};

// delete document
var deleteItem = function deleteItem(obj,dir,req,res){
  obj.findById(req.params.id, function(err, d){
    d.remove(function(){
      switch(req.params.format){
        case 'json':
          res.send('true');
        break;

        default:
          res.redirect('/' + dir);
      }
    });
  });
};






app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});