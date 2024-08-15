import express from 'express';
import cookieParser from 'cookie-parser';
import indexRouter from './router/indexRouter.js';
import recruiterRouter from './router/recruiterRouter.js';
import candidateRouter from './router/candidateRouter.js';
import adminRouter from './router/adminRouter.js';
import expressFileUpload from 'express-fileupload';

var app = express();

app.set("views","views");
app.set("view engine","ejs");

app.use(express.static('public'));
app.use(expressFileUpload());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/",indexRouter);
app.use("/recruiter",recruiterRouter);
app.use("/candidate",candidateRouter);
app.use("/admin",adminRouter);

app.listen(3000,()=>{
    console.log("Sever Connection Sucessfull");
});

// async function pass(){
//     var pss = await bcrypt.hash("admin@123",10);
//     console.log(pss);
// }
// pass();