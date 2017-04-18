const models = require('../models');
const CompPost = models.CompPost;

const makerPage = (req, res) => {
  CompPost.CompPostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { compposts: docs });
  });
};

const makeCompPost = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const compPostData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newCompPost = new CompPost.CompPostModel(compPostData);
  const compPostPromise = newCompPost.save();

  compPostPromise.then(() => res.json({ redirect: '/maker' }));

  compPostPromise.catch((err) => {
    console.log(err);
		// Not sure if this check is really necessary
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This post already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return compPostPromise;
};

module.exports.makerPage = makerPage;
module.exports.make = makeCompPost;
