const express = require('express');
const actions = require('../helpers/actionModel');

const router = express.Router({
  mergeParams: true,
});

// Actions Schema
// id: number - no need to provide it when creating posts(projects?), the database will automatically generate it.
// project_id: number - required, must be the id of an existing project.
// description: string - up to 128 characters long, required.
// notes: string - no size limit, required. Used to record additional notes or requirements to complete the action.
// completed: boolean - used to indicate if the action has been completed, not required

// get(): resolves to an array of all the resources contained in the database. If you pass an id to this method it will return the resource with that id if one is found.
// init GET req
router.get('/', (req, res) => {
  actions.get()
    .then(action => {
      res.status(200).json(action)
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error retrieving the actions.'
      })
    })
});

// GET req with id
router.get('/actions/:id', (req, res) => {
  const { id } = req.params.id;

  actions.get({id})
    .then(data => {
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(400).json({
          message: `The action with ${id} does not exist.`
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        error: 'The action information could not be retrieved.'
      })
    })
});

// insert(): calling insert passing it a resource object will add it to the database and return the newly created resource.
// POST req
router.post('/')


module.exports = router;