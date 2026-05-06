const express = require('express');
const cors = require('cors');
const { evaluate } = require('mathjs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/calculate', (req, res) => {
    const { expression } = req.body;
    if (!expression) {
        return res.status(400).json({ error: 'Expression is required' });
    }
    
    try {
        const result = evaluate(expression);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: 'Invalid expression' });
    }
});

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
