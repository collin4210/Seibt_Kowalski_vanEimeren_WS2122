const express = require('express');
const PORT = process.env.port || 6969;
const api = express();
const { fstat } = require("fs")
const fs = require('fs');
const { arrayBuffer, json } = require("stream/consumers");
const WgPath = './src/Data/wgs.json';

api.use(express.json());

api.listen(PORT, () => {
    console.log("API läuft!")
});

api.get('/', (req, res) => {
    console.log(req);
    res.send('Hello World!');
});

fs.readFile(WgPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return
    }

    let Wgs = JSON.parse(data);

    api.put("/wg/:wgID", (req, res) => {

        let thisWG = Wgs.find(wg => wg.ID == parseInt(req.params.wgID));
        if (!thisWG) res.status(404).send('WG not found');

        thisWG.PersonCount = req.body.PersonCount;

        newData = JSON.stringify(Wgs);

        fs.writeFile(WgPath, newData, 'utf8', function (err) {
            if (err) {
                return console.log(err);
                res.code(500);
            }
            console.log("The file was saved!");
            res.status(201).send("updated successfully!");

       });
    });

    api.put("/wg/:wgID/ShoppingList/:productID", (req, res) => {

        let thisWG = Wgs.find(wg => wg.ID == parseInt(req.params.wgID));
        if (!thisWG) res.status(404).send('WG not found');

        let thisProduct = thisWG.ShoppingList.find(list => list.ProductID === parseInt(req.params.productID));
        if (!thisProduct) res.status(404).send('Product not found');
        thisProduct.Product = req.body.ProductName;
        thisProduct.Price = req.body.Price;
        newData = JSON.stringify(Wgs);

        fs.writeFile(WgPath, newData, 'utf8', function (err) {
            if (err) {
                return console.log(err);
                res.code(500);
            }
            console.log("The file was saved!");
            res.status(201).send("updated successfully!");
        });
    });

    api.delete("/wg/:wgID", (req, res) => {

        let thisWG = Wgs.find(wg => wg.ID == parseInt(req.params.wgID));
        if (!thisWG) res.status(404).send('WG not found');

        for (var i = 0; i < Wgs.length; i++) {

            if (Wgs[i].ID == req.body.wgID) {

                Wgs.splice(i, 1);
                fs.writeFile(WgPath, newData, 'utf8', function (err) {
                    if (err) {
                        return console.log(err);
                        res.code(500);
                    }
                    console.log("The file was saved!");
                    res.status(201).send("deleted succesfully!");
                    return
                });

                break
            }
        }
    });

    api.delete("/wg/:wgID/ShoppingList/:productID", (req, res) => {

        let thisWG = Wgs.find(wg => wg.ID == parseInt(req.params.wgID));
        if (!thisWG) res.status(404).send('WG not found');

        newData = JSON.stringify(Wgs);

        fs.writeFile(WgPath, newData, 'utf8', function (err) {
            if (err) {
                return console.log(err);
                res.code(500);
            }
            console.log("The file was saved!");
            res.status(201).send("created successfully!");
        });
    });

    

    api.get("/wg/:wgID/shoppinglist/:productID", (req, res) => {
        let thisWG = Wgs.find(wg => wg.ID == parseInt(req.params.wgID));
        if (!thisWG) res.status(404).send('WG not found');

        let thisProduct = thisWG.ShoppingList.find(list => list.ProductID == parseInt(req.params.productID));
        if (!thisProduct) res.status(404).send('Product not found');


        res.status(200).send(thisProduct);
    });


    api.get("/wg/:ID/shoppinglist", (req, res) => {
        let thisWG = Wgs.find(wg => wg.ID == parseInt(req.params.ID));
        if (!thisWG) res.status(404).send('WG not found');
        res.status(200).send(thisWG.ShoppingList);
    });

    api.get("/wg/:ID", (req, res) => {

        let thisWG = Wgs.find(wg => wg.ID == parseInt(req.params.ID));

        if (!thisWG) res.status(404).send('WG not found');
        res.status(200).send(thisWG);
    });

    api.get("/wg", (req, res) => {

        res.status(200).send(Wgs);
    });

    api.post("/wg", (req, res) => {


        const newWG = {
            ID: Wgs.length + 1,
            PersonCount: req.body.PersonCount,
            Price: 0,
            PricePerPerson: 0,

        }

        Wgs.push(newWG);

        newData = JSON.stringify(Wgs);

        fs.writeFile(WgPath, newData, 'utf8', function (err) {
            if (err) {
                return console.log(err);
                res.code(500);
            }
            console.log("The file was saved!");
            res.status(201).send("created successfully!");

        });


        res.status(201).send(console.log(Wgs));

    });

    api.post("/wg/:wgID/ShoppingList/", (req, res) => {


        const newProduct = {
            ProductID: Wgs[req.params.wgID - 1].ShoppingList.length + 1,
            Product: req.body.ProductName,
            Price: req.body.Price
        }

        Wgs[req.params.wgID - 1].ShoppingList.push(newProduct);
        Wgs[req.params.wgID - 1].ShoppingList.forEach(element => {
            Wgs[req.params.wgID - 1].Price = Wgs[req.params.wgID - 1].Price + element.Price;
        });
        Wgs[req.params.wgID - 1].PricePerPerson = Wgs[req.params.wgID - 1].Price / Wgs[req.params.wgID - 1].PersonCount;

        newData = JSON.stringify(Wgs);

        fs.writeFile(WgPath, newData, 'utf8', function (err) {
            if (err) {
                return console.log(err);
                res.code(500);
            }
            console.log("The file was saved!");
            res.status(201).send("created successfully!");



        });

       

    });




});





