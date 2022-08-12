import Express from 'express';
import BodyParser from 'body-parser';
import { uploadFile, getUrlFromBucket, listObjects } from './helpers/s3Helper.js'
 
const app = Express()
app.use(BodyParser.json({ limit: "4mb" }));
 
app.post("/upload", async (req, res) => {
    const response = await uploadFile(req.body.data)
    res.send({ response });
});

app.get("/getURL", async (req, res) => {
    const url = await getUrlFromBucket(req.query.id)
    res.send({ url });
});

app.get("/list", async (req, res) => {
    const list = await listObjects()
    res.send({ list });
});
 
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
