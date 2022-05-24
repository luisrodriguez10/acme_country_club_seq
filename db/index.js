const Sequelize = require("sequelize");
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme-country-club-db"
);

const Member = conn.define("member", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: {
    type: STRING,
  },
});

const Facility = conn.define("facility", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: {
    type: STRING,
  },
});

const Booking = conn.define("booking", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
});

Member.belongsTo(Member, { as: "sponsor" });
Member.hasMany(Member, { foreignKey: 'sponsorId',as: "sponsored" });

Booking.belongsTo(Member, { as: "booker" });
// Member.hasMany(Booking, { foreignKey: "bookerId" });

Booking.belongsTo(Facility);
// Facility.hasMany(Booking);

const seeder = async () => {
  await conn.sync({ force: true });
  const [moe, lucy, ethyl, larry] = await Promise.all([
    Member.create({ name: "Moe" }),
    Member.create({ name: "Lucy" }),
    Member.create({ name: "Ethyl" }),
    Member.create({ name: "Larry" }),
  ]);

  moe.sponsorId = lucy.id;
  await moe.save();
  larry.sponsorId = lucy.id;
  await larry.save();
  ethyl.sponsorId = moe.id;
  await ethyl.save();

  const [tennis, pingpong, marbles] = await Promise.all([
      Facility.create({name: 'Tennis'}),
      Facility.create({name: 'Ping Pong'}),
      Facility.create({name: 'Marbles'})
  ])

  await Promise.all([
      Booking.create({bookerId: lucy.id, facilityId: marbles.id}),
      Booking.create({bookerId: moe.id, facilityId: tennis.id}),
      Booking.create({facilityId: pingpong.id})
  ])
};

module.exports = {
  Member,
  Booking,
  Facility,
  seeder,
};
