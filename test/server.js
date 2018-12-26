const express = require('express');
const app = express();

app.use(express.static('./'));
app.use('/dist', express.static('../dist'));

app.listen(3000, () => console.log('listening on port 3000!'));
