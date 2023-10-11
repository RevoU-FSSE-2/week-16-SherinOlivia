import express, {Express} from 'express';
import 'dotenv/config';
import { DBLocal } from './config/dbConnection';
import insertAdmin from './config/adminConfig';
import router from './router/mainRouter';
// import swaggerUi from 'swagger-ui-express';
// import yaml from 'yaml';
// import * as fs from 'fs';
// import * as OpenApiValidator from 'express-openapi-validator';
import cors from 'cors';

const app: Express = express()
const port = process.env.PORT;

// cors
app.use(cors());

app.use(express.json())


// // swagger
// const openAPIDoc = './doc/swaggerDoc.yaml'
// const file = fs.readFileSync(openAPIDoc, 'utf-8')
// const swaggerDoc = yaml.parse(file) as object

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// app.use(OpenApiValidator.middleware({
//   apiSpec: openAPIDoc,
//   validateRequests: true,
// }))

// // DB Connection (Railway)
// DB.connect( function () {
//     if (DB) {
//         console.log("Railway Connection Succeed");
//     } else {
//         console.log("Railway Connection Failed");
//     }
// }),

// DB Connection (Local)
DBLocal.connect( function () {
    if (DBLocal) {
        console.log("Localhost Connection Succeed");
    } else {
        console.log("Localhost Connection Failed");
    }
})

// insert Super User / Admin account to Database.. (One time Use)
insertAdmin();

// router
app.use(router)

app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
})

