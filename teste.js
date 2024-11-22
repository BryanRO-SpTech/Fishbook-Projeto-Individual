const formattedDateTimeDeparture = new Date('10/10/2024 10:00').toISOString().slice(0, 19).replace('T', ' ');

console.log(formattedDateTimeDeparture)