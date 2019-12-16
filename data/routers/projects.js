const express = require('express');
const projects = require('../helpers/projectModel');
const actionsRouter = require('./actions');

const router = express.Router();

router.use('/:projectId/actions', actionsRouter);

// Projects Schema
// id: number no need to provide it when creating projects, the database will generate it
// name: string required.
// description:	string required.
// completed:	boolean used to indicate if the project has been completed, not required

// get(): resolves to an array of all the resources contained in the database. If you pass an id to this method it will return the resource with that id if one is found.
// init GET req
router.get('/', (req, res) => {
  projects.get()
    .then(project => {
      res.status(200).json(project)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'Error retrieving the projects.'
      })
    })
});

// GET by id
router.get('/:id', (req, res) => {
  const id = req.params.id;

  projects.get(id)
    .then(data => {
      // console.log('DATA', data)
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(400).json({
          message: 'The project with the specified ID does not exist.'
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        error: 'The project information could not be retrieved.'
      })
    })
});

// insert(): calling insert passing it a resource object will add it to the database and return the newly created resource.
// POST req
router.post('/', (req, res) => {
  const project = req.body;

  if (!project.name || !project.description) {
    return res.status(400).json({
      errorMessage: 'Please provide name and description for the project.'
    })
  } else {
    projects.insert(project)
      .then(data => {
        res.status(201).json(data)
      })
      .catch(error => {
        res.status(500).json({
          error: 'There was an error while saving the project to the database, try again.'
        })
      })
  }
});

// with POST?
// The projectModel.js helper includes an extra method called getProjectActions() that takes a project id as it's only argument and returns a list of all the actions for the project.
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

  if (!req.body.name || !req.body.description) {
    return res.status(400).json({
      message: 'The project with the specified ID does not exist.'
    })
  }

  projects.update(id, req.body)
    .then(data => {
      if (data) {
        res.status(200).json(data)
      } else {
        return res.status(404).json({
          errorMessage: 'Please provide name and description for the project.'
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        error: 'The project information could not be modified.'
      })
    })
});

// remove(): the remove method accepts an id as it's first parameter and, upon successfully deleting the resource from the database, returns the number of records deleted.
// DELETE req
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  projects.remove(id)
    .then(gone => {
      if (gone) {
        res.status(200).json(gone)
      } else {
        res.status(404).json({
          message: 'The project with the specified ID does not exist.'
        })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'The project could not be removed.'
      })
    })
});

module.exports = router;