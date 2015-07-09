var Post = require('../post.js');

Post.find({}, function(err, results){
  if(results.length === 0){
    
    var p1 = new Post({
      name: "Chris Sharma",
      date: "2015-06-10T06:00:00.000Z",
      state:"Arkansas",
      grades:"bouldering",
      crag:"Ozard Mountain",
      contact:"Phone",
      info:"Witness the Fitness!",
      style:"bouldering"
    });
   

  

  }
});
