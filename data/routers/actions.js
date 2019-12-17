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
// not working
router.get('/:id', (req, res) => {
  const id = req.params.id;

  actions.get(id)
    .then(data => {
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(400).json({
          message: 'The action with the specified ID does not exist.'
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
router.post('/', (req, res) => {
  const action = req.body;

  if(!action.description || !action.notes) {
    return res.status(400).json({
      errorMessage: 'Please provide description and notes for the action'
    })
  } else {
    actions.insert(action)
      .then(data => {
        res.status(201).json(data)
      })
      .catch(error => {
        res.status(500).json({
          error: 'There was an error while saving the action to the database.'
        })
      })
  }
});

router.post('/:id', (req, res) => {
  // const projectId = req.params.id;
  const addAction = {
    project_id: req.params.project_id,
    descritption: req.body.description,
    notes: req.body.notes,
  };

  const action = {
    descritption: req.body.description,
    notes: req.body.notes,
  }

  if (!action) {
    res.status(400).json({
      errorMessage: 'Please provide description and notes for action.'
    })
  }

  projects.getProjectActions(req.params.project_id)
    .then(data => {
      if (!data) {
        return res.status(404).json({
          message: 'The action with this specified ID does not exist.'
        })
      }
    })

    projects.insert(addAction)
      .then(action => {
        if (action) {
          res.status(200).json(action)
        }
      })
      .catch(error => {
        res.status(500).json({
          error: 'There was an error while saving the action to the database.'
        })
      })
});

// update(): accepts two arguments, the first is the id of the resource to update, and the second is an object with the changes to apply. It returns the updated resource. If a resource with the provided id is not found, the method returns null.
// PUT req
router.put('/:id', (req, res) => {
  const id = req.params.id;

  if (!req.body.description || !req.body.notes) {
    return res.status(400).json({
      message: 'The action with the specified ID does not exist.'
    })
  }

  actions.update(id, req.body)
    .then(data => {
      if (data) {
        res.status(200).json(data)
      } else {
        return res.status(404).json({
          errorMessage: 'Please provide description and notes for the action.'
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        error: 'The action information could not be modified.'
      })
    })
});

// remove(): the remove method accepts an id as it's first parameter and, upon successfully deleting the resource from the database, returns the number of records deleted.
// DELETE req
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  actions.remove(id)
    .then(gone => {
      if (gone) {
        res.status(200).json(gone)
      } else {
        res.status(404).json({
          message: 'The action with the specified ID does not exist.'
        })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'The action could not be removed.'
      })
    })
});


module.exports = router;