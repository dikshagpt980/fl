let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin ,X-Requested-With, Content-Type, Accept"
    );
    next();
});
// const port = 2410;
var port = process.env.PORT || 2410;

app.listen(port, ()=> console.log(`Node app listening on port ${port}!`));

let {data} = require("./data.js");
let fs = require("fs");
let fname = "allData.json";

app.get("/reset",function(req,res){
    let arr = JSON.stringify(data);
    fs.writeFile(fname,arr,function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in file is reset");
    })
});

app.get("/shops",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) req.status(400).send(err);
        else{
            let arr = JSON.parse(data)
            res.send(arr.shops);
        }
    })
})

app.post("/shops",function(req, res){
    let body = req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else {
            let arr = JSON.parse(data);
            let maxid = arr.shops.reduce((acc,cur)=> (cur.shopId>acc ? cur.shopId : acc),0);
            let newid = maxid+1;
            let newarr = {...body,shopId:newid};
            arr.shops.push(newarr);
            let data1 = JSON.stringify(arr)
            fs.writeFile(fname,data1,function(err1){
                if(err1) res.status(404).send(err1);
                else res.send(newarr);
            });
        }
    });
});

app.get("/products",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) req.status(400).send(err);
        else{
            let arr = JSON.parse(data)
            res.send(arr.products);
        }
    })
})

app.get("/products/:id",function(req,res){
    let id = +req.params.id;
    console.log(id);
    fs.readFile(fname,"utf8",function(err,data){
        if(err) req.status(400).send(err);
        else{
            let arr = JSON.parse(data);
            let str = arr.products.find((ele)=> ele.productId === id);
            if(str) res.send(str);
            else res.status(404).send("No product found");
        }
    })
})

app.post("/products",function(req, res, next){
    let body = req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else {
            let arr = JSON.parse(data);
            let maxid = arr.products.reduce((acc,cur)=> (cur.productId>acc ? cur.productId : acc),0);
            let newid = maxid+1;
            let newarr = {...body,productId:newid};
            arr.products.push(newarr);
            let data1 = JSON.stringify(arr)
            fs.writeFile(fname,data1,function(err1){
                if(err1) res.status(404).send(err1);
                else res.send(newarr);
            });
        }
    });
});

app.put("/products/:id",function(req,res){
    let id = +req.params.id;
    let body = req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else {
            let arr = JSON.parse(data);
            let index = arr.products.findIndex((ele)=> ele.productId === id);
            if(index>=0){
                let updateArr = {...arr.products[index],...body};
                arr.products[index] = updateArr;
                let data1 = JSON.stringify(arr);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(updateArr);
                })
            }
            else res.status(404).send("No product found");
        }
    });
});

app.get("/purchases", function (req, res) {
    let { product = "", shop = "" } = req.query;
    if(product || shop){
        fs.readFile(fname,"utf8",function(err,data){
            if(err) req.status(400).send(err);
            else{
                let arr1 = [];
                let arr = JSON.parse(data);
                if (product) {
                    let ar = product.split(",");
                    arr1  = arr.purchases.filter((ele)=> ar.findIndex((st)=> +st === +ele.productid)>=0)
                }
                if (shop) {
                    if(arr1){
                        arr1 = arr1.filter((ele)=> +ele.shopId === +shop)
                    }
                    else{
                        arr1 = arr.purchases.filter((ele)=> +ele.shopId === +shop)
                    }
                }
                res.send(arr1);
            }
        })
    }
    else{
        fs.readFile(fname,"utf8",function(err,data){
            if(err) req.status(400).send(err);
            else{
                let arr = JSON.parse(data)
                res.send(arr.purchases);
            }
        })
    }
});

app.post("/purchases", function (req, res) {
    let body = req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else {
            let arr = JSON.parse(data);
            let maxid = arr.purchases.reduce((acc,cur)=> (cur.purchaseId>acc ? cur.purchaseId : acc),0);
            let newid = maxid+1;
            let newarr = {...body,purchaseId:newid};
            arr.purchases.push(newarr);
            let data1 = JSON.stringify(arr)
            fs.writeFile(fname,data1,function(err1){
                if(err1) res.status(404).send(err1);
                else res.send(newarr);
            });
        }
    });
});