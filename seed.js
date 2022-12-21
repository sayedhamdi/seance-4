const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'users.csv',
    header: [
        {id: 'fullname', title: 'fullname'},
        {id: 'password', title: 'password'},
        {id : 'email' , title: 'email'}
    ]
});

const data = [
    {fullname:"aziz",email:"aziz@gmail.com",password:"forsaargentine123"},
    {fullname:"mariem",email:"mariem@gmail.com",password:"noone123"},
    {fullname:"aisha",email:"aisha@gmail.com",password:"argentinemessi123"},
];


csvWriter.writeRecords(data)       // returns a promise
.then(() => {
    console.log('... Seeding Done');
});