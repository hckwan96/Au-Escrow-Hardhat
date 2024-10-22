const express = require("express");
const cors = require("cors");

var app = express();
app.use(cors());
app.use(express.json());

app.listen(3421, () => {
    console.log("Server running on port 3421");
});

const fs = require('fs');
const path = require('path');
const escrowsFilePath = path.join(__dirname, 'escrows.json');

function loadEscrows() {
    if (!fs.existsSync(escrowsFilePath)) {
        return {};
    }
    const data = fs.readFileSync(escrowsFilePath);
    return JSON.parse(data);
}

// Function to save escrows to the JSON file
function saveEscrows(escrows) {
    fs.writeFileSync(escrowsFilePath, JSON.stringify(escrows, null, 2));
}

let escrows = loadEscrows();

app.get('/escrows', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/src/artifacts/contracts/Escrow.sol/Escrow.json'));
});

app.post("/add", (req, res, next) => {
    try {
        console.log(req.body)
        const address = req.body.address;
        const contract = req.body.contract;
        const arbiter = req.body.arbiter;
        const txHash = req.body.txHash;

        if (!address || !contract) {
            throw new Error('No deployer address or contract address!')
        }

        if (!escrows[address]) {
            escrows[address] = [];
        }

        if (!escrows[arbiter]) {
            escrows[arbiter] = [];
        }

        if (!escrows[contract]) {
            escrows[contract] = [];
        }

        escrows[address].push(contract);
        escrows[arbiter].push(contract);
        escrows[contract].push(txHash);
        saveEscrows(escrows);
        console.log(escrows);

        fs.writeFileSync(escrowsFilePath, JSON.stringify(escrows, null, 2));
        res.send({ message: "Contract added successfully!" });
    }
    catch (ex)
    {
        console.log(ex);
        res.status(500).send({ error: "Server error" });
    }
});

app.post("/hash", (req, res, next) => {
    try {
        console.log(req.body);
        const contract = req.body.contract;

        if (!fs.existsSync(escrowsFilePath)) {
            return res.status(404).send("Escrows data file not found.");
        }

        if (!contract) {
            return res.status(400).send({ error: "No contract provided" });
        }

        if (!escrows[contract]) {
            return res.status(404).send({ error: "No hash found for this contract" });
        }

        res.send({ hash: escrows[contract] });
    }
    catch (ex)
    {
        console.log(ex);
        res.status(500).send({ error: "Server error" });
    }
});

app.post("/escrows", (req, res, next) => {
    try {
        console.log(req.body);
        const address = req.body.address;

        if (!fs.existsSync(escrowsFilePath)) {
            return res.status(404).send("Escrows data file not found.");
        }

        if (!address) {
            return res.status(400).send({ error: "No address provided" });
        }

        if (!escrows[address]) {
            return res.status(404).send({ error: "No escrows found for this address" });
        }

        res.send({ addresses: escrows[address] });
    }
    catch (ex)
    {
        console.log(ex);
        res.status(500).send({ error: "Server error" });
    }
});
