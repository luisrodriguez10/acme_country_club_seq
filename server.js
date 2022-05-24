const express = require("express");
const { Member, Booking, Facility, seeder } = require("./db");
const app = express();

app.get('/api/facilities', async(req, res, next) => {
    try {
        const facilities = await Facility.findAll({
            include: [Booking]
        })
        res.send(facilities)
    } catch (ex) {
        next(ex)
    }
})

app.get('/api/bookings', async(req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                {
                    model: Member,
                    as: 'booker'
                },
                Facility
            ]
        })
        res.send(bookings)
    } catch (ex) {
        next(ex)
    }
})

app.get('/api/members', async(req, res, next) => {
    try {
        const members = await Member.findAll({
            include: [
                {
                    model: Member,
                    as: 'sponsor'
                },
                {
                    model: Member,
                    as: 'sponsored'
                },
            ]
        })
        res.send(members)
    } catch (ex) {
        next(ex)
    }
})

const setup = async () => {
  try {
      await seeder()
      const port = process.env.PORT || 3000;
      app.listen(port, () => console.log(`listening on port ${port}`))
  } catch (ex) {
    console.log(ex);
  }
};

setup();
