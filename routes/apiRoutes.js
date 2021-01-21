const db = require("../models");

module.exports = (app) => {

    app.post("/api/workouts", (req, res) => {
        db.Workout.create(req.body)
            .then(dbWorkout => {
                res.json(dbWorkout);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.get("/api/workouts", (req, res) => {
        db.Workout.find({}).sort({ _id: -1 }).limit(1)
            .then((dbWorkout) => db.Workout.aggregate([
                {
                    $addFields: {
                        totalDuration: { $sum: "$exercises.duration" }
                    }
                }
            ])
            .then(dbWorkout => {
                res.json(dbWorkout);
            })
            .catch(err => {
                res.json(err);
            }));
    });

    app.put("/api/workouts/:id", (req, res) => {
        console.log(req.params.id)
        db.Workout.findByIdAndUpdate(
            req.params.id 
        , 
        { 
            $push: {
                exercises: req.body
            }
        })
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
    });

    app.get("/api/workouts/range", (req, res) => {
        db.Workout.aggregate([
            {
                $sort: { _id: -1 }
            },
            {
                $limit: 7
            },
            {
                $addFields: {
                    totalDuration: { $sum: "$exercises.duration" },
                    totalPounds: { $sum: "$exercises.weight" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])
        .then(dbWorkout => {
            console.log(dbWorkout);
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
    });

};
